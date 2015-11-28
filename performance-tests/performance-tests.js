function Point(x,y){
  this.x = x;
  this.y = y;
}

Point.prototype.set = function(x, y){
  this.x = x;
  this.y = y;
}

function Point2(x,y){
  this.p = new Float32Array(2);
  this.p[0]=x;
  this.p[1]=y;
}

Point2.prototype.set = function(x,y){
  this.p[0]=x;
  this.p[1]=y;
}

function Point3(x,y){
  var p = new Float32Array(2);
  p[0]=x;
  p[1]=y;
  return p;
}

Point3.set = function(p,x,y){
  p[0]=x;
  p[1]=y;
}


var pointArray;
var point2Array;
var point3Array;

var creation = [];
var assignment = [];
var indexing = [];
var addition = [];
var multiplication = [];


creation.push(function testPointCreation(number){
  pointArray = new Array(number);
  for(var i = 0; i<number; i++){
    pointArray[i] = new Point(1,2);
  }
})

creation.push(function testPoint2Creation(number){
  point2Array = new Array(number);
  for(var i = 0; i<number; i++){
    point2Array[i] = new Point2(1,2);
  }
})

creation.push(function testPoint3Creation(number){
  point3Array = new Array(number);
  for(var i = 0; i<number; i++){
    point3Array[i] = new Point3(1,2);
  }
})

assignment.push(function testPointAssignment(number){
  for(var i = 0; i<number; i++){
    pointArray[i].set(10, 12);
  }
})

assignment.push(function testPoint2Assignment(number){
  for(var i = 0; i<number; i++){
    point2Array[i].set(10, 12);
  }
})

assignment.push(function testPoint3Assignment(number){
  for(var i = 0; i<number; i++){
    Point3.set(point3Array[i],10,12);
  }
})

indexing.push(function testIndexingPoint(number){
  var x,y;
  for(var i = 0; i<number; i++){
    x = pointArray[i].x;
    y = pointArray[i].y;
  }
})

indexing.push(function testIndexingPoint2(number){
  var x,y;
  for(var i = 0; i<number; i++){
    x = point2Array[i].p[0];
    y = point2Array[i].p[1];
  }
})

indexing.push(function testIndexingPoint3(number){
  var x,y;
  for(var i = 0; i<number; i++){
    x = point3Array[i][0];
    y = point3Array[i][1];
  }
})


addition.push(function testAddition(number){
  for(var i = 0; i<number; i++){
    pointArray[i].x = pointArray[i].x + pointArray[i].y;
  }
})

addition.push(function testAddition2(number){
  for(var i = 0; i<number; i++){
    point2Array[i].p[0] = point2Array[i].p[0] + point2Array[i].p[1];
  }
})

addition.push(function testAddition3(number){
  for(var i = 0; i<number; i++){
    point3Array[i][0] = point3Array[i][0] + point3Array[i][1];
  }
})

multiplication.push(function testMultiplication(number){
  for(var i = 0; i<number; i++){
    pointArray[i].y = pointArray[i].x * pointArray[i].y;
  }
})

multiplication.push(function testMultiplication2(number){
  for(var i = 0; i<number; i++){
    point2Array[i].p[1] = point2Array[i].p[0] * point2Array[i].p[1];
  }
})

multiplication.push(function testMultiplication3(number){
  for(var i = 0; i<number; i++){
    point3Array[i][1] = point3Array[i][0] * point3Array[i][1];
  }
})



function performanceTest(testFunction, iterations){
  var sum = 0;
  var start = performance.now();
  testFunction(iterations)
  var time=performance.now()-start;

  return time;
}
function logTime(t){
  console.log(t + "ms");
}

function formatOutput(times){
  var str = "|"
  for(var time of times){
    str += ' ' +time.toFixed(3)+'ms |'
  }
  return str;
}

function compare(name, funcs, number, iterations){
  console.log(name);
  if(!iterations){
    iterations = 1;
  }
  var times = [];
  for(var fun of funcs){
    var time = 0;
    for(var i = 0; i<iterations; i++){
      time+=performanceTest(fun, number);
    }
    times.push(time);
  }
  console.log(formatOutput(times));
}

function runTests(number){
  var iterations = number;
  compare("creation", creation, number);
  compare("assignment", assignment, number,100);
  compare("indexing", indexing, number, 100);
  compare("addition", addition, number, 100);
  compare("multiplication", multiplication, number, 100);

}