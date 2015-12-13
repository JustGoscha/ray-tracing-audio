import {audioCtx} from './webaudio'


var createNodeFromBuffer = function(buffer){
  var bfSource = audioCtx.createBufferSource();
  bfSource.buffer = buffer;
  return bfSource;
};

var applyAmplitude = function(buffer, amp){
  var data = buffer.getChannelData(0);
  for(var i = 0; i<buffer.length; i++){
    data[i] = data[i]*amp; // checkout copy from channel and stuff...
  }
};

var createNoise = function(amp = 1, length = 80000){
  var bf = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  var data = bf.getChannelData(0);

  for(var i=0;i<length;i++){
    data[i] = Math.random() * amp;
  }

  // bfSource.buffer = bf;
  return bf;
};

var createSine = function(f = 440,amp = 1, length = audioCtx.sampleRate){
  var bf = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  var data = bf.getChannelData(0);

  for(var i=0;i<length;i++){
    data[i] = Math.sin(i * 2*Math.PI * (f/audioCtx.sampleRate)) * amp;
  }
  // bfSource.buffer = bf;
  return bf;
};

export {createSine, createNoise, createNodeFromBuffer}