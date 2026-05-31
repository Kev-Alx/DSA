import pandas as pd
import json

def merge_comments_with_topics(topic_data_path, comments_excel_path, output_csv_path):
    """
    Merges topic proportion data with the original comments from an Excel file.
    """
    try:
        topic_data = pd.read_csv(topic_data_path)
        
        comments_data = pd.read_excel(comments_excel_path, usecols=['id', 'comment'])
        
        merged_df = pd.merge(topic_data, comments_data, on='id', how='left')
        
        merged_df.to_csv(output_csv_path, index=False)
        
        print(f"Successfully merged data and saved to: {output_csv_path}")
        print("\nHead of merged data:")
        print(merged_df.head())
        
        return merged_df

    except FileNotFoundError as e:
        print(f"Error: File not found. {e}")
        print("Please make sure you ran the R script first to generate the CSV file.")
        return None
    except KeyError as e:
        print(f"Error: Column not found. Make sure 'id' and 'comment' columns exist. {e}")
        print(e)
        return None
    except Exception as e:
        print(f"An error occurred during merging: {e}")
        return None

def get_top_comments_for_topics(merged_df, num_topics, top_n=30):
    """
    Finds the top N comments for each topic based on the highest proportion,
    ensuring each comment ID appears only once across all topics.
    """
    if merged_df is None:
        print("Cannot get top comments, the merged DataFrame is empty.")
        return None
        
    topic_columns = [f"Topic{i+1}" for i in range(num_topics)]
    
    if not all(col in merged_df.columns for col in topic_columns):
        print("Error: Not all topic columns were found in the DataFrame.")
        return None

    top_comments_all_topics = {}
    used_ids = set()  # To track IDs already chosen in other topics

    print(f"\nFinding top {top_n} unique comments for {num_topics} topics...")

    for topic in topic_columns:
        sorted_df = merged_df.sort_values(by=topic, ascending=False)
        
        filtered_df = sorted_df[~sorted_df['id'].isin(used_ids)]
        
        top_n_df = filtered_df.head(top_n)[['id', 'comment', topic]]
        
        used_ids.update(top_n_df['id'].tolist())
        
        top_comments_all_topics[topic] = top_n_df.to_dict('records')

    print("✅ Successfully extracted unique top comments for all topics.")
    
    return top_comments_all_topics

if __name__ == "__main__":
    
    K = 20  # Number of topics
    
    TOPIC_DATA_CSV = "outputs/WIDWLALL2WS_GBT_td_K20.csv" 
    
    ORIGINAL_DATA_XLSX = "outputs/no_unk_processed_STM_ALL.xlsx"
    
    MERGED_DATA_OUTPUT_CSV = f"merged_topics_with_comments_K{K}.csv"
    TOP_COMMENTS_OUTPUT_JSON = f"top_comments_per_topic_K{K}.json"

    merged_dataframe = merge_comments_with_topics(
        topic_data_path=TOPIC_DATA_CSV,
        comments_excel_path=ORIGINAL_DATA_XLSX,
        output_csv_path=MERGED_DATA_OUTPUT_CSV
    )

    if merged_dataframe is not None:
        top_comments = get_top_comments_for_topics(
            merged_df=merged_dataframe,
            num_topics=K,
            top_n=30
        )
        
        if top_comments:
            try:
                with open(TOP_COMMENTS_OUTPUT_JSON, 'w', encoding='utf-8') as f:
                    json.dump(top_comments, f, indent=4, ensure_ascii=False)
                print(f"Successfully saved all top comments to: {TOP_COMMENTS_OUTPUT_JSON}")
            except Exception as e:
                print(f"Error saving JSON file: {e}")

            for i in range(1, 3): # Show sample for first 2 topics
                topic_name = f"Topic{i}"
                print(f"\nTop 3 comments for {topic_name}:")
                if topic_name in top_comments:
                    for j, entry in enumerate(top_comments[topic_name][:3]):
                        print(f"  Rank {j+1} (ID: {entry['id']}, Proportion: {entry[topic_name]:.4f}):")
                        print(f"    Comment: {entry['comment'][:150]}...")
                else:
                    print(f"  No data found for {topic_name}.")