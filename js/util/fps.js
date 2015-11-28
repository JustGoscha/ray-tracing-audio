import {ctx} from '../canvas'
import colors from '../misc/colors'

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

export default fps;