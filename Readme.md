```markdown
# Node.js and Browser Global Objects, Modules, and Patterns

## Global Objects

### Node.js vs Browser

- `console.log(global);` 
  - Node.js: Returns the global object.
  - Browser: `global` is not defined.

- `console.log(this);`
  - Node.js: Returns an empty object `{}`.
  - Browser: Returns the `window` object.

- In the browser, `window`, `this`, `self`, `frames`, `top`, `parent`, `document`, etc., are all the same.

### ES2020 `globalThis`

- Introduced to resolve conflicts between Node.js and browser environments.
- `globalThis` returns the global object in both Node.js and browser.

## Modules

### Module Scope

- Modules protect their variables and functions from leaking by default.

#### Example

**sum.js**
```javascript
const sum = (a, b) => {
  return a + b;
};
```

**app.js**
```javascript
require('./sum.js');
console.log(sum(2, 3)); // sum is not defined
```

- You cannot access the `sum` function in `app.js` because `sum.js` is a module and does not leak its variables and functions.

### Exporting and Importing

- Use `module.exports` to export functions and variables.

#### Example

**sum.js**
```javascript
const sum = (a, b) => {
  return a + b;
};
module.exports = sum;
```

**app.js**
```javascript
const sum = require('./sum.js');
console.log(sum(2, 3)); // 5
```

- To export multiple functions:

**sum.js**
```javascript
const sum = (a, b) => {
  return a + b;
};
const sub = (a, b) => {
  return a - b;
};
module.exports = { sum, sub };
```

**app.js**
```javascript
const { sum, sub } = require('./sum.js');
console.log(sum(2, 3)); // 5
console.log(sub(2, 3)); // -1
```

## Module Patterns

### CommonJS (Node.js)

**sum.js**
```javascript
const sum = (a, b) => {
  return a + b;
};
module.exports = sum;
```

**app.js**
```javascript
const sum = require('./sum.js');
```

### ES6 Modules (Browser)

**sum.js**
```javascript
export const sum = (a, b) => {
  return a + b;
};
```

**app.js**
```javascript
import { sum } from './sum.js';
```

- By default, CommonJS is used in Node.js.
- You can use ES6 modules in Node.js by using the `.mjs` extension and `type="module"` in `package.json`.

### Differences Between CommonJS and ES6 Modules

1. CommonJS is synchronous and blocking.
2. ES6 Modules are asynchronous and non-blocking.
3. CommonJS is used in Node.js (`require`, `module.exports`).
4. ES6 Modules are used in the browser (`type="module"` in the script tag).
5. ES6 Modules are tree-shakeable (you can remove unused code).
6. ES6 Modules are statically analyzable (you cannot use variables dynamically).
7. ES6 Modules are loaded in parallel (CommonJS is loaded sequentially).
8. ES6 Modules are loaded in strict mode by default (CommonJS is not).
9. ES6 Modules are loaded in the top-level scope (CommonJS is loaded in function scope).
10. ES6 Modules are read-only (CommonJS is not).
11. ES6 Modules use live bindings (CommonJS does not).
12. ES6 Modules handle cyclic dependencies (CommonJS does not).

## Organizing Modules

- Group multiple modules in a folder.
- Create an `index.js` file in that folder to export all functions and variables.
- This keeps the import statements clean and abstracts implementation details.

## Importing JSON Files

- You can import JSON files using `require`.

```javascript
const data = require('./data.json');
```

## Node.js Built-in Modules

- Node.js has many built-in modules like `util`, `fs`, `http`, etc.

```javascript
const util = require('node:util');
const fs = require('node:fs');
const http = require('node:http');
```

- You can also import core modules in Node.js.

```javascript
const path = require('path');
const os = require('os');
const url = require('url');
```
# Node.js Module System and `require` Mechanism

## Why Can't You Access Variables and Functions of One Module in Another Module?

The module system in Node.js is implemented using CommonJS modules. CommonJS modules are designed to be loaded synchronously, and the module system is implemented in such a way that it is not possible to access variables and functions of one module in another module.

### Internal Mechanism

- When you use `require('module')`, Node.js binds the whole module as a function and returns it.
- The scope of variables and functions of a module is limited to that module only.
- This function is known as an IIFE (Immediately Invoked Function Expression).

### IIFE (Immediately Invoked Function Expression)

An IIFE is a JavaScript function that runs as soon as it is defined. It looks like this:

```javascript
(function () {
  // All code is wrapped in this function
})();
```

### Privacy of Variables and Functions

- Due to the IIFE and `require()` function, the variables and functions of a module are private and can't be accessed from outside.

### Accessing `module.exports`

- The `module` and `require` are provided by Node.js.
- These are passed as parameters to the IIFE.

```javascript
(function (module, require, ...) {
  // All code is wrapped in this function
}(module, require, ...));
```

- Node.js takes your module code and wraps it in a function.
- Node.js then calls this function with the `module`, `require`, and other parameters.
- It then passes this to the V8 engine to execute the code.

## `require` Mechanism

### 5-Step Mechanism of How `require` Works

1. **Resolving the Module**
   - Determines whether the module is coming from a node module, JSON, local path, etc.

2. **Loading the Module**
   - Reads the file and wraps it in a function according to the file type.

3. **Wrapping the Module**
   - Wraps the module in an IIFE.

4. **Evaluating the Module**
   - Executes the module code and assigns the result to `module.exports`.

5. **Caching the Module**
   - Caches the module so that it doesn't have to read it again. A module is read only once.
```