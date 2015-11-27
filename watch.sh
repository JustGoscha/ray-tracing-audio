#!/bin/bash
node_modules/nodemon/bin/nodemon.js -e js,less,png,jpg,gif --ignore css/ --ignore build/ --ignore bower_components --ignore node_modules -x ./compile.sh