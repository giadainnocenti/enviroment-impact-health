// https://plotly.com/javascript/reference/choropleth/#choropleth-visible
const plotlyMapId = "usa-states-map";

const yearPrefix = "Year: ";
const playDuration = 300;
const stateSubPath = "state";
const mapTopMargin = 0;
const mapBottomMargin = 75;
const mapNames = ["AirQuality", "Asthma"];
const colorLabel = "Air Quality";
const colorScale = [
	[0, "rgb(255,255,255)"],
	[1, "rgb(0,0,255)"]
];

var statesData = null;
var selectedMap = null;
var selectedYearIndex = 0;

var layout = null;

d3.json("/raw_data").then(function (rawData, err) {

	statesData = new StatesData(rawData);
	var years = statesData.years;

	var frames = getFrames(years, StatesData.states, [statesData.airQuality, statesData.asthma], null);

	var traces = [
		getDefaultTrace(mapNames[0], statesData.airQuality[0]),
		getDefaultTrace(mapNames[1], statesData.asthma[0])
	];

	selectedMap = mapNames[0];
	traces[0].visible = true;

	layout = getLayout(years);

	var plot = Plotly.newPlot(plotlyMapId, traces, layout);

	plot.then(gd => {
		Plotly.addFrames(plotlyMapId, frames);
		gd.on("plotly_click", d => onStateClick((d.points || [])[0].location));
		gd.on("plotly_legendclick", d => onLegendClick(d.data[d.expandedIndex].name));
	});

	// Plotly.newPlot(plotlyMapId, traces, layout).then(function () {
	// 	Plotly.addFrames(plotlyMapId, frames);
	// });

	// 	plot.then(gd => {
	// 	gd.on("plotly_click", d => onStateClick((d.points || [])[0].location));
	// 	gd.on("plotly_legendclick", d => onLegendClick(d.data[d.expandedIndex].name));
	// });
});

function getFrames(years, locations, values, displayText) {

	var min = Math.min.apply(Math, years);
	var max = Math.max.apply(Math, years);
	var length = max - min;

	var frames = []

	for (var i = 0; i <= length; i++)
		frames[i] = {
			data: [{
				z: values[i],
				locations: locations,
				text: locations
			}],
			name: min + i
		};

	return frames;
}

function getDefaultTrace(traceName, values) {

	var max = Math.max(values);
	var min = Math.min(values);

	return {
		name: traceName,
		type: 'choropleth',
		locationmode: 'usa',
		locations: StatesData.states,
		z: values,
		zauto: false,
		zmin: min,
		zmax: max,
		visible: "legendonly",
		showlegend: true,
		locationmode: "USA-states",
		text: StatesData.states,
		colorscale: colorScale,
		colorbar: {
			title: colorLabel,
			thickness: 15,
			y: 0.25,
			len: 0.75,
			xanchor: "right"
		}
	};
}

function getLayout(years) {
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
			subunitcolor: 'rgb(255, 255, 255)',
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
					{
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
					},
					{
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
					}
				]
			}
		],
		sliders: [
			{
				active: 0,
				steps: getSliderSteps(years),
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
			}
		]
	};
}
function getSliderSteps(years) {

	var min = Math.min.apply(Math, years);
	var max = Math.max.apply(Math, years);
	var length = max - min;

	var sliderSteps = [];

	for (var i = 0; i <= length; i++) {
		var year = min + i;
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

// d3.json("/raw_data").then(function (rawData, err) {
// 	if (err) throw err;

// 	statesData = new StatesData(rawData);
// 	var years = statesData.years;
// 	var min = Math.min.apply(Math, years);
// 	var max = Math.max.apply(Math, years);
// 	selectedMap = mapNames[0];
// 	selectedYearIndex = max - min;
// 	setSliderValues(min, max, 1);
// 	drawStates();

// }).catch(function (error) {
// 	console.log(error);
// });

// function getDefaultTrace(graphName, values) {
// 	var max = Math.max(values);
// 	var min = Math.min(values);
// 	return {
// 		name: graphName,
// 		type: "choropleth",
// 		locations: StatesData.states,
// 		z: values,
// 		zmin: min,
// 		zmax: max,
// 		visible: "legendonly",
// 		showlegend: true,
// 		locationmode: "USA-states",
// 		text: StatesData.states,
// 		colorscale: colorScale,
// 		colorbar: {
// 			title: colorLabel,
// 			thickness: 15,
// 			y: 0.25,
// 			len: 0.75,
// 			xanchor: "right"
// 		}
// 	};
// }

// function getDefaultLayout() {
// 	return {
// 		showlegend: true,
// 		legend: {
// 			x: 1,
// 			y: 0.85,
// 			xanchor: "right",
// 		},
// 		margin:
// 		{
// 			t: mapTopMargin,
// 			b: mapBottomMargin
// 		},
// 		geo: {
// 			scope: "usa",
// 			showlakes: true,
// 			lakecolor: "rgb(50,100,190)"
// 		}
// 	};
// }

function drawStates() {
	var traces = [
		getDefaultTrace(mapNames[0], statesData.airQualityByIndex(selectedYearIndex)),
		getDefaultTrace(mapNames[1], statesData.asthmaByIndex(selectedYearIndex))
	];
	var layout = getDefaultLayout();

	var selectedMapIndex = mapNames.indexOf(selectedMap);
	traces[selectedMapIndex].visible = true;

	var plot = Plotly.newPlot(plotlyMapId, traces, layout, { showLink: false });

	plot.then(gd => {
		gd.on("plotly_click", d => onStateClick((d.points || [])[0].location));
		gd.on("plotly_legendclick", d => onLegendClick(d.data[d.expandedIndex].name));
	});
}

function onStateClick(stateAbbrev) {
	window.location.href = `/${stateSubPath}/${stateAbbrev}`;
}

function onLegendClick(graphName) {
	console.log(graphName);

	if (graphName == selectedMap)
		return;

	selectedMap = graphName;

	var index = mapNames.indexOf(selectedMap);
console.log(selectedMap);
console.log(index);
	var traces = [
		getDefaultTrace(mapNames[0], statesData.airQuality[0]),
		getDefaultTrace(mapNames[1], statesData.asthma[0])
	];

	for (var i = 0; i < mapNames.length; i++)
		traces[i].visible = (index == i) ? true : "legendonly";

	Plotly.update(plotlyMapId, traces, layout);
}