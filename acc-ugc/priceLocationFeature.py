import pandas as pd
import json
import os
import glob
import numpy as np

csv_file_path = r'outputs\WIDWLALL2WS_GBT_td_K20.csv'
agoda_listings_path = 'agoda'
agoda_reviews_path = 'hotel_reviews'
airbnb_listings_path = 'airbnb'
airbnb_reviews_path = 'listing_reviews'
output_filename = 'reviews_enriched_final.csv'

def clean_id(id_val):
    """Convert scientific notation and extract first 12 digits"""
    id_str = str(id_val).strip()
    
    if 'e+' in id_str.lower() or 'e-' in id_str.lower():
        try:
            id_str = str(int(float(id_str)))
        except:
            pass
    
    if '.' in id_str:
        id_str = id_str.split('.')[0]
    
    id_str = ''.join(c for c in id_str if c.isdigit())
    
    if len(id_str) > 12:
        return id_str[:12]
    return id_str

def normalize_city_name(city):
    """Normalize city names according to mapping rules"""
    city = city.lower().strip()
    mappings = {
        'trawas': 'batu',
        'nusadua': 'bali'
    }
    return mappings.get(city, city)

def extract_city_from_path(filepath, base_path):
    """
    Extract city name from file path more reliably.
    Returns (city_name, structure_type) where structure_type is 'long', 'short', or 'flat'
    """
    norm_path = os.path.normpath(filepath)
    rel_path = os.path.relpath(norm_path, base_path)
    path_parts = rel_path.split(os.sep)
    
    # Case 1: base_path/CITY/long/file.json or base_path/CITY/short/file.json
    if len(path_parts) == 3:
        city_folder = path_parts[0]
        structure_type = path_parts[1]  # 'long' or 'short'
        if structure_type in ['long', 'short']:
            return normalize_city_name(city_folder), structure_type
    
    # Case 2: base_path/CITY/file.json (flat structure)
    if len(path_parts) == 2:
        city_folder = path_parts[0]
        return normalize_city_name(city_folder), 'flat'
    
    return None, None

print(f"Loading CSV from {csv_file_path}...")
try:
    df = pd.read_csv(csv_file_path, dtype={'id': str, 'segment': str})
    df['id'] = df['id'].str.strip()
    df['segment'] = df['segment'].str.strip()
    print(f"Loaded {len(df)} rows.")
    print(f"Sample IDs from CSV (first 5):")
    for idx, row in df.head().iterrows():
        print(f"  Original: {row['id']} -> Cleaned: {clean_id(row['id'])}")
except FileNotFoundError:
    print("Error: CSV file not found.")
    exit()

property_database = {}
review_to_property_map = {}

# --- 1. Load Airbnb Listings (Prices) ---
print("\n=== Loading Airbnb Listings ===")
airbnb_files = glob.glob(os.path.join(airbnb_listings_path, '*', 'listing*.json'))
print(f"Found {len(airbnb_files)} Airbnb listing files")

for filepath in airbnb_files:
    city_name, _ = extract_city_from_path(filepath, airbnb_listings_path)
    
    if not city_name:
        print(f"WARNING: Could not extract city from {filepath}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            stays_search = data.get('data', {}).get('presentation', {}).get('staysSearch', {})
            results_container = stays_search.get('results', [])
            
            actual_results_list = []
            if isinstance(results_container, list):
                actual_results_list = results_container
            elif isinstance(results_container, dict):
                if 'searchResults' in results_container:
                    actual_results_list = results_container['searchResults']
                elif 'results' in results_container:
                    actual_results_list = results_container['results']
                else:
                    actual_results_list = stays_search.get('searchResults', [])
            
            for result in actual_results_list:
                if not isinstance(result, dict):
                    continue
                if result.get('__typename') == 'StaySearchResult':
                    listing = result.get('listing', {})
                    p_id = str(listing.get('id'))
                    
                    price_val = None
                    try:
                        price_str = result.get('pricingQuote', {}) \
                            .get('structuredStayDisplayPrice', {}) \
                            .get('primaryLine', {}) \
                            .get('price')
                        if price_str:
                            clean_str = ''.join(c for c in str(price_str) if c.isdigit() or c == '.')
                            if clean_str:
                                price_val = float(clean_str)
                    except:
                        pass
                    
                    if p_id:
                        property_database[p_id] = {'price': price_val, 'location': city_name}
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

print(f"Loaded {len(property_database)} Airbnb properties")

# --- 2. Load Airbnb Reviews (Map Review ID -> Property ID) ---
print("\n=== Loading Airbnb Reviews ===")
airbnb_review_files = glob.glob(os.path.join(airbnb_reviews_path, '*', '*', '*.json'))
airbnb_review_files += glob.glob(os.path.join(airbnb_reviews_path, '*', '*.json'))
airbnb_review_files = list(set(airbnb_review_files))

print(f"Found {len(airbnb_review_files)} Airbnb review files")

review_file_count = 0
review_count = 0

for filepath in airbnb_review_files:
    city_name, structure_type = extract_city_from_path(filepath, airbnb_reviews_path)
    
    if not city_name:
        print(f"WARNING: Could not extract city from {filepath}")
        continue
    
    listing_id_from_file = os.path.splitext(os.path.basename(filepath))[0]
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            reviews = data.get('reviews', []) if isinstance(data, dict) else data
            
            if isinstance(reviews, list):
                review_file_count += 1
                for rev in reviews:
                    r_id = str(rev.get('id')).strip()
                    r_id_cleaned = clean_id(r_id)
                    
                    if r_id_cleaned:
                        review_count += 1
                        # Store multiple mappings for different ID formats
                        review_to_property_map[r_id_cleaned] = listing_id_from_file
                        if len(r_id_cleaned) >= 12:
                            review_to_property_map[r_id_cleaned[:12]] = listing_id_from_file
                        
                        if review_count <= 5:
                            print(f"  Review ID: {r_id} -> Cleaned: {r_id_cleaned} -> Property: {listing_id_from_file} -> City: {city_name}")
                
                # Update property database
                if listing_id_from_file not in property_database:
                    property_database[listing_id_from_file] = {'price': None, 'location': city_name}
                elif property_database[listing_id_from_file]['location'] is None:
                    property_database[listing_id_from_file]['location'] = city_name
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

print(f"Processed {review_file_count} review files with {review_count} total reviews")
print(f"Created {len(review_to_property_map)} review-to-property mappings")

# --- 3. Load Agoda Listings (Prices) ---
print("\n=== Loading Agoda Listings ===")
agoda_files = glob.glob(os.path.join(agoda_listings_path, '*', 'listing*.json'))
print(f"Found {len(agoda_files)} Agoda listing files")

for filepath in agoda_files:
    city_name, _ = extract_city_from_path(filepath, agoda_listings_path)
    
    if not city_name:
        print(f"WARNING: Could not extract city from {filepath}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            for prop in json.load(f).get('data', {}).get('properties', []):
                p_id = str(prop.get('propertyId'))
                price = None
                try:
                    price_raw = prop['pricing']['offers'][0]['roomOffers'][0]['room']['pricing'][0]['price']['perNight']['inclusive']['display']
                    if price_raw:
                        price = float(price_raw)
                except:
                    pass
                
                if p_id:
                    property_database[p_id] = {'price': price, 'location': city_name}
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

# --- 4. Load Agoda Reviews (Map Review ID -> Property ID) ---
print("\n=== Loading Agoda Reviews ===")
agoda_review_files = glob.glob(os.path.join(agoda_reviews_path, '*_hotels', '*.json'))
print(f"Found {len(agoda_review_files)} Agoda review files")

for filepath in agoda_review_files:
    hotel_id = os.path.splitext(os.path.basename(filepath))[0]
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            for rev in json.load(f).get('reviews', []):
                r_id = str(rev.get('id')).strip()
                r_id_cleaned = clean_id(r_id)
                if r_id_cleaned:
                    review_to_property_map[r_id_cleaned] = hotel_id
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

if 'price' not in df.columns:
    df['price'] = None
if 'location' not in df.columns:
    df['location'] = None

def enrich_row(row):
    segment = str(row['segment'])
    review_id = clean_id(row['id'])
    
    is_airbnb = segment in ['entire', 'private']
    is_agoda = segment in ['high', 'low']
    
    prop_id = review_to_property_map.get(review_id)
    
    if prop_id:
        details = property_database.get(prop_id)
        if details:
            return pd.Series([details['price'], details['location']])
    
    return pd.Series([None, None])

print("\n=== Enriching rows ===")
df[['price', 'location']] = df.apply(enrich_row, axis=1)

# Check match rate
matched_count = df['location'].notna().sum()
total_count = len(df)
match_rate = (matched_count / total_count) * 100

print(f"\nMatch Statistics:")
print(f"  Total reviews: {total_count}")
print(f"  Matched: {matched_count} ({match_rate:.1f}%)")
print(f"  Unmatched: {total_count - matched_count} ({100-match_rate:.1f}%)")

df['price'] = pd.to_numeric(df['price'], errors='coerce')

# Fill missing prices with median by location+segment
median_prices = df.groupby(['location', 'segment'])['price'].transform('median')
df['price'] = df['price'].fillna(median_prices)

# Fill remaining missing prices with global median
global_median = df['price'].median()
df['price'] = df['price'].fillna(global_median)

# --- VALIDATION CHECK ---
nan_locations = df['location'].isna().sum()
nan_prices = df['price'].isna().sum()

if nan_locations > 0:
    print("\n--- DEBUG: Rows with Missing Location (First 20) ---")
    missing_loc_df = df[df['location'].isna()]
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', 1000)
    
    print("\nShowing original ID, cleaned ID, and segment:")
    for idx, row in missing_loc_df.head(20).iterrows():
        print(f"  Original ID: {row['id']} | Cleaned: {clean_id(row['id'])} | Segment: {row['segment']}")
    
    print("\n" + "="*80)
    print("Checking if these IDs exist in review_to_property_map:")
    for idx, row in missing_loc_df.head(10).iterrows():
        cleaned = clean_id(row['id'])
        exists = cleaned in review_to_property_map
        prop = review_to_property_map.get(cleaned, 'NOT FOUND')
        print(f"  {cleaned}: {'FOUND' if exists else 'MISSING'} -> {prop}")
    print("="*80 + "\n")


if nan_locations > 0:
    print(f"\n⚠ WARNING: Removing {nan_locations} rows with missing locations")
    df = df[df['location'].notna()]
    print(f"Remaining rows: {len(df)}")

if nan_prices > 0:
    print(f"\n⚠ WARNING: {nan_prices} rows still have missing prices after filling")

df.to_csv(output_filename, index=False)
print(f"\n✓ Done! Saved to {output_filename}")
print(f"Total rows: {len(df)}")
print(f"Unique locations: {df['location'].nunique()}")
print(f"\nLocation distribution:")
print(df['location'].value_counts())