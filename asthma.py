import sys
import traceback
import glob
import pandas as pd
import sqlite3
from sodapy import Socrata
import requests
from math import ceil


def clean_raw_data(asthma_df):
    drop_columns = [
        # "yearstart",
        "yearend",
        # "locationabbr",
        "locationdesc",
        "datasource",
        "topic",
        "question",
        "datavaluetype",
        # "datavalue",
        "datavaluealt",
        "stratificationcategory1",
        "stratification1",
        "locationid",
        "topicid",
        "questionid",
        "datavaluetypeid",
        "stratificationcategoryid1",
        "stratificationid1",
        "datavalueunit",
        "lowconfidencelimit",
        "highconfidencelimit",
        "datavaluefootnotesymbol",
        "datavaluefootnote",
    ]

    # stratification category => Overall
    asthma_df = asthma_df[asthma_df["stratificationcategory1"] == "Overall"]
    # stratification => Overall
    asthma_df = asthma_df[asthma_df["stratification1"] == "Overall"]
    # question => AST1_1 (Current asthma prevalence among adults aged >= 18 years)
    asthma_df = asthma_df[asthma_df["questionid"] == "AST1_1"]
    # => AGEADJPREV (Age-adjusted Prevalence) in %
    asthma_df = asthma_df[asthma_df["datavaluetypeid"] == "AGEADJPREV"]
    # dropping of unnecessary columns
    asthma_df = asthma_df.drop(columns=drop_columns)
    # removing missing data values
    asthma_df = asthma_df[asthma_df["datavalue"].isna() == False]
    # drop territories (PR, GU, VI) and nation-wide data (US)
    asthma_df = asthma_df[~asthma_df["locationabbr"].isin(
        ["PR", "GU", "VI", "US"])]
    # rename columns
    asthma_df = asthma_df.rename(
        columns={
            "yearstart": "year",
            "locationabbr": "state",
            "datavalue": "value"
        }
    )
    return asthma_df.reset_index(drop=True)


def get_raw_data():
    # Instruction from the CDC website to extract data
    # Unauthenticated client only works with public data sets. Note "None"
    # in place of application token, and no username or password:
    client = Socrata("chronicdata.cdc.gov", None)

    # Return as JSON from API / converted to Python list of
    # dictionaries by sodapy.
    results = client.get_all("us8e-ubyj")

    # Convert to pandas DataFrame
    return pd.DataFrame.from_records(results)


def add_table_to_db(table_name, df, conn):
    cur = conn.cursor()
    df.to_sql(name=table_name, if_exists="replace", con=conn)
    return(cur.execute(f"""SELECT * FROM {table_name};""").fetchall())


def update_asthma_database(file_path):
    conn = None
    try:
        # connecting to the sqlite database
        conn = sqlite3.connect(file_path)
        # grab and clean the data
        asthma_df = get_raw_data()
        asthma_df = clean_raw_data(asthma_df)
        # adding collection about asthma to sqlite
        add_table_to_db("asthma", asthma_df, conn)
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
        update_asthma_database(file_path)
    else:
        update_asthma_database(args[1])