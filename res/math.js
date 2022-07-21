const chat_container_elem = document.getElementById('chat-container');

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
})

math_elem.addEventListener('input', function() {
    preview_elem.innerText = '\\['+math_elem.value+'\\]';
    MathJax.typesetPromise([preview_elem]);
});

math_send_btn_elem.addEventListener('click',sendMessage);
text_send_btn_elem.addEventListener('click',sendMessage);

math_input_help_elem.addEventListener('click',toggleMathState);
text_input_help_elem.addEventListener('click',toggleMathState);

let input_state = 'text';
function toggleMathState(){
    if(input_state == 'text'){
        input_state = 'math';
        math_box_elem.style.display = 'block';
        text_box_elem.style.display = 'none';
        resetInput();
        focusOnInput();
    }else{
        input_state = 'text';
        math_box_elem.style.display = 'none';
        text_box_elem.style.display = 'block';
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

function preview(){
    preview_elem.innerText = '\\('+math_elem.value+'\\)';
    MathJax.typesetPromise([preview_elem]);
}

function sendText(){
    const msg = text_elem.value;
    console.log("sending text message : "+msg);
    socket.emit('textmsg',msg);
    const messageElement = createTextMessage('Me',msg);
    messageElement.classList.add('message-me');
}
function sendMath(){
    const msg = math_elem.value;
    console.log("sending math message : "+msg);
    socket.emit('mathmsg',msg);
    const messageElement = createMathMessage('Me',msg);
    messageElement.classList.add('message-me');
}

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
    list_container_elem.appendChild(messageElement);
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
    list_container_elem.appendChild(messageElement);
    return messageElement;
}


socket.on('textmsg',(e)=>{
    console.log("text message received : "+e.from, e.message);
    createTextMessage(e.from,e.message);
});

socket.on('mathmsg',(e)=>{
    console.log("math message received : "+e.from, e.message);
    createMathMessage(e.from,e.message);
});