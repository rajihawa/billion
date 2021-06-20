import { CF } from './component';
import { templateToElement, newTemplate } from './template';

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

export default { ...billion, newTemplate };
