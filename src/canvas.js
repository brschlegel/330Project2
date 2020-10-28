/*
    The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import * as classes from './classes.js';
import * as audio from './audio.js'

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;
let totalDepth =3;
let numFractals = 3;
let audioDataEndPoints = [];
let allFractals = [];
let colorByDepth = [];
let imageDataY = 0;
let imageDataHeight = 0;
colorByDepth[0] = "#6699ff";
colorByDepth[1] = "#3366ff";
colorByDepth[2] = "#3333ff";
colorByDepth[3] = "#000066";
colorByDepth[4] = "#000066";
colorByDepth[5] = "#000066";
colorByDepth[6] = "#000066";

let prevCurTime, timeElapsed;

function setupCanvas(canvasElement, analyserNodeRef) {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    timeElapsed = 0;
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
    ctx.fillStyle = "green";
   // ctx.fillRect(100,100,200,200);
    ctx.fillStyle = "black";
    //drawCarpet(100, 100, 200, 200, 0);
    changeGradient();
    //gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:.25,color:"green"},{percent:.5,color:"yellow"},{percent:.75,color:"red"},{percent:1,color:"magenta"}])
    setUpShapeFractal(ArrangeCarpet, numFractals);
    for(let i = 0; i < numFractals; i++){
        audioDataEndPoints.push(Math.round(i * 128 / numFractals));
    }
    audioDataEndPoints.push(128);
  
}

function RearrangeFractal(numFractal, depth){
    audioDataEndPoints = [];
    allFractals = [];
    totalDepth = depth;
    numFractals = numFractal;
    console.log(numFractals);
    setUpShapeFractal(ArrangeCarpet, numFractals);
    for(let i = 0; i < numFractals; i++){
        audioDataEndPoints.push(Math.round(i * 128 / numFractals));
    }
    audioDataEndPoints.push(128);

}

function changeDepth(depth){
    totalDepth = depth;
    allFractals = [];
    setUpShapeFractal(ArrangeCarpet, numFractals);
}

function changeNumFractal(numFractal){
    audioDataEndPoints = [];
    allFractals = [];
    numFractals = numFractal;
    setUpShapeFractal(ArrangeCarpet, numFractals);
    for(let i = 0; i < numFractals; i++){
        audioDataEndPoints.push(Math.round(i * 128 / numFractals));
    }
    audioDataEndPoints.push(128);

}

function changeGradient(){
   gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:colorByDepth[0]},{percent:.25,color:colorByDepth[1]},{percent:.5,color:colorByDepth[2]},{percent:.75,color:colorByDepth[3]}]) 
}
function draw(params = {}) {
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
     analyserNode.getByteFrequencyData(audioData);
    // // OR
    // //analyserNode.getByteTimeDomainData(audioData); // waveform data
    elapseTime();
    ctx.save();
    ctx.fillStyle = "black";
   // ctx.globalAlpha = .1;
     ctx.fillRect(0,0,canvasWidth,canvasHeight);
     ctx.restore();
  
     
    drawTime(canvasWidth/2 - 30,canvasHeight - 30,"30px Arial", "white");
     
    if(params.showGradient){
        ctx.fillStyle = gradient;
    }
    for(let i = 0; i < allFractals.length; i++){
        drawFractal(audioData, allFractals[i],audioDataEndPoints[i], audioDataEndPoints[i+1], params.showGradient, gradient);
    }
    //including image data with the fractals pretty much just shuts things down, unless you restrict where it looks to just where new stuff is happening
    let imageData = ctx.getImageData(0,imageDataY,canvasWidth,imageDataHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
    // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i =0; i < length; i += 4){
        if(params.showInvert){
            let red = data[i], green = data[i+1], blue = data[i+2];
            if(red != 0 || blue != 0 || green != 0){
            data[i] = 255 - red;
            data[i+1] = 255 - green;
            data[i+2] = 255 - blue;
            }
        }
    }
    ctx.putImageData(imageData, 0, imageDataY);
    
}

function ArrangeCarpet(x, y, width, height, depth, squares){
   
    for(let i =0; i < totalDepth + 1; i++){
        squares.push([]);
    }
    squares[depth].push(new classes.Square(x + .333333 * width, y + .33333333 * height, .333333 * width, .33333333 * height, colorByDepth[depth]));
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(!(i == 1 && j == 1) && depth < totalDepth){
               ArrangeCarpet(x + .333333 * width * i, y + .33333333 * height * j, .333333 * width, .33333333 * height, depth + 1, squares);
            }
        }
    }
   
}

//Plans for sierpinski triangle that didn't have time to go through

function ArrangeTriangle(points,depth,arr){
    for(let i =0; i < totalDepth + 1; i++){
        arr.push([]);
    }
    let p = [];
    p[0] = (points[2] - points[0])/2 + points[0];
    p[1] = (points[3] - points[1])/2 + points[1];
    p[2] = (points[4] - points[2])/2 + points[2];
    p[3] = (points[5] - points[3])/2 + points[3];
    p[4] = (points[4] - points[0])/2 + points[0];
    p[5] = (points[5] - points[1])/2 + points[1];
    arr[depth].push(new classes.Triangle(p, colorByDepth[depth]));
  

}

function drawFractal(audioData, array,start,end, gradient){
    //let value = utils.averageArrayValues(audioData, 0, Math.floor(audioData.length / 3));
    let value = audioData[start]
    let numDepth = Math.round(value / (256 / totalDepth));
    if(numDepth > totalDepth){
        numDepth = totalDepth;
    }
    for(let i =0; i < numDepth; i++){
        for(let j = 0; j < array[i].length; j++)
        {
            array[i][j].scale = value / 256;
            array[i][j].draw(ctx,gradient);
        }
    }
}

function setUpShapeFractal(arrangeFunction, num){

    num++;
  
    for(let i = 0; i < num - 1; i++){
        let arr = [];
        let width = canvasWidth / num ;
        let spacing = width / num ;
        imageDataHeight = width;
        imageDataY = (canvasHeight / 2) - (width /2);
        arrangeFunction( spacing + i * (width + spacing),(canvasHeight / 2) - (width /2),width,width,0,arr);
        allFractals.push(arr);
    }

}

function setColor(color, depth){
    colorByDepth[depth] = color;
    changeGradient();
    allFractals = [];
    setUpShapeFractal(ArrangeCarpet, numFractals);
}

function elapseTime(){
    if(audio.playing){
    timeElapsed += audio.audioCtx.currentTime - prevCurTime;
    timeElapsed
    }
    prevCurTime =  audio.audioCtx.currentTime;
}

function drawTime(x,y,font,color){
    let date = new Date(0);
    date.setSeconds(timeElapsed); // specify value for SECONDS here
    let timeString = date.toISOString().substr(14, 5);
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(timeString, x, y)
    ctx.restore();
}


export { setupCanvas, draw, RearrangeFractal,changeDepth,changeNumFractal,setColor };