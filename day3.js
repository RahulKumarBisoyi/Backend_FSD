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

/*create promises that will print username and pass using and if username and pass not found then it will call reject state and print error.*/

const login = new Promise((resolve, reject) => {
    let username = "Rahul";
    let password = "12345";

    if (username === "Rahul" && password === "12345") {
        resolve("Login Successful");
    } else {
        reject("Invalid Username or Password");
    }
});

login
    .then((message) => {
        console.log(message);
    })
    .catch((error) => {
        console.log(error);
    });

async function test2(){
    console.log("message:2");
    const response=await fetch("./student.json");
    console.log(response.status);
    const stdn=await response.json();
    console.log("message:3");
    return stdn;
    

}
test2().then((res)=>{
    console.log(res)
});
