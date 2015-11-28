import {startAnimationLoop} from './animation'
import * as interaction from './interaction'
import player from './player'

function init(){
  interaction.init();
  startAnimationLoop();
}

init();