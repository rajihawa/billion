import { patch } from 'million';
import { Plugin } from './plugin';
import { templateToNode } from './template';

type MutationFunctions<S, M> = {
    [k in keyof M]: (state: S, data: M[k]) => void;
};

export type StoreOptions<S, M> = {
    state?: S;
    repository?: Repository<S>;
    mutations?: MutationFunctions<S, M>;
    useCases?: UseCases<S, M>;
};

export type Repository<S> = {
    [k: string]: (state: S) => unknown;
};

export type Mutations<S> = {
    [k: string]: (state: S, data: unknown) => void;
};

export type UseCases<S, M> = {
    [k: string]: (this: Store<S, M>, data: unknown) => unknown;
};

export type Store<S, M> = Plugin & {
    state?: S;
    get: (key: keyof Repository<S>) => unknown;
    run: (key: keyof UseCases<S, M>, data: unknown) => unknown;
    apply: (key: keyof M, data: M[keyof M]) => void;
    update: () => void;
};

// export const createMutations = <S, M>(mutations: MutationFunctions<S,M>): Mutations<> => {

// }

export const createStore = <S, M>(options: StoreOptions<S, M>): Store<S, M> => {
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
