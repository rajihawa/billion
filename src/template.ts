// the template engine of billion, Inspired by flutter.
import {
  createElement,
  m,
  patch,
  VFlags,
  VNode,
  VProps,
  className as MclassName,
} from "million";
import { CssToString, styles } from "./styles";

// supported tags for better auto-complete
export enum Tags {
  div = "div",
  input = "input",
  button = "button",
}

type defaultPropsType = {};

export type Template = {
  tag: keyof typeof Tags;
  options?: Options;
  children?: Template[] | string;
};

export type Options = VProps & {
  key?: string;
  id?: string;
  className?: Record<string, boolean>;
  style?: styles;
};

export type BT<T = defaultPropsType> = (props?: T) => Template;

// turn the template object into an optimized vnode object to be used by million
const templateToNode = (template: Template): VNode =>
  m(
    template.tag,
    {
      ...template.options,
      className: MclassName(template.options?.className || {}),
      style: template.options?.style ? CssToString(template.options.style) : "",
    },
    typeof template.children == "string"
      ? [template.children]
      : template.children
      ? parseChildren(template.children)
      : undefined,
    typeof template.children == "string"
      ? VFlags.ONLY_TEXT_CHILDREN
      : template.children
      ? VFlags.ANY_CHILDREN
      : VFlags.NO_CHILDREN
  );

// recurse over all children
const parseChildren = (children: Template[]): VNode[] | undefined =>
  children?.map((child) => templateToNode(child));

// turn template into HTML element
export const templateToElement = (template: Template): HTMLElement | Text => {
  const vnode = templateToNode(template);
  const element = createElement(vnode);
  return element;
};

// inject template into a parent element
export const mountTemplate = (
  parent: HTMLElement | Text,
  template: Template
) => {
  const vnode = templateToNode(template);
  patch(parent, vnode);
};
