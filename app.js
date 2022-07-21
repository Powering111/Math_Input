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
    socket.on('disconnecting',()=>{
        
        socket.rooms.forEach((room)=>{
            io.to(room).emit('userleave',socket.name);
            socket.leave(room);
            console.log(room);
        });
    });

    socket.on('disconnect',()=>{
        console.log('a user disconnected');
    }
    );
    
    socket.on('setname',(name,callback)=>{
        console.log('user set name : '+name);
        io.to(socket.roomname).emit('namechange',{old_name:socket.name,new_name:name});
        socket.name = name;
        callback();
    });

    socket.on('joinroom',(room,callback)=>{
        if(room){
            console.log('user join room : '+room);
            if(socket.roomname){
                socket.leave(socket.roomname);
                io.to(socket.roomname).emit('userleave',socket.name);

            }
            socket.roomname=room;
            socket.join(room);
            io.to(room).emit('userjoin',socket.name);
            console.log(socket.name,": ",socket.rooms);
        }
        callback();
    });
    socket.on('leaveroom',(callback)=>{
        console.log('user leave room : '+socket.roomname);
        io.to(socket.roomname).emit('userleave',socket.name);
        socket.leave(socket.roomname);
        socket.roomname=null;
        callback();
    });
    
    socket.on('textmsg',(msg)=>{
        console.log('text message received : '+msg);
        socket.broadcast.to(socket.roomname).emit('textmsg',{from:socket.name,message:msg});
    }
    );
    socket.on('mathmsg',(msg)=>{
        console.log('math message received : '+msg);
        socket.broadcast.to(socket.roomname).emit('mathmsg',{from:socket.name,message:msg});
    });
}
);