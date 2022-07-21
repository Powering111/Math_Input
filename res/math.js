const join_container_elem = document.getElementById('join-container');
const chat_container_elem = document.getElementById('chat-container');

// join
const name_input_elem = document.getElementById('name-input');
const room_input_elem = document.getElementById('room-input');
const join_btn_elem = document.getElementById('join-btn');
const join_alert_elem = document.getElementById('join-alert');

const roomname_label_elem = document.getElementById('roomname-label');
const name_label_elem = document.getElementById('name-label');

const changename_input_elem = document.getElementById('changename-input')
const changeroom_input_elem = document.getElementById('changeroom-input')
const changeroom_btn_elem = document.getElementById('changeroom-btn');
const changename_btn_elem = document.getElementById('changename-btn');
const leave_btn_elem = document.getElementById('leave-btn');

// chat
const list_container_elem = document.getElementById('list-container');
const input_container_elem = document.getElementById('input-container');

const math_box_elem = document.getElementById('math-box');
const text_box_elem = document.getElementById('text-box');

const preview_elem = document.getElementById('math-preview');
const math_elem = document.getElementById('math-input');
const text_elem = document.getElementById('text-input');

const math_send_btn_elem = document.getElementById('math-send-btn');
const text_send_btn_elem = document.getElementById('text-send-btn');

const math_input_help_elem = document.getElementById('math-input-help');
const text_input_help_elem = document.getElementById('text-input-help');

// keyboard shortcuts
input_container_elem.addEventListener('keydown',(e)=>{
    if(e.key=='Tab'){
        e.preventDefault();
        e.stopPropagation();
        toggleMathState();
    }
    if (e.key=='Enter'){
        e.preventDefault();
        e.stopPropagation();
        sendMessage();
    }
});

// joining
join_container_elem.addEventListener('keydown',(e)=>{
    if(e.key=='Enter'){
        e.preventDefault();
        e.stopPropagation();
        first_join();
    }
});

join_btn_elem.addEventListener('click',(e)=>{
   first_join(); 
});

// on first joining
function first_join(){
    if(name_input_elem.value=='' || room_input_elem.value==''){
        join_alert_elem.value="빈칸을 채우십시오.";
        return;
    }
    const name = name_input_elem.value;
    const room = room_input_elem.value;
    setname(name).then(()=>{joinroom(room);});
    name_input_elem.value="";
    room_input_elem.value="";
    join_alert_elem.value="";
}
changename_btn_elem.addEventListener('click',(e)=>{
    const name = changename_input_elem.value;
    if(name){
        setname(name);
    }
});

function setname(name){
    return new Promise((resolve,reject)=>{
        socket.emit('setname',name,()=>{
            name_label_elem.innerText=name;
            changename_input_elem.value=name;
            resolve();
        });
    });
}

function joinroom(room){
    return new Promise((resolve,reject)=>{
        socket.emit('joinroom',room,()=>{
            roomname_label_elem.innerText=room;
            changeroom_input_elem.value=room;
            list_container_elem.innerHTML='';
            
            join_container_elem.style.display = 'none';
            chat_container_elem.style.display = '';
            input_state = 'text';
            resetInput();
            focusOnInput();
            resolve();
        });
    });
}

//leaving
changeroom_btn_elem.addEventListener('click',(e)=>{
    const room = changeroom_input_elem.value;
    if(room){
        joinroom(room);
    }
});

leave_btn_elem.addEventListener('click',(e)=>{
    leave();
});

function leave(){
    socket.emit('leaveroom',()=>{
        join_container_elem.style.display = '';
        chat_container_elem.style.display = 'none';
        
    });
}

// input state change
let input_state = 'text';
function toggleMathState(){
    if(input_state == 'text'){
        input_state = 'math';
        math_box_elem.style.display = '';
        text_box_elem.style.display = 'none';
        resetInput();
        focusOnInput();
    }else{
        input_state = 'text';
        math_box_elem.style.display = 'none';
        text_box_elem.style.display = '';
        resetInput();
        focusOnInput();
    }
}


function resetInput(){
    text_elem.value="";
    math_elem.value="";
    preview();
}
function focusOnInput(){
    if(input_state == 'text'){
        text_elem.focus();
    }
    else if (input_state=='math'){
        math_elem.focus();
    }
    else{
        console.log('error');
    }
}



// math preview
math_elem.addEventListener('input', function() {
    preview();
});
function preview(){
    preview_elem.innerText = '\\('+math_elem.value+'\\)';
    MathJax.typesetPromise([preview_elem]);
}

//message sending
math_send_btn_elem.addEventListener('click',sendMessage);
text_send_btn_elem.addEventListener('click',sendMessage);

math_input_help_elem.addEventListener('click',toggleMathState);
text_input_help_elem.addEventListener('click',toggleMathState);


function sendMessage(){
    if(input_state=='text'){
        sendText();
    }
    else if (input_state=='math'){
        sendMath();
    }
    else{
        console.log("unknown input state");
    }
    resetInput();
    focusOnInput();
}

function sendText(){
    const msg = text_elem.value;
    if(msg=='') return;
    console.log("sending text message : "+msg);
    socket.emit('textmsg',msg);
    const messageElement = createTextMessage('Me',msg);
    messageElement.classList.add('message-me');
}
function sendMath(){
    const msg = math_elem.value;
    if(msg=='') return;
    console.log("sending math message : "+msg);
    socket.emit('mathmsg',msg);
    const messageElement = createMathMessage('Me',msg);
    messageElement.classList.add('message-me');
}


//message receiving
socket.on('textmsg',(e)=>{
    console.log("text message received : "+e.from, e.message);
    createTextMessage(e.from,e.message);
});

socket.on('mathmsg',(e)=>{
    console.log("math message received : "+e.from, e.message);
    createMathMessage(e.from,e.message);
});

// generate message
const appearAnimation = [
    {opacity:0},
    {opacity:1}
];
const appearTiming = {
    duration : 500,
    iterations:1
};

function createMessage(messageElement){

    let scrolledBottom=false;
    //check if scrolled bottom
    if (Math.ceil(list_container_elem.scrollTop)+10 >= list_container_elem.scrollHeight - list_container_elem.clientHeight){
        scrolledBottom = true;
    }

    list_container_elem.appendChild(messageElement);
    messageElement.animate(appearAnimation,appearTiming);

    //auto scroll to bottom
    if(scrolledBottom){
        list_container_elem.scrollTop = list_container_elem.scrollHeight;
    }
}
function createTextMessage(from,msg){
    const messageElement = document.createElement('div');
    const fromElement = document.createElement('span');
    const contentElement = document.createElement('span');

    fromElement.innerText=from;
    contentElement.innerText=msg;

    messageElement.classList.add('message');
    messageElement.classList.add('text-message');
    fromElement.classList.add('message-from');
    contentElement.classList.add('message-content');
    
    messageElement.appendChild(fromElement);
    messageElement.appendChild(contentElement);
    
    createMessage(messageElement);
    return messageElement;
}
function createMathMessage(from,msg){
    const messageElement = document.createElement('div');
    const fromElement = document.createElement('span');
    const contentElement = document.createElement('span');

    fromElement.innerText=from;
    contentElement.innerText='\\('+msg+'\\)';
    MathJax.typesetPromise([contentElement]);

    messageElement.classList.add('message');
    messageElement.classList.add('math-message');
    fromElement.classList.add('message-from');
    contentElement.classList.add('message-content');
    
    messageElement.appendChild(fromElement);
    messageElement.appendChild(contentElement);
    
    createMessage(messageElement);
    return messageElement;
}

function createSystemMessage(msg){
    const messageElement = createTextMessage('System',msg);
    messageElement.classList.add('message-system');
}

// server events
socket.on('userjoin',(name)=>{
    createSystemMessage(name+'님이 입장하셨습니다.');
});

socket.on('userleave',(name)=>{
    createSystemMessage(name+'님이 퇴장하셨습니다.');
});

socket.on('namechange',(e)=>{
    createSystemMessage(`${e.old_name} -> ${e.new_name}으로 이름이 변경되었습니다.`);
    
});