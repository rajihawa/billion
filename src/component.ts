import { bht } from './bht';
import { newTemplate, Template } from './template';

// Component Function
export type CF<P = unknown> = (props?: P) => Template;

export type NewComponent = <P = unknown>() => CF<P>;

export const newComponent = <P = unknown>(cb?: CF<P>): CF<P> => {
    if (!cb) {
        return () => {
            return newTemplate('div');
        };
    }
    return cb;
};

export type BF = () => bht;
