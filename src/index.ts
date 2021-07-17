import { bfToNode } from './template';
import { createElement, patch } from 'million';
import { BF } from './bht';

let rootEl: HTMLElement;
let rootBF: BF;

export const startApp = (querySelector: string, bf: BF): void => {
    const root = document.querySelector(querySelector);
    if (!root) throw new Error(`root element ${querySelector} not found`);
    rootEl = root as HTMLElement;
    rootBF = bf;
    const node = bfToNode(bf);
    const template = createElement(node);
    root.appendChild(template);
};

export const reRender = (): void => {
    patch(rootEl, bfToNode(rootBF));
};
