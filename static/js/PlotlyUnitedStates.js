const plotlyMapId = "usa-states-map";

const yearPrefix = "Year: ";
const playDuration = 300;
const stateSubPath = "state";
const mapTopMargin = 0;
const mapBottomMargin = 0;

var statesData = null;
var minYear = 0;
var maxYear = 1;
var yearsLength = 1;

var selectedMapIndex = 0;
var selectedYearIndex = 0;

Promise.all([
	d3.json("/raw/air_quality_index.json"),
	d3.json("/raw/asthma.json"),
]).then(function (files) {
	statesData = new StatesData(files[0]["air_quality_index"], files[1]["asthma"]);
	minYear = Math.min.apply(Math, statesData.years);
	maxYear = Math.max.apply(Math, statesData.years);
	yearsLength = maxYear - minYear;
	selectedMapIndex = statesData.length - 1;
	createPlotlyUnitedStatesDisplay();
}).catch(function (err) {
	console.error(err);
})

function onStateClick(stateAbbrev) {
	window.location.href = `/${stateSubPath}/${stateAbbrev}`;
}

function onSliderChange(yearIndex) {
	selectedYearIndex = yearIndex;
	createPlotlyUnitedStatesDisplay();
}

function onLegendChange(mapIndex) {
	selectedMapIndex = mapIndex;
	createPlotlyUnitedStatesDisplay();
}

function createPlotlyUnitedStatesDisplay() {

	var data = [];
	for (var i = 0; i < statesData.length; i++)
		data.push(createMapTrace(i));

	var plot = Plotly.newPlot(plotlyMapId, data, getLayout(), {scrollZoom: false , showAxisDragHandles : false});

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

function createMapTrace(mapIndex) {
	return {
		name: statesData.mapNames[mapIndex],
		type: 'choropleth',
		locationmode: 'USA-states',
		locations: States,
		text: statesData.displayText,
		z: statesData.dataPerState[mapIndex][selectedYearIndex],
		zauto: false,
		zmin: 0,
		zmin: Math.max(Math.min.apply(Math, statesData.dataPerState[mapIndex][0]), 0),
		zmax: Math.max.apply(Math, statesData.dataPerState[mapIndex][statesData.length - 1]),
		visible: (mapIndex == selectedMapIndex) ? true : "legendonly",
		showlegend: true,
		colorscale: statesData.scaleColors[mapIndex],
		colorbar: {
			title: statesData.mapNames[mapIndex],
			thickness: 15,
			x: 0.95,
			y: 0.4,
			len: 1,
			xanchor: "left"
		}
	};
}

function getLayout() {
	return {
		showlegend: true,
		legend: {
			x: 0.05,
			y: 0.95,
			xanchor: "left",
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
			landcolor: 'rgb(255, 255, 255)',
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
					//createPlayLayout(),
					//createPauseLayout()
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
				transition: { duration: 200, },
				frame: { duration: 500 }
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