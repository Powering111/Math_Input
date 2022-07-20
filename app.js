const express = require('express');
const app = express();
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

app.listen(80,()=>{
    console.log('Server is running on port 80');
})
