// the template engine of billion, Inspired by flutter.
// templates are just minimal build blocks, it gets translated to HTML in the end
import { createElement, m, VFlags, VNode, VProps, className as MclassName, svg } from 'million';
import { BF } from './component';
import { CssToString, styles } from './styles';
import { Tags } from './tags';

// template definition
export type Template = {
    tag: keyof Tags;
    options?: Options<'div'>;
    children?: Template[] | string;
};

export type TF = () => Template;

// template options
export type Options<T extends keyof Tags> = VProps &
    Partial<Tags[T]> & {
        key?: string;
        id?: string;
        className?: Record<string, boolean>;
        styles?: styles;
    };

// turn the template object into an optimized vnode object to be used by million
export const templateToNode = (template: Template): VNode => {
    const vnode = m(
        template.tag,
        {
            ...template.options,
            className: template.options?.className ? MclassName(template.options.className) : '',
            style: template.options?.styles ? CssToString(template.options.styles) : '',
        },
        typeof template.children == 'string'
            ? [template.children]
            : template.children
            ? parseChildren(template.children)
            : undefined,
        typeof template.children == 'string'
            ? VFlags.ONLY_TEXT_CHILDREN
            : template.children
            ? VFlags.ANY_CHILDREN
            : VFlags.NO_CHILDREN,
    );
    const result = !template.options?.ns && template.tag === 'svg' ? svg(vnode) : vnode;

    return result;
};

// faster and more elegant way to create templates
export const newTemplate = <T extends keyof Tags>(
    tag: keyof Tags,
    opts?: Options<T>,
    children?: Template[] | string,
): Template => {
    return {
        tag,
        options: opts,
        children,
    };
};

// recurse over all children
const parseChildren = (children: Template[]): VNode[] | undefined => children?.map((child) => templateToNode(child));

// turn template into HTML element
export const templateToElement = (template: Template): HTMLElement | Text => {
    const vnode = templateToNode(template);
    const element = createElement(vnode);
    return element;
};

export const bfToNode = (bf: BF): VNode => {
    const [tags] = bf();
    const result = parseType(tags);
    const node = m(
        result.tag,
        {
            key: result['$'],
            className: result['.'],
            id: result['#'],
        },
        undefined,
        VFlags.NO_CHILDREN,
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
            result[ch] = result[ch] + currentWord + '';
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
