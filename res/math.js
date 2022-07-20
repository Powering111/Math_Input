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


text_elem.addEventListener('input',function(){
    // do nothing
})

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
}
function sendMath(){
    const msg = math_elem.value;
    console.log("sending math message : "+msg);
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