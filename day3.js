//promises for asynchronous
//js single threaded
const Promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Arigato");
    }, 2000);

    console.log("promise task1 ");
resolve("promises passed by using resolve");

    let msg = true;
    if (!msg == true) {
        console.log("msg using promise failed");
    } else {
        console.log("error...");
    }
});

Promise1.then((result) => {
    console.log(result);
});

// .catch((error)=>{
// console.log(error);
// });

//asych await
console.log("1");

async function test() {
    console.log("2");
    await console.log("3");
    console.log("4");
}

test();

console.log("5");