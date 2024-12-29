const fs = require('fs');
const https = require('https');

console.log("Hello World");

var a = 123826333;
var b = 2628363;

const httpsOptions = {
    rejectUnauthorized: false
};

https.get('https://jsonplaceholder.typicode.com/posts', httpsOptions, (res) => {
    console.log('statusCode:', res.statusCode);
});

setTimeout(() => {
    console.log("Timeout called after 5 second");
}, 5000);

fs.readFile('./file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
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
Multiplication of a and b is:  325460552082879
File read operation
statusCode: 200
Timeout called after 5 second
 */