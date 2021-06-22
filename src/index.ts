import { CF } from './component';
import { Plugin } from './plugin';
import { newTemplate, templateToElement } from './template';
import { newComponent } from './component';
import { createStore } from './state';

// the Billion app type
export type Billion = {
    rootEl: HTMLElement | Text | undefined;
    component: CF<unknown>;
    use: (plugin: Plugin, ...args: unknown[]) => void;
};

const createApp = (selector: string, component: CF): Billion => {
    // look for selected root element
    const root = document.querySelector(selector) as Billion['rootEl'];
    if (!root) throw new Error(`root element ${selector} not found`);
    // parse and inject the component
    const rootEl = templateToElement(component());
    root.appendChild(rootEl);
    // create the app instance
    const app: Billion = {
        rootEl,
        component,
        use(plugin, ...args) {
            plugin.implement(this, ...args);
        },
    };

    return app;
};

export { createApp, newTemplate, newComponent, createStore };
