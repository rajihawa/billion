import { patch } from 'million';
import { Plugin } from './plugin';
import { templateToNode } from './template';

type MutationFunctions<S, M> = {
    [k in keyof M]: (state: S, data: M[k]) => void;
};

type RepositoryFunctions<S, R> = {
    [k in keyof R]: (state: S) => R[k];
};

type UseCaseArgs = {
    [k: string]: (args: never) => unknown;
};

type UseCaseFunctions<S, R, M, U extends UseCaseArgs> = {
    [k in keyof U]: (this: Store<S, R, M, U>, data: Parameters<U[k]>[0]) => ReturnType<U[k]>;
};

export type StoreOptions<S, R, M, U extends UseCaseArgs> = {
    state?: S;
    repository?: RepositoryFunctions<S, R>;
    mutations?: MutationFunctions<S, M>;
    useCases?: UseCaseFunctions<S, R, M, U>;
};

export type Repository<S> = {
    [k: string]: (state: S) => unknown;
};

export type Mutations<S> = {
    [k: string]: (state: S, data: unknown) => void;
};

export type UseCases<S, R, M, U extends UseCaseArgs> = {
    [k: string]: (this: Store<S, R, M, U>, data: unknown) => unknown;
};

export type Store<S, R, M, U extends UseCaseArgs> = Plugin & {
    state?: S;
    get: (key: keyof R) => R[keyof R];
    run: (key: keyof U, data: Parameters<U[keyof U]>[0]) => ReturnType<U[keyof U]>;
    apply: (key: keyof M, data: M[keyof M]) => void;
    update: () => void;
};

// export const createMutations = <S, M>(mutations: MutationFunctions<S,M>): Mutations<> => {

// }

export const createStore = <S, R, M, U extends UseCaseArgs>(options: StoreOptions<S, R, M, U>): Store<S, R, M, U> => {
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
                options.mutations[key](this.state, data);
                this.update();
                return;
            }
            throw new Error('mutations are not defined');
        },
        get(key) {
            if (this.state && options.repository) {
                return options.repository[key](this.state);
            }
            throw new Error('repository is not defined');
        },
        implement(app) {
            this.update = () => {
                if (app.rootEl) {
                    patch(app.rootEl, templateToNode(app.component()));
                }
            };
        },
        update() {
            return;
        },
    };
};
