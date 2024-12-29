const fs = require("fs");
const a = 100;

setImmediate(() => console.log("setImmediate"));

Promise.resolve().then(() => console.log("Promise resolved"));

fs.readFile("./file.txt", "utf8", (err, data) => {
  console.log("File read operation");
});

setTimeout(() => console.log("Timer expired"), 0);

process.nextTick(() => console.log("process.nextTick"));

function PrintA() {
  console.log("a", a);
}

PrintA();
console.log("last line of the code");

/**
 * Output:
a 100
last line of the code
process.nextTick
Promise resolved
Timer expired
setImmediate
file read operation
*/
