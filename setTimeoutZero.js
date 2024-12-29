console.log("Hello World");

var a = 45716571;
var b = 563622;

// This callback will be called after 0 milliseconds after global execution context is done
setTimeout(()=>{
    console.log("call me right now");
},0); // it will only be called once call stack of main thread is empty

setTimeout(()=>{
    console.log("call me after 3 second");
},3000);

function multiplyFn(a, b) {
    const result = a * b;
    return result;
}  

var c = multiplyFn(a, b);

console.log("Multiplication of a and b is: ", c);

/**
 * Output:
Hello World
Multiplication of a and b is:  25766865180162
call me right now
call me after 3 second
*/