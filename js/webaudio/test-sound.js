import {audioCtx} from './webaudio'
import {panners} from './endpoints'
import Scene from './../scene'
import * as SoundUtils from './sound-util'


var noise = SoundUtils.createNoise(0.3);
var s440 = SoundUtils.createSine(440, 0.5);
var s560 = SoundUtils.createSine(560, 0.4);

var playing = false;

function playSound(){
  if(playing){

  } else {
    startBuffer(noise, 0);
    playing=true;
  }
}

var sounds = new Array(panners.length);

function playAllSounds(){
  for(var i = 0; i< Scene._distances.length; i++){
    var d = Scene._distances[i];
    if(d>400){
      sounds[i] = SoundUtils.createNoise(1000/(d*d));
    } else {
      sounds[i] = SoundUtils.createSine(10000/d, d/300);
    }
  }

  for(var i = 0; i<sounds.length; i++){
    startBuffer(sounds[i], i);
  }
}

function startBuffer(buffer, channel){
  var node = SoundUtils.createNodeFromBuffer(buffer);
  node.connect(panners[channel]);
  node.start();
  node.onended = function(){
    playing = false;
  };
}

export {playSound, playAllSounds}