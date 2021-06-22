import { patch } from 'million';
import { Plugin } from './plugin';
import { templateToNode } from './template';

type MutationFunctions<S, M> = {
    [k in keyof M]: (state: S, data: M[k]) => void;
};

type RepositoryFunctions<S, R> = {
    [k in keyof R]: (state: S) => R[k];
};

export type StoreOptions<S, R, M> = {
    state?: S;
    repository?: RepositoryFunctions<S, R>;
    mutations?: MutationFunctions<S, M>;
    useCases?: UseCases<S, R, M>;
};

export type Repository<S> = {
    [k: string]: (state: S) => unknown;
};

export type Mutations<S> = {
    [k: string]: (state: S, data: unknown) => void;
};

export type UseCases<S, R, M> = {
    [k: string]: (this: Store<S, R, M>, data: unknown) => unknown;
};

export type Store<S, R, M> = Plugin & {
    state?: S;
    get: (key: keyof R) => R[keyof R];
    run: (key: keyof UseCases<S, R, M>, data: unknown) => unknown;
    apply: (key: keyof M, data: M[keyof M]) => void;
    update: () => void;
};

// export const createMutations = <S, M>(mutations: MutationFunctions<S,M>): Mutations<> => {

// }

export const createStore = <S, R, M>(options: StoreOptions<S, R, M>): Store<S, R, M> => {
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
