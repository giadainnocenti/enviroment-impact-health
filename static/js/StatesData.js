class StatesData {

	static states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
	
	years = null;
	airQuality = null;
	asthma = null;

	constructor(rawData) {
		// console.log(rawData);

		var yearsAQI = rawData.airQualityIndex
			.map(d => +d.year)
			.filter((value, index, self) => self.indexOf(value) === index)
			.sort();

		var yearsAsthma = rawData.asthmaMortalityRate
			.map(d => +d.year)
			.filter((value, index, self) => self.indexOf(value) === index)
			.sort();

		this.years = StatesData.mergeArrays(yearsAQI, yearsAsthma);
		this.airQuality = StatesData.pullOutAirQuality(this.years, rawData.airQualityIndex);
		this.asthma = StatesData.pullOutAsthma(this.years, rawData.asthmaMortalityRate);
	}

	get years() { return this.years; }

	airQualityByIndex(index) {
		//console.log(index);

		return this.airQuality[index];
	}

	asthmaByIndex(index) {
		//console.log(index);

		return this.asthma[index];
	}

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
		var airQuality = Array(y_length).fill(Array(StatesData.states.length).fill(0.0));

		var length = rawData.length;
		for (var year = 0; year < y_length; year++)
			for (var i = 0; i < length; i++) {
				var state = StatesData.states.indexOf(rawData[i].name);
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
		var asthma = Array(y_length).fill(Array(StatesData.states.length).fill(0.0));

		var length = rawData.length;
		for (var year = 0; year < y_length; year++)
			for (var i = 0; i < length; i++) {
				var state = StatesData.states.indexOf(rawData[i].name);
				var year = years.indexOf(+rawData[i].year);
				if (state < 0 || year < 0) continue;
				// parse data
				asthma[year][state] = +rawData[i].asthmaMortalityRate;
			}

		return asthma;
	}
}

