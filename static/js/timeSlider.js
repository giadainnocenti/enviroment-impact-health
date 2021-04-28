// const sliderRangeId = "datetime-slider";
// const playButtonId = "play-button";
// const loopButtonId = "loop-button";
// const stepMillisecond = 1000;

// var i = 0;
// var canLoop = false;
// var intervalLoop = null;
// var slider = null;
// var min = 0;
// var max = 1;
// var step = 1;
// var value = 1;
// var loopLength = 1;

// slider = d3.select("#" + sliderRangeId);
// document.getElementById(playButtonId).addEventListener("click", () => onPlayClicked());
// document.getElementById(loopButtonId).addEventListener("click", () => onLoopClicked());
// //d3.select("#" + playButtonId).on("click", () => onPlayClicked());
// //d3.select("#" + loopButtonId).on("click", () => onLoopClicked());
// slider.on("change", function (d) {
// 	onSliderChange(+this.value);
// });

// function setSliderValues(_min, _max, _step) {
// 	slider = d3.select("#" + sliderRangeId);
// 	slider.on("change", function (d) {
// 		onSliderChange(+(this.value));
// 	});
// 	min = _min;
// 	max = _max;
// 	step = _step;
// 	value = _max;
// 	loopLength = (max - min) / step + 1;
// 	slider
// 		.attr("min", min)
// 		.attr("max", max)
// 		.attr("step", step)
// 		.attr("value", value);
// }

// function isPlaying() { return intervalLoop != null; }

// function play() {
// 	console.log("play");
// 	if (value === max){
// 		update(0);
// 		i = 1;
// 	}
// 	intervalLoop = setInterval(function () {
// 		if (i >= loopLength && canLoop) i = 0;
// 		if (i < loopLength) update(i);
// 		else stop();
// 		i++;
// 	}, stepMillisecond);
// }

// function stop() {
// 	clearInterval(intervalLoop);
// 	intervalLoop = null;
// }

// function update(index) {
// 	value = min + step * index;
// 	if (value > max || (max - value) < step)
// 		value = max;
// 	slider.attr("value", value);
// 	onSliderChange(value);
// }

// function onPlayClicked() {
// 	console.log("onPlayClicked");
// 	if (isPlaying()) stop();
// 	else play();
// }

// function onLoopClicked() {
// 	console.log("onLoopClicked");
// 	canLoop = !canLoop;
// }

// function onManualSliderChange(_value) {
// 	if (isPlaying()) stop();
// 	onSliderChange(_value);
// }

// function onSliderChange(_value) {
// 	console.log("onSliderChange " + _value);
// }
