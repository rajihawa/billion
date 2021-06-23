import htmlTags from './htmlTags';
import { newTemplate, Options, Tags, Template } from './template';

type ElementFunc<T extends keyof Tags> = (
    ...args: [Options<T>, Template[] | string] | [Template[] | string]
) => Template;

type ELements = {
    [k in keyof Tags]: ElementFunc<keyof Tags>;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const elements: ELements = htmlTags.reduce((acc, tag) => {
    const a: ElementFunc<typeof tag> = (...args) => {
        if (typeof args[0] == 'string' || Array.isArray(args[0])) {
            return newTemplate(tag, {}, args[0]);
        }
        return newTemplate(tag, args[0], args[1]);
    };
    acc[tag] = a;
    return acc;
}, {});

export default { ...elements };
