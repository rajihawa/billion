import { Billion } from '.';

export type Plugin = Record<string, unknown> & {
    implement: PluginFC;
};

export type PluginFC = (app: Billion, ...options: unknown[]) => void;
