const { MongoClient } = require('mongodb');
require('dotenv').config();

async function updateBrokenImages() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('travelplanner');
    const collection = db.collection('premadeitineraries');
    
    // Update specific cities with local image paths
    const imageUpdates = [
      { cityName: "Goa", newImage: "/cities/goa.jpg" },
      { cityName: "Rishikesh", newImage: "/cities/rishikesh.jpg" },
      { cityName: "Darjeeling", newImage: "/cities/darjeeling.jpg" },
      { cityName: "Varanasi", newImage: "/cities/varanasi.jpg" },
      { cityName: "Amritsar", newImage: "/cities/amritsar.jpg" },
      { cityName: "Hyderabad", newImage: "/cities/hyderabad.jpg" },
      { cityName: "Bangalore", newImage: "/cities/bangalore.jpg" },
      { cityName: "Chennai", newImage: "/cities/chennai.jpg" },
      { cityName: "Kolkata", newImage: "/cities/kolkata.jpg" },
      { cityName: "Pune", newImage: "/cities/pune.jpg" },
      { cityName: "Leh Ladakh", newImage: "/cities/lehladakh.jpg" },
      { cityName: "Andaman", newImage: "/cities/andaman.jpg" },
      { cityName: "Shimla", newImage: "/cities/shimla.jpg" }
    ];
    
    for (const update of imageUpdates) {
      await collection.updateOne(
        { cityName: new RegExp(update.cityName, 'i') },
        { $set: { cityImage: update.newImage } }
      );
      console.log(`✅ Updated ${update.cityName} image`);
    }
    
    console.log('🎉 All images updated!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

updateBrokenImages();