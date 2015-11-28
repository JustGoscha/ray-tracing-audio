import {getMousePositionFromEvent} from './util/browser-util.js';
import {near} from './math/vector-math';
import {canvas} from './canvas';
import player from './player';
import colors from './misc/colors';
import {updatePrimaryRays} from './shoot-rays'
import Line from './geometry/Line'

import Scene from './scene'

function init(){
  canvas.addEventListener('mousedown', discernEvent);
  Mousetrap.bind(["cmd+z", "ctrl+z"], removeLastLine); 
}

function removeLastLine(){
  Scene.finishedLines.pop();
};

function discernEvent(event){
  var mousePoint = getMousePositionFromEvent(event);

  if(near(player, mousePoint, 7)){
    dragPlayer(event);
  } else {
    startDrawing(event);
  }
};

// ----- DRAGGING PLAYER -----
function dragPlayer(event){
  canvas.addEventListener('mousemove', updateDrag);
  canvas.addEventListener('mouseup', endDrag);
};

function updateDrag(event){
  var {x,y} = getMousePositionFromEvent(event);
  player.set(x,y);
  updatePrimaryRays();

};

function endDrag(event){
  var {x,y} = getMousePositionFromEvent(event);
  player.set(x,y);
  canvas.removeEventListener('mousemove', updateDrag);
  canvas.removeEventListener('mouseup', endDrag);
  updatePrimaryRays();
};


// ----- DRAWING LINES ------

var lineBeingDrawn;

function startDrawing(event){
  var {x,y} = getMousePositionFromEvent(event);
  Scene.lineBeingDrawn = lineBeingDrawn = new Line(x,y,x,y, colors.unfinished);

  canvas.addEventListener('mousemove', updateDrawing);
  canvas.addEventListener('mouseup', finishDrawing);
};

function updateDrawing(event){
  if(!lineBeingDrawn) return;

  var {x,y} = getMousePositionFromEvent(event);
  lineBeingDrawn.setPoint2(x,y);
  // get current x1 and y1 corrdinate and update current Line
};

function finishDrawing(event){
  // get end x1, y1 coordinate and add to finished Lines
  
  var {x,y} = getMousePositionFromEvent(event);
  lineBeingDrawn.setPoint2(x,y);
  lineBeingDrawn.color = colors.line;
  lineBeingDrawn.width = 4;
  Scene.finishedLines.push(lineBeingDrawn);
  Scene.lineBeingDrawn = lineBeingDrawn = null;

  canvas.removeEventListener('mousemove', updateDrawing);
  canvas.removeEventListener('mouseup', finishDrawing);
};

export {init};