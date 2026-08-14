//eventemitter-on() register event or ,emit()-trigger event/create event
const EventEmitter=require('events');
class MyEvent extends EventEmitter{

};
const events=new MyEvent();
events.oncei("greet",(name)=>{
    console.log(`hello cse 24 my name is ${name}`);   
})
events.on("exit",()=>{})
events.emit("greet","Rahul");
events.emit("exit");