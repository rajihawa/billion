import { Tags } from './tags';

// . is for classNames, # for Ids and $ is for keys
export type Attribute<T extends Attribute = ''> =
    | (T extends '' ? `${'#' | '.' | '$'}${string}` : `${'#' | '.'}${string}${T}`)
    | '';

export type bht = [`${keyof Tags}${Attribute<Attribute>}`];
