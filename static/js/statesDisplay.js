// https://plotly.com/javascript/reference/choropleth/#choropleth-visible
const plotlyMapId = "usa-states-map";


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

d3.json("/raw_data").then(function (rawData, err) {
	if (err) throw err;

	statesData = new StatesData(rawData);
	var years = statesData.years;
	var min = Math.min.apply(Math, years);
	var max = Math.max.apply(Math, years);
	selectedMap = mapNames[0];
	selectedYearIndex = max - min;
	setSliderValues(min, max, 1);
	drawStates();

}).catch(function (error) {
	console.log(error);
});

function getDefaultTrace(graphName, values) {
	var max = Math.max(values);
	var min = Math.min(values);
	return {
		name: graphName,
		type: "choropleth",
		locations: StatesData.states,
		z: values,
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

function getDefaultLayout() {
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
			scope: "usa",
			showlakes: true,
			lakecolor: "rgb(50,100,190)"
		}
	};
}

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
	drawStates();
}