import os
from flask import Flask, render_template, redirect, json, current_app as app

# Set up flask
app = Flask(__name__)

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