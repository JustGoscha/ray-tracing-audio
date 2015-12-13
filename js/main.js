import {startAnimationLoop} from './animation'
import * as interaction from './interaction'
import player from './player'
import {panners} from './webaudio/endpoints'

function init(){
  interaction.init();
  startAnimationLoop();
}

init();