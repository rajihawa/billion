// the template engine of billion, Inspired by flutter.
// templates are just minimal build blocks, it gets translated to HTML in the end
import { m, VFlags, VNode, svg, style } from 'million';
import { BF, bht, Options } from './bht';

export const bfToNode = (bf: BF): VNode => {
    const params = bf();
    const tag = params[0];
    const result = parseType(tag);
    let str = '';
    let bhts: bht[] = [];
    let opts = {
        key: result['$'],
        className: result['.'],
        id: result['#'],
        style: '',
    };
    if (Array.isArray(params[1])) {
        bhts = params.slice(1) as bht[];
    } else if (typeof params[1] == 'object') {
        const newOpts: Options = params[1];
        opts = { ...opts, style: newOpts.style ? style(newOpts.style) : '' };
    } else if (typeof params[1] == 'string') {
        str = params[1];
    }
    if (typeof params[2] == 'string') {
        str = params[2];
    }
    const node = m(
        result.tag,
        opts,
        str
            ? [str]
            : Array.isArray(bhts)
            ? bhts.map((bht) => {
                  return bfToNode(() => bht);
              })
            : undefined,
        str ? VFlags.ONLY_TEXT_CHILDREN : Array.isArray(bhts) ? VFlags.ANY_CHILDREN : VFlags.NO_CHILDREN,
    );
    return result.tag === 'svg' ? svg(node) : node;
};

const parseType = (str: string) => {
    let i = str.length - 1;
    let ch = str[i];
    let currentWord = '';
    const result: {
        tag: string;
        '.': string;
        $: string;
        '#': string;
    } = {
        '#': '',
        '.': '',
        $: '',
        tag: '',
    };
    while (i >= 0) {
        if (ch != '.' && ch != '#' && ch != '$') {
            currentWord = ch + currentWord;
        } else {
            result[ch] = result[ch] + currentWord + ' ';
            currentWord = '';
        }
        if (i == 0) {
            result['tag'] = currentWord;
            result['#'] = result['#'].slice(0, -1);
            result['.'] = result['.'].slice(0, -1);
            result['$'] = result['$'].slice(0, -1);
        }
        i--;
        ch = str[i];
    }
    return result;
};
