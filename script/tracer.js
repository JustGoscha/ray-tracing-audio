// ----- HELPER FUNCTIONS -----

function $(expr, container) {
  return typeof expr === "string"? (container || document).querySelector(expr) : expr || null;
}

// Returns all elements that match CSS selector {expr} as an array.
// Querying can optionally be restricted to {container}’s descendants
function $$(expr, container) {
  return [].slice.call((container || document).querySelectorAll(expr));
}

function viewport(){
    var e = window;
    var a = 'inner';
    if (!('innerWidth' in window)){
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

function Framerate(){
  var lastTime = performance.now();
  this.displayFrameRate = function(ctx){
    var thisTime = performance.now();
    var fps = Math.floor(1000 / (thisTime - lastTime));
    lastTime = thisTime;
    ctx.font = "20px sans-serif"
    ctx.fillStyle = colors.slight;
    ctx.fillText(`${fps}fps`, 5, 20);
  };
}

var fps = {
  startTime : 0,
  frameNumber : 0,
  getFPS : function(){
    this.frameNumber++;
    var d = performance.now(),
      currentTime = ( d - this.startTime ) / 1000,
      result = Math.floor( ( this.frameNumber / currentTime ) );

    if( currentTime > 1 ){
      this.startTime = performance.now();
      this.frameNumber = 0;
    }
    return result;
  },
  drawFPS: function(){
    var fps = this.getFPS();
    ctx.font = "20px sans-serif";
    ctx.fillStyle = colors.slight;
    ctx.fillText(`${fps}fps`, 5, 20);
  }
};


// ------ SETUP -------
var canvas;
var ctx;
var player;
var framerate;

var colors = {
  line: "#514248",
  unfinished : "#dbb4ad",
  ray: "#edd6c9",
  red: "#a02e61",
  light: "#ffe3dc",
  slight: "#99ad7c"

};

var init = function(){
  initCanvas();
  initPlayer();
  startAnimationLoop();
  framerate = new Framerate();
};

var initCanvas = function(){
  canvas = $('canvas');
  setCanvasSize();
  initDrawingCapabilities();
  ctx = canvas.getContext('2d');
};

var setCanvasSize = function(){
  size = viewport();
  canvas.style.width = `${size.width}px`;
  canvas.width = size.width;
  canvas.height = size.height-5;
  canvas.style.height = `${size.height-5}px`;
  canvas.style.top = canvas.style.bottom = canvas.style.right = canvas.style.left = 0;
};

var initPlayer = function(){
  var {width, height} = viewport();
  player = new Player(width/2, height/2);
  shootRaysFromPlayer();
};

var initDrawingCapabilities = function(){
  canvas.addEventListener('mousedown', discernEvent);


  // undo
  Mousetrap.bind(["cmd+z", "ctrl+z"], removeLastLine);
};

var discernEvent = function(event){
  var mousePoint = getMousePositionFromEvent(event);

  if(near(player, mousePoint, 7)){
    dragPlayer(event);
  } else {
    startDrawing(event);
  }
};

var near = function(p1,p2,dist){
  if((Math.abs(p1.x-p2.x)<=dist) && (Math.abs(p1.y-p2.y)<=dist)) return true;
  else return false;
};

var dragPlayer = function(event){
  canvas.addEventListener('mousemove', updateDrag);
  canvas.addEventListener('mouseup', endDrag);
};

var updateDrag = function(event){
  var {x,y} = getMousePositionFromEvent(event);
  player.x = x; player.y = y;
  updatePrimaryRays();
};

var endDrag = function(event){
  var {x,y} = getMousePositionFromEvent(event);
  player.x = x; player.y = y;
  updatePrimaryRays();
  canvas.removeEventListener('mousemove', updateDrag);
  canvas.removeEventListener('mouseup', endDrag);
};

var startDrawing = function(event){
  var {x,y} = getMousePositionFromEvent(event);
  lineBeingDrawn = new Line(x,y,x,y, colors.unfinished);

  canvas.addEventListener('mousemove', updateDrawing);
  canvas.addEventListener('mouseup', finishDrawing);
};

var updateDrawing = function(event){
  if(!lineBeingDrawn) return;

  var {x,y} = getMousePositionFromEvent(event);
  lineBeingDrawn.setEnd(x,y);

  // get current x1 and y1 corrdinate and update current Line
};

var finishDrawing = function(event){
  // get end x1, y1 coordinate and add to finished Lines
  
  var {x,y} = getMousePositionFromEvent(event);
  lineBeingDrawn.setEnd(x,y);
  lineBeingDrawn.color = colors.line;
  lineBeingDrawn.width = 4;
  finishedLines.push(lineBeingDrawn);
  lineBeingDrawn = null;

  canvas.removeEventListener('mousemove', updateDrawing);
  canvas.removeEventListener('mouseup', finishDrawing);
};

var getMousePositionFromEvent = function(event){
  var currentX, currentY;
  if(event.offsetX!==undefined){
    currentX = event.offsetX;
    currentY = event.offsetY;
  } else {
    currentX = event.layerX - event.currentTarget.offsetLeft;
    currentY = event.layerY - event.currentTarget.offsetTop;
  }

  return {x: currentX, y: currentY};
};

var removeLastLine = function(){
  finishedLines.pop();
};

var lineBeingDrawn = null;
var finishedLines = [];

var drawFinishedLines = function(){
  for(var line of finishedLines){
    line.draw(ctx);
  }
};

var drawLineBeingDrawn = function(){
  if(lineBeingDrawn) lineBeingDrawn.draw(ctx);
};


function Rectangle(x,y,width,height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

function Line(x,y,x1,y1, color = "#444"){
  this.x = x;
  this.y = y;
  this.x1 = x1;
  this.y1 = y1;

  this.vector = {x: x1 - x, y: y1 - y};

  this.color = color;
  this.width = 2;
}

function Player(x,y){
  this.x = x;
  this.y = y;
}


Player.prototype.draw = function(ctx){
  ctx.fillStyle = colors.slight;
  ctx.fillRect(this.x-5, this.y-5, 10, 10);
};

var primaryRays = [];
var numberOfRays = 32;
var rayAngle = 2*Math.PI/numberOfRays;

var shootRaysFromPlayer = function(){
  for(var i = 0; i<numberOfRays; i++){
    var angle = rayAngle*i;
    var vector = {x: Math.cos(angle), y: Math.sin(angle)};
    var ray = new Ray(player.x, player.y, vector);
    primaryRays.push(ray);
  }
};

/**
 * [rayLineIntersection description]
 * @param  {[type]} ray  [description]
 * @param  {[type]} line [description]
 * @return {Point}      returns point or null
 */
var rayLineIntersection = function(ray, line){
  var e = ray.vector;
  var f = line.vector;
  var p = {x: -e.y, y: e.x};
  var q = {x: -f.y, y: f.x};
  var h = (dotProduct(subtract(ray, line), p))/dotProduct(f,p);
  var i = (dotProduct(subtract (line, ray), q))/dotProduct(e,q);
  if(i>0 && h>0 && h<1){
    return {
      rayPosition: i,
      x: ray.x + i*ray.vector.x, 
      y: ray.y + i*ray.vector.y
    };
  } else {
    return null;
  }
};

var intersections = [];
var checkRayLineIntersections = function(){
  intersections = [];
  // if (finishedLines.length > 0) debugger
  for(var ray of primaryRays){
    for(var line of finishedLines){
      var intersectPoint = rayLineIntersection(ray, line);
      if(intersectPoint){
        intersections.push(intersectPoint);
      }
    }
  }
};

var drawIntersections = function(ctx){
  ctx.fillStyle = colors.red;
  for(var point of intersections){
    ctx.fillRect(point.x-5, point.y-5, 10, 10);
  }
}; 

var dotProduct = function(a, b){
  return a.x * b.x + a.y * b.y;
};

var subtract = function(a,b){
  return {x: a.x - b.x, y: a.y - b.y};
};
// var crossProduct = function(p, q){
//   var point = {};
//   point.x
// }

var updatePrimaryRays = function(){
  for(var ray of primaryRays){
    ray.updatePosition(player.x, player.y);
  }
};

var drawPrimaryRays = function(){
  for(var ray of primaryRays){
    ray.draw(ctx);
  }
};

function Ray(x,y,vector){
  this.x = x;
  this.y = y;
  this.x1 = this.x + vector.x * canvas.width; 
  this.y1 = this.y + vector.y * canvas.height;
  this.vector = vector;
}

Ray.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  // to
  ctx.lineTo(this.x1,this.y1);
  // color
  ctx.strokeStyle = colors.ray;
  ctx.lineWidth = 2;
  // draw it
  ctx.stroke();
  ctx.closePath();
};

Ray.prototype.updatePosition = function(x,y){
  this.x = x;
  this.y = y;
  this.x1 = x + this.vector.x * canvas.width; 
  this.y1 = y + this.vector.y * canvas.height;
};

Line.prototype.draw = function(ctx) {
  // draw on canvas
  // line from
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  // to
  ctx.lineTo(this.x1,this.y1);
  // color
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.width;
  // draw it
  ctx.stroke();
  ctx.closePath();
};

Line.prototype.setEnd = function(x,y){
  this.x1 = x;
  this.y1 = y;
  this.vector.x = x - this.x;
  this.vector.y = y - this.y;
}

Rectangle.prototype.draw = function(canvas){
  // draw on canvas
};

// ------ Animation LOOP --------
 

function clearCanvas(){
  canvas.width = canvas.width;
}
function drawFrame(){
  clearCanvas();
  checkRayLineIntersections();
  drawPrimaryRays();
  player.draw(ctx);
  drawFinishedLines();
  drawIntersections(ctx);
  drawLineBeingDrawn();
  fps.drawFPS();
  // if(finishedLines.length > 0) debugger
}

function startAnimationLoop(){
  var animFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      null ;

    var recursiveAnim = function() {
        drawFrame();
        animFrame( recursiveAnim );
    };
      
  animFrame(recursiveAnim);
}

// ------ ENTRY POINT -------
init();