from flask import Flask, render_template, redirect

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

if __name__ == "__main__":
    app.run(debug=True)