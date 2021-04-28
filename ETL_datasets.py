
import glob
import pandas as pd
from pymongo import MongoClient
from sodapy import Socrata
import requests
import glob




def add_collection_to_mongo (collection_name, df, mongo_db_conn = mydb):
    mongo_db_conn[collection_name].insert_many(df.to_dict('records'))
    return print(f'{collection_name} stored in the MongoDB database named {mydb}')

def Get_Data():
    #connecting to the MongoDB Database
    mongo_client = MongoClient()
    #creating the MongoDB
    mydb = mongo_client['health_air_mongo']

    # Instruction from the CDC website to extract data
    # Unauthenticated client only works with public data sets. Note 'None'
    # in place of application token, and no username or password:
    client = Socrata("chronicdata.cdc.gov", None)

    # Return as JSON from API / converted to Python list of
    # dictionaries by sodapy.
    results = client.get_all("us8e-ubyj")

    # Convert to pandas DataFrame
    asthma_df = pd.DataFrame.from_records(results)

    #list containing the questions of interest for our project
    questions_OI = ['Asthma mortality rate',                'Emergency department visit rate for asthma',                'Hospitalizations for asthma',                'Current asthma prevalence among adults aged >= 18 years',                'Asthma prevalence among women aged 18-44 years']

    #retrieving the unique ID per question so that we address eventual spelling mistakes
    questionids_list=[]
    for question in questions_OI:
        questionids_list += list(asthma_df[asthma_df['question']==question]['questionid'].unique())
    print(questionids_list)

    # filtering the dataset for the questions of interest
    filtered_asthma_df = asthma_df[asthma_df['questionid'].isin(questionids_list)]

    #checking if column 'yearstart' and 'yearend' are the same
    print(f"Are the columns datavalue and datavaluealt end the same?\n{filtered_asthma_df['datavalue'].equals(filtered_asthma_df['datavaluealt'])}")
    print(f"Are the columns yearstart and year end the same?\n{filtered_asthma_df['yearstart'].equals(filtered_asthma_df['yearend'])}")
    #if these columns are the same drop one of the duplicates and other not useful columns
    if filtered_asthma_df['yearstart'].equals(filtered_asthma_df['yearend']):
        columns_to_drop = ['yearend',\
                            'topic',\
                            'datavaluealt',\
                            'topicid',\               
                            'datavaluetypeid',\
                            'stratificationcategoryid1',\
                            'stratificationid1',\
                            'lowconfidencelimit',\
                        'highconfidencelimit',\
                        'datavaluefootnotesymbol',\
                        'datavaluefootnote']
        filtered_asthma_df=filtered_asthma_df.drop(columns=columns_to_drop)
        print(f"The following columns {columns_to_drop} were dropped")

    #renaming some columns
    filtered_asthma_df=filtered_asthma_df.rename(columns={"yearstart": "year","locationabbr":"state_id","locationdesc":"state"})

    # removing missing data values
    filtered_asthma_df=filtered_asthma_df[filtered_asthma_df['datavalue'].isna()==False]

    # drop territories (PR, GU, VI) and nation-wide data (US)
    state_to_drop = ['PR','GU','US','VI']
    filtered_asthma_df = filtered_asthma_df[~filtered_asthma_df['state_id'].isin(state_to_drop)]

    #checking for duplicates
    filtered_asthma_df=filtered_asthma_df.drop_duplicates()

    #checking that there isn't more than one data value entry for the same year and state.
    duplicateRowsDF = filtered_asthma_df[filtered_asthma_df.duplicated(subset=['year','state_id','state','datasource','question','datavaluetype','datavaluetype','stratificationcategory1','stratification1','locationid','questionid','datavalueunit'], keep=False)]

    #keeping only the Overall values
    filtered_asthma_df = filtered_asthma_df[filtered_asthma_df['stratificationcategory1'] == 'Overall']

    # final dropping of unnecessary columns
    filtered_asthma_df=filtered_asthma_df.drop(columns=['state',\
                                                        'datasource',\
                                                        'question',\
                                                        'stratificationcategory1',\
                                                        'stratification1',\
                                                        'locationid',\
                                                        'questionid'])


    # adding collection about asthma to MongoDB
    add_collection_to_mongo('asthma',filtered_asthma_df)


    #finding the name of all the files in the air quality folder
    all_files = glob.glob('./Air_quality_csv/*.csv')

    air_list = []
    #reading all the CSV files
    for filename in all_files:
        df = pd.read_csv(filename, index_col=None, header=0)
        air_list.append(df)
    #creating the concatenated dataframe
    air_df = pd.concat(air_list, axis=0, ignore_index=True)


    # there is the need to aggregate the data by state and year
    # The output is the average number of days that were over the law limits per parameter of interest (i.e. PMx)
    # The average median and maximum API per state in a year is evaluated as well.
    aggregate_air_df = air_df.groupby(by=['State','Year']).mean()
    air_df = aggregate_air_df.reset_index()

    #dropping not useful column 
    columns_to_drop = ['Days with AQI',\
                    'Good Days',\
                    'Moderate Days',\
                    'Unhealthy for Sensitive Groups Days',\
                    'Unhealthy Days',\
                    'Very Unhealthy Days',\
                    'Hazardous Days',\
                    '90th Percentile AQI',\
                    'Days CO',\
                    'Days NO2',\
                    'Days SO2',]
    air_df=air_df.drop(columns=columns_to_drop)

    #converting the number of days in integers because as float they do not make too much sense
    for column in air_df.columns:
        if air_df[column].dtype == float:
            air_df[column]= air_df[column].astype('int64')

    #removing the point from the key for handling the dataset in MongoDb without issues
    air_df=air_df.rename(columns={"Days PM2.5": "Days PM2_5"})

    # adding collection about asthma to MongoDB
    add_collection_to_mongo('air',air_df)


    #closing the connections to sqlite and MongoDB
    mongo_client.close()
    return(print('Data successfully imported!'))

if __name__ == "__main__":
    Get_Data()