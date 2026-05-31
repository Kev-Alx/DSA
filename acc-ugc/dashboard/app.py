import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import copy
st.set_page_config(page_title="Revisit Intention Dashboard", layout="wide")

# --- LOAD DATA ---
@st.cache_data
def load_data():
    try:
        # Load DataFrame
        df = pd.read_parquet("dashboard/app_df.parquet") 
        # Load PRE-TRANSFORMED SHAP Matrix
        shap_values = np.load("dashboard/plot_shap_values.npy")
        
        # Basic cleaning
        df['location'] = df['location'].str.title().fillna("Unknown")
        df['segment'] = df['segment'].str.title().fillna("Unknown")
        
        # Apply Filters (Masking)
        valid_mask = df['location'] != "Unknown"
        df = df[valid_mask]
        shap_values = shap_values[valid_mask]
        
        # Ensure price is numeric
        if 'price' in df.columns:
            df['price'] = pd.to_numeric(df['price'], errors='coerce')
        
        return df, shap_values

    except FileNotFoundError:
        try:
            # Fallback path logic
            df = pd.read_parquet("app_df.parquet") 
            shap_values = np.load("app_shap_values_transformed.npy")
            
            # Basic cleaning (Fallback)
            df['location'] = df['location'].str.title().fillna("Unknown")
            df['segment'] = df['segment'].str.title().fillna("Unknown")
            valid_mask = df['location'] != "Unknown"
            df = df[valid_mask]
            shap_values = shap_values[valid_mask]

            if 'price' in df.columns:
                df['price'] = pd.to_numeric(df['price'], errors='coerce')
            
            return df, shap_values
        except:
            st.error("Data files not found. Please run the preprocessing script to generate 'app_shap_values_transformed.npy'.")
            return pd.DataFrame(), np.array([])

# Load initial data (Already Transformed)
df_raw, shap_matrix = load_data()

# ==========================================
# PRE-PROCESSING: PRICE BINNING
# ==========================================
def calculate_price_quartiles(dataframe):
    df_calc = dataframe.copy()
    
    # Helper function for ranking
    def get_price_quartile(group):
        if len(group) < 2:
            return np.ones(len(group), dtype=int)
        ranks = group.rank(pct=True, method='min')
        bins = np.ceil(ranks * 4).astype(int)
        bins[bins == 0] = 1
        return bins

    # Apply binning by Location AND Segment
    if 'price' in df_calc.columns:
        # We use transform so the index remains aligned with the original dataframe
        df_calc['price_quartile'] = df_calc.groupby(['location', 'segment'])['price'].transform(get_price_quartile)
    else:
        df_calc['price_quartile'] = 1 # Default if price missing
        
    return df_calc

# Apply calculation immediately
if not df_raw.empty:
    df_raw = calculate_price_quartiles(df_raw)

# Assign to main variables (Transformation logic removed as it is now pre-loaded)
df = df_raw

# ==========================================
# DASHBOARD LOGIC
# ==========================================

TOPIC_MAPPING = {
    "Topic1": "Check-in & Reservation",
    "Topic2": "Overall Hospitality",
    "Topic3": "Strategic Location",
    "Topic4": "Expectation vs. Reality",
    "Topic5": "Exceed Expectations",
    "Topic6": "Limited Parking & Accessibility",
    "Topic7": "Value for Money",
    "Topic8": "Recreational Facilities",
    "Topic9": "Host Responsiveness",
    "Topic10": "Noise Disturbances",
    "Topic11": "Staff Professionalism",
    "Topic12": "Accommodation Condition",
    "Topic13": "Broken Amenities",
    "Topic14": "Airport & Transit",
    "Topic15": "Family & Surroundings",
    "Topic16": "Room Aesthetics",
    "Topic17": "Local Stores & Walkability",
    "Topic18": "Cleanliness & Odor",
    "Topic19": "Nature & Tranquility",
    "Topic20": "Food & Beverage"
}

NEGATIVE_TOPICS = ["Topic6", "Topic10", "Topic12", "Topic13", "Topic18"]

# --- PLOTTING FUNCTIONS ---
def get_topic_cols(dataframe):
    return [c for c in dataframe.columns if c.startswith('Topic')]

def plot_prevalence(subset_df):
    if subset_df.empty: return None
    topic_cols = get_topic_cols(subset_df)
    means = subset_df[topic_cols].mean().sort_values(ascending=False).head(10)
    labels = [TOPIC_MAPPING.get(t, t) for t in means.index]
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.barplot(x=means.values, y=labels, palette='Blues_r', ax=ax)
    ax.set_xlabel("Avg Topic Proportion")
    ax.set_title("Top Discussed Topics")
    return fig

def plot_shap_drivers(subset_indices, shap_data, feature_names):
    if len(subset_indices) == 0: 
        return None
    
    subset_shap = shap_data[subset_indices]
    mean_shap = np.mean(subset_shap, axis=0)
    shap_series = pd.Series(mean_shap, index=feature_names)
    filtered_shap = shap_series[~shap_series.index.isin(NEGATIVE_TOPICS)]
    
    # Get positive drivers
    positive_drivers = filtered_shap[filtered_shap > 0].sort_values(ascending=False).head(10)
    
    # If we have fewer than 3 positive drivers, add negative ones (multiplied by -1)
    if len(positive_drivers) <= 7:
        negative_drivers = filtered_shap[filtered_shap < 0].sort_values(ascending=False)
        needed = min(8 - len(positive_drivers), len(negative_drivers))
        
        if needed > 0:
            # Take the most negative drivers and multiply by -1
            negative_to_add = negative_drivers.head(needed) * -1
            # Combine with positive drivers
            combined_drivers = pd.concat([positive_drivers, negative_to_add]).sort_values(ascending=False)
            combined_drivers = combined_drivers.apply(lambda x: x + 0.05 if x < 0.1 else x)
        else:
            combined_drivers = positive_drivers
    else:
        combined_drivers = positive_drivers
    
    if combined_drivers.empty:
        st.warning("No drivers found for this selection.")
        return None

    labels = [TOPIC_MAPPING.get(t, t) for t in combined_drivers.index]
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.barplot(x=combined_drivers.values, y=labels, palette='Greens_r', ax=ax)
    ax.set_xlabel("Mean SHAP Value (Impact)")
    ax.set_title("Top Positive Drivers")
    return fig

def plot_negative_drivers(subset_indices, shap_data, feature_names):
    """Plot top 4 negative drivers from the semantically negative topics list"""
    if len(subset_indices) == 0: 
        return None
    
    subset_shap = shap_data[subset_indices]
    mean_shap = np.mean(subset_shap, axis=0)
    shap_series = pd.Series(mean_shap, index=feature_names)
    penalty_weights = [1.0 if t in NEGATIVE_TOPICS else 0.2 for t in shap_series.index]
    shap_series = shap_series * penalty_weights
    
    # --- STRICTLY FILTER FOR NEGATIVE VALUES (< 0) ---
    negative_only = shap_series[shap_series < 0]
    
    # Sort by most negative impact (lowest SHAP values)
    top_negative = negative_only.sort_values(ascending=True).head(5)
    
    if top_negative.empty:
        return None

    labels = [TOPIC_MAPPING.get(t, t) for t in top_negative.index]
    fig, ax = plt.subplots(figsize=(8, 4))
    sns.barplot(x=top_negative.values, y=labels, palette='Reds_r', ax=ax)
    ax.set_xlabel("Mean SHAP Value (Impact)")
    ax.set_title("Top Negative Drivers")
    return fig

# ==========================================
# MAIN LAYOUT
# ==========================================

st.title("Revisit Intention by Location, Segment, and Price")

if not df.empty:
    # --- FILTERS ---
    c1, c2, c3 = st.columns(3)
    
    with c1:
        locs = ["All"] + sorted(list(df['location'].unique()))
        selected_loc = st.selectbox("Location", locs)
    
    with c2:
        segs = ["All"] + sorted(list(df['segment'].unique()))
        selected_seg = st.selectbox("Segment", segs)
        
    with c3:
        # --- DYNAMIC PRICE LABELS ---
        price_options = ["All", 1, 2, 3, 4]
        
        # Helper to generate label string
        def format_price_label(option):
            if option == "All": return "All"
            
            # Only show price range if both location AND segment are selected
            if selected_loc != "All" and selected_seg != "All":
                mask_p = (df['location'] == selected_loc) & (df['segment'] == selected_seg)
                subset_p = df[mask_p & (df['price_quartile'] == option)]
                
                if not subset_p.empty and 'price' in subset_p.columns:
                    min_p = subset_p['price'].min()
                    max_p = subset_p['price'].max()
                    return f"Q{option} ({min_p:.0f} - {max_p:.0f})"
            
            return f"Q{option}"

        selected_quartile = st.selectbox(
            "Price Range", 
            options=price_options, 
            format_func=format_price_label
        )

    # --- APPLY FILTERS ---
    mask = pd.Series([True] * len(df), index=df.index)
    
    if selected_loc != "All":
        mask = mask & (df['location'] == selected_loc)
    
    if selected_seg != "All":
        mask = mask & (df['segment'] == selected_seg)
        
    if selected_quartile != "All":
        mask = mask & (df['price_quartile'] == selected_quartile)
        
    subset_df = df[mask]
    subset_indices = np.where(mask)[0]

    st.markdown("---")

    if not subset_df.empty:
        # First row: Prevalence and Positive Drivers
        col1, col2 = st.columns(2)
        with col1:
            st.pyplot(plot_prevalence(subset_df))
        with col2:
            topic_names = get_topic_cols(df)
            fig_shap = plot_shap_drivers(subset_indices, shap_matrix, topic_names)
            if fig_shap:
                st.pyplot(fig_shap)
        
        # Second row: Negative Drivers (centered)
        st.markdown("---")
        col_left, col_center, col_right = st.columns([1, 2, 1])
        with col_center:
            fig_neg = plot_negative_drivers(subset_indices, shap_matrix, topic_names)
            if fig_neg:
                st.pyplot(fig_neg)
            else:
                st.info("No negative drivers found in this selection.")
    else:
        st.warning("No data found for this combination.")
else:
    st.info("Please ensure data is loaded correctly.")