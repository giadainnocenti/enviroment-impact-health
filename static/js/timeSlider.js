var i = 0;
var length = 3;
var loop = false;
var intervalLoop = null;

var slider = d3.select("#datetime-slider");
slider.on('change', function (d) {
	onSliderChange(+(this.value));
});

setSliderValues(5, 10, 1);

function isPlaying() {
	return intervalLoop != null;
}

function play() {
	intervalLoop = setInterval(function () {
		if (i >= length && loop) i = 0;
		if (i < length) update(i);
		else stop();
		i++;
	}, 1000);
}

function stop() {
	clearInterval(intervalLoop);
	intervalLoop = null;
}

function update(index) {
	setSliderValue(index);
}

function onPlayClicked() {
	if (isPlaying()) stop();
	else play();
}

function onLoopClicked() {
	loop = !loop;
}

function setSliderValues(min, max, step) {
	length = (max - min) / step + 1;
	slider
		.attr("min", min)
		.attr("max", max)
		.attr("step", step)
		.attr("value", min);
}

function setSliderValue(value) {
	var min = +slider.attr("min");
	var step = +slider.attr("step");
	slider.attr("value", min + step * value);
}

function onSliderChange(value) {
	console.log("onSliderChange " + value);
}