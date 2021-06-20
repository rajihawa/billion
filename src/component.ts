import { Template } from './template';

// Component Function
export type CF<P = unknown> = (props?: P) => Template;
