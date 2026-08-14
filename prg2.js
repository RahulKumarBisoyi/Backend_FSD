//simulate DOM-like event handling in Node.js using events.

const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.on('click', () => {
    console.log('Button clicked!');
});
emitter.emit('click');