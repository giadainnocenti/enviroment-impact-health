const graphTitle = "US Air Quality by State";
const colorLabel = "Air Quality";
const colorScale = [
	[0, "rgb(242,240,247)"], [0.2, "rgb(218,218,235)"],
	[0.4, "rgb(188,189,220)"], [0.6, "rgb(158,154,200)"],
	[0.8, "rgb(117,107,177)"], [1, "rgb(84,39,143)"]
];

function drawStates(states, values, hoverInfo) {
	var max = Math.max(values);
	var min = Math.min(values);

	var data = [{
		type: "choropleth",
		locationmode: "USA-states",
		locations: states,
		z: values,
		text: hoverInfo,
		zmin: min,
		zmax: max,
		colorscale: colorScale,
		colorbar: {
			title: colorLabel,
			thickness: 1
		}
	}];

	var layout = {
		title: graphTitle,
		geo: {
			scope: "usa",
			showlakes: true,
			lakecolor: "rgb(50,100,190)"
		}
	};

	Plotly.newPlot("usa-states-map", data, layout, { showLink: false })
		.then(gd => gd.on('plotly_click', d => onStateClick((d.points || [])[0].location)));
}

function onStateClick(stateAbbrev) {
	window.location.href = "/state/" + stateAbbrev;
}

d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/2011_us_ag_exports.csv").then(function (csvData, err) {
	if (err) throw err;

	drawStates(["AL", "AK"], [100, 1000], ["cool", "beans"]);

}).catch(function (error) {
	console.log(error);
});