import { Template, templateToElement } from "./template";

type App = {
  root: HTMLElement | Text;
};

export const createApp = (selector: string, template: Template<any>): App => {
  // Find the root element to build app on
  const root = document.querySelector(selector);
  if (root == null) {
    throw new Error("Invalid selector value!");
  }

  // create first template
  const element = templateToElement(template);

  // inject the element into the DOM
  root.appendChild(element);

  // initiate and return a new app instance
  return {
    root: element,
  };
};
