class StatesData {

	years = null;
	dataPerState = null;
	length = 0;

	mapNames = ["DaysOzone", "VarDaysPM2.5", "DaysPM10", "MaxAQI", "MedianAQI", "Asthma"];
	scaleNames = ["Days Ozone", "Days PM2.5", "Days PM10", "Max AQI", "Median AQI", "Asthma Rate"];
	scaleColors = [
		[
			[0, "rgb(255,255,255)"],
			[1, "rgb(255,0,0)"]
		],
		[
			[0, "rgb(255,255,255)"],
			[1, "rgb(0,255,0)"]
		],
		[
			[0, "rgb(255,255,255)"],
			[1, "rgb(0,0,255)"]
		],
		[
			[0, "rgb(255,255,255)"],
			[1, "rgb(255,255,0)"]
		],
		[
			[0, "rgb(255,255,255)"],
			[1, "rgb(0,255,255)"]
		],
		[
			[0, "rgb(255,255,255)"],
			[1, "rgb(255,0,255)"]
		],
	];

	constructor(air_quality_index, asthma) {
		var yearsAQI = air_quality_index
			.map(aqi => +aqi.Year)
			.filter((value, index, self) => self.indexOf(value) === index)
			.sort();

		var yearsAsthma = asthma
			.map(a => +a.year)
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
	get scaleNames() { return this.scaleNames; }
	get displayText() { return StatesData.states; }
	get years() { return this.years; }
	get dataPerState() { return this.dataPerState; }
	get length() { return this.length; }

	static mergeArrays(a, b) {
		var c = a.concat(b)
			.filter((value, index, self) => self.indexOf(value) === index)
			.sort();
		for (var i = 0; i < c.length; i++)
			if (a.includes(c[i]) == false) {
				c.pop(c[i]);
				i++;
			}
			else if (b.includes(c[i]) == false) {
				c.pop(c[i]);
				i++;
			}
		return c;
	}

	static pullOutAirQuality(years, rawData) {
		// console.log(rawData);

		var y_length = years.length;
		var daysOzone = [];
		var daysPM2_5 = [];
		var daysPM10 = [];
		var maxAQI = [];
		var medianAQI = [];
		for (var y = 0; y < y_length; y++) {
			daysOzone.push(Array(States.length).fill(-1.0));
			daysPM2_5.push(Array(States.length).fill(-1.0));
			daysPM10.push(Array(States.length).fill(-1.0));
			maxAQI.push(Array(States.length).fill(-1.0));
			medianAQI.push(Array(States.length).fill(-1.0));
		}
		
		var length = rawData.length;
		//for (var y = 0; y < y_length; y++)
		for (var i = 0; i < length; i++) {
			var state = States.indexOf(rawData[i]["State"]);
			var year = years.indexOf(+rawData[i]["Year"]);
			if (state < 0 || year < 0) continue;
			// parse data
			daysOzone[year][state] = +rawData[i]["Days Ozone"];
			daysPM2_5[year][state] = +rawData[i]["Days PM2.5"];
			daysPM10[year][state] = +rawData[i]["Days PM10"];
			maxAQI[year][state] = +rawData[i]["Max AQI"];
			medianAQI[year][state] = +rawData[i]["Median AQI"];
		}

		return [daysOzone, daysPM2_5, daysPM10, maxAQI, medianAQI];
	}

	static pullOutAsthma(years, rawData) {
		// console.log(rawData);

		var y_length = years.length;
		var asthma = [];
		for (var y = 0; y < y_length; y++)
			asthma.push(Array(States.length).fill(-1.0));
		var length = rawData.length;
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
