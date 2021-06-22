# Billion js

Billionjs is a frontend framework that targets micro-frontends and small-scale projects, the goal is not to replace any of the great [React](https://github.com/facebook/react) or [Vue](https://github.com/vuejs/vue), Billion aims to create small and crazy fast web apps with great typing support by using minimal and hand-picked dependencies.

### Features

-   [x] JS Object based templates
-   [x] centralized flux store
-   [ ] create-billion-app cli
-   [ ] built-in router

### dependencies

-   [million](https://github.com/millionjs/million) 🌈 <1kb virtual DOM - it's fast!
-   [cssType](https://github.com/frenic/csstype) TypeScript and Flow definitions for CSS!

### example

> note that the package is not public yet

> this example is done with vite vanilla typescript template

```typescript
// main.ts
import { createApp, newComponent, newTemplate, createStore } from 'billionjs';
import './style.css';

/*
 * creating the store is the only thing that might take time, but its better than having an unmanageable state in the future.
 * billion's store is based on flux state management by facebook (https://facebook.github.io/flux/docs/in-depth-overview#structure-and-data-flow)
 * and on clean archetecture by uncle bob (https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).
 * in short:
 *   - mutations are the only functions that are allowed to directly change the state and cause a re-render, they should be called only from inside usecases.
 *   - usecases are responisble of carrying the business logic like api calls, usecases also have access to mutations and repository.
 *   - repository is responsible of returning data from state to the app.
 */
type Mutations = {
    // * name of the function persist all over the app, and the type is the data you expect to be passed.
    setClicks: number;
};

type UseCases = {
    // * name is same as mutations, but the first argument type is the data type and the return type is the return type.
    buttonClick: () => void;
};

type Repository = {
    // * this is exactly just like mutations.
    clicks: number;
};

const store = createStore<{ clicks: number }, Repository, Mutations, UseCases>({
    // * specify the initial state here.
    state: {
        clicks: 0,
    },
    // * this is where the mutations, repository and usecase logic is implemented.
    mutations: {
        setClicks(state, data) {
            state.clicks = data;
        },
    },
    repository: {
        clicks(state) {
            return state.clicks;
        },
    },
    useCases: {
        buttonClick() {
            // * the "this" is the entire store.
            // * the apply functions is used to call mutations, passing the name and the data expected.
            this.apply('setClicks', this.state.clicks);
        },
    },
});

// * component is a collection of logic that returns a template in the end.
const Button = newComponent(() => {
    // * get fucntion is used to call repository fucntions.
    const clicks = store.get('clicks');

    // * templates are highly typed HTML elements.
    return newTemplate('div', {}, [
        newTemplate('div', {}, clicks.toString()),
        newTemplate(
            'button',
            {
                onclick: (_e) => {
                    // * run function is used to call usecases fucntions.
                    // * specifing undefined when there is no data to persist a highly typed app.
                    store.run('buttonClick', undefined);
                },
            },
            'Click me',
        ),
    ]);
});

const App = newComponent(() => newTemplate('div', {}, [Button({})]));

// * create app expect a selector to apply VirtualDOM to it, and a base template.
const app = createApp('#app', App);

// * use function allow to implement custom plugins
app.use(store);
```
