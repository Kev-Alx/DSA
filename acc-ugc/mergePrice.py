import pandas as pd
import os
import re

def merge_and_impute():
    file_a_path = r'outputs/no_unk_processed_STM_ALL.xlsx'
    file_b_path = 'reviews_enriched_final.csv'
    output_path = 'price_merge_imputed.xlsx'
    
    group_cols = ['segment', 'location'] 

    if not os.path.exists(file_a_path) or not os.path.exists(file_b_path):
        print("Error: Files not found.")
        return

    try:
        print("Reading files...")
        df_a = pd.read_excel(file_a_path)
        df_b = pd.read_csv(file_b_path)

        df_a.columns = df_a.columns.str.strip().str.lower()
        df_b.columns = df_b.columns.str.strip().str.lower()

        for col in group_cols:
            if col not in df_a.columns:
                print(f"Error: Grouping column '{col}' not found in File A.")
                print(f"Available columns: {list(df_a.columns)}")
                return

        def clean_id(val):
            val = str(val).strip()
            return re.sub(r'\.0$', '', val)

        df_a['id'] = df_a['id'].apply(clean_id)
        df_b['id'] = df_b['id'].apply(clean_id)

        if 'price' in df_b.columns:
            df_b['price'] = df_b['price'].astype(str).str.replace(r'[$,]', '', regex=True)
            df_b['price'] = pd.to_numeric(df_b['price'], errors='coerce')
        else:
            print("Error: 'price' column not found in CSV.")
            return

        merged_df = pd.merge(df_a, df_b[['id', 'price']], on='id', how='left')

        missing_before = merged_df['price'].isna().sum()
        print(f"Missing prices before fill: {missing_before}")

        print(f"Filling missing prices using median of: {group_cols}...")
        
        merged_df['price'] = merged_df['price'].fillna(
            merged_df.groupby(group_cols)['price'].transform('median')
        )

        remaining_missing = merged_df['price'].isna().sum()
        if remaining_missing > 0:
            print(f"{remaining_missing} rows still empty (group had no data). Filling with global median.")
            global_median = merged_df['price'].median()
            merged_df['price'] = merged_df['price'].fillna(global_median)

        print(f"Saving to {output_path}...")
        merged_df.to_excel(output_path, index=False)
        print("Done.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    merge_and_impute()
    