## Electronic Store eCommerce Purchase History Analysis

This report analyzes data from an electronic store's eCommerce platform. The dataset is sourced from the Open Customer Data Platform (CDP) project and covers an eight-month operational window from April 2020 to November 2020.

The initial dataset captured 2,633,521 total events representing many-to-many relations between products and users. After removing critical missing data, the final operational dataset comprises 2,186,014 complete transaction rows.

**Purpose:**
This report aims to analyze the eCommerce purchase history, category performance, and basket dynamics of the electronic store over an 8-month period (April – November 2020). To translate historical transaction behaviors into actionable eCommerce optimization strategies, enabling the executive team to make data-driven decisions on marketing spend and inventory depth.

### Northstar Metrics:

1. **Category Revenue Distribution** - Tracking the primary financial drivers across product lines.

2. **Order Volume and Unit Velocity** - Evaluating the total number of orders placed against total physical units sold to measure transaction frequency versus physical product movement.

3. **Basket Size Metrics** - Focusing on the average units per order metric to evaluate customer purchasing habits.

### Executive Summary:

Over the eight-month period from April to November 2020, the eCommerce platform demonstrated **highly concentrated sales** that are heavily reliant on two core product lines. **Electronics** dominated the revenue share at 43.7% (\$147.3M), followed by **Appliances** at 30.6% ($103.1M). Order volume and basket size metrics revealed a disconnect between revenue and transaction frequency: Appliances generated more total orders (~480k) and higher average units per order (1.26) compared to Electronics (~460k orders and 1.17 units per order). To optimize these dynamics, we must execute two primary actions: Maximize marketing spend and introduce aggressive checkout cross-selling in Electronics to improve its low 1.17 basket size, and implement bundled deals and premium product placements in Appliances to convert its high transaction frequency into stronger revenue yields.

![Category Revenue Visual](/sales/image_003.png)

**Key Takeaways:**

**Extreme Revenue Concentration:** The business is fundamentally reliant on just two categories, with Electronics and Appliances combining to generate over 74% of total revenue.

**Volume & Value Disconnect:** While Electronics is the undisputed revenue leader, Appliances actually drive a higher total order volume and larger average basket sizes.

### Data

The analysis is built on a highly structured dataset containing 2,186,014 fully complete rows out of the original 2.6M+ events.
| Column Name | Type | Description |
| ------------- | ---------- | ------------------------------------------------------- |
| `event_time` | `datetime` | Timestamp of when the event occurred. |
| `order_id` | `string` | Unique identifier for each order. |
| `product_id` | `string` | Unique identifier for each product. |
| `category_id` | `string` | Unique identifier for the product category. |
| `category_code` | `string` | Readable category and sub-category name (if available). |
| `brand` | `string` | Brand name (in lowercase, if available). |
| `price` | `float` | Product price at purchase time. |
| `user_id` | `string` | Unique identifier for the user. |

### Insights Deep-Dive

#### Products and Categories

![Category Revenue Visual](/sales/md-only-img/s1.png)

![Category Revenue Visual](/sales/image_013.png)

**\*Electronics** is the clear revenue leader, generating $147.3M over the operational window. This single category is responsible for **43.7%** of the total eCommerce revenue.

**Appliances** follow as the secondary pillar, contributing $103.1M, which represents **30.6%** of total revenue.

Combined, these two categories account for a massive **74%** of the platform's total revenue, indicating heavy reliance on these specific product lines.

Within the Electronics sector, major brands like **Samsung and Huawei** are prominent drivers, specifically moving volume in the tablet and audio/headphone sub-categories.

#### Purchase Time Analysis

|      Monthly Revenue & Order Volume      |       Orders Heatmap (Day × Hour)       |
| :--------------------------------------: | :-------------------------------------: |
| ![Monthly Revenue](/sales/image_007.png) | ![Orders Heatmap](/sales/image_008.png) |

**Extreme Volatility:** The platform recovered from a severe April low (**\$8M revenue**) to hit peak transaction volume in June (**~210k orders**) and peak revenue in August (**$53M**).

**Concerning Q4 Decline:** Sales consistently plummeted heading into the end of the year, dropping from $49M in September to just **\$12M in November**, requiring immediate investigation into funnel or inventory issues.

**Morning Shopping Habit:** Purchase activity is heavily concentrated in the morning, surging between **06:00 and 12:00** daily, with an absolute peak converting hour at **10:00 AM**.

**Evening Dormancy:** Order volumes drop off a cliff after **18:00** and remain effectively dormant overnight, proving this is a reliable daily morning behavior rather than an evening or weekend-driven activity.

#### Purchase Frequency Analysis

![Distribution of Purchase Frequency](/sales/image_011.png)

![When Do Repeat Customers Return?](/sales/image_006.png)

| Customer Category | Avg Days Between Orders | Median Days | Total Customers |
| :---------------- | :---------------------: | :---------: | :-------------: |
| **Recurrent**     |          39.2           |    21.0     |     38,796      |
| **Loyal**         |           3.8           |     1.0     |    2,061,729    |

A substantial portion of users still **drop off after their first purchase**, with **44.8%** one-time buyers. The transition from the first to the second order represents the sharpest decline in the customer lifecycle, with retention falling by more than half to around ~21%, making this the most critical window for onboarding and early retention interventions.

A large share of the customer base demonstrates strong **retention**, with **55.2%** of users returning for repeat purchases instead of dropping off after a single transaction.

Repeat purchasing behavior is highly compressed in time, as 74.8% of **repeat buyers make their second purchase within the same month** (median: 0 months). This pattern is reinforced by an extremely short purchase cycle among most users, with many transacting again within **~1 day**, while a smaller segment follows a longer cycle of around **~21 days**.

#### Basket Analysis

### Basket Analysis: Segments and Timing

|    Basket Analysis - Segment Overview     |           Avg Basket Value Heatmap            |
| :---------------------------------------: | :-------------------------------------------: |
| ![Segment Overview](/sales/image_009.png) | ![Basket Value Heatmap](/sales/image_010.png) |

**Key Basket Dynamics:**

The platform’s financial stability is **largely driven by** the core **“average” basket segment**, which accounts for 91.2% of all orders and **83.6%** of total revenue, with a consistent AOV of around $220.

A smaller segment of **large baskets** presents a disproportionate revenue opportunity, contributing **15.7% of total revenue** despite representing only **5.5% of orders**, supported by a significantly higher AOV of approximately $681.

Basket value also varies systematically across time, revealing an **inverse relationship between transaction volume and cart size**. **High-traffic morning periods** (06:00–12:00) tend to generate **lower-value purchases**, often falling below \$200, while **lower-volume evening and late-night periods** (18:00–00:00) consistently attract **higher-spending** customers, with average basket values rising to $350–$400, particularly on Friday evenings and late Sunday nights.

### Recommendations

#### Products and Categories

Electronics dominate revenue (**43.7%, $147.3M**), while Appliances lead in volume (~480k orders) but underperform in value.

**Actions:**

- Scale Electronics visibility for revenue stability
- Increase Appliance AOV via bundling, pricing, and cross-selling
- Expand into higher-AOV categories to reduce concentration risk

#### Purchase Time

Revenue drops sharply in Q4 (**\$49M → $12M**), while demand concentrates in mornings (peak ~10:00 AM) and higher-value purchases occur in evenings.

**Actions:**

- Strengthen Q4 inventory and campaign planning
- Allocate marketing: mornings for volume, evenings for high-value conversion
- Align staffing and operations with peak demand hours

#### Purchase Frequency

Fast repeat behavior (within **1–2 days**) contrasts with high one-time buyer share (**44.8%**), indicating a major drop-off after first purchase.

**Actions:**

- Trigger post-purchase campaigns within 24–48 hours
- Introduce second-purchase incentives to reduce early churn
- Develop loyalty or retention programs for repeat users

#### Order Basket

Large baskets drive disproportionate revenue (**15.7% from 5.5% of orders**), with higher spending concentrated in evening hours (**\$350–$400**).

**Actions:**

- Upsell to convert average baskets into larger transactions
- Launch premium campaigns during evening high-value periods
- Implement time-based promotions aligned with spending behavior

### Dashboard

![Dashboard Image](/sales/Dashboard-1.png)
[Electronic Store eCommerce Tableu Public Dashboard Link](https://public.tableau.com/views/ElectronicStoreeCommerceDashboard/Dashboard1?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link)
