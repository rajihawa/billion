// the template engine of billion, Inspired by flutter.
// templates are just minimal build blocks, it gets translated to HTML in the end
import { m, VFlags, VNode, svg, VProps } from 'million';
import { BF, bht, Options } from './bht';
import { CssToString } from './styles';

export const bfToNode = (bf: BF): VNode => {
    const params = bf();
    if (params == null) {
        throw new Error('cant return null');
    }
    const tag = params[0];
    const result = parseType(tag);
    let str = '';
    let bhts: bht[] = [];
    let opts: VProps = {
        key: result['$'],
        className: result['.'],
        id: result['#'],
        style: '',
    };
    if (Array.isArray(params[1])) {
        bhts = params.slice(1) as bht[];
    } else if (typeof params[1] == 'object') {
        const newOpts = params[1] as Options;
        opts = { ...opts, ...newOpts, style: newOpts.style ? CssToString(newOpts.style) : '' };
        bhts = params.slice(2) as bht[];
    } else if (typeof params[1] == 'string') {
        str = params[1];
    }
    if (typeof params[2] == 'string') {
        str = params[2];
    }
    for (const propName in opts) {
        if (!opts[propName]) {
            delete opts[propName];
        }
    }

    const node = m(
        result.tag,
        opts,
        str
            ? [str]
            : Array.isArray(bhts)
            ? bhts
                  .filter((bht) => Boolean(bht))
                  .map((bht) => {
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
        '.'?: string;
        $?: string;
        '#'?: string;
    } = {
        tag: '',
    };
    while (i >= 0) {
        if (ch != '.' && ch != '#' && ch != '$') {
            currentWord = ch + currentWord;
        } else {
            result[ch] = result[ch] ? result[ch] + currentWord + ' ' : currentWord + ' ';
            currentWord = '';
        }
        if (i == 0) {
            result['tag'] = currentWord;
            result['#'] = result['#'] ? result['#'].slice(0, -1) : undefined;
            result['.'] = result['.'] ? result['.'].slice(0, -1) : undefined;
            result['$'] = result['$'] ? result['$'].slice(0, -1) : undefined;
        }
        i--;
        ch = str[i];
    }
    return result;
};
