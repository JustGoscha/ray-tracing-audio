// ----- HELPER FUNCTIONS -----

function $(expr, container) {
  return typeof expr === "string"? (container || document).querySelector(expr) : expr || null;
}

// Returns all elements that match CSS selector {expr} as an array.
// Querying can optionally be restricted to {container}’s descendants
function $$(expr, container) {
  return [].slice.call((container || document).querySelectorAll(expr));
}

function viewport(){
    var e = window;
    var a = 'inner';
    if (!('innerWidth' in window)){
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

var getMousePositionFromEvent = function(event){
  var currentX, currentY;
  if(event.offsetX!==undefined){
    currentX = event.offsetX;
    currentY = event.offsetY;
  } else {
    currentX = event.layerX - event.currentTarget.offsetLeft;
    currentY = event.layerY - event.currentTarget.offsetTop;
  }

  return {x: currentX, y: currentY};
};

export {$, $$, viewport, getMousePositionFromEvent};