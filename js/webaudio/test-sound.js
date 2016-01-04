import {audioCtx} from './webaudio'
import {masterChannel} from './master'
import {panners} from './endpoints'
import Scene from './../scene'
import * as SoundUtils from './sound-util'
import player from '../player'


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
var sixteeth = audioCtx.sampleRate/60;
var noise = SoundUtils.createNoise(.4);

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

function soundFromDistance(d){
  // if(d>500){
  //   return SoundUtils.createNoise(1000/(d*d), length);
  // } else {
    var freq = 20000/d;
    var length = audioCtx.sampleRate/freq;
    return SoundUtils.createSine(freq, d/500, length);
  // }
}

var soundsPlaying = false;


var lastPosition = {x: 0, y: 0};
var oscillators = new Array(panners.length);
var gains = new Array(panners.length);

for(var i = 0; i<gains.length; i++){
  gains[i] = audioCtx.createGain();
  gains[i].connect(masterChannel);
}

function toggleContinuous(){
  soundsPlaying = !soundsPlaying;
  if(soundsPlaying){
    for(var i = 0; i<gains.length; i++){
      oscillators[i] = audioCtx.createOscillator();
      oscillators[i].connect(gains[i]);
      oscillators[i].start();
    }
  } else {
    for(var osc of oscillators){
      osc.stop();
    }
  }
}

function updatePlay(){
  if (soundsPlaying){
    if(lastPosition.x != player.x && lastPosition.y != player.y){
      lastPosition = {x: player.x, y: player.y};
      for(var i = 0; i< Scene._distances.length; i++){
        var osc = oscillators[i];
        var gain = gains[i];
        var d = Scene._distances[i];
        if(d>4000){
          // noise.connect(gain)
          // var n = SoundUtils.createNodeFromBuffer(noise);
          // n.connect(gain);
          // gain.gain.value = 1/d/1000;
          osc.frequency.value = 0;
          // n.start();
          gain.gain.value = .0000;
        } else {
          osc.frequency.value = 20000/d;
          gain.gain.value = d/5000;
        }
      }
    }
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

export {playSound, playAllSounds, updatePlay, toggleContinuous}