const crypto = require('crypto');

console.log("Hello World");

var a = 123826333;
var b = 2628363;
//Password based key derivative function

// sync call - blocking - DO NOT USE THIS as this will block the main thread
crypto.pbkdf2Sync("password", "salt", 100000, 64, "sha512");
console.log("first Key is generated");

// Async call - non-blocking
crypto.pbkdf2("password", "salt", 100000, 64, "sha512", () => {
    console.log("Second Key is generated");
});

function multiplyFn(a, b) {
    const result = a * b;
    return result;
}  

var c = multiplyFn(a, b);

console.log("Multiplication of a and b is: ", c);

/**
 * Output:
Hello World
first Key is generated
Multiplication of a and b is:  325460552082879
Second Key is generated
*/