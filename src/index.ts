import { bfToNode } from './template';
import { createElement, patch, VNode } from 'million';
import { BF } from './bht';

let rootEl: HTMLElement | Text;
let oldNode: VNode;
let rootBF: BF;
let stateId = 0;
const states = {};

export const startApp = (querySelector: string, bf: BF): void => {
    const root = document.querySelector(querySelector);
    if (!root) throw new Error(`root element ${querySelector} not found`);
    rootBF = bf;
    const node = bfToNode(bf);
    const template = createElement(node);
    rootEl = template;
    root.appendChild(template);
};

export const render = (): void => {
    stateId = 0;
    const newNode = bfToNode(rootBF);
    patch(rootEl, newNode, oldNode);
    oldNode = newNode;
};

type StateObj<T> = {
    get: () => T;
    set: (s: T, r?: boolean) => void;
};

export const state = <T>(init: T): StateObj<T> => {
    if (!(stateId in states)) {
        states[stateId] = init;
    }
    const val = states[stateId];
    const currId = stateId;
    stateId++;

    return {
        get() {
            return val;
        },
        set(s: T, r = true) {
            states[currId] = s;
            if (r) {
                render();
            }
            return;
        },
    };
};
