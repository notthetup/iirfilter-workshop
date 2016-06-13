var horner = require("horner");
var ndarray = require("ndarray");
var cops = require("ndarray-complex");

console.log("Hello World");

/*
* Given the numerator b and denominator a of a digital filter, compute its frequency response
*/
function caclculateFreqz(a, b){


  return {
    w: [],
    H: []
  }
}

var b = [2, 0, 4];
var a = [0, -3, 5];

var omega = ndarray(new Float32Array([10,20,30,40,50]), [1, 5])
console.log(omega);
window.omega = omega;

//Evaluate the polynomial 2 - 3i * x + (4 + 5i)*x^2 at x = 1+2i:

// console.log(horner([]     //Real coefficients
//                   ,[]   //Imaginary coefficients
//                   ,[1, 2]))
