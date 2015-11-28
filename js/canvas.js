import {$, viewport} from './util/browser-util'

var initCanvas = function(){
  var canvas = $('canvas');
  setCanvasSize(canvas);
  var ctx = canvas.getContext('2d');
  return [canvas, ctx];
};

var setCanvasSize = function(canvas){
  var size = viewport();

  canvas.style.width = `${size.width}px`;
  canvas.width = size.width;
  canvas.height = size.height-5;
  canvas.style.height = `${size.height-5}px`;
  canvas.style.top = canvas.style.bottom = canvas.style.right = canvas.style.left = 0;
};

function clearCanvas(){
  canvas.width = canvas.width;
}

var [canvas, ctx] = initCanvas();

export {canvas, ctx, clearCanvas};