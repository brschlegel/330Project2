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

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;
let totalDepth = 4;
let numFractals = 3;
let audioDataEndPoints = [];
let allFractals = [];
let colorByDepth = [];
colorByDepth[0] = "#6699ff";
colorByDepth[1] = "#3366ff";
colorByDepth[2] = "#3333ff";
colorByDepth[3] = "#000066";


function setupCanvas(canvasElement, analyserNodeRef) {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: .25, color: "green" }, { percent: 1, color: "yellow" }]);
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
    ctx.fillStyle = "green";
   // ctx.fillRect(100,100,200,200);
    ctx.fillStyle = "black";
    //drawCarpet(100, 100, 200, 200, 0);

    setUpShapeFractal(ArrangeCarpet, 3, 100,100,200,200 );
    for(let i = 0; i < numFractals; i++){
        audioDataEndPoints.push(Math.round(i * 128 / numFractals));
    }
    audioDataEndPoints.push(128);
  
}

function draw(params = {}) {
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
     analyserNode.getByteFrequencyData(audioData);
    // // OR
    // //analyserNode.getByteTimeDomainData(audioData); // waveform data

    ctx.save();
    ctx.fillStyle = "black";
   // ctx.globalAlpha = .1;
     ctx.fillRect(0,0,canvasWidth,canvasHeight);
     ctx.restore();
     
    for(let i = 0; i < allFractals.length; i++){
        drawFractal(audioData, allFractals[i],audioDataEndPoints[i], audioDataEndPoints[i+1]);
    }
   
     // 2 - draw background
  
     

    // // 3 - draw gradient
    // if(params.showGradient){
    //     ctx.save();
    //     ctx.fillStyle = gradient;
    //     ctx.globalAlpha = .3;
    //     ctx.fillRect(0,0,canvasWidth, canvasHeight);
    //     ctx.restore();
    // }
    // // 4 - draw bars
    // if(params.showBars){
    //     let barSpacing = 4;
    //     let margin = 5;
    //     let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
    //     let barWidth = screenWidthForBars / audioData.length;
    //     let barHeight = 200;
    //     let topSpacing = 100;

    //     ctx.save();
    //     ctx.fillStyle = 'rgba(255,255,255,0.5)';
    //     ctx.strokeStyle = 'rgba(0,0,0,0,.5)';

    //     for(let i = 0; i < audioData.length; i++){
    //         ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
    //         ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
    //     }
    //     ctx.restore();
    // }
    // // 5 - draw circles
    // if(params.showCircles){
    //     let maxRadius = canvasHeight/4;
    //     ctx.save();
    //     ctx.globalAlpha = .5;
    //     for(let i = 0; i < audioData.length; i++){
    //         let percent = audioData[i] / 255;

    //         let circleRadius = percent * maxRadius;
    //         ctx.beginPath();
    //         ctx.fillStyle = utils.makeColor(255,111,111, .34 - percent/3.0);
    //         ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2*Math.PI, false);
    //         ctx.fill();
    //         ctx.closePath();

    //         ctx.beginPath();
    //         ctx.fillStyle = utils.makeColor(0,0,255,.1-percent/10.0);
    //         ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
    //         ctx.fill();
    //         ctx.closePath();

    //         ctx.save();
    //         ctx.beginPath();
    //         ctx.fillStyle = utils.makeColor(200,200,0,0.5 - percent/5.0);
    //         ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * .5, 0, 2* Math.PI, false);
    //         ctx.fill();
    //         ctx.closePath();
    //         ctx.restore();
    //     }
    //     ctx.restore();
    // }

    // // 6 - bitmap manipulation
    // // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
    // // regardless of whether or not we are applying a pixel effect
    // // At some point, refactor this code so that we are looping though the image data only if
    // // it is necessary

    // // A) grab all of the pixels on the canvas and put them in the `data` array
    // // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
    // // the variable `data` below is a reference to that array 
    // let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    // let data = imageData.data;
    // let length = data.length;
    // let width = imageData.width;
    // // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    // for (let i =0; i < length; i += 4){
    //     if(params.showNoise && Math.random() < .05){
    //         data[i] = data[i +1] = 0;
    //         data[i] = 255;
    //     }

    //     if(params.showInvert){
    //         let red = data[i], green = data[i+1], blue = data[i+2];
    //         data[i] = 255 - red;
    //         data[i+1] = 255 - green;
    //         data[i+2] = 255 - blue;
    //     }
    // }
    // if(params.showEmboss){
    //     for (let i = 0; i < length; i++) {
    //     if(i%4 == 3) continue;
    //     data[i] = 127 + 2*data[i] - data[i+4] - data[i + width *4];
    // }
    // }
    // ctx.putImageData(imageData, 0, 0);
}

function ArrangeCarpet(x, y, width, height, depth, squares){
   
    for(let i =0; i < totalDepth + 1; i++){
        squares.push([]);
    }
    squares[depth].push(new classes.Square(x + .333333 * width, y + .33333333 * height, .333333 * width, .33333333 * height, colorByDepth[depth]));
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(!(i == 1 && j == 1) && depth < 3){
               ArrangeCarpet(x + .333333 * width * i, y + .33333333 * height * j, .333333 * width, .33333333 * height, depth + 1, squares);
            }
        }
    }
   
}

function drawFractal(audioData, array,start,end){
    //let value = utils.averageArrayValues(audioData, 0, Math.floor(audioData.length / 3));
    let value = audioData[start]
    let numDepth = Math.round(value / 64);
    if(numDepth > 4){
        numDepth = 4;
    }
    for(let i =0; i < numDepth; i++){
        for(let j = 0; j < array[i].length; j++)
        {
            array[i][j].scale = value / 256;
            array[i][j].draw(ctx);
        }
    }
}

function setUpShapeFractal(arrangeFunction, num, x,y,width,height){
    for(let i = 0; i < num; i++){
        let arr = [];
        console.log(arr);
        arrangeFunction(x + i * 200,y,width,height,0,arr);
        allFractals.push(arr);
    }

}



export { setupCanvas, draw };