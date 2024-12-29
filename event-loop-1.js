const fs = require("fs");
const a = 100;

setImmediate(() => console.log("setImmediate"));

fs.readFile("./file.txt", "utf8", (err, data) => {
  console.log("File read operation");
});

setTimeout(()=> console.log("Timer expired"), 0);

function PrintA(){
    console.log("a", a);
}

PrintA();
console.log("last line of the code");

/**
 * Output:
a 100
last line of the code
Timer expired
setImmediate
File read operation
 */