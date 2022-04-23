const Text = fetchParagraph();
let typedText = '';
let cursorIdx = 0;
let details = {};
details.correctnessList = new Array(Text.length).fill(0);
details.correctCnt = 0;
details.incorrectCnt = 0;
details.backSpaceCnt = 0;
details.oldKey;
let Letters;
let progress = 0;

//
const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change', ()=>{
  document.body.classList.toggle('dark');
})
//
function loadParagraph(){
    const ParagraphDiv = document.querySelector('.paragraph');
    for (let i = 0; i < Text.length; i++) {
        let letter = document.createElement('letter');
        letter.innerText = Text[i];
        letter.classList.add('untyped');
        ParagraphDiv.append(letter);
    }
}


function isPrintableKey(e){
    return (e.key && e.key.length === 1);
}

function checkCharacter(key){
    // console.log(`${key},${Letters[cursorIdx].innerText}`);
    Letters[cursorIdx].classList.remove('untyped');
    if(Letters[cursorIdx].innerText===key){
        details.correctCnt++;
        Letters[cursorIdx].classList.add('correct');
    } else{
        details.incorrectCnt++;
        if(Letters[cursorIdx].innerText==' '){
            Letters[cursorIdx].classList.add('wrong-space');
        } else{
            Letters[cursorIdx].classList.add('wrong');
        }
    }
}

function processCharacter(e){
    if(e.key=='Backspace'){
        if(cursorIdx<=0)return -1;
        Letters[cursorIdx-1].classList = 'untyped';        
        typedText = typedText.slice(0,typedText.length-1);
        details.backSpaceCnt++;
        return -1;
    } else if(cursorIdx<Text.length){
        if(isPrintableKey(e)){
            // append
            typedText+=e.key;
            checkCharacter(e.key);
            return 1;
        } else{
            return 0;
        }
    }
}

document.onkeydown = function updateCursor(e){
    e.preventDefault();
    let moveForward = processCharacter(e);
    progress = typedText.length/Text.length*100;
    Letters[cursorIdx]?.classList.remove('cursor'); // remove cursor from previous character
    if(moveForward>0){
        cursorIdx++;    
    } else if(moveForward<0 && cursorIdx>0){
        cursorIdx--;
    }
    if(cursorIdx>=Text.length){
        getAccuracy();
        return;
    }
    Letters[cursorIdx].classList.add('cursor'); // add cursor over current character
}

function showAccuracy(){
    let analysisDiv = document.querySelector('.analysis');
    analysisDiv.innerText = 'Accuracy: '+((details.accuracy*100).toFixed(2));
}

function getAccuracy(){
    // acc = correct/total = 1- errors/total
    details.accuracy = (details.correctCnt)/(details.correctCnt+details.incorrectCnt);
    showAccuracy();
}

function run(){
    loadParagraph();
    Letters = document.querySelectorAll('letter');
    Letters[cursorIdx].classList.add('cursor');
}

run();
// edge cases -> 
// typo during space
// typing after end of paragraph
// backspacing till the very begining to see if cursor index becomes negative
// handling of keys with symbols due to 2 symbols present on them
// floating point issues while handling accuracy