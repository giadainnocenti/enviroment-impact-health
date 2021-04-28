// https://plotly.com/javascript/reference/choropleth/#choropleth-visible
const plotlyMapId = "usa-states-map";

const yearPrefix = "Year: ";
const playDuration = 300;
const stateSubPath = "state";
const mapTopMargin = 0;
const mapBottomMargin = 75;

var statesData = null;
var minYear = 0;
var maxYear = 1;
var yearsLength = 1;

var selectedMapIndex = 0;
var selectedYearIndex = 0;

d3.json("/raw_data").then(function (rawData, err) {
	statesData = new StatesData(rawData);
	minYear = Math.min.apply(Math, statesData.years);
	maxYear = Math.max.apply(Math, statesData.years);
	yearsLength = maxYear - minYear;
	createPlotlyStatesDisplay();
});

function createPlotlyStatesDisplay() {

	var data = [];
	for (var i = 0; i < statesData.length; i++)
		data.push(getMapTrace(i));
	console.log(statesData.length);
	console.log(data);
	var plot = Plotly.newPlot(plotlyMapId, data, getLayout());

	console.log(getSliderSteps());
	console.log(getFrames());

	plot.then(gd => {
		Plotly.addFrames(plotlyMapId, getFrames());
		gd.on("plotly_click", d => onStateClick((d.points || [])[0].location));
		gd.on("plotly_sliderchange", d => {
			var newYear = d.slider.active;
			if (selectedYearIndex !== newYear)
				onSliderChange(newYear);
		});
		gd.on("plotly_legendclick", d => {
			var newMap = statesData.mapNames.indexOf(d.data[d.expandedIndex].name);
			if (selectedMapIndex !== newMap)
				onLegendChange(newMap);
		});
	});
}

function getMapTrace(mapIndex) {
	return {
		name: statesData.mapNames[mapIndex],
		type: 'choropleth',
		locationmode: 'USA-states',
		locations: States,
		//text: statesData.displayText,
		z: statesData.dataPerState[mapIndex][selectedYearIndex],
		zauto: false,
		zmin: Math.min.apply(Math, statesData.dataPerState[mapIndex][0]),
		zmax: Math.max.apply(Math, statesData.dataPerState[mapIndex][statesData.length - 1]),
		visible: (mapIndex == selectedMapIndex) ? true : "legendonly",
		showlegend: true,
		colorscale: statesData.scaleColors[mapIndex],
		colorbar: {
			title: statesData.scaleNames[mapIndex],
			thickness: 15,
			y: 0.25,
			len: 0.75,
			xanchor: "right"
		}
	};
}

function getLayout() {
	return {
		showlegend: true,
		legend: {
			x: 1,
			y: 0.85,
			xanchor: "right",
		},
		margin:
		{
			t: mapTopMargin,
			b: mapBottomMargin
		},
		geo: {
			scope: 'usa',
			showland: true,
			showlakes: true,
			lakecolor: 'rgb(255, 255, 255)',
			// subunitcolor: 'rgb(255, 255, 255)',
			lonaxis: {},
			lataxis: {}
		},
		updatemenus: [
			{
				x: 0.1,
				y: 0,
				yanchor: "top",
				xanchor: "right",
				showactive: false,
				direction: "left",
				type: "buttons",
				pad: { "t": 87, "r": 10 },
				buttons: [
					createPlayLayout(),
					createPauseLayout()
				]
			}
		],
		sliders: [createTimeSliderLayout()]
	};
}

function createPlayLayout() {
	return {
		method: "animate",
		args: [
			null,
			{
				fromcurrent: true,
				transition: { duration: playDuration, },
				frame: { duration: playDuration }
			}
		],
		label: "Play"
	};
}

function createPauseLayout() {
	return {
		method: "animate",
		args: [
			[null],
			{
				mode: "immediate",
				transition: { duration: 0 },
				frame: { duration: 0 }
			}
		],
		label: "Pause"
	};
}

function createTimeSliderLayout() {
	return {
		active: selectedYearIndex,
		steps: getSliderSteps(),
		x: 0.1,
		y: 0,
		len: 0.9,
		xanchor: "left",
		yanchor: "top",
		pad: { t: 50, b: 10 },
		currentvalue: {
			visible: true,
			prefix: yearPrefix,
			xanchor: "right",
			font: {
				size: 20,
				//color: "#666"
			}
		},
		transition: {
			duration: 300,
			easing: "cubic-in-out"
		}
	};
}

function getSliderSteps() {

	var sliderSteps = [];

	for (var i = 0; i <= yearsLength; i++) {
		var year = minYear + i;
		sliderSteps.push({
			label: year.toString(),
			method: "animate",
			args: [
				[year],
				{
					mode: "immediate",
					transition: { duration: playDuration },
					frame: { duration: playDuration }
				}
			]
		});
	}

	return sliderSteps;
}

function getFrames() {
	var frames = []

	for (var i = 0; i <= yearsLength; i++)
		frames[i] = {
			data: [{
				z: statesData.dataPerState[selectedMapIndex][i],
				locations: States,
				text: statesData.displayText
			}],
			name: minYear + i
		};

	return frames;
}

function onStateClick(stateAbbrev) {
	window.location.href = `/${stateSubPath}/${stateAbbrev}`;
}

function onSliderChange(yearIndex) {
	selectedYearIndex = yearIndex;
	createPlotlyStatesDisplay();
}

function onLegendChange(mapIndex) {
	selectedMapIndex = mapIndex;
	createPlotlyStatesDisplay();
}