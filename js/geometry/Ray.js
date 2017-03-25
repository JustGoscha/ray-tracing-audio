import Point from './Point'
import {canvas} from '../canvas'
import {reflectionVector, normalize} from '../math/vector-math'
import colors from '../misc/colors'
import * as config from '../config'

/**
 * [Ray description]
 * @param {Point} start    [description]
 * @param {Point} vector        [description]
 * @param {number} maxChildren  maximum number of reflected rays from it
 * @param {Line} touchedLine    The line from which it starts
 *                              if it is a reflected Ray
 */
class Ray{
  constructor(start,vector, maxChildren = config.maxChildren, touchedLine){
    this.maxChildren = maxChildren
    this.end = new Point(vector.x, vector.y)
    this.reset(start, vector, undefined, touchedLine)
  }

  get x() { return this.start.x }
  get y() { return this.start.y }
  get x1() { return this.end.x }
  get y1() { return this.end.y }

  reset(start,vector,length = 10000, touchedLine) {
    this.start = start

    this.end.set(vector.x,vector.y)
    this.end.scale(length)
    this.end.add(start)
    
    this.vector = vector
    this.touchedLine = touchedLine
  }

  reflect(line, intersectionPoint) {
    const reflectedVector = reflectionVector(this.vector, normalize(line.vector))
    this.reset(this.start, this.vector, intersectionPoint.rayPosition)
    
    if (this.maxChildren > 0) {
      if(this.child) {
        this.child.reset(intersectionPoint, reflectedVector, undefined, line)
      } else {
        this.child = new Ray(intersectionPoint, reflectedVector, this.maxChildren-1, line)
      }
    }
  }

  draw(ctx, color = colors.ray) {
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    // to
    ctx.lineTo(this.x1,this.y1)
    // color
    ctx.strokeStyle = `rgba(${200 - 30*this.maxChildren},20,30,${0.15*this.maxChildren})`
    ctx.lineWidth = 1
    // draw it
    ctx.stroke()
    ctx.closePath()
    if (this.child) {
      this.child.draw(ctx, color)
    }
  }

  updatePosition(p){
    this.reset(p, this.vector)
  }
}

export default Ray;