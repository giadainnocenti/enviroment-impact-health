from flask import Flask, render_template, redirect

# Set up flask
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")
	
@app.route("/per_state")
def per_state():
    return render_template("per_state.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/scrape")
def scrape():
    return redirect("/", code=302)

if __name__ == "__main__":
    app.run(debug=True)
