import { createElement } from 'million';
import { BF, CF } from './component';
import { templateToElement, newTemplate, bfToNode } from './template';

// the Billion app type
type Billion = {
    render: (component: CF<undefined>) => void;
};

const billion: Billion = {
    render: (component) => {
        // look for #app root element
        const root = document.querySelector('#app');
        if (!root) throw new Error('root element #app not found');
        // parse and inject the component
        const template = component();
        const element = templateToElement(template);
        root.appendChild(element);
    },
};

export const startApp = (querySelector: string, bf: BF): void => {
    const root = document.querySelector(querySelector);
    if (!root) throw new Error(`root element ${querySelector} not found`);
    const node = bfToNode(bf);
    const template = createElement(node);
    root.appendChild(template);
};

export default { ...billion, newTemplate };
