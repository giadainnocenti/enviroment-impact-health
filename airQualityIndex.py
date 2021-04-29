import sys
import traceback
import glob
import pandas as pd
import sqlite3
from sodapy import Socrata
import requests
from math import ceil


def clean_raw_data(air_quality_index_df):
    # there is the need to aggregate the data by state and year
    # The output is the average number of days that were over the law limits per parameter of interest (i.e. PMx)
    # The average median and maximum API per state in a year is evaluated as well.
    air_quality_index_df = air_quality_index_df.groupby(
        by=["State", "Year"]).mean().reset_index()

    # dropping not useful column
    columns_to_drop = [
        "Days with AQI",
        "Good Days",
        "Moderate Days",
        "Unhealthy for Sensitive Groups Days",
        "Unhealthy Days",
        "Very Unhealthy Days",
        "Hazardous Days",
        "90th Percentile AQI",
        "Days CO",
        "Days NO2",
        "Days SO2"
    ]

    air_quality_index_df.drop(columns=columns_to_drop, inplace=True)

    # converting the number of days in integers because as float they do not make too much sense
    for column in air_quality_index_df.columns:
        if air_quality_index_df[column].dtype == float:
            air_quality_index_df[column] = air_quality_index_df[column].astype(
                "int64")

    return air_quality_index_df


def get_raw_data():
    # finding the name of all the files in the air quality folder
    all_files = glob.glob("./Air_quality_csv/*.csv")

    aqi_list = []
    # reading all the CSV files
    for filename in all_files:
        df = pd.read_csv(filename, index_col=None, header=0)
        aqi_list.append(df)
    # creating the concatenated dataframe
    return pd.concat(aqi_list, axis=0, ignore_index=True)


def add_table_to_db(table_name, df, conn):
    cur = conn.cursor()
    df.to_sql(name=table_name, if_exists="replace", con=conn)
    return(cur.execute(f"""SELECT * FROM {table_name};""").fetchall())


def update_air_quality_index_database(file_path):
    conn = None
    try:
        # connecting to the sqlite database
        conn = sqlite3.connect(file_path)
        # grab and clean the data
        air_quality_index_df = get_raw_data()
        air_quality_index_df = clean_raw_data(air_quality_index_df)
        # adding collection about asthma to sqlite
        add_table_to_db("air_quality_index", air_quality_index_df, conn)
    except Exception as e:
        print("Error")
        print(e)
        traceback.print_exc()
    finally:
        # closing the connections to sqlite
        if conn:
            conn.close()


if __name__ == "__main__":
    args = sys.argv
    file_path = "static/data/environment-impact-health.sqlite3"
    if (len(args) < 2):
        update_air_quality_index_database(file_path)
    else:
        update_air_quality_index_database(args[1])
