const fs = require("fs");

setImmediate(() => console.log("setImmediate"));

setTimeout(() => console.log("Timer expired"), 0);

Promise.resolve().then(() => console.log("Promise resolved"));

fs.readFile("./file.txt", "utf8", (err, data) => {
  console.log("File read operation");
});

process.nextTick(() => {
    process.nextTick(()=>console.log("inner process.nextTick"));
    console.log("process.nextTick");
});

console.log("last line of the code");

// If nextTick has nested nextTick, it will keep on executing the nextTick callbacks until the nextTick queue is empty.

/**
 * Output:
last line of the code
process.nextTick      
inner process.nextTick
Promise resolved      
Timer expired
setImmediate
File read operation   
 */