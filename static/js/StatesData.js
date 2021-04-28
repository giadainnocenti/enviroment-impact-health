class StatesData {

	mapNames = null;
	scaleNames = null;
	scaleColors = null;
	years = null;
	dataPerState = null;
	length = 0;

	constructor(rawData) {
		// console.log(rawData);

		this.mapNames = [];
		this.scaleNames = [];
		this.scaleColors = [];

		this.mapNames.push("AirQuality");
		this.scaleNames.push("Air Quality");
		this.scaleColors.push([[0, "rgb(255,255,255)"], [1, "rgb(0,0,255)"]]);
		var yearsAQI = rawData.airQualityIndex
		.map(d => +d.year)
		.filter((value, index, self) => self.indexOf(value) === index)
		.sort();
		
		this.mapNames.push("Asthma");
		this.scaleNames.push("Asthma Rate");
		this.scaleColors.push([[0, "rgb(255,255,255)"], [1, "rgb(0,0,255)"]]);
		var yearsAsthma = rawData.asthmaMortalityRate
			.map(d => +d.year)
			.filter((value, index, self) => self.indexOf(value) === index)
			.sort();

		this.years = StatesData.mergeArrays(yearsAQI, yearsAsthma);
		this.dataPerState = [
			StatesData.pullOutAirQuality(this.years, rawData.airQualityIndex),
			StatesData.pullOutAsthma(this.years, rawData.asthmaMortalityRate)
		];
		this.length = this.dataPerState.length;
	}

	get mapNames() { return this.mapNames; }
	get scaleNames() { return this.scaleNames; }
	get displayText() { return StatesData.states; }
	get years() { return this.years; }
	get dataPerState() { return [this.airQuality, this.asthma]; }
	get length() { return this.length; }

	airQualityByIndex(index) {
		//console.log(index);

		return this.airQuality[index];
	}

	asthmaByIndex(index) {
		//console.log(index);

		return this.asthma[index];
	}

	// probably dont need this, filter func could be redundant for loop
	static mergeArrays(a, b) {
		// console.log(a);
		// console.log(b);

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
		var airQuality = Array(y_length).fill(Array(States.length).fill(0.0));

		var length = rawData.length;
		for (var year = 0; year < y_length; year++)
			for (var i = 0; i < length; i++) {
				var state = States.indexOf(rawData[i].name);
				var year = years.indexOf(+rawData[i].year);
				if (state < 0 || year < 0) continue;
				// parse data
				airQuality[year][state] = +rawData[i].average;
			}

		return airQuality;
	}

	static pullOutAsthma(years, rawData) {
		// console.log(rawData);

		var y_length = years.length;
		var asthma = Array(y_length).fill(Array(States.length).fill(0.0));

		var length = rawData.length;
		for (var year = 0; year < y_length; year++)
			for (var i = 0; i < length; i++) {
				var state = States.indexOf(rawData[i].name);
				var year = years.indexOf(+rawData[i].year);
				if (state < 0 || year < 0) continue;
				// parse data
				asthma[year][state] = +rawData[i].asthmaMortalityRate;
			}

		return asthma;
	}
}

