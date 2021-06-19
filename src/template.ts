// the template engine of billion, Inspired by flutter.
import { createElement, m, patch, VFlags, VNode, VProps, className as MclassName } from 'million';
import { CssToString, styles } from './styles';

type defaultPropsType = Record<string, unknown>;
export type defaultTemplate = keyof HTMLElementTagNameMap;

// template definition
export type Template<T extends defaultTemplate> = {
    tag: T;
    options?: Options<T>;
    children?: Template<defaultTemplate>[] | string;
};

// template options
export type Options<K extends defaultTemplate> = VProps &
    Partial<HTMLElementTagNameMap[K]> & {
        key?: string;
        id?: string;
        className?: Record<string, boolean>;
        styles?: styles;
    };

// billion template function type
export type BTF<T extends defaultTemplate = 'div', P = defaultPropsType> = (props?: P) => Template<T>;

// turn the template object into an optimized vnode object to be used by million
const templateToNode = <T extends defaultTemplate = 'div'>(template: Template<T>): VNode => {
    console.log(template);
    return m(
        template.tag,
        {
            ...template.options,
            className: MclassName(template.options?.className || {}),
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
};

// recurse over all children
const parseChildren = (children: Template<defaultTemplate>[]): VNode[] | undefined =>
    children?.map((child) => templateToNode(child));

// turn template into HTML element
export const templateToElement = (template: Template<defaultTemplate>): HTMLElement | Text => {
    const vnode = templateToNode(template);
    const element = createElement(vnode);
    return element;
};

// inject template into a parent element
export const mountTemplate = (parent: HTMLElement | Text, template: Template<defaultTemplate>): void => {
    const vnode = templateToNode(template);
    patch(parent, vnode);
};
