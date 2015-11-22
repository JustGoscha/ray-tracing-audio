angular.module('app').controller('PositionCtrl', function(SoundService, $scope){
	$scope.soundPosition = {
		soundX: 0,
		soundY: 0,
		soundZ: 0
	}


	context = SoundService.context;
	// HRTF panning!!
	panner = SoundService.panner;

	$scope.$watch($scope.soundPosition,function(){
		panner.setPosition($scope.soundPosition.soundX,
			$scope.soundPosition.soundY,
			$scope.soundPosition.soundZ);
	});

	$scope.startDemo = function(){

		// AudioSource
		source = context.createBufferSource();

		// load the source
		var urls = ['Dramatic2.wav'];
		var loader = new BufferLoader(context,urls,finished);
		loader.load();

		function finished(bufferList){
			mixToMono[bufferList[1]]
			source.buffer = bufferList[0];
		}
		
		// unprocessed sound gain
		dryGainNode = context.createGain();
		
		// processed sound gain
		wetGainNode = context.createGain();

		lowFilter =  context.createBiquadFilter();
		lowFilter.frequency.value = 22050.0;
	    lowFilter.Q.value = 5.0;

	    convolver = context.createConvolver();
	    
	    // audio processing graph linking
	    source.connect(lowFilter);
	    lowFilter.connect(panner);

	    // dry mix connect
	    panner.connect(dryGainNode);
	    dryGainNode.connect(context.destination);



	    // wet mix connect
		panner.connect(convolver);
		convolver.connect(wetGainNode);
		wetGainNode.connect(context.destination);
		wetGainNode.gain.value = 0.0; // reverb level


		source.playbackRate.value = 1.0;

		panner.setPosition(0,2,0);

		source.start(context.currentTime);


	};

});

