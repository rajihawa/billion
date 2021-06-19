import { defaultTemplate, Template, templateToElement } from './template';

export const createApp = (selector: string, template: Template<defaultTemplate>): void => {
    // Find the root element to build app on
    const root = document.querySelector(selector);
    if (root == null) {
        throw new Error('Invalid selector value!');
    }

    // create first template
    const element = templateToElement(template);

    // inject the element into the DOM
    root.appendChild(element);
};
