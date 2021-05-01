class StatesData {

	years = null;
	dataPerState = null;
	length = 0;

	mapNames = ["Days Ozone", "Days PM2.5", "Max AQI", "Median AQI", "Asthma Prevalence  "];
	valueType = ["Days", "Days", "AQI", "AQI", "%"];
	scaleColors = [
		[
			[0, "rgb(255,0,0)"],
			[1, "rgb(0,0,0)"],
		],
		[
			[0, "rgb(0,255,0)"],
			[1, "rgb(0,0,0)"],
		],
		[
			[0, "rgb(123,123,255)"],
			[1, "rgb(0,0,0)"],
		],
		[
			[0, "rgb(255,0,255)"],
			[1, "rgb(0,0,0)"],
		],
		[
			[0, "rgb(0,255,255)"],
			[1, "rgb(0,0,0)"],
		],
	];

	constructor(air_quality_index, asthma) {
		var yearsAQI = air_quality_index
			.map(aqi => +aqi["Year"])
			.filter((value, index, self) => self.indexOf(value) === index)
			.sort();

		var yearsAsthma = asthma
			.map(a => +a["year"])
			.filter((value, index, self) => self.indexOf(value) === index)
			.sort();

		this.years = StatesData.mergeArrays(yearsAQI, yearsAsthma);
		this.dataPerState = [
			...StatesData.pullOutAirQuality(this.years, air_quality_index),
			StatesData.pullOutAsthma(this.years, asthma)
		];
		this.length = this.dataPerState.length;
	}

	get mapNames() { return this.mapNames; }
	get valueType() { return this.valueType; }
	get displayText() { return StatesData.states; }
	get years() { return this.years; }
	get dataPerState() { return this.dataPerState; }
	get length() { return this.length; }

	static mergeArrays(a, b) {
		var c = [];
		a.forEach(element => {
			if (b.includes(element))
				c.push(element);
		});
		b.forEach(element => {
			if (a.includes(element))
				c.push(element);
		});
		c.filter((value, index, self) => self.indexOf(value) === index).sort();
		return c;
	}

	static pullOutAirQuality(years, rawData) {
		// console.log(rawData);

		var length = years.length;
		var daysOzone = [];
		var daysPM2_5 = [];
		var maxAQI = [];
		var medianAQI = [];
		for (var i = 0; i <= length; i++) {
			daysOzone.push(Array(States.length).fill(-1.0));
			daysPM2_5.push(Array(States.length).fill(-1.0));
			maxAQI.push(Array(States.length).fill(-1.0));
			medianAQI.push(Array(States.length).fill(-1.0));
		}

		length = rawData.length;
		for (var i = 0; i < length; i++) {
			var state = States.indexOf(rawData[i]["State"]);
			var year = years.indexOf(+rawData[i]["Year"]);
			if (state < 0 || year < 0) continue;
			// parse data
			daysOzone[year][state] = +rawData[i]["Days Ozone"];
			daysPM2_5[year][state] = +rawData[i]["Days PM2.5"];
			maxAQI[year][state] = +rawData[i]["Max AQI"];
			medianAQI[year][state] = +rawData[i]["Median AQI"];
		}

		return [daysOzone, daysPM2_5, maxAQI, medianAQI];
	}

	static pullOutAsthma(years, rawData) {
		// console.log(rawData);

		var length = years.length;
		var asthma = [];
		for (var i = 0; i <= length; i++)
			asthma.push(Array(States.length).fill(-1.0));

		length = rawData.length;
		for (var i = 0; i < length; i++) {
			var row = rawData[i];
			var state = States.indexOf(row["state"]);
			var year = years.indexOf(+row["year"]);
			if (state < 0 || year < 0) continue;
			// parse data
			asthma[year][state] = +row["value"];
		}

		return asthma;
	}
}