//Event loop concept 
//create one synchronous function
//set time out and make two promise 
//use call back outside main function


console.log("synchronous task");

const f1 = () => {
    console.log("f1");
};

const f2 = () => {
    console.log("f2");
};

const f3 = function () {
    console.log("this event loop");

    setTimeout(f1, 1000);
    setTimeout(f2, 1000);

    new Promise((resolve) => {
        resolve("I am Promise 1");
    }).then((result) => {
        console.log(result);
    });

    new Promise((resolve) => {
        resolve("This is Promise 2");
    }).then((result) => {
        console.log(result);
    });
};

f2();
f3();