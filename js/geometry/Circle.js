import colors from '../misc/colors'

class Circle {
  constructor(center, radius) {
    this.center = center
    this.radius = radius
  }

  draw(ctx, color) {
    ctx.beginPath()
    const {x,y} = this.center
    ctx.lineWidth = 1
    ctx.arc(x,y,this.radius,0,2*Math.PI)
    ctx.strokeStyle = this.color || colors.circle
    ctx.stroke()
    ctx.closePath()
  }
}

export default Circle



















