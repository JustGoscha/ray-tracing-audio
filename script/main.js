// this defines all the dependencies and figures app the static
// loading order of the scripts

"use strict";

require({
  paths: {
    exmplCtrl: "controllers/exampleCtrl",
    positionCtrl: "controllers/positionCtrl",
    demo2: "demo2"
  },
  shim: {
    'lib/angular':{
      deps: ['lib/jquery']
    },
    'lib/angular-resource': {
      deps: ['lib/angular']
    },
    'app': {
      deps: ['lib/angular', 'lib/angular-resource']
    },
    'bootstrap': {
      deps: ['app']
    },
    'exmplCtrl': {
      deps: ['app']
    },
    'positionCtrl': {
      deps: ['app','demo2']
    },
    'demo2':{
      deps: ['app']
    }
  }
}, ['require',
    'exmplCtrl',
    'demo2',
    'positionCtrl'
    ], function(require) {
  return require(['bootstrap']);
});