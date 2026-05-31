import { promises as fs } from "fs";
import path from "path";

const INPUT_JSON_FILE = "active_hotels.json";
const OUTPUT_DIR = "agoda_reviews";
const REVIEWS_LIMIT = 50;
const FETCH_DELAY_MS = 3000;
const MAX_FETCH_PAGES = 14;

const fetchOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "xxx",
    "x-rapidapi-host": "xxx",
  },
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchReviewPage(propertyId, page) {
  const url = `https://xxx.com/hotels/reviews?propertyId=${propertyId}&limit=${REVIEWS_LIMIT}&page=${page}`;
  console.log(`   Fetching page ${page} for property ${propertyId}...`);

  try {
    const response = await fetch(url, fetchOptions);
    if (response.ok) {
      const result = await response.json();
      // Successfully fetched and parsed, return the comments.
      return result?.data?.comments || [];
    }
    // If the response was not ok (e.g., 404, 500), log the error and return an empty array.
    console.error(
      `   ERROR: Received status ${response.status} for property ${propertyId} on page ${page}.`
    );
    if (response.status === 403) {
      throw Error("Empty API key", { cause: 403 });
    }
    return [];
  } catch (error) {
    console.error(
      `   FATAL: Network or parsing error for property ${propertyId} on page ${page}:`,
      error.message
    );
    if (error.message === "Empty API key") throw error;
    return [];
  }
}

async function fetchAllReviewsForProperty(propertyId) {
  let allReviews = [];
  let currentPage = 1;
  let keepFetching = true;

  while (keepFetching && currentPage <= MAX_FETCH_PAGES) {
    try {
      const reviewsFromPage = await fetchReviewPage(propertyId, currentPage);
      if (reviewsFromPage.length > 0) {
        allReviews = allReviews.concat(reviewsFromPage);
      }

      if (reviewsFromPage.length < REVIEWS_LIMIT) {
        keepFetching = false;
      } else {
        currentPage++;
      }
    } catch (error) {
      console.error("API Key habis");
      break;
    }
  }
  if (currentPage > MAX_FETCH_PAGES) {
    console.log(
      `   -> Reached fetch limit of ${MAX_FETCH_PAGES} pages for property ${propertyId}.`
    );
  }
  return allReviews;
}

async function main() {
  console.log("Starting review fetching process...");

  try {
    const fileContent = await fs.readFile(INPUT_JSON_FILE, "utf8");
    const locationsData = JSON.parse(fileContent);

    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`Output directory '${OUTPUT_DIR}' is ready.`);
    for (const locationKey in locationsData) {
      if (locationKey === "cumulativeAll") continue;

      console.log(`\nProcessing location: ${locationKey}`);
      const locationPath = path.join(OUTPUT_DIR, locationKey);
      await fs.mkdir(locationPath, { recursive: true });

      const categories = locationsData[locationKey];

      for (const categoryKey in categories) {
        const propertyIds = categories[categoryKey].id || [];
        console.log(
          ` -> Found ${propertyIds.length} properties in category '${categoryKey}'`
        );

        for (const propertyId of propertyIds) {
          const allReviews = await fetchAllReviewsForProperty(propertyId);
          console.log(
            ` -> Fetched a total of ${allReviews.length} reviews for property ${propertyId}.`
          );

          if (allReviews.length > 0) {
            const outputFilePath = path.join(
              locationPath,
              `${propertyId}.json`
            );
            const fileData = { reviews: allReviews };

            await fs.writeFile(
              outputFilePath,
              JSON.stringify(fileData, null, 4)
            );
            console.log(` -> Successfully saved reviews to ${outputFilePath}`);
          } else {
            console.log(
              ` -> No reviews found or an error occurred for property ${propertyId}. Skipping file creation.`
            );
          }
          await sleep(FETCH_DELAY_MS);
        }
      }
    }
    console.log("\nProcess finished successfully!");
  } catch (error) {
    console.error("\nAn unexpected error occurred during the process:", error);
  }
}

main();
