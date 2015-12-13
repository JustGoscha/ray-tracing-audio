import {audioCtx} from './webaudio'

var compressor = audioCtx.createDynamicsCompressor();
var masterChannel = audioCtx.createGain();

masterChannel.connect(compressor);
compressor.connect(audioCtx.destination);

export {masterChannel}