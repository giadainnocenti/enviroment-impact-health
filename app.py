import os
from flask import Flask, render_template, redirect, json, current_app as app
from flask_pymongo import PyMongo
from ETL_datasets import Get_Data

#before starting the flask imports and cleans the datasets
Get_Data()

# Set up flask
app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
conn = "mongodb://localhost:27017/health_mongo_db"
client = PyMongo(app, uri=conn)

@app.route("/")
def index():
    return render_template("index.html")
	
@app.route("/state/<state>")
def state(state):
    return render_template("state.html",state=state)

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/raw_data")
def raw_data():
    data_path = os.path.join(app.static_folder, 'data', 'demoData.json')
    with open(data_path) as raw_data:
        json_data = json.load(raw_data)
    return json_data

if __name__ == "__main__":
    app.run(debug=True)