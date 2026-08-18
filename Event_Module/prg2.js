const EventEmitter=require('events');
const emitter=new EventEmitter();

emitter.on('click',(name)=>{
    console.log('Button clicked by',name);
});

emitter.on('mouseover',(element)=>{
    console.log('Mouseover event triggered on',element);
});

emitter.emit('click','Rahul');
emitter.emit('mouseover','Button');