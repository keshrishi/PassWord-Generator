const inputSlider = document.querySelector("[data-lengthSlider]");
const datalength = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyButton = document.querySelector("[data-copy]");
const copyMessage = document.querySelector("[data-cpyMsg]");
const upperBox = document.querySelector("#Uppercase");
const LowerBox = document.querySelector("#Lowercase");
const NumberBox = document.querySelector("#Numbers");
const SymbolBox = document.querySelector("#Symbol");

const StrengthIndicator = document.querySelector("[data-indicator]");
const GenerateButton = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '!@#$%^&*(<}{?*^$:;\|+=~`,./[]';
let passWord = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// strength indicator is by default white
setIndicator("#ccc");

// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    datalength.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}

function setIndicator(color) {
    StrengthIndicator.style.backgroundColor = color;
    StrengthIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInt(min,max){
   return Math.floor(Math.random() *(max-min)) + min;
}

function generateRndNum(){
    return getRndInt(0,9);
}
function generateRndUpper(){
    return String.fromCharCode(getRndInt(97,123));
}
function generateRndLower(){
    return String.fromCharCode(getRndInt(65,91));
}
function generateRndSymbol(){
    const randNum = getRndInt(0,symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (upperBox.checked) hasUpper = true;
    if (LowerBox.checked) hasLower = true;
    if (NumberBox.checked) hasNumber = true;
    if (SymbolBox.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >=8){
        setIndicator('#0f0');
    } else if(
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) && 
        passwordLength>= 6
    ) {
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}

 async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText = "Copied"; 
    } catch(e){
        copyMessage.innerText = "Failed";
    }
    copyMessage.classList.add("active");
    setTimeout( () =>{
        copyMessage.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    console.log(passwordLength);
    handleSlider();
});

copyButton.addEventListener('click',function() {
    if(passwordDisplay.value)
        copyContent();
});

function handleCheckBox(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
        });

    // Special Case
    if(checkCount > passwordLength){
        passwordLength = checkCount;
        handleSlider();
    }
};
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBox);

});

function shufflePassword(array){
    // Fisher yates Method
    for ( let i = array.length-1 ; i > 0;i--){
        // finding random J index for swapping with ith index
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
GenerateButton.addEventListener('click',() => {
    // none of check boxes are checked
    console.log("journey started");
    if(checkCount <=0) return;
    
    if ( passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    // lets start the journey to find 
    console.log("journey started2");

    passWord = "";
    let functionArr = [];
    if(upperBox.checked)
        functionArr.push(generateRndUpper);
    if(LowerBox.checked)
        functionArr.push(generateRndLower);
    if(NumberBox.checked)
        functionArr.push(generateRndNum);
    if(SymbolBox.checked)
        functionArr.push(generateRndSymbol);

    for( let i = 0 ; i< checkCount;i++){
    console.log("journey started3");

        passWord += functionArr[i]();
    }
    for( let i = 0 ; i < passwordLength - checkCount ; i++){
    console.log("journey started4");

        let RandIndex = getRndInt(0,functionArr.length);
        passWord += functionArr[RandIndex]();
    }
    // shuffle the password 
    console.log("journey started5");

    passWord = shufflePassword(Array.from(passWord));

    passwordDisplay.value = passWord;

    // check the strength indicator
    calcStrength();
})