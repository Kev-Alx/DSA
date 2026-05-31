import os
import json
import pandas as pd

def create_listing_type_lookup(ids_filepath):
    """
    Reads the new ids.JSON file and creates a lookup dictionary that maps
    a listing ID to its type ('entire' or 'private').
    """
    id_to_type_map = {}
    try:
        with open(ids_filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for location_key, types in data.items():
            if not isinstance(types, dict):
                continue # Skip malformed entries like 'cumulativeAll'

            for type_key, details in types.items():
                category = 'unknown'
                if 'entire' in type_key:
                    category = 'entire'
                elif 'private' in type_key:
                    category = 'private'
                
                if category != 'unknown' and isinstance(details, dict) and 'id' in details:
                    for listing_id in details['id']:
                        id_to_type_map[listing_id] = category
                        
    except FileNotFoundError:
        print(f"Error: The file {ids_filepath} was not found.")
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {ids_filepath}.")
        
    return id_to_type_map

def process_reviews_to_excel(main_folder, ids_filepath, output_filepath):
    """
    Walks through a directory structure with 'long'/'short' subdirs,
    processes the new review format, and saves the data to an Excel file.
    """
    id_type_map = create_listing_type_lookup(ids_filepath)
    if not id_type_map:
        print("Could not create ID map. Aborting.")
        return

    all_reviews_data = []

    for location_folder in os.listdir(main_folder):
        location_path = os.path.join(main_folder, location_folder)
        
        if os.path.isdir(location_path):
            print(f"  Processing location: {location_folder}")
            for sub_dir in os.listdir(location_path):
                sub_dir_path = os.path.join(location_path, sub_dir)
                if os.path.isdir(sub_dir_path):
                    for filename in os.listdir(sub_dir_path):
                        if filename.endswith('.json'):
                            file_path = os.path.join(sub_dir_path, filename)
                            listing_id = os.path.splitext(filename)[0]
                            
                            listing_type = id_type_map.get(listing_id, 'unknown')

                            try:
                                with open(file_path, 'r', encoding='utf-8') as f:
                                    data = json.load(f)
                                
                                for review in data.get('reviews', []):
                                    created_at = review.get('createdAt')
                                    year = None
                                    if created_at and isinstance(created_at, str):
                                        try:
                                            year = created_at.split('T')[0].split('-')[0]
                                        except IndexError:
                                            year = 'N/A'
                                    
                                    localized_review_obj = review.get('localizedReview') or {}
                                    
                                    final_comment = localized_review_obj.get('comments', review.get('comments'))

                                    new_loca = 'bali_listings' if location_folder == 'nusadua_listings' else 'batu_listings' if location_folder == 'trawas_listings' else location_folder
                                    all_reviews_data.append({
                                        'id': review.get('id'),
                                        'date': created_at,
                                        'year': year,
                                        'comments': final_comment, # Use the prioritized comment
                                        'language': review.get('language'),
                                        'type': listing_type,
                                        'rating': review.get('rating'),
                                        'location': new_loca
                                    })
                            except (json.JSONDecodeError, FileNotFoundError) as e:
                                print(f"    Could not process file {file_path}: {e}")

    if not all_reviews_data:
        print("No review data was found. The output file will not be created.")
        return
        
    print("Creating DataFrame...")
    df = pd.DataFrame(all_reviews_data)
    
    df.rename(columns={'type': 'entire / private'}, inplace=True)

    df = df[['id', 'date', 'year', 'comments', 'language', 'entire / private', 'rating', 'location']]

    try:
        print(f"Saving data to '{output_filepath}'...")
        df.to_excel(output_filepath, index=False, engine='openpyxl')
        print("Done! The Excel file has been created successfully.")
    except Exception as e:
        print(f"An error occurred while saving the Excel file: {e}")


MAIN_DATA_FOLDER = 'listing_reviews' 
IDS_JSON_FILE = 'new_all_airbnb_ids.JSON'
OUTPUT_EXCEL_FILE = 'localized_new_p2p_reviews.xlsx'


if __name__ == "__main__":
    if not os.path.isdir(MAIN_DATA_FOLDER):
        print(f"Error: The main data folder '{MAIN_DATA_FOLDER}' does not exist.")
    else:
        process_reviews_to_excel(MAIN_DATA_FOLDER, IDS_JSON_FILE, OUTPUT_EXCEL_FILE)
