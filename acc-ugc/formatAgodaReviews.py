import os
import json
import pandas as pd
from googletrans import Translator, LANGUAGES

def create_id_lookup(ids_filepath):
    """
    Reads the ids.json file and creates a simple lookup dictionary
    that maps each location ID to its tier ('low' or 'high').
    """
    id_to_tier_map = {}
    try:
        with open(ids_filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for location_key, tiers in data.items():
            if not isinstance(tiers, dict):
                continue # Skip this item if it's not a dictionary.

            if 'low' in tiers and isinstance(tiers.get('low'), dict) and 'id' in tiers['low']:
                for location_id in tiers['low']['id']:
                    id_to_tier_map[location_id] = 'low'
            
            if 'high' in tiers and isinstance(tiers.get('high'), dict) and 'id' in tiers['high']:
                for location_id in tiers['high']['id']:
                    id_to_tier_map[location_id] = 'high'
                    
    except FileNotFoundError:
        print(f"Error: The file {ids_filepath} was not found.")
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {ids_filepath}.")
        
    return id_to_tier_map

def process_reviews_to_excel(main_folder, ids_filepath, output_filepath):
    """
    Walks through a directory of review files, processes them, and
    saves the consolidated data to an Excel file.
    """
    id_tier_map = create_id_lookup(ids_filepath)
    if not id_tier_map:
        print("Could not create ID map. Aborting.")
        return
    translator = Translator()
    all_reviews_data = []

    for location_folder in os.listdir(main_folder):
        location_path = os.path.join(main_folder, location_folder)
        
        if os.path.isdir(location_path):
            print(f"  Processing location: {location_folder}")
            for filename in os.listdir(location_path):
                if filename.endswith('.json'):
                    file_path = os.path.join(location_path, filename)
                    
                    location_id = os.path.splitext(filename)[0]
                    
                    tier = id_tier_map.get(location_id, 'unknown') # Default to 'unknown' if not found

                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                        for review in data.get('reviews', []):
                            review_detail = review.get('reviewDetail', {})
                            rating_info = review.get('rating', {})
                            
                            review_date = review_detail.get('date')
                            year = None
                            if review_date and isinstance(review_date, str):
                                try:
                                    year = review_date.split('-')[0]
                                except IndexError:
                                    year = 'N/A'
                            
                            comment = review_detail.get('comment')
                            languageId = review_detail.get('languageId')
                            original_comment = review_detail.get('originalComment')
                            if languageId == 26 and len(original_comment) < 2:
                                try:
                                    print('--')
                                    translation_result = translator.translate(comment, src='id', dest='en')
                                    comment = translation_result.text
                                except Exception as e:
                                      print(f"    - Could not translate comment for review ID {review.get('id')}: {e}")
                            
                            all_reviews_data.append({
                                'id': review.get('id'),
                                'date': review_date,
                                'year': year,
                                'title': review_detail.get('title'),
                                'comment': comment,
                                'originalComment': review_detail.get('originalComment'),
                                'languageId': review_detail.get('languageId'),
                                'rating': rating_info.get('score'),
                                'tier': tier,
                                'location': location_folder # Add the folder name as the location
                            })
                    except (json.JSONDecodeError, FileNotFoundError) as e:
                        print(f"    Could not process file {file_path}: {e}")

    if not all_reviews_data:
        print("No review data was found. The output file will not be created.")
        return
        
    print("Creating DataFrame...")
    df = pd.DataFrame(all_reviews_data)
    
    df = df[['id', 'date', 'year', 'title', 'comment', 'originalComment','languageId', 'rating', 'tier', 'location']]

    try:
        print(f"Saving data to '{output_filepath}'...")
        df.to_excel(output_filepath, index=False, engine='openpyxl')
        print("Done! The Excel file has been created successfully.")
    except Exception as e:
        print(f"An error occurred while saving the Excel file: {e}")


MAIN_DATA_FOLDER = 'hotel_reviews' 
IDS_JSON_FILE = 'all_hotels_ids.JSON'
OUTPUT_EXCEL_FILE = 'ori_hotel_reviews.xlsx'


if __name__ == "__main__":
    if not os.path.isdir(MAIN_DATA_FOLDER):
        print(f"Error: The main data folder '{MAIN_DATA_FOLDER}' does not exist.")
        print("Please create a folder named 'A' and place your location folders inside it,")
        print("or update the 'MAIN_DATA_FOLDER' variable in the script.")
    else:
        process_reviews_to_excel(MAIN_DATA_FOLDER, IDS_JSON_FILE, OUTPUT_EXCEL_FILE)
