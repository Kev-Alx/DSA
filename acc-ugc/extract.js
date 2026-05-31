import { writeFileSync, readFileSync } from "fs";

function staysToCSV(searchResults) {
  const rows = [["id", "city", "name", "rating", "review_count", "price"]];
  for (const p of searchResults) {
    if (p.propertyResultType !== "NormalProperty") continue;
    try {
      rows.push([
        p.propertyId ?? "",
        p.content.informationSummary.address.city.name ?? "",
        p.content.informationSummary.defaultName ?? "",
        p.content.informationSummary.rating ?? "",
        p.content.reviews.cumulative?.reviewCount ?? "0",
        p.pricing.offers.at(0).roomOffers.at(0).room.pricing.at(0).price.perBook
          .inclusive.display,
      ]);
    } catch (error) {
      console.log(p.propertyId);
      return;
    }
  }
  return rows
    .map((row) =>
      row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
}

let allResults = [];
const locations = {
  bali: "huehue",
  jakarta: "ChIJnUvjRenzaS4RILjULejFAAE",
  surabaya: "ChIJf8QaOPj71y0RQL5S43Z6AgM",
  malang: "ChIJ-8I9BiIo1i0Rok0aSEaUh3g",
  batu: "ChIJvfrjmQ9-eC4R2Kk4dNrC39c",
  medan: "ChIJ_bI-HMwxMTARYoKQpsgx1CM",
  yogjakarta: "ChIJxWtbvYdXei4RcU9o09Q_ciE",
  semarang: "ChIJTQINP02LcC4R8rlc2rkyBB4",
};

Object.keys(locations).map((location) => {
  allResults = [];
  console.log(location);
  for (let i = 1; i <= 3; i++) {
    console.log(i);
    const file = `./agoda/${location}/listing${i}.json`;
    const json = JSON.parse(readFileSync(file, "utf-8"));
    const results = json.data?.properties ?? [];
    allResults.push(...results);
  }

  const csv = staysToCSV(allResults);
  writeFileSync(`./agoda/${location}_hotels.csv`, csv);
  console.log(
    "CSV file written to stays.csv with combined results from listing1-4.json"
  );
});
// const json = JSON.parse(readFileSync(`./agoda/medan/listing1.json`, "utf-8"));
// const results = json.data?.properties ?? [];
// console.log(results.at(0));
