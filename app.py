import os
import sqlite3
from flask import Flask, render_template, redirect, json, current_app as app

# Set up flask
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/state/<state>")
def state(state):
    return render_template("state.html", state=state)


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/raw_data")
def raw_data():
    data_path = os.path.join(
        app.static_folder,
        "data",
        "enviroment-impact-health.sqlite3"
    )

    conn = sqlite3.connect(data_path)
    con.row_factory = sql.Row

    cur = con.cursor()
    cur.execute("select * from asthma")

    asthma_db = cur.fetchall()

    cur = con.cursor()
    cur.execute("select * from air_quality_index")

    air_quality_index_db = cur.fetchall()

    conn.close()

    return [asthma_db, air_quality_index_db]


if __name__ == "__main__":
    app.run(debug=True)
