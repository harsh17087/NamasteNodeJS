const fs = require("fs");

setImmediate(() => console.log("1st setImmediate"));

setTimeout(() => console.log("1st timer"), 0);
Promise.resolve().then(() => console.log("Promise resolved"));

fs.readFile("./file.txt", "utf8", (err, data) => {
  setTimeout(() => console.log("2nd timer"), 0);
  process.nextTick(() => console.log("2nd process.nextTick"));
  setImmediate(() => console.log("2nd setImmediate"));
  console.log("File read operation");
});

process.nextTick(() => console.log("1st process.nextTick"));

console.log("last line of the code");

// when there is no callback, the event loop will wait at the poll phase.

/**
 * Output:
last line of the code
1st process.nextTick
Promise resolved
1st timer
1st setImmediate
File read operation
2nd process.nextTick
2nd setImmediate
2nd timer
 */