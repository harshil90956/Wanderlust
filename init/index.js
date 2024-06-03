const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Function to generate random coordinates
function generateRandomCoordinates() {
  // Generate random latitude (-90 to 90)
  const latitude = Math.random() * 180 - 90;
  // Generate random longitude (-180 to 180)
  const longitude = Math.random() * 360 - 180;
  return [latitude, longitude];
}

const initDB = async () => {
  await Listing.deleteMany({});
  const listingsWithCoordinates = initData.data.map(listing => ({
    ...listing,
    geometry: {
      type: "Point",
      coordinates: generateRandomCoordinates()
    },
  owner: "665c672942b1a8b802d1f41f" // Assuming this is the owner ID // Assuming this is the owner ID
  }));
  await Listing.insertMany(listingsWithCoordinates);
  console.log("data was initialized");
};