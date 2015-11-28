import {viewport} from './util/browser-util'
import {ctx} from './canvas'
import colors from './misc/colors'

function Player(x,y){
  this.x = x;
  this.y = y;
}

Player.prototype.draw = function(){
  ctx.fillStyle = colors.slight;
  ctx.fillRect(this.x-5, this.y-5, 10, 10);
};

Player.prototype.set = function(x,y){
  this.x = x;
  this.y = y;
}

var initPlayer = function(){
  var {width, height} = viewport();
  return player = new Player(width/2, height/2);
};

var player = initPlayer();


export default player;