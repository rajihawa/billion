import htmlTags from './htmlTags';
import { newTemplate, Options, Tags, Template } from './template';

type ElementFunc = (...args: [Options<'div'>, Template[] | string] | [Template[] | string]) => Template;

type ELements = {
    [k in keyof Tags]: ElementFunc;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const elements: ELements = htmlTags.reduce((acc, tag) => {
    const a: ElementFunc = (...args) => {
        if (typeof args[0] == 'string' || Array.isArray(args[0])) {
            return newTemplate(tag, {}, args[0]);
        }
        return newTemplate(tag, args[0], args[1]);
    };
    acc[tag] = a;
    return acc;
}, {});

export default { ...elements };
