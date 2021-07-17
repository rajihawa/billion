import { Tags } from './tags';

// . is for classNames, # for Ids and $ is for keys
export type Attribute<T extends Attribute = ''> =
    | (T extends '' ? `${'#' | '.' | '$'}${string}` : `${'#' | '.'}${string}${T}`)
    | '';

type BillionType = `${keyof Tags}${Attribute<Attribute>}`;

export type Options = {
    style?: Record<string, string>;
};

export type bht =
    | [BillionType, Options, ...bht[]]
    | [BillionType, ...bht[]]
    | [BillionType, Options, string]
    | [BillionType, string];

export type BF<P extends unknown = void> = (props: P) => bht;
