import {viewport} from './util/browser-util'
import {ctx} from './canvas'
import colors from './misc/colors'
import Point from './geometry/Point'

class Player{
  constructor (x,y) {
    this.position = new Point(x,y)
  }

  get x() { return this.position.x }
  get y() { return this.position.y }

  draw(){
    ctx.fillStyle = colors.slight;
    ctx.fillRect(this.x-5, this.y-5, 10, 10);
  }

  set(x,y){
    this.position.set(x,y)
  }
}

const initPlayer = function(){
  var {width, height} = viewport()
  return new Player(width/2, height/2)
}
const player = initPlayer()

export default player