const express = require('express');
const app = express();
const SocketIO = require('socket.io');
const path = require('path');
function getFilename(fullPath) {
    return fullPath.substring(fullPath.lastIndexOf('/') + 1);
}
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/Math.html'));
});
app.get('/res/:name',(req,res)=>{
    res.sendFile(path.join(__dirname,'/res/'+req.params.name));
})
app.get('/js/:name',(req,res)=>{
    res.sendFile(path.join(__dirname,'/js/'+getFilename(req.params.name)));
});
app.get('/fonts/:name',(req,res)=>{
    res.sendFile(path.join(__dirname,'/fonts/'+getFilename(req.params.name)));
});

const server = app.listen(80,()=>{
    console.log('Server is running on port 80');
});

const io = SocketIO(server,{path:'/socket.io'});
io.on('connection',(socket)=>{
    
    console.log('a user connected');
    socket.name="Anonymous";
    socket.on('disconnect',()=>{
        console.log('a user disconnected');
    }
    );
    
    socket.on('setname',(msg)=>{
        console.log('user set name : '+msg);
        socket.name = msg;
    });
    
    socket.on('textmsg',(msg)=>{
        console.log('text message received : '+msg);
        socket.broadcast.emit('textmsg',{from:socket.name,message:msg});
    }
    );
    socket.on('mathmsg',(msg)=>{
        console.log('math message received : '+msg);
        socket.broadcast.emit('mathmsg',{from:socket.name,message:msg});
    })
}
);