# Billion js

Billionjs is a frontend framework that targets micro-frontends and small-scale projects, the goal is not to replace any of the great [React](https://github.com/facebook/react) or [Vue](https://github.com/vuejs/vue), Billion aims to create small and crazy fast web apps with great typing support by using minimal and hand-picked dependencies.

### Features

-   [x] JS Object based templates
-   [ ] centralized flux store
-   [ ] built-in router

### dependencies

-   [million](https://github.com/millionjs/million) 🌈 <1kb virtual DOM - it's fast!
-   [cssType](https://github.com/frenic/csstype) TypeScript and Flow definitions for CSS!

### example

> note that the package is not public yet

> this example is done with vite vanilla typescript template

```typescript
// main.ts
import Billion, { CF } from '../../billionjs/src';

// render a simple button in screen with onclick event
const App: CF = () => {
    return Billion.newTemplate(
        'button',
        {
            onclick: (event) => {
                console.log(event);
            },
        },
        'Click me',
    );
};

Billion.render(App);
```
