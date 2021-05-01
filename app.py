import os
import traceback
import sqlite3
from flask import Flask, render_template, redirect, current_app as app
import json

us_state_abbrev = {
    "Alabama": "AL",
    "Alaska": "AK",
    "American Samoa": "AS",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "District of Columbia": "DC",
    "Florida": "FL",
    "Georgia": "GA",
    "Guam": "GU",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Northern Mariana Islands": "MP",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Puerto Rico": "PR",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virgin Islands": "VI",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY"
}

# Set up flask
app = Flask(__name__)


def get_raw_data(db):
    data_path = os.path.join(app.static_folder, "data",
                             "environment-impact-health.sqlite3")
    sending_data = []
    conn = None
    try:
        # connecting to the sqlite database
        conn = sqlite3.connect(data_path)

        cur = conn.cursor()
        cur.execute(f"PRAGMA table_info({db});")
        header = []
        for row in cur.fetchall():
            header.append(row[1])

        # grab and clean the data
        cur = conn.cursor()
        cur.execute(f"SELECT * FROM {db}")
        for row in cur.fetchall():
            data = {}
            for i in range(1, len(row)):
                data[header[i]] = row[i]
                sending_data.append(data)

    except Exception as e:
        print("Error")
        print(e)
        traceback.print_exc()
        return "something went wrong"
    finally:
        # closing the connections to sqlite
        if conn:
            conn.close()

    return {db: sending_data}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/state/<state>")
def state(state):
    full_state_name = {v: k for k, v in us_state_abbrev.items()}[state]
    days_ozone_regression = full_state_name + "_Days Ozone_regression.png"
    days_PM2_5 = full_state_name + "_Days PM2.5_regression.png"
    return render_template(
        "state.html",
        state=state,
        full_state_name=full_state_name,
        days_ozone_regression=days_ozone_regression,
        days_PM2_5=days_PM2_5
    )


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/raw/air_quality_index.json")
def raw_air_quality_index_db():
    raw_data = get_raw_data("air_quality_index")
    for row in raw_data["air_quality_index"]:
        state = row["State"]
        if (state in us_state_abbrev):
            row["State"] = us_state_abbrev[row["State"]]
        else:
            raw_data["air_quality_index"].remove(row)

    return raw_data


@app.route("/raw/asthma.json")
def raw_asthma_db():
    return get_raw_data("asthma")


if __name__ == "__main__":
    app.run(debug=True)
