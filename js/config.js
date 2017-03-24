const numberOfRays = 60;
// 1m = 10px -> ratio = 10
const pixelMeterRatio = 10;
const maxChildren = 10

const rayAngle = 2*Math.PI/numberOfRays;

var rayAngles = new Array(numberOfRays);
for(var i = 0; i<numberOfRays; i++){
  rayAngles[i] = rayAngle*i;
  console.log(rayAngles[i])
}

export {numberOfRays, rayAngle, rayAngles, pixelMeterRatio, maxChildren};