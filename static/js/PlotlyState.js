const plotlyMapId = "state-map";

const mapTopMargin = 0;
const mapBottomMargin = 0;

var stateIndex = -1;
var statesData;
var minYear = 0;
var maxYear = 1;
var yearsLength = 1;

Promise.all([
	d3.json("/raw/air_quality_index.json"),
	d3.json("/raw/asthma.json"),
]).then(function (files) {

	stateIndex = States.indexOf(window.location.href.split("/state/")[1]);
	statesData = new StatesData(files[0]["air_quality_index"], files[1]["asthma"]);
	minYear = Math.min.apply(Math, statesData.years);
	maxYear = Math.max.apply(Math, statesData.years);
	yearsLength = maxYear - minYear;

	createPlotlyStateDisplay();

}).catch(function (err) {
	console.error(err);
})

function createPlotlyStateDisplay() {

	var data = [];
	for (var i = 0; i < statesData.length; i++)
		data.push(createStateMapTrace(i));
	console.log(data);
	var layout = {
		showlegend: true,
		legend: {
			orientation: "h",
			// x: 1,
			// y: 1.5,
			// xanchor: 'right',
		}
	};

	Plotly.newPlot(plotlyMapId, data, layout);
}

function createStateMapTrace(index) {
	console.log(statesData.scaleColors[index]);
	console.log(statesData.scaleColors[index][1]);
	console.log(statesData.scaleColors[index][1][1]);
	var values = [];
	for (var i = 0; i < yearsLength; i++)
		values.push(statesData.dataPerState[index][i][stateIndex]);
	return {
		x: statesData.years,
		y: values,
		legendgroup: statesData.valueType[index],
		marker: { color: statesData.scaleColors[index][1][1] },
		name: statesData.mapNames[index],
		type: 'scatter'
	};
}