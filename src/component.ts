import { bht } from './bht';
import { Template } from './template';

// Component Function Props
export type CFP<P = unknown> = P;

// Component Function
export type CF<P = unknown> = (props?: CFP<P>) => Template;

export type BF = () => bht;
