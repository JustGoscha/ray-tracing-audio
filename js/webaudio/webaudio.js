var AudioContext = window.AudioContext || window.webkitAudioContext || window.MozAudioContext || window.mozAudioContext;

if(!AudioContext){
  window.alert('Your browser does not support the WebAudio API or is not compatible with this implementation.');
}

var audioCtx = new AudioContext();

export {audioCtx};