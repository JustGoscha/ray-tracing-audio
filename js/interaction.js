import {getMousePositionFromEvent} from './util/browser-util.js';
import {near, distanceBetween} from './math/vector-math';
import {canvas} from './canvas';
import player from './player';
import colors from './misc/colors';
import {updatePrimaryRays} from './shoot-rays'
import Line from './geometry/Line'
import Circle from './geometry/Circle'
import Point from './geometry/Point'
import {playSound, playAllSounds, toggleContinuous} from './webaudio/test-sound'

import Scene from './scene'

const MOVEMENT_SPEED = 2; // pixels per frame

const keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

function updatePlayerMovement() {
  let dx = 0;
  let dy = 0;
  
  if (keys.w) dy -= MOVEMENT_SPEED;
  if (keys.s) dy += MOVEMENT_SPEED;
  if (keys.a) dx -= MOVEMENT_SPEED;
  if (keys.d) dx += MOVEMENT_SPEED;
  
  if (dx !== 0 || dy !== 0) {
    player.set(player.x + dx, player.y + dy);
    updatePrimaryRays();
  }
}

function init(){
  canvas.addEventListener('mousedown', discernEvent);
  Mousetrap.bind(["cmd+z", "ctrl+z"], removeLast); 
  Mousetrap.bind('x', playSound);
  Mousetrap.bind('c', playAllSounds);
  Mousetrap.bind('v', toggleContinuous);
  
  // Add WASD controls with keydown/keyup
  document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
      case 'w': keys.w = true; break;
      case 'a': keys.a = true; break;
      case 's': keys.s = true; break;
      case 'd': keys.d = true; break;
    }
  });
  
  document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
      case 'w': keys.w = false; break;
      case 'a': keys.a = false; break;
      case 's': keys.s = false; break;
      case 'd': keys.d = false; break;
    }
  });
}

let undos = []
function removeLast(){
  const undo = undos.pop()
  if (undo)
    undo()
};

function discernEvent(event){
  var mousePoint = getMousePositionFromEvent(event);

  if(near(player, mousePoint, 7)){
    dragPlayer(event);
  } else {
    if (event.shiftKey) {
      startDrawing(event, 'circle')
    } else {
      startDrawing(event, 'line')
    }
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

const drawingModes = {
  line: {
    start: (event) => {
      const {x,y} = getMousePositionFromEvent(event);
      Scene.lineBeingDrawn = lineBeingDrawn = new Line(x,y,x,y, colors.unfinished)
    },
    update: (event) => {
      if(!Scene.lineBeingDrawn) return
      const {x,y} = getMousePositionFromEvent(event)
      Scene.lineBeingDrawn.setEnd(x,y)
    },
    finish: (event) => {
      const {x,y} = getMousePositionFromEvent(event)
      Scene.lineBeingDrawn.setEnd(x,y)
      Scene.lineBeingDrawn.color = colors.line
      Scene.lineBeingDrawn.width = 4
      Scene.finishedLines.push(Scene.lineBeingDrawn)
      Scene.lineBeingDrawn = null
      undos.push(() => Scene.finishedLines.pop())
    }
  },
  circle: {
    start: (event) => {
      const {x,y} = getMousePositionFromEvent(event)
      Scene.circleBeingDrawn = new Circle(new Point(x,y), 0)
    },
    update: (event) => {
      const mousePosition = getMousePositionFromEvent(event)
      const radius = distanceBetween(Scene.circleBeingDrawn.center, mousePosition)
      Scene.circleBeingDrawn.radius = radius
    },
    finish: (event) => {
      const mousePosition = getMousePositionFromEvent(event)
      const radius = distanceBetween(Scene.circleBeingDrawn.center, mousePosition)
      Scene.circleBeingDrawn.radius = radius
      Scene.circles.push(Scene.circleBeingDrawn) 
      Scene.circleBeingDrawn = null
      undos.push(() => Scene.circles.pop())
    },
  }
}

var lineBeingDrawn;
var circleBeingDrawn;

function startDrawing(event, type){
  const drawing = drawingModes[type]
  drawing.start(event)

  const update = drawing.update
  const finish = (event) => {
    drawing.finish(event)
    canvas.removeEventListener('mousemove', update);
    canvas.removeEventListener('mouseup', finish);
  }
  canvas.addEventListener('mousemove', update);
  canvas.addEventListener('mouseup', finish);
};


function finishDrawing(type){
  const drawing = drawingModes[type]
  return (event) => {
    drawing.finish(event)
  }
};



export {init, updatePlayerMovement};