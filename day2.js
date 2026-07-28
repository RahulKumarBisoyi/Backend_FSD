//synchronous and asynchonous
// console.log("task 3");

// function hello(){
//     console.log("task 1");
// }
// hello();
// console.log("task 2");

// function hello(){                     //asynchrohous fnc --> run after set time
//     console.log("task 1");            //here set time is 2 second
//     setTimeout(function(){            //fnc is written inside setTimeout()
//         console.log("task 2");
//         console.log("task 4");
//     },2000)
// }
// hello();
// console.log("task 3");

function hello(n1,n2,callback){
    console.log("task1");
    return n1+n2;
    callback();
}
let a=10;
let b=20;
console.log(hello(a,b));
hello(a,b,hi);
function hi(){
    console.log("sayHi");
}
hi();