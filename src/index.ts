import { CF } from './component';
import { Plugin } from './plugin';
import { templateToElement, newTemplate, Template } from './template';

// the Billion app type
export type Billion = {
    rootEl: HTMLElement | Text | undefined;
    template: Template | undefined;
    use: Plugin;
};

const createApp = (component: CF): Billion => {
    // look for #app root element
    const root = document.querySelector('#app');
    if (!root) throw new Error('root element #app not found');
    // parse and inject the component
    const template = component();
    const rootEl = templateToElement(template);
    root.appendChild(rootEl);

    // create the app instance
    const app: Billion = {
        rootEl,
        template,
        use(plugin, ...args) {
            plugin(this, ...args);
            return;
        },
    };

    return app;
};

export default { createApp, newTemplate };
