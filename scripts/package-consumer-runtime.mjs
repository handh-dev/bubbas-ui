// Only the owned packed-consumer process loads this local qualification adapter.
import assert from 'node:assert/strict';
import {Server} from 'node:http';
const identity=process.env.BUBBAS_PACKAGE_RUNTIME_ID;assert.match(identity??'',/^[0-9a-f-]{36}$/,'Packed consumer identity required');
const emit=Server.prototype.emit;Server.prototype.emit=function(event,...args){if(event==='request')args[1].setHeader('X-Bubbas-Package-Consumer',identity);return emit.call(this,event,...args);};
const parent=process.ppid,watchdog=setInterval(()=>{if(process.ppid!==parent||parent===1){try{process.kill(-process.pid,'SIGTERM');}catch{process.kill(process.pid,'SIGTERM');}}},500);watchdog.unref();
