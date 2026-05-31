const baseURL =
  "https://xxx/hotels/search-overnight?checkinDate=2025-08-12&checkoutDate=2025-08-15&limit=100&propertyType=34";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "xxx",
    "x-rapidapi-host": "xxx",
  },
};

import { promises as fs } from "fs";
import path from "path";

// Define the locations with their place_ids. Replace these with your actual IDs.
const locations = {
  jakarta: "1_8691",
  surabaya: "1_10779",
  malang: "1_5414",
  batu: "1_102505",
  medan: "1_21284",
  yogjakarta: "1_14018",
  semarang: "1_19359",
};

// const lastCursors = {
//   jakarta:
//     "eyJzZWN0aW9uX29mZnNldCI6MCwiaXRlbXNfb2Zmc2V0IjoxMjAsInZlcnNpb24iOjF9",
//   surabaya:
//     "ChIJfeyJzZWN0aW9uX29mZnNldCI6MCwiaXRlbXNfb2Zmc2V0IjoxMjAsInZlcnNpb24iOjF98QaOPj71y0RQL5S43Z6AgM",
//   malang:
//     "eyJzZWN0aW9uX29mZnNldCI6MCwiaXRlbXNfb2Zmc2V0IjoxMjAsInZlcnNpb24iOjF9",
//   batu: "eyJzZWN0aW9uX29mZnNldCI6MCwiaXRlbXNfb2Zmc2V0IjoxMjAsInZlcnNpb24iOjF9",
//   medan: "eyJzZWN0aW9uX29mZnNldCI6MCwiaXRlbXNfb2Zmc2V0IjoxMjAsInZlcnNpb24iOjF9",
//   yogjakarta:
//     "eyJzZWN0aW9uX29mZnNldCI6MCwiaXRlbXNfb2Zmc2V0IjoxMjAsInZlcnNpb24iOjF9",
//   semarang:
//     "eyJzZWN0aW9uX29mZnNldCI6MCwiaXRlbXNfb2Zmc2V0IjoxMjAsInZlcnNpb24iOjF9",
// };

async function fetchAndSaveListings(locationName, placeId) {
  const outputBaseDir = "agoda";

  const locationDir = path.join(outputBaseDir, locationName);
  try {
    await fs.mkdir(locationDir, { recursive: true });
    console.log(`Created directory: ${locationDir}`);
  } catch (err) {
    console.error(`Error creating directory ${locationDir}:`, err);
    return;
  }
  // return;
  // let nextPageCursor = lastCursors[locationName];
  let nextPageCursor = null;

  for (let i = 1; i <= 3; i++) {
    try {
      let url = `${baseURL}&id=${placeId}&page=${i}`;
      // if (nextPageCursor) {
      //   url += `&nextPageCursor=${nextPageCursor}`;
      // }

      console.log(`Fetching data for ${locationName}, page ${i}...`);
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const fileName = `listing${i}.json`;
      const filePath = path.join(locationDir, fileName);

      await fs.writeFile(filePath, JSON.stringify(result, null, 2));
      console.log(`Successfully saved data to ${filePath}`);

      // Extract the cursor for the next page from the result object.
      // We use optional chaining (?) to prevent errors if any part of the path is missing.
      // nextPageCursor =
      //   result?.data?.presentation?.staysSearch?.results?.paginationInfo
      //     ?.nextPageCursor;

      // If there's no nextPageCursor, we can't fetch more pages, so we break the loop.
      // if (!nextPageCursor) {
      //   console.log(
      //     `No next page cursor found for ${locationName}, stopping fetch.`
      //   );
      //   break;
      // }

      // Add a small delay between requests to avoid potential rate-limiting.
      if (i < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(
        `Error fetching or saving data for ${locationName}, page ${i}:`,
        error
      );
      break;
    }
  }
}

(async () => {
  console.log("Starting data fetching process...");
  // Loop through each location and call the fetching function.
  for (const [locationName, placeId] of Object.entries(locations)) {
    await fetchAndSaveListings(locationName, placeId);
  }
  console.log("Data fetching process completed.");
})();
