import { Plugin } from './plugin';

export type StoreOptions<S> = {
    state?: S;
    repository?: Repository<S>;
    mutations?: Mutations<S>;
    useCases?: UseCases<S>;
};

export type Repository<S> = {
    [k: string]: (state: S) => unknown;
};

export type Mutations<S> = {
    [k: string]: (state: S, data: unknown) => void;
};

export type UseCases<S> = {
    [k: string]: (this: Store<S>, data: unknown) => unknown;
};

export type Store<S> = {
    state?: S;
    get: (key: keyof Repository<S>) => unknown;
    run: (key: keyof UseCases<S>, data: unknown) => unknown;
    apply: (key: keyof Mutations<S>, data: unknown) => void;
};

export const createStore = <S>(options: StoreOptions<S>): Store<S> => {
    return {
        state: options.state,
        run(key, data) {
            if (this.state && options.useCases) {
                const d = options.useCases[key].bind(this)(data);
                return d;
            }
            throw new Error('usecases are not defined');
        },
        apply(key, data) {
            if (this.state && options.mutations) {
                return options.mutations[key](this.state, data);
            }
            throw new Error('mutations are not defined');
        },
        get(key) {
            if (this.state && options.repository) {
                return options.repository[key](this.state);
            }
            throw new Error('repository is not defined');
        },
    };
};

export const billionX: Plugin = () => {
    return;
};
