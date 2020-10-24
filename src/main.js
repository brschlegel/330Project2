import * as audio from './audio.js';
import * as utils from './utils.js';
import * as canvas from './canvas.js';

const drawParams = {
    showGradient: true,
    showBars: true,
    showCircles: true,
    showNoise: true,
    showInvert: false,
    showEmboss: false
};
/*
    main.js is primarily responsible for hooking up the UI to the rest of the application 
    and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!


// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/New Adventure Theme.mp3"
});

function init() {
    audio.setupWebAudio(DEFAULTS.sound1);
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode, 3,3);
    loop();
}

function setupUI(canvasElement) {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };

    playButton.onclick = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        if (e.target.dataset.playing == "no") {
            audio.playCurrentSound();
            e.target.dataset.playing = "yes";
        } else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";
        }
    }

    //C - hookup volume slider & label
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");
    let depthSlider = document.querySelector("#depthSlider");
    let numSlider = document.querySelector("#numSlider");

    //add ,oninput event to slider
    volumeSlider.oninput = e => {
        //set the gain 
        audio.setVolume(e.target.value);
        //update value of label 
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
    };

    // depthSlider.onchange = e => {
        
    //     canvas.setupCanvas(canvasElement, audio.analyserNode, e.target.value,numSlider.value);
    // }

    // numSlider.onchange = e => {
    //     canvas.setupCanvas(canvasElement, audio.analyserNode,depthSlider.value,e.target.value);
    // }


    //set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    let trackSelect = document.querySelector("#trackSelect");
    //add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);

        if (playButton.dataset.playing = "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };

    // let circleCB =  document.querySelector("#circlesCB");
    //  circleCB.onchange = e => {
    //     drawParams.showCircles = circleCB.checked;
    // }

    // let barCB = document.querySelector("#barsCB");
    // barCB.onchange = e => {
    //     drawParams.showBars = barCB.checked;
    // }

    // let gradientCB = document.querySelector("#gradientCB");
    // gradientCB.onchange = e => {
    //     drawParams.showGradient = !drawParams.showGradient
    // }

    // let noiseCB = document.querySelector("#noiseCB");
    // noiseCB.onchange  = e =>{
    //     drawParams.showNoise = !drawParams.showNoise;
    // }

    // let invertCB = document.querySelector("#invertCB");
    // invertCB.onchange  = e =>{
    //     drawParams.showInvert = !drawParams.showInvert;
    // }
    
    // let embossCB = document.querySelector("#embossCB");
    // embossCB.onchange  = e =>{
    //     console.log("bro")
    //     drawParams.showEmboss = !drawParams.showEmboss;
    // }

} // end setupUI

function loop() {
    requestAnimationFrame(loop);
    canvas.draw(drawParams);
}

export { init };