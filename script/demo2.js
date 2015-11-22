angular.module('app').directive("listenermove", function(EntityService, SoundService){
	return {
		restrict: 'A',
		link: function(scope,element){
			//get canvas context
			var ctx = element[0].getContext('2d');

			EntityService.setContext(ctx);
			EntityService.setElement(element);

			var listener = new EntityService.Entity(
				{
					x: 300,
					y: 200,
				},
				null,
				null
			);

			var mouse = new EntityService.Entity({x:0,y:0},{x:5,y:5},'#f36');

			EntityService.addMouse(mouse);
			EntityService.drawingChain.addEntity(mouse);
			EntityService.addListenerEntity(listener);
			EntityService.drawingChain.addEntity(listener);

			EntityService.startDrawing();

			var movement = EntityService.movement;
			var mousePosition = EntityService.mousePosition;

			// controls W S A D
			angular.element('html').bind('keydown',function(event){
				switch (event.which){
					case 87: {
					event.preventDefault();
						// up
						movement.up = true;
					}
					break;
					case 83: {
						event.preventDefault();
						// down
						movement.down = true;
					}
					break;			
					case 68: {
						event.preventDefault();
						// right
						movement.right = true;
					}
					break;
					case 65: {
						event.preventDefault();
						// down
						movement.left = true;
					}
					break;
					case 85: {
						event.preventDefault();
						// front
						movement.front = true;
					}
					break;
					case 74: {
						event.preventDefault();
						// back
						movement.back = true;
					}
					break;



				}
			});
			angular.element('html').bind('keyup',function(event){
				console.log('Key up:' +event.which);
				switch (event.which){
					case 87: {
						event.preventDefault();
						// up
						movement.up = false;

					}
					break;
					case 83: {
						event.preventDefault();
						// down
						movement.down = false;
					}
					break;			
					case 68: {
						event.preventDefault();
						// right
						movement.right = false;
					}
					break;
					case 65: {
						event.preventDefault();
						// left
						movement.left = false;
					}
					break;
					case 85: {
						event.preventDefault();
						// front
						movement.front = false;
					}
					break;
					case 74: {
						event.preventDefault();
						// back
						movement.back = false;
					}
					break;
				}
			});

			angular.element('html').bind('mousemove',function(event){
				var rect = element[0].getBoundingClientRect();
				EntityService.mousePosition.x = event.clientX - rect.left;
				EntityService.mousePosition.y = event.clientY - rect.top; 
			});


		

		}
	};
});

angular.module('app').factory('EntityService', function(SoundService){
	var EntityService = new Object();

	var startId = 0;

	EntityService.refreshrate = 16;
	var ctx = null;
	var element = null;

	EntityService.setContext = function(c){
		ctx = c;
	}
	EntityService.setElement = function(e){
		element = e;
	}


	var refreshrate = EntityService.refreshrate;
	var listener = null;
	var mouse = null;


	EntityService.addMouse = function(m){
		mouse = m;
	}
	EntityService.addListenerEntity = function(l){
		listener = l;
	}

	// entities for the drawing chain
	EntityService.Entity = function(position,dimensions,color){
		this.position = position;
		this.dimensions = {x:8, y:8};
		this.color = "#000000"
		if(color)
			this.color = color;

		if(dimensions){
			this.dimensions = dimensions;
		}

		this.id = startId++;
	}

	// the things that get redrawn every cycle
	EntityService.drawingChain = {
		listOfEntities: {},
		addEntity: function(entity){
			this.listOfEntities[entity.id] = entity;
		},
		removeEntity: function(entity){
			delete this.listOfEntities[entity.id];
		}
	}

	EntityService.addEntity = function(entity) {EntityService.drawingChain.addEntity(entity)};
	EntityService.removeEntity = function(entity) {EntityService.drawingChain.removeEntity(entity)};

	EntityService.startDrawing = function(){
		  var animFrame = window.requestAnimationFrame ||
	        window.webkitRequestAnimationFrame ||
	        window.mozRequestAnimationFrame    ||
	        window.oRequestAnimationFrame      ||
	        window.msRequestAnimationFrame     ||
	        null ;

		    var recursiveAnim = function() {
		        redraw();
		        animFrame( recursiveAnim );
		    };
	        
		animFrame(recursiveAnim);
	}

	// main loop
	function redraw(){
		element[0].width = element[0].width;
		for(i in EntityService.drawingChain.listOfEntities){
			var entity = EntityService.drawingChain.listOfEntities[i];
			ctx.fillStyle=entity.color;
			ctx.fillRect(
				entity.position.x - entity.dimensions.x/2,
				entity.position.y - entity.dimensions.x/2,
				entity.dimensions.x,
				entity.dimensions.y
			);
		}

		updateMovement();
		updateMouseMovement();
	}

	EntityService.mousePosition = {
		x: 0,
		y: 0
	};

	EntityService.movement = {
		up: false,
		down: false,
		left: false,
		right: false,
		front: false,
		back: false
	};

	var movement = EntityService.movement;	

	var maxSpeed = 180; // in px/s
	var speed = 100;
	var accelaration = 5;
	var spOne = speed/(1000/EntityService.refreshrate);
	var spTwo = 0.7071067811865475*speed/(1000/EntityService.refreshrate);

	// TODO make speed a vector

	function accelarate(){
		speed = speed + accelaration;
		spOne = speed/(1000/EntityService.refreshrate);
		spTwo = 0.7071067811865475*speed/(1000/EntityService.refreshrate);

	}

	var lastTime = null;

	function updateMouseMovement () {
		mouse.position = EntityService.mousePosition;
		ctx.beginPath();
		ctx.moveTo(listener.position.x,listener.position.y);
		ctx.lineTo(mouse.position.x,mouse.position.y);
		ctx.stroke();

		var u = {
			x: mouse.position.x - listener.position.x, 
			y: mouse.position.y - listener.position.y 
		};
		var normVal = Math.sqrt(u.x*u.x + u.y*u.y);
		u.x =  u.x/normVal;
		u.y = u.y/normVal;
		// x^2+y^2 = normval * normval ...
		// x/normVal ... y/normVal
		// 
		SoundService.context.listener.setOrientation(u.x,0,u.y,0,1,0);	
	}


	function updateMovement(){
		var up = movement.up;
		var down = movement.down;
		var left = movement.left;
		var right = movement.right;

		var front = movement.front;
		var back = movement.back;

		if (lastTime)
			lastTime = new Date();

		var lastX = listener.position.x;
		var lastY = listener.position.y;


		if(up && !down && !left && !right){
			// accelarate();
			listener.position.y = listener.position.y - spOne;
		} else if(!up && down && !left && !right){
			// accelarate();
			listener.position.y = listener.position.y + spOne;
		} else if(!up && !down && left && !right){
			// accelarate();
			listener.position.x = listener.position.x - spOne;
		} else if(!up && !down && !left && right){
			// accelarate();
			listener.position.x = listener.position.x + spOne;
		} else if(up && !down && left && !right){
			// accelarate();
			listener.position.y = listener.position.y - spTwo;
			listener.position.x = listener.position.x - spTwo;					
		} else if(up && !down && !left && right){
			// accelarate();
			listener.position.y = listener.position.y - spTwo;
			listener.position.x = listener.position.x + spTwo;					
		} else if(!up && down && left && !right){
			// accelarate();
			listener.position.y = listener.position.y + spTwo;
			listener.position.x = listener.position.x - spTwo;					
		} else if(!up && down && !left && right){
			// accelarate();
			listener.position.y = listener.position.y + spTwo;
			listener.position.x = listener.position.x + spTwo;					
		} else {
			while(speed>0){
				speed = speed - accelaration;
			}
		}

		if(speed>maxSpeed){
			speed = maxSpeed;
		}

		var dt = new Date() - lastTime;
		var dx = (listener.position.x - lastX)/50;
		var dy = (lastY - listener.position.y)/50;


		if(front && !back){
			listener.dimensions.x = Math.pow(listener.dimensions.x,1/1.01);
			listener.dimensions.y = Math.pow(listener.dimensions.y,1/1.01);

		}else if(!front && back){
			listener.dimensions.x = Math.pow(listener.dimensions.x,1.01);
			listener.dimensions.y = Math.pow(listener.dimensions.y,1.01);
		}

		SoundService.context.listener.setPosition(listener.position.x/50, 1.8, listener.position.y/50)
		SoundService.context.listener.setVelocity(dx/dt, 0, dy/dt);

		// random effects

	}


	return EntityService;
});

angular.module('app').factory('SoundEntity', function($rootScope, SoundService, EntityService){
	var SoundEntity = new Object();

	var soundSource0 = new EntityService.Entity({x: 50, y: 30}, {x:14,y:14},'#4bf');
	var soundSource1 = new EntityService.Entity({x: 345, y: 189}, {x:14,y:14},'#4bf');
	var soundSourceNoise = new EntityService.Entity({x: 420, y: 304}, {x:22,y:22},'#bf4');

	var soundSources = [soundSource0, soundSource1, null,null,null,null,null,null,soundSourceNoise];

	// EntityService.drawingChain.addEntity(soundSource0);
	// EntityService.drawingChain.addEntity(soundSource1);

	var sounds = ['assets/bubidibup.mp3','assets/bla atm.mp3', 'assets/Impulsantwort.wav', 'assets/effect.wav', 'assets/effect2.wav', 'assets/effect3.wav', 'assets/effect4.wav', 'assets/effect5.wav'];
	var loader = new BufferLoader(SoundService.context, sounds, loaded);

	var sources = [];
	var panners = [];

	var loadedSounds = null;

	var compressor = SoundService.context.createDynamicsCompressor();
	var masterGain = SoundService.context.createGain();

	masterGain.connect(compressor);
	compressor.connect(SoundService.context.destination);

	SoundEntity.ready = function(){
		if(loadedSounds)
			return true;
		else
			return false;
	}

	SoundEntity.sources = sources;

	function loaded(bufferList){
		loadedSounds = bufferList;
		for(i in bufferList){
			mixToMono(bufferList[i]);
		}

		var node = SoundService.context.createBufferSource()
		  , buffer = SoundService.context.createBuffer(1, 80000, SoundService.context.sampleRate)
		  , data = buffer.getChannelData(0);

		for (var i = 0; i < 80000; i++) {
		 data[i] = Math.random();
		}

		node.buffer = buffer;
		//var buffer = SoundService.context.createBuffer(data);

		bufferList.push(buffer);
		console.log('noise registered as: ' + (bufferList.length-1));



		$rootScope.$apply();
	}

	loader.load();

	var startedMusic = [false, false];
	var musicSources = [null, null]
	SoundEntity.startMusicSamples = function(i,loop){
		if(startedMusic[i]){
			startedMusic[i] = false;
			EntityService.drawingChain.removeEntity(soundSources[i]);
			musicSources[i].stop(SoundService.context.currentTime);
			return;
		}

		// var convolver0 = SoundService.context.createConvolver();
		// convolver0.buffer = loadedSounds[2];

		var source0 = SoundService.context.createBufferSource();
		if(loop) source0.loop = true;
		source0.buffer = loadedSounds[i];

		// TODO maybe the creation of a buffer is critical bottleneck... keep in mind for later
		musicSources[i] = source0;

		var panner0 = SoundService.context.createPanner();
		source0.connect(panner0);
		// convolver0.connect(panner0);

		panner0.setPosition(soundSources[i].position.x/50,1,soundSources[i].position.y/50);
		source0.playbackRate.value = 1.0;
		panner0.connect(SoundService.context.destination);

		EntityService.drawingChain.addEntity(soundSources[i]);
		source0.start(SoundService.context.currentTime);

		startedMusic[i] = true;
	}



	SoundEntity.startXTimes = function(times){
		currentTime = SoundService.context.currentTime;
			var source0 = SoundService.context.createBufferSource();
			source0.buffer = loadedSounds[5];
			var panner0 = SoundService.context.createPanner();
			var gain0 = SoundService.context.createGain();
			source0.connect(panner0);

			panner0.setPosition(x/50,1,y/50);

			panner0.connect(gain0);
			gain0.connect(masterGain);


		for(i=0; i<times; i++){			
			var delay = SoundService.context.createDelay();
			delay.delayTime = 0.0001 * i * (Math.random()*1000);

			var gain = SoundService.context.createGain();
			gain.value = 0.5 - ((0.005 * i) + (Math.random()*0.2));

			var panner = SoundService.context.createPanner();
			var x = Math.random()*600;
			var y = Math.random()*400;
			EntityService.drawingChain.addEntity(new EntityService.Entity({x: x, y: y}, {x:14,y:14},'#7cf'));
			panner0.setPosition(x/50,1,y/50);	

			source0.connect(delay);
			delay.connect(gain);
			gain.connect(panner);

			panner.connect(masterGain);
		}
		source0.playbackRate.value = 1.0;
		source0.start(currentTime);

	}

	var raining = false;
	var rainInterval = 20;
	var rainSound = 3;
	SoundEntity.setRainSound = function(i){
		if(i)
			rainSound = i;
	}
	SoundEntity.setRainInterval = function(interval){
		rainInterval = interval;
	};
	SoundEntity.makeItRain = function(interval, sound){
		if(raining){
			raining = false;
			return;
		}

		raining = true;

		SoundEntity.setRainSound(sound);
		if(!interval || interval < 20)
			interval = 20;
		SoundEntity.setRainInterval(interval);
		setTimeout(rain, 40);
		function rain(){
			var source = SoundService.context.createBufferSource();
			source.buffer = loadedSounds[rainSound] //loadedSounds[Math.round((Math.random()*4)+3)];
			var panner = SoundService.context.createPanner();

			source.connect(panner);

			var x = Math.random()*1000; // Math.random()*60+300;
			var y = Math.random()*200;
			var z = Math.random()*1000; // Math.random()*60+30;

			var effectEntity = new EntityService.Entity({x: x,y: z}, {x: 5+Math.pow(y/50,2), y: 5+Math.pow((y/50),2)}, "#dddde5");
			EntityService.drawingChain.addEntity(effectEntity);
			setTimeout(function(){
				EntityService.drawingChain.removeEntity(effectEntity);
			},700);

			panner.setPosition(x/50,y/50,z/50);
			source.playbackRate.value = 1.2-(Math.random()*0.3);


			panner.connect(masterGain);
			source.start(SoundService.context.currentTime);

			if(raining){
				setTimeout(rain, (rainInterval/2 + (Math.random()*rainInterval)));
			}
		}

	}

	var robotWalking = false;
	SoundEntity.startRobotWalking = function(){
		if(robotWalking){
			robotWalking= false;
			return;
		}
		robotWalking = true;
		setTimeout(startSoundEffect,Math.random()*1000);

		var il = 0;
		function startSoundEffect(){
			// var convolver = SoundService.context.createConvolver();
			// convolver.buffer = loadedSounds[2];

			var source = SoundService.context.createBufferSource();
			source.buffer = loadedSounds[5] //loadedSounds[Math.round((Math.random()*4)+3)];
			var panner = SoundService.context.createPanner();

			// var lowFilter = SoundService.context.createBiquadFilter();
			// lowFilter.Q = 5.0;

			// lowFilter.frequency.value = Math.random()*22050;

			source.connect(panner);

			// lowFilter.connect(panner);
			
			// source.connect(convolver);
			// convolver.connect(panner);

			var x =  10*il++; // Math.random()*60+300;
			var y = Math.random()*2;
			var z =  100+5*(il%2); // Math.random()*60+30;

			if(il>80){
				il = 0;
			}

			var effectEntity = new EntityService.Entity({x: x,y: z}, {x: 8, y: 8}, "#da2");
			EntityService.drawingChain.addEntity(effectEntity);

			setTimeout(function(){
				EntityService.drawingChain.removeEntity(effectEntity);
			},1000);


			panner.setPosition(x/50,y,z/50);
			source.playbackRate.value = 1.1-(Math.random()*0.2);

			panner.connect(masterGain);
			source.start(SoundService.context.currentTime);

			if(robotWalking)
				setTimeout(startSoundEffect,400);
		}
	}

	return SoundEntity;
});

angular.module('app').controller("PreloadCtrl", function($scope, SoundEntity){
	$scope.ready = SoundEntity.ready;

	$scope.startMusic = SoundEntity.startMusicSamples;
	$scope.startRobotWalking = SoundEntity.startRobotWalking;

	$scope.makeItRain = SoundEntity.makeItRain;
	$scope.setRainSound = SoundEntity.setRainSound;

	$scope.setRainInterval = SoundEntity.setRainInterval;

	$scope.startXTimes = SoundEntity.startXTimes;
});

angular.module('app').factory('SoundService', function(){
	var SoundService = new Object();
  var context = window.AudioContext || window.webkitAudioContext || window.MozAudioContext || window.mozAudioContext;

  if(!context){
  	window.alert('Your browser does not support the WebAudio API or is not compatible with this implementation.');
  }
	SoundService.context = new context();


	return SoundService;
});


function mixToMono(buffer) {
    if (buffer.numberOfChannels == 2) {
        var pL = buffer.getChannelData(0);
        var pR = buffer.getChannelData(1);
        var length = buffer.length;
        
        for (var i = 0; i < length; ++i) {
            var mono = 0.5 * (pL[i] + pR[i]);
            pL[i] = mono;
            pR[i] = mono;
        }
    }
}

// BufferLoader
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
