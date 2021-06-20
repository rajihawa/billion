import { Billion } from '.';

export type Plugin = (plugin: (app: Billion, ...options: unknown[]) => void, ...args: unknown[]) => void;
