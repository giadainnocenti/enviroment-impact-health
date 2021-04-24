from flask import Flask, render_template

app = Flask(__name__)

# Use the connection to the database chose
#conn = "mongodb://localhost:27017/mission_to_mars"
#client = PyMongo(app, uri=conn)

#show the main page
@app.route("/")
def index():
    return render_template('main.html')
#show the regression and ? per state - we probably have to 
# do a call per state - look into that
@app.route("/Georgia")
def healthquality():
    return render_template('states.html')
#show the best place to live
@app.route("/winner")
def bestplacetolive():
    return render_template("winner.html")

@app.route("contacts")
def contacts():
    return render_template("contacts.html")

@app.route("/airquality-wildfires")
def wildfires():
    return render_template('wildfire.html')


if __name__ == "__main__":
    app.run(debug=True)