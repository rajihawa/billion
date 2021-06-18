// Element is a barebone html tag, just a minimal build block
import { Template } from "./template";

type elementOptions = {
  children?: Template["children"];
  options?: Template["options"];
};

export const Element = (
  tag: Template["tag"],
  options: elementOptions = {}
): Template => {
  return {
    tag,
    children: options.children,
    options: options.options,
  };
};
