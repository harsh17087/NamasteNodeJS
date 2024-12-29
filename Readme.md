
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

# Google V8 JavaScript Engine

## What happens when you give your code to Google V8 JavaScript Engine?

### 1. Parsing

- **Syntax Analysis/Parsing**: Tokens are converted into an Abstract Syntax Tree (AST), which is a tree representation of the structure of the code. You can use [AST Explorer](https://astexplorer.net) to see the AST of your code.

### 2. Compilation

- **Ignition Interpreter**: The AST is passed to the Ignition Interpreter, which converts the AST into bytecode. This bytecode is then executed.
- **Profiling**: While the code is running, the V8 engine profiles the code to identify potential optimizations. If the code runs multiple times, the V8 engine optimizes it using Just-In-Time (JIT) Compilation, producing optimized machine code. This optimized code is stored in the code cache. The Turbofan Compiler handles this process, making assumptions about variables' types. If these assumptions are incorrect, the code is deoptimized, and the process is repeated.
- **Inline Caching**: A technique used by V8 to optimize the code by storing the optimized code in the code cache.
- **Copy Elision**: A compiler optimization technique that eliminates unnecessary copying of objects.

### 3. Garbage Collection

V8 uses a garbage collector to manage memory, freeing up memory that is no longer needed by the program. This process runs parallel to code execution.

#### Garbage Collection Algorithms:

- **Mark and Sweep**: Marks objects that are reachable by the program and sweeps away those that are not.
- **Scavenger**: Used for short-lived objects, dividing the heap into new and old spaces. Objects start in the new space and move to the old space if they survive a garbage collection cycle.
- **Mark and Compact**: Used for long-lived objects, marking reachable objects and compacting them into contiguous memory locations.
- **Incremental**: Breaks up the garbage collection process into smaller steps interleaved with program execution, reducing pause time.
- **Generational**: Divides objects into different generations based on their age, collecting young objects more frequently than old ones.

#### Orinoco Garbage Collector

The garbage collector in V8, called Orinoco, is a generational garbage collector that uses a combination of mark and sweep, scavenger, and incremental garbage collection algorithms.

# LIBUV

LIBUV is a multi-platform support library with a focus on asynchronous I/O. It was primarily developed for use by Node.js, but it’s also used by other software projects. It consists of three major components:

## Components

1. **Event Loop**: The event loop is the core of every Node.js application. It’s a single-threaded loop that monitors the execution stack and the callback queue. It executes the operations in the queue and checks for any new operations that need to be added to the queue.

2. **Thread Pool**: The thread pool is used to handle asynchronous operations. It’s a pool of threads that are used to execute non-blocking operations.

3. **Callback Queue**: The callback queue is a queue that holds the callbacks that need to be executed by the event loop.

## Phases of the Event Loop

1. **Timers**: This phase executes callbacks scheduled by `setTimeout()` and `setInterval()`.

2. **Poll**: This phase retrieves new I/O events. It executes I/O-related callbacks, such as those for network requests, file system operations, and timers.

3. **Check**: This phase executes callbacks that are scheduled by `setImmediate()`.

4. **Close Callbacks**: This phase executes close callbacks, such as those for socket and file system operations.

There are two more phases after Timer : 
**Pending Callbacks** - Executes I/O callbacks deferred to the next loop iteration.
**Idle, prepare** - Used internally.

The event loop continues to run as long as there are callbacks in the queue. When the queue is empty, the event loop exits. Each phase has its own queue, and the event loop moves from one phase to the next. The event loop keeps checking the call stack and the callback queue. If the call stack is empty, it will check the callback queue for any new operations that need to be executed and will push the operations to the call stack.

Before each phase, one more cycle of the event loop is run. This cycle is called the tick. The tick is used to check for any new operations that need to be added to the queue. This cycle checks for `process.nextTick()` and Promise callbacks.

**If there is noo callback in queues, then event loop will wait in the poll phase. 
Once the callback is available, it will again start the loop.**

# Node.js: Single-Threaded and Multithreaded Aspects

Node.js is primarily **single-threaded** in terms of its event loop, which handles asynchronous operations. However, it can also be considered **multithreaded** due to its use of a thread pool for certain tasks.

## Single-Threaded Event Loop
- The core of Node.js is the event loop, which runs on a single thread. This event loop handles I/O operations, such as reading from or writing to a file, making network requests, and executing timers.

## Multithreaded Thread Pool
- Node.js uses a thread pool (provided by the `libuv` library) to handle operations that are too heavy for the event loop to manage efficiently on its own. These operations include:
  - File system operations
  - DNS lookups
  - Compression tasks
  - Some cryptographic functions

The thread pool allows Node.js to perform these blocking operations asynchronously, without blocking the main event loop. By default, the thread pool has four threads, but this number can be adjusted.

## Node.js Event Loop

Node.js uses a single-threaded event loop to handle asynchronous operations. The event loop continuously checks for events and executes the corresponding callback functions.

### Integration with epoll/kqueue

### Epoll (Linux)
- When an asynchronous operation (like file I/O or network request) is initiated, Node.js registers the operation with epoll.
- The event loop waits for the operation to complete without blocking the main thread.
- Once the operation is ready, epoll notifies the event loop, which then executes the callback associated with the operation.

### Kqueue (BSD-based systems, including macOS)
- When an asynchronous operation (like file I/O or network request) is initiated, Node.js registers the operation with kqueue.
- The event loop waits for the operation to complete without blocking the main thread.
- Once the operation is ready, kqueue notifies the event loop, which then executes the callback associated with the operation.

### Benefits
This efficient handling of asynchronous tasks allows Node.js to manage numerous concurrent connections with minimal resource usage, making it ideal for scalable network applications.
