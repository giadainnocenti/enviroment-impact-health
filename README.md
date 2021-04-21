# enviroment-impact-health

# Project Goal
Dashboard and visualizations to explore air quality and its health effects in the United States.

# Wireframe Goals

These are the agreed upon wireframes for the dashboard we want to use. All these graphs and data are subject to change based on data availability and scope.

## MainPage

![MainPage](images/Main_Page.png)
 
The Main page shows the overview of the states with time as the slider at the bottom. When a user hovers over the state, the user can see some info for that specific state. When the user clicks the state, the user will be redirected to the individual Per State Page. There is a legend that the user can click to reduce the amount of data displayed on the graph, allowing data to be visually filtered. Lastly we want to have a play button on the bottom date time slider to allow the user to view the data as time passes.

![PerStatePage](images/Per_State_Page.png)

This PerStatePage shows the regression data for the state as well as more state specific graphs that can also be filtered to show different data.

![LiveWellsStates](images/Live_Wells_States.png)

This LiveWellsStates page is our attempt to create a "so what?" answer with our data, allowing the findings to inform the user.

![AboutTheAuthors](images/About_The_Authors.png)

Check us out! :)

# Flask Structure
```
/
```
Home Page for our project and presentation of the data.

```
/healthvsairquality
```
Dashboard showing the info-graphics created to show the health and environment trends with respect to the time.

```
/airquality-wildfires
```
Additional dashboard to visualize if a wild fire is impacting the air-quality.

# Data
1. [Asthma](https://chronicdata.cdc.gov/Chronic-Disease-Indicators/U-S-Chronic-Disease-Indicators-Asthma/us8e-ubyj)

2. [Wildfires](https://www.kaggle.com/rtatman/188-million-us-wildfires)

3. [Air Quality Index](https://www.epa.gov/outdoor-air-quality-data)

4. [COPD](https://chronicdata.cdc.gov/Chronic-Disease-Indicators/U-S-Chronic-Disease-Indicators-Chronic-Obstructive/aqr6-8kj8)

