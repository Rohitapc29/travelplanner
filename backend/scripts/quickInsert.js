const { MongoClient } = require('mongodb');
require('dotenv').config();

async function quickInsert() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected');
    
    const db = client.db('travelplanner');
    const collection = db.collection('premadeitineraries');
    
    // Clear existing
    await collection.deleteMany({});
    console.log('🗑️ Cleared');
    
    const data = [
  {
    cityName: "Delhi",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/activities/m_Delhi_shutterjulimg_1_l_1058_1590.jpg",
    description: "India's capital city, rich in history and culture with magnificent monuments and bustling markets.",
    plans: [
      {
        id: "delhi-1day",
        name: "🏛️ Delhi Heritage Express",
        days: 1,
        cost: "₹3,500",
        type: "Heritage & Culture",
        highlights: ["Red Fort", "India Gate", "Qutub Minar", "Chandni Chowk"],
        details: [{
          day: 1,
          title: "Capital Highlights",
          activities: [
            "9:00 AM - Red Fort exploration with audio guide",
            "11:00 AM - Jama Masjid visit and minaret climb",
            "1:00 PM - Chandni Chowk food walk and shopping",
            "3:00 PM - India Gate and Rashtrapati Bhavan drive",
            "5:00 PM - Qutub Minar complex tour",
            "7:00 PM - Connaught Place evening stroll"
          ],
          meals: ["Breakfast", "Street food lunch", "Dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["AC transportation", "Entry fees", "Guide", "Breakfast"],
        excludes: ["Lunch", "Dinner", "Personal expenses"]
      },
      {
        id: "delhi-2day",
        name: "🎯 Old & New Delhi Explorer",
        days: 2,
        cost: "₹8,500",
        type: "Complete Heritage",
        highlights: ["Red Fort", "Lotus Temple", "Humayun's Tomb", "Akshardham"],
        details: [
          {
            day: 1,
            title: "Old Delhi Heritage",
            activities: [
              "9:00 AM - Red Fort detailed exploration",
              "11:00 AM - Jama Masjid and Chandni Chowk",
              "1:00 PM - Traditional lunch at Karim's",
              "3:00 PM - Raj Ghat and Gandhi memorial",
              "5:00 PM - Humayun's Tomb sunset visit",
              "7:00 PM - Evening at Lodhi Gardens"
            ],
            meals: ["Breakfast", "Karim's lunch", "Dinner"],
            accommodation: "3-star hotel"
          },
          {
            day: 2,
            title: "New Delhi & Modern Attractions",
            activities: [
              "9:00 AM - India Gate and surrounding monuments",
              "11:00 AM - Qutub Minar complex",
              "1:00 PM - Lotus Temple meditation",
              "3:00 PM - Akshardham Temple (closed Mondays)",
              "6:00 PM - Connaught Place shopping",
              "8:00 PM - Cultural dinner show"
            ],
            meals: ["Breakfast", "Lunch", "Cultural dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Hotel", "All meals", "Transportation", "Guide", "Entry fees"],
        excludes: ["Flight", "Personal shopping", "Tips"]
      },
      {
        id: "delhi-3day",
        name: "👑 Complete Delhi Heritage & Culture",
        days: 3,
        cost: "₹15,000",
        type: "Heritage & Culture Immersion",
        highlights: ["All major monuments", "Food tours", "Cultural experiences", "Day trip to Agra"],
        details: [
          {
            day: 1,
            title: "Old Delhi Deep Dive",
            activities: [
              "9:00 AM - Red Fort with museum visit",
              "11:00 AM - Jama Masjid and minaret",
              "12:30 PM - Chandni Chowk heritage walk",
              "2:00 PM - Traditional lunch and cooking class",
              "4:00 PM - Spice market and fabric shopping",
              "6:00 PM - Raj Ghat meditation",
              "8:00 PM - Evening Aarti at Bangla Sahib"
            ],
            meals: ["Breakfast", "Cooking class lunch", "Dinner"],
            accommodation: "4-star heritage hotel"
          },
          {
            day: 2,
            title: "New Delhi & Architectural Marvels",
            activities: [
              "8:00 AM - Early morning Lotus Temple",
              "10:00 AM - Humayun's Tomb detailed tour",
              "12:00 PM - India Gate and surrounding area",
              "2:00 PM - Lunch at Imperial Hotel",
              "4:00 PM - Qutub Minar and Iron Pillar",
              "6:00 PM - Lodhi Gardens evening walk",
              "8:00 PM - Cultural performance at India Habitat Centre"
            ],
            meals: ["Breakfast", "Imperial lunch", "Dinner"],
            accommodation: "Same hotel"
          },
          {
            day: 3,
            title: "Modern Delhi & Day Trip Option",
            activities: [
              "7:00 AM - Optional Agra day trip (Taj Mahal)",
              "OR - Akshardham Temple full experience",
              "12:00 PM - National Museum visit",
              "2:00 PM - Lunch at Khan Market",
              "4:00 PM - Connaught Place final shopping",
              "6:00 PM - Departure preparations",
              "8:00 PM - Farewell dinner"
            ],
            meals: ["Breakfast", "Lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Moderate",
        includes: ["4-star hotel", "All meals", "AC car", "Professional guide", "Entry fees", "Cultural shows"],
        excludes: ["Flight", "Agra trip supplement", "Personal expenses", "Tips"]
      }
    ]
  },
  {
    cityName: "Mumbai",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/destimg/mmt/destination/m_mumbai_main_tv_destination_img_1_l_848_1272.jpg",
    description: "The financial capital of India, famous for Bollywood, street food, and colonial architecture.",
    plans: [
      {
        id: "mumbai-1day",
        name: "🏙️ Mumbai Highlights",
        days: 1,
        cost: "₹4,000",
        type: "City & Culture",
        highlights: ["Gateway of India", "Marine Drive", "Crawford Market", "Bollywood"],
        details: [{
          day: 1,
          title: "Maximum City Experience",
          activities: [
            "9:00 AM - Gateway of India and Taj Hotel",
            "10:30 AM - Elephanta Caves boat trip",
            "2:00 PM - Lunch at Leopold Cafe",
            "4:00 PM - Crawford Market shopping",
            "6:00 PM - Marine Drive sunset walk",
            "8:00 PM - Street food tour at Juhu Beach"
          ],
          meals: ["Breakfast", "Leopold lunch", "Street food"],
          accommodation: "Day trip"
        }],
        bestTime: "Nov-Feb",
        difficulty: "Easy",
        includes: ["Local transportation", "Boat to Elephanta", "Guide"],
        excludes: ["Hotel", "Some meals", "Personal shopping"]
      },
      {
        id: "mumbai-2day",
        name: "🎬 Bollywood & Heritage Mumbai",
        days: 2,
        cost: "₹9,500",
        type: "Entertainment & Heritage",
        highlights: ["Film City tour", "Dhobi Ghat", "Chhatrapati Shivaji Terminus", "Night markets"],
        details: [
          {
            day: 1,
            title: "Colonial Heritage & Markets",
            activities: [
              "9:00 AM - Chhatrapati Shivaji Terminus architecture tour",
              "11:00 AM - Crawford Market and shopping",
              "1:00 PM - Lunch at traditional Thali restaurant",
              "3:00 PM - Dhobi Ghat and slum tour (ethical)",
              "5:00 PM - Hanging Gardens and Malabar Hill",
              "7:00 PM - Gateway of India evening",
              "9:00 PM - Colaba Causeway night market"
            ],
            meals: ["Breakfast", "Thali lunch", "Dinner"],
            accommodation: "3-star hotel near Gateway"
          },
          {
            day: 2,
            title: "Bollywood & Modern Mumbai",
            activities: [
              "9:00 AM - Film City tour with live sets",
              "1:00 PM - Lunch at Film City canteen",
              "3:00 PM - Bandra-Worli Sea Link drive",
              "4:30 PM - Bandstand and Carter Road",
              "6:00 PM - Juhu Beach and celebrity homes",
              "8:00 PM - Street food tour at Mohammad Ali Road",
              "10:00 PM - Marine Drive night drive"
            ],
            meals: ["Breakfast", "Film City lunch", "Street food dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Nov-Feb",
        difficulty: "Easy",
        includes: ["Hotel", "Film City tour", "All transportation", "Guide"],
        excludes: ["Some meals", "Personal expenses", "Tips"]
      },
      {
        id: "mumbai-3day",
        name: "🌊 Complete Mumbai Experience",
        days: 3,
        cost: "₹16,500",
        type: "Complete City Experience",
        highlights: ["Elephanta Caves", "Bollywood studio", "Food tours", "Nightlife", "Day trip to Lonavala"],
        details: [
          {
            day: 1,
            title: "Heritage & Island Adventure",
            activities: [
              "8:00 AM - Early Gateway of India",
              "9:00 AM - Elephanta Caves full day trip",
              "2:00 PM - Lunch on Elephanta Island",
              "4:00 PM - Return to mainland",
              "5:30 PM - Prince of Wales Museum",
              "7:00 PM - High Street Phoenix mall",
              "9:00 PM - Dinner at Trishna (seafood)"
            ],
            meals: ["Breakfast", "Island lunch", "Trishna dinner"],
            accommodation: "4-star hotel in Colaba"
          },
          {
            day: 2,
            title: "Bollywood & Local Life",
            activities: [
              "9:00 AM - Film City detailed tour with celebrity spotting",
              "1:00 PM - Bollywood theme lunch",
              "3:00 PM - Dharavi community tour (responsible tourism)",
              "5:00 PM - Crawford Market spice shopping",
              "7:00 PM - Local train experience (1st class)",
              "8:30 PM - Mohammad Ali Road food street",
              "10:00 PM - Marine Drive night walk"
            ],
            meals: ["Breakfast", "Film City lunch", "Street food dinner"],
            accommodation: "Same hotel"
          },
          {
            day: 3,
            title: "Nature Escape & Departure",
            activities: [
              "7:00 AM - Day trip to Lonavala hill station",
              "9:00 AM - Karla and Bhaja Caves",
              "12:00 PM - Traditional Maharashtrian lunch",
              "2:00 PM - Lonavala lake and viewpoints",
              "5:00 PM - Return to Mumbai",
              "7:00 PM - Final shopping at Palladium Mall",
              "9:00 PM - Farewell dinner at Khyber Restaurant"
            ],
            meals: ["Breakfast", "Maharashtrian lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Nov-Feb",
        difficulty: "Moderate",
        includes: ["4-star hotel", "All tours", "AC transportation", "Professional guide", "Most meals"],
        excludes: ["Flight", "Personal shopping", "Alcoholic drinks", "Tips"]
      }
    ]
  },
  {
    cityName: "Goa",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/goa/mmt/activities/m_Goa_beach_l_400_640.jpg",
    description: "India's beach paradise with Portuguese heritage, vibrant nightlife, and pristine beaches.",
    plans: [
      {
        id: "goa-1day",
        name: "🏖️ Beach Bliss Express",
        days: 1,
        cost: "₹3,000",
        type: "Beach & Relaxation",
        highlights: ["Baga Beach", "Anjuna Market", "Old Goa churches", "Sunset cruise"],
        details: [{
          day: 1,
          title: "Beaches & Heritage",
          activities: [
            "9:00 AM - Baga Beach water sports",
            "11:00 AM - Anjuna Beach and flea market",
            "1:00 PM - Seafood lunch at beach shack",
            "3:00 PM - Old Goa churches tour",
            "5:00 PM - Dona Paula viewpoint",
            "6:30 PM - Mandovi River sunset cruise"
          ],
          meals: ["Breakfast", "Beach shack lunch", "Dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Nov-Mar",
        difficulty: "Easy",
        includes: ["Transportation", "Sunset cruise", "Entry fees"],
        excludes: ["Hotel", "Water sports", "Alcohol"]
      },
      {
        id: "goa-2day",
        name: "🌴 North Goa Adventure",
        days: 2,
        cost: "₹7,500",
        type: "Beach & Adventure",
        highlights: ["Multiple beaches", "Spice plantation", "Night markets", "Water sports"],
        details: [
          {
            day: 1,
            title: "Beach Hopping North Goa",
            activities: [
              "9:00 AM - Calangute Beach and water sports",
              "11:00 AM - Baga Beach shack hopping",
              "1:00 PM - Lunch at Tito's Lane",
              "3:00 PM - Anjuna Beach and market",
              "5:00 PM - Vagator Beach cliff views",
              "7:00 PM - Chapora Fort sunset",
              "9:00 PM - Saturday Night Market (if Saturday)"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Beach resort"
          },
          {
            day: 2,
            title: "Heritage & Spice Tour",
            activities: [
              "9:00 AM - Old Goa churches detailed tour",
              "11:00 AM - Spice plantation tour with lunch",
              "3:00 PM - Dona Paula and Miramar Beach",
              "5:00 PM - Panaji city walk and shopping",
              "7:00 PM - Mandovi River evening cruise",
              "9:00 PM - Beach dinner and departure prep"
            ],
            meals: ["Breakfast", "Spice plantation lunch", "Beach dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Nov-Mar",
        difficulty: "Easy",
        includes: ["Beach resort", "All transfers", "Spice tour", "River cruise"],
        excludes: ["Water sports", "Alcohol", "Personal expenses"]
      },
      {
        id: "goa-3day",
        name: "🏝️ Complete Goa Experience",
        days: 3,
        cost: "₹14,000",
        type: "Beach, Heritage & Adventure",
        highlights: ["North & South Goa", "Dudhsagar Falls", "Portuguese heritage", "Beach parties"],
        details: [
          {
            day: 1,
            title: "North Goa Beaches & Nightlife",
            activities: [
              "10:00 AM - Calangute Beach water sports festival",
              "12:00 PM - Baga Beach lunch and relaxation",
              "3:00 PM - Anjuna Beach flea market shopping",
              "5:00 PM - Vagator Beach and Chapora Fort",
              "7:00 PM - Sunset at Ozran Beach",
              "9:00 PM - Tito's Lane dinner and nightlife",
              "11:00 PM - Beach party (optional)"
            ],
            meals: ["Breakfast", "Beach lunch", "Dinner"],
            accommodation: "4-star beach resort North Goa"
          },
          {
            day: 2,
            title: "Adventure & Heritage Day",
            activities: [
              "6:00 AM - Early start for Dudhsagar Falls",
              "8:00 AM - Jeep safari to waterfall",
              "10:00 AM - Swimming and photography at falls",
              "1:00 PM - Lunch at spice plantation",
              "3:00 PM - Spice plantation tour and elephant ride",
              "5:00 PM - Return to hotel",
              "7:00 PM - Old Goa evening heritage walk",
              "9:00 PM - Traditional Goan dinner show"
            ],
            meals: ["Breakfast", "Plantation lunch", "Cultural dinner"],
            accommodation: "Same resort"
          },
          {
            day: 3,
            title: "South Goa & Relaxation",
            activities: [
              "9:00 AM - Check-out and drive to South Goa",
              "10:30 AM - Colva Beach relaxation",
              "12:00 PM - Benaulim Beach water sports",
              "2:00 PM - Seafood lunch at Martin's Corner",
              "4:00 PM - Cabo de Rama Fort and beaches",
              "6:00 PM - Palolem Beach sunset",
              "8:00 PM - Final beach dinner",
              "10:00 PM - Departure preparations"
            ],
            meals: ["Breakfast", "Martin's lunch", "Beach dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Nov-Mar",
        difficulty: "Moderate",
        includes: ["4-star resort", "All transportation", "Dudhsagar trip", "Cultural show", "Most meals"],
        excludes: ["Flight", "Alcohol", "Water sports", "Personal shopping"]
      }
    ]
  },
  {
    cityName: "Jaipur",
    cityImage: "https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/3769/Marvellous%20doorways%20in%20Amer%20Fort.jpg",
    description: "The Pink City of Rajasthan, known for royal palaces, majestic forts, and vibrant culture.",
    plans: [
      {
        id: "jaipur-1day",
        name: "👑 Pink City Express",
        days: 1,
        cost: "₹4,500",
        type: "Heritage & Royal",
        highlights: ["Hawa Mahal", "City Palace", "Amber Fort", "Local markets"],
        details: [{
          day: 1,
          title: "Royal Rajasthan Highlights",
          activities: [
            "8:00 AM - Amber Fort with elephant/jeep ride",
            "11:00 AM - Hawa Mahal photo stop and exploration",
            "12:30 PM - City Palace and museum",
            "2:00 PM - Traditional Rajasthani thali lunch",
            "4:00 PM - Jantar Mantar astronomical park",
            "6:00 PM - Johari Bazaar shopping",
            "8:00 PM - Cultural evening with folk dance"
          ],
          meals: ["Breakfast", "Rajasthani thali", "Dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["AC car", "Entry fees", "Elephant ride", "Guide"],
        excludes: ["Hotel", "Personal shopping", "Tips"]
      },
      {
        id: "jaipur-2day",
        name: "🏰 Royal Heritage & Culture",
        days: 2,
        cost: "₹9,000",
        type: "Heritage & Culture",
        highlights: ["All major forts", "Palace stays", "Village visit", "Handicraft workshops"],
        details: [
          {
            day: 1,
            title: "Forts & Palaces",
            activities: [
              "8:00 AM - Amber Fort detailed exploration",
              "10:00 AM - Jaigarh Fort and cannon foundry",
              "12:00 PM - Nahargarh Fort with valley views",
              "2:00 PM - Lunch at 1135 AD restaurant in fort",
              "4:00 PM - City Palace complex and museums",
              "6:00 PM - Hawa Mahal sunset views",
              "8:00 PM - Chokhi Dhani village cultural evening"
            ],
            meals: ["Breakfast", "Fort lunch", "Village dinner"],
            accommodation: "Heritage hotel"
          },
          {
            day: 2,
            title: "Culture & Crafts",
            activities: [
              "9:00 AM - Jantar Mantar and Albert Hall Museum",
              "11:00 AM - Block printing workshop",
              "1:00 PM - Traditional lunch at Peacock Rooftop",
              "3:00 PM - Johari and Bapu Bazaar shopping",
              "5:00 PM - Birla Temple visit",
              "6:30 PM - Raj Mandir Cinema Bollywood show",
              "9:00 PM - Farewell dinner at Suvarna Mahal"
            ],
            meals: ["Breakfast", "Rooftop lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Heritage hotel", "All transportation", "Cultural shows", "Workshop"],
        excludes: ["Personal shopping", "Movie tickets", "Tips"]
      },
      {
        id: "jaipur-3day",
        name: "🐘 Complete Rajasthan Royal Experience",
        days: 3,
        cost: "₹18,000",
        type: "Royal Heritage & Adventure",
        highlights: ["All forts & palaces", "Village safari", "Cooking classes", "Luxury experiences"],
        details: [
          {
            day: 1,
            title: "Grand Fort Circuit",
            activities: [
              "7:00 AM - Early Amber Fort with elephant ride",
              "9:00 AM - Amber Palace detailed audio tour",
              "11:00 AM - Jaigarh Fort and Jaivana cannon",
              "1:00 PM - Royal lunch at Amber Fort restaurant",
              "3:00 PM - Nahargarh Fort and sculpture park",
              "5:00 PM - Sunset views and photography",
              "7:00 PM - Return to heritage hotel",
              "9:00 PM - Traditional Rajasthani dinner with folk show"
            ],
            meals: ["Breakfast", "Royal lunch", "Folk dinner"],
            accommodation: "5-star heritage palace hotel"
          },
          {
            day: 2,
            title: "City Palaces & Cultural Immersion",
            activities: [
              "9:00 AM - City Palace complex and armory",
              "11:00 AM - Private museum tour with curator",
              "1:00 PM - Cooking class and lunch preparation",
              "3:00 PM - Hawa Mahal and surrounding old city",
              "4:30 PM - Jantar Mantar with astronomy guide",
              "6:00 PM - Artisan workshop visits (gems, textiles)",
              "8:00 PM - Rooftop dinner overlooking City Palace",
              "10:00 PM - Evening walk through illuminated Hawa Mahal"
            ],
            meals: ["Breakfast", "Cooking class lunch", "Rooftop dinner"],
            accommodation: "Same heritage hotel"
          },
          {
            day: 3,
            title: "Village Safari & Royal Farewell",
            activities: [
              "8:00 AM - Village safari to rural Rajasthan",
              "10:00 AM - Camel cart ride and village interaction",
              "12:00 PM - Traditional village lunch with local family",
              "2:30 PM - Return to Jaipur",
              "4:00 PM - Final shopping at Johari Bazaar",
              "6:00 PM - Albert Hall Museum and Central Park",
              "8:00 PM - Farewell dinner at Peshawri (ITC Rajputana)",
              "10:30 PM - Traditional goodbye ceremony"
            ],
            meals: ["Breakfast", "Village lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Moderate",
        includes: ["Palace hotel", "All meals", "Private car", "Cultural shows", "Village safari", "Cooking class"],
        excludes: ["Flight", "Personal shopping", "Spa treatments", "Alcoholic beverages"]
      }
    ]
  },
  {
    cityName: "Kerala",
    cityImage: "https://seoimgak.mmtcdn.com/blog/sites/default/files/kerala-handy-travel-guide.jpg",
    description: "God's Own Country - tropical paradise with backwaters, hill stations, beaches, and spice plantations.",
    plans: [
      {
        id: "kerala-1day",
        name: "🌴 Kerala Highlights",
        days: 1,
        cost: "₹5,000",
        type: "Nature & Culture",
        highlights: ["Backwaters", "Spice garden", "Kathakali show", "Kerala cuisine"],
        details: [{
          day: 1,
          title: "God's Own Country Essence",
          activities: [
            "8:00 AM - Alleppey backwater houseboat cruise",
            "10:00 AM - Village backwater exploration",
            "1:00 PM - Traditional Kerala lunch on houseboat",
            "3:00 PM - Spice plantation tour",
            "5:00 PM - Kumarakom bird sanctuary",
            "7:00 PM - Kathakali classical dance performance",
            "9:00 PM - Kerala Sadya dinner"
          ],
          meals: ["Breakfast", "Houseboat lunch", "Sadya dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Sep-Mar",
        difficulty: "Easy",
        includes: ["Houseboat cruise", "Cultural show", "Spice tour"],
        excludes: ["Hotel", "Personal expenses", "Tips"]
      },
      {
        id: "kerala-2day",
        name: "🛶 Backwaters & Hills",
        days: 2,
        cost: "₹12,000",
        type: "Nature & Relaxation",
        highlights: ["Houseboat stay", "Hill station", "Tea plantations", "Ayurveda"],
        details: [
          {
            day: 1,
            title: "Backwater Paradise",
            activities: [
              "10:00 AM - Board luxury houseboat in Alleppey",
              "11:00 AM - Cruise through narrow canals",
              "1:00 PM - Fresh seafood lunch on board",
              "3:00 PM - Village visits and local interactions",
              "5:00 PM - Sunset cruise with tender coconut",
              "7:00 PM - Traditional Kerala dinner",
              "9:00 PM - Overnight on houseboat under stars"
            ],
            meals: ["Breakfast", "Seafood lunch", "Kerala dinner"],
            accommodation: "Luxury houseboat"
          },
          {
            day: 2,
            title: "Hill Station & Tea Gardens",
            activities: [
              "7:00 AM - Early breakfast and disembark",
              "8:00 AM - Drive to Munnar hill station",
              "11:00 AM - Tea plantation tour and factory visit",
              "1:00 PM - Lunch with mountain views",
              "3:00 PM - Mattupetty Dam and echo point",
              "5:00 PM - Tea museum and tasting",
              "7:00 PM - Ayurvedic massage session",
              "9:00 PM - Hillside dinner and departure prep"
            ],
            meals: ["Breakfast", "Mountain lunch", "Dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Sep-Mar",
        difficulty: "Easy",
        includes: ["Houseboat", "Hill station transfer", "All meals", "Ayurveda session"],
        excludes: ["Flight", "Personal shopping", "Additional treatments"]
      },
      {
        id: "kerala-3day",
        name: "🏝️ Complete Kerala Triangle",
        days: 3,
        cost: "₹20,000",
        type: "Complete Kerala Experience",
        highlights: ["Backwaters", "Hill stations", "Beaches", "Wildlife", "Ayurveda"],
        details: [
          {
            day: 1,
            title: "Backwater Immersion",
            activities: [
              "9:00 AM - Arrive Cochin, drive to Alleppey",
              "11:00 AM - Board premium houseboat",
              "12:00 PM - Backwater cruise with village stops",
              "2:00 PM - Fresh fish curry lunch",
              "4:00 PM - Canoeing in narrow canals",
              "6:00 PM - Sunset viewing with Kerala snacks",
              "8:00 PM - Traditional dinner with local musicians",
              "10:00 PM - Sleep under stars on deck"
            ],
            meals: ["Breakfast", "Fish curry lunch", "Musical dinner"],
            accommodation: "Premium houseboat"
          },
          {
            day: 2,
            title: "Hill Station & Wildlife",
            activities: [
              "6:00 AM - Early morning bird watching cruise",
              "8:00 AM - Breakfast and check-out",
              "9:00 AM - Drive to Thekkady (Periyar)",
              "12:00 PM - Check-in resort and lunch",
              "3:00 PM - Periyar National Park boat safari",
              "5:00 PM - Spice plantation guided tour",
              "7:00 PM - Martial arts show (Kalaripayattu)",
              "9:00 PM - Spice-infused dinner"
            ],
            meals: ["Breakfast", "Resort lunch", "Spice dinner"],
            accommodation: "Wildlife resort Thekkady"
          },
          {
            day: 3,
            title: "Beach & Ayurveda",
            activities: [
              "8:00 AM - Drive to Kovalam beach",
              "11:00 AM - Beach resort check-in",
              "12:00 PM - Lighthouse beach relaxation",
              "2:00 PM - Seafood lunch by the ocean",
              "4:00 PM - Ayurvedic consultation and treatment",
              "6:00 PM - Sunset at Hawah Beach",
              "8:00 PM - Beach barbecue dinner",
              "10:00 PM - Cultural program and departure prep"
            ],
            meals: ["Breakfast", "Seafood lunch", "Barbecue dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Sep-Mar",
        difficulty: "Easy",
        includes: ["Houseboat", "Wildlife resort", "Beach resort", "All transfers", "Cultural shows", "Ayurveda", "All meals"],
        excludes: ["Flight", "Alcoholic drinks", "Personal spa treatments", "Shopping"]
      }
    ]
  },
  {
    cityName: "Agra",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/agra/mmt/activities/m_activities-agra-taj-mahal_l_400_640.jpg",
    description: "Home to the magnificent Taj Mahal, one of the Seven Wonders of the World.",
    plans: [
      {
        id: "agra-1day",
        name: "🕌 Taj Mahal Express",
        days: 1,
        cost: "₹3,500",
        type: "Heritage & Wonder",
        highlights: ["Taj Mahal", "Agra Fort", "Mehtab Bagh", "Marble inlay work"],
        details: [{
          day: 1,
          title: "Wonder of the World",
          activities: [
            "6:00 AM - Sunrise at Taj Mahal",
            "8:00 AM - Detailed Taj exploration with guide",
            "11:00 AM - Agra Fort red sandstone palace",
            "1:00 PM - Lunch at Pinch of Spice",
            "3:00 PM - Marble inlay workshop visit",
            "5:00 PM - Mehtab Bagh sunset view of Taj",
            "7:00 PM - Local market shopping"
          ],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Entry fees", "Professional guide", "Transportation"],
        excludes: ["Hotel", "Personal shopping", "Tips"]
      },
      {
        id: "agra-2day",
        name: "👑 Mughal Heritage Trail",
        days: 2,
        cost: "₹8,500",
        type: "Complete Mughal",
        highlights: ["Taj at sunrise & sunset", "Fatehpur Sikri", "Agra Fort", "Local crafts"],
        details: [
          {
            day: 1,
            title: "Taj Mahal & Agra Fort",
            activities: [
              "5:30 AM - Taj Mahal sunrise photography",
              "7:00 AM - Breakfast at hotel",
              "9:00 AM - Detailed Taj Mahal exploration",
              "12:00 PM - Agra Fort Mughal architecture",
              "2:00 PM - Lunch at Daawat-e-Nawab",
              "4:00 PM - Itmad-ud-Daulah (Baby Taj)",
              "6:00 PM - Mehtab Bagh sunset views",
              "8:00 PM - Cultural dinner show"
            ],
            meals: ["Breakfast", "Lunch", "Cultural dinner"],
            accommodation: "4-star hotel with Taj view"
          },
          {
            day: 2,
            title: "Fatehpur Sikri & Crafts",
            activities: [
              "8:00 AM - Drive to Fatehpur Sikri",
              "10:00 AM - Ghost city exploration",
              "12:00 PM - Buland Darwaza and Salim Chishti",
              "2:00 PM - Lunch at local restaurant",
              "4:00 PM - Return to Agra",
              "5:00 PM - Marble handicraft workshop",
              "7:00 PM - Sadar Bazaar shopping",
              "9:00 PM - Farewell dinner"
            ],
            meals: ["Breakfast", "Lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Taj view hotel", "Fatehpur Sikri", "All transportation", "Cultural show"],
        excludes: ["Personal shopping", "Additional monuments", "Tips"]
      },
      {
        id: "agra-3day",
        name: "🏰 Golden Triangle Extension",
        days: 3,
        cost: "₹15,000",
        type: "Heritage Circuit",
        highlights: ["Multiple Taj visits", "Mathura-Vrindavan", "Fatehpur Sikri", "Photography tours"],
        details: [
          {
            day: 1,
            title: "Taj Mahal Photography Special",
            activities: [
              "5:00 AM - Professional sunrise shoot at Taj",
              "7:00 AM - Breakfast break",
              "9:00 AM - Taj Mahal different angles tour",
              "12:00 PM - Agra Fort with photography guide",
              "3:00 PM - Lunch and rest",
              "5:00 PM - Itmad-ud-Daulah golden hour",
              "7:00 PM - Mehtab Bagh blue hour shoot",
              "9:00 PM - Photo review dinner"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Luxury hotel with Taj view"
          },
          {
            day: 2,
            title: "Mathura-Vrindavan Spiritual Day",
            activities: [
              "7:00 AM - Drive to Mathura (Krishna's birthplace)",
              "9:00 AM - Krishna Janmabhoomi temple",
              "11:00 AM - Mathura museum and ghats",
              "1:00 PM - Traditional lunch",
              "3:00 PM - Vrindavan temples tour",
              "5:00 PM - ISKCON temple evening aarti",
              "7:00 PM - Return to Agra",
              "9:00 PM - Mughlai dinner"
            ],
            meals: ["Breakfast", "Traditional lunch", "Mughlai dinner"],
            accommodation: "Same luxury hotel"
          },
          {
            day: 3,
            title: "Fatehpur Sikri & Departure",
            activities: [
              "8:00 AM - Final Taj Mahal visit (different perspective)",
              "10:00 AM - Drive to Fatehpur Sikri",
              "11:00 AM - Comprehensive ghost city tour",
              "1:00 PM - Lunch at heritage restaurant",
              "3:00 PM - Akbar's tomb at Sikandra",
              "5:00 PM - Return to Agra",
              "7:00 PM - Final shopping and crafts",
              "9:00 PM - Farewell dinner at Peshawri"
            ],
            meals: ["Breakfast", "Heritage lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Moderate",
        includes: ["Luxury Taj view hotel", "Photography guide", "Mathura-Vrindavan", "All monuments", "Cultural experiences"],
        excludes: ["Flight", "Personal shopping", "Professional photo prints", "Tips"]
      }
    ]
  },
  {
    cityName: "Udaipur",
    cityImage: "https://hldak.mmtcdn.com/prod-s3-hld-hpcmsadmin/holidays/images/cities/1325/Udaipur3.jpg",
    description: "The City of Lakes in Rajasthan, known for stunning palaces, romantic lakes, and royal heritage.",
    plans: [
      {
        id: "udaipur-1day",
        name: "🏰 Lake City Express",
        days: 1,
        cost: "₹4,000",
        type: "Heritage & Romance",
        highlights: ["City Palace", "Lake Pichola", "Jagdish Temple", "Local markets"],
        details: [{
          day: 1,
          title: "Venice of the East",
          activities: [
            "9:00 AM - City Palace complex tour",
            "11:00 AM - Crystal Gallery and museum",
            "1:00 PM - Lunch at Ambrai Restaurant lakeside",
            "3:00 PM - Jagdish Temple and old city walk",
            "5:00 PM - Lake Pichola boat ride",
            "7:00 PM - Sunset at Fateh Sagar Lake",
            "9:00 PM - Cultural dinner show"
          ],
          meals: ["Breakfast", "Lakeside lunch", "Cultural dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Palace entry", "Boat ride", "Guide", "Transportation"],
        excludes: ["Hotel", "Personal shopping", "Tips"]
      },
      {
        id: "udaipur-2day",
        name: "💎 Royal Lake Palace Experience",
        days: 2,
        cost: "₹12,000",
        type: "Luxury Heritage",
        highlights: ["Palace hotels", "Multiple lakes", "Sunset cruise", "Royal dining"],
        details: [
          {
            day: 1,
            title: "Palace & Lake Circuit",
            activities: [
              "9:00 AM - City Palace detailed exploration",
              "11:00 AM - Vintage car museum",
              "1:00 PM - Royal lunch at Lake Palace Hotel",
              "3:00 PM - Saheliyon ki Bari gardens",
              "5:00 PM - Fateh Sagar Lake and Nehru Park",
              "7:00 PM - Sunset cruise on Lake Pichola",
              "9:00 PM - Rooftop dinner with palace views"
            ],
            meals: ["Breakfast", "Royal lunch", "Rooftop dinner"],
            accommodation: "Heritage haveli"
          },
          {
            day: 2,
            title: "Cultural Immersion",
            activities: [
              "9:00 AM - Bagore ki Haveli museum",
              "11:00 AM - Local handicraft workshops",
              "1:00 PM - Traditional Rajasthani thali",
              "3:00 PM - Shilpgram crafts village",
              "5:00 PM - Monsoon Palace sunset drive",
              "7:00 PM - Folk dance and puppet show",
              "9:00 PM - Farewell dinner at Udaivilas"
            ],
            meals: ["Breakfast", "Thali lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Heritage hotel", "Lake Palace lunch", "All cruises", "Cultural shows"],
        excludes: ["Personal shopping", "Spa treatments", "Tips"]
      },
      {
        id: "udaipur-3day",
        name: "👑 Complete Mewar Royal Experience",
        days: 3,
        cost: "₹22,000",
        type: "Ultimate Royal Heritage",
        highlights: ["Palace stays", "Chittorgarh fort", "Village safari", "Luxury experiences"],
        details: [
          {
            day: 1,
            title: "Palace Circuit & Lakes",
            activities: [
              "8:00 AM - City Palace private tour with curator",
              "10:00 AM - Crystal Gallery and armory",
              "12:00 PM - Royal lunch at Taj Lake Palace",
              "2:00 PM - Private boat to Jag Mandir",
              "4:00 PM - Jagdish Temple and old city",
              "6:00 PM - Private sunset cruise",
              "8:00 PM - Dinner at Ambrai with folk music",
              "10:00 PM - Evening walk along Lake Pichola"
            ],
            meals: ["Breakfast", "Royal lunch", "Folk dinner"],
            accommodation: "5-star heritage palace"
          },
          {
            day: 2,
            title: "Chittorgarh Fort Day Trip",
            activities: [
              "7:00 AM - Early departure to Chittorgarh",
              "9:00 AM - Chittorgarh Fort exploration",
              "11:00 AM - Vijay Stambh and Kirti Stambh",
              "1:00 PM - Lunch at fort restaurant",
              "3:00 PM - Rana Kumbha Palace ruins",
              "5:00 PM - Return to Udaipur",
              "7:00 PM - Relaxation at hotel spa",
              "9:00 PM - Private dining experience"
            ],
            meals: ["Breakfast", "Fort lunch", "Private dinner"],
            accommodation: "Same palace hotel"
          },
          {
            day: 3,
            title: "Village Safari & Royal Farewell",
            activities: [
              "8:00 AM - Village safari to rural Rajasthan",
              "10:00 AM - Traditional pottery and weaving demos",
              "12:00 PM - Village lunch with local family",
              "2:00 PM - Return to Udaipur",
              "4:00 PM - Shilpgram arts and crafts center",
              "6:00 PM - Final shopping at Hathi Pol",
              "8:00 PM - Royal farewell dinner at Oberoi Udaivilas",
              "10:30 PM - Traditional goodbye ceremony"
            ],
            meals: ["Breakfast", "Village lunch", "Royal farewell"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Moderate",
        includes: ["Palace hotel", "All meals", "Chittorgarh trip", "Village safari", "Private experiences", "Cultural shows"],
        excludes: ["Flight", "Personal shopping", "Spa treatments", "Alcoholic beverages"]
      }
    ]
  },
  {
    cityName: "Manali",
    cityImage: "https://seoimgak.mmtcdn.com/blog/sites/default/files/images/manali-High-mountain-road.jpg",
    description: "Popular hill station in Himachal Pradesh, perfect for adventure sports, snow activities, and mountain scenery.",
    plans: [
      {
        id: "manali-1day",
        name: "🏔️ Mountain Adventure Express",
        days: 1,
        cost: "₹3,500",
        type: "Adventure & Nature",
        highlights: ["Rohtang Pass", "Solang Valley", "Adventure sports", "Local markets"],
        details: [{
          day: 1,
          title: "Himalayan Heights",
          activities: [
            "7:00 AM - Early start to Rohtang Pass",
            "9:00 AM - Snow activities and photography",
            "12:00 PM - Lunch with mountain views",
            "2:00 PM - Solang Valley adventure sports",
            "4:00 PM - Cable car ride and valley views",
            "6:00 PM - Return to Manali town",
            "8:00 PM - Mall Road shopping and dinner"
          ],
          meals: ["Breakfast", "Mountain lunch", "Dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Apr-Jun, Oct-Feb",
        difficulty: "Moderate",
        includes: ["Transportation", "Snow activities", "Cable car"],
        excludes: ["Hotel", "Adventure sports fees", "Personal expenses"]
      },
      {
        id: "manali-2day",
        name: "❄️ Snow & Solitude in Manali",
        days: 2,
        cost: "₹7,000",
        type: "Nature & Adventure",
        highlights: ["Rohtang Pass", "Solang Valley", "Beas River", "Old Manali"],
        details: [
          {
            day: 1,
            title: "Snow Adventures",
            activities: [
              "8:00 AM - Drive to Rohtang Pass",
              "10:00 AM - Snow activities (skiing, snowboarding)",
              "1:00 PM - Lunch at mountain dhaba",
              "3:00 PM - Visit Solang Valley (paragliding option)",
              "6:00 PM - Return to Manali",
              "8:00 PM - Dinner at Johnson's Lodge"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "3-star hotel in Manali"
          },
          {
            day: 2,
            title: "Cultural & Natural Wonders",
            activities: [
              "9:00 AM - Visit Hadimba Temple and Manu Temple",
              "11:00 AM - Explore Old Manali village",
              "1:00 PM - Lunch at local cafe",
              "3:00 PM - Beas River rafting (optional)",
              "6:00 PM - Evening at Vashisht hot springs",
              "8:00 PM - Traditional Himachali dinner"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Dec-Mar",
        difficulty: "Moderate",
        includes: ["Hotel", "All meals", "Transportation", "Guide", "Entry fees"],
        excludes: ["Adventure sports", "Personal expenses", "Tips"]
      },
      {
        id: "manali-3day",
        name: "🏞️ Complete Manali Adventure",
        days: 3,
        cost: "₹10,500",
        type: "Adventure & Culture",
        highlights: ["Rohtang Pass", "Solang Valley", "Old Manali", "Kullu Valley"],
        details: [
          {
            day: 1,
            title: "Mountain Peaks & Valleys",
            activities: [
              "8:00 AM - Early drive to Rohtang Pass",
              "10:00 AM - Snow activities and photography",
              "1:00 PM - Lunch at Kullu Valley",
              "3:00 PM - Visit Solang Valley (paragliding option)",
              "6:00 PM - Return to Manali",
              "8:00 PM - Dinner at The Corner House"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "3-star hotel in Manali"
          },
          {
            day: 2,
            title: "Cultural Immersion & Relaxation",
            activities: [
              "9:00 AM - Visit Hadimba Temple and Tibetan Monastery",
              "11:00 AM - Explore Old Manali and its cafes",
              "1:00 PM - Lunch at Johnson's Cafe",
              "3:00 PM - Beas River camping and bonfire",
              "7:00 PM - Dinner at Himalayan Spice Kitchen"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Same hotel"
          },
          {
            day: 3,
            title: "Adventure Sports & Departure",
            activities: [
              "8:00 AM - White water rafting on Beas River",
              "1:00 PM - Lunch at local restaurant",
              "3:00 PM - Visit to Kullu Dussehra Museum",
              "5:00 PM - Departure preparations",
              "8:00 PM - Dinner at The Lazy Dog"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Dec-Mar",
        difficulty: "Moderate",
        includes: ["Hotel", "All meals", "Transportation", "Guide", "Rafting fees", "Entry fees"],
        excludes: ["Personal expenses", "Tips"]
      }
    ]
  },
  {
    cityName: "Rishikesh",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/rishikesh/mmt/activities/m_Rishikesh_adventure_l_400_640.jpg",
    description: "The Yoga Capital of the World, famous for spiritual retreats, Ganga Aarti, and adventure sports.",
    plans: [
      {
        id: "rishikesh-1day",
        name: "🧘 Spiritual Rishikesh",
        days: 1,
        cost: "₹2,500",
        type: "Spiritual & Adventure",
        highlights: ["Ganga Aarti", "Lakshman Jhula", "Beatles Ashram", "River rafting"],
        details: [{
          day: 1,
          title: "Yoga Capital Experience",
          activities: [
            "6:00 AM - Morning yoga session by Ganges",
            "8:00 AM - Breakfast at German Bakery",
            "10:00 AM - Lakshman Jhula and Ram Jhula walk",
            "12:00 PM - Beatles Ashram exploration",
            "2:00 PM - Lunch at Chotiwala Restaurant",
            "4:00 PM - White water rafting (Shivpuri-Rishikesh)",
            "7:00 PM - Evening Ganga Aarti at Parmarth Niketan"
          ],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Sep-Jun",
        difficulty: "Easy",
        includes: ["Yoga session", "Rafting", "Aarti ceremony", "Guide"],
        excludes: ["Hotel", "Personal expenses", "Advanced courses"]
      },
      {
        id: "rishikesh-2day",
        name: "🏔️ Adventure & Spirituality",
        days: 2,
        cost: "₹6,000",
        type: "Complete Experience",
        highlights: ["Multi-day yoga", "Adventure sports", "Ashram visits", "Meditation"],
        details: [
          {
            day: 1,
            title: "Spiritual Immersion",
            activities: [
              "5:30 AM - Sunrise yoga and meditation",
              "7:30 AM - Healthy breakfast at ashram",
              "9:00 AM - Visit multiple ashrams and temples",
              "12:00 PM - Vegetarian lunch at Parmarth Niketan",
              "3:00 PM - Beatles Ashram and graffiti art",
              "5:00 PM - Ayurvedic massage session",
              "7:00 PM - Ganga Aarti participation",
              "9:00 PM - Satsang (spiritual discourse)"
            ],
            meals: ["Ashram breakfast", "Vegetarian lunch", "Ashram dinner"],
            accommodation: "Riverside ashram/hotel"
          },
          {
            day: 2,
            title: "Adventure & Nature",
            activities: [
              "6:00 AM - Morning meditation by Ganges",
              "8:00 AM - Breakfast and check-out",
              "9:00 AM - White water rafting (full day)",
              "1:00 PM - Riverside lunch during rafting",
              "4:00 PM - Bungee jumping at Jumpin Heights",
              "6:00 PM - Neelkanth Mahadev Temple visit",
              "8:00 PM - Farewell dinner at Pyramid Cafe"
            ],
            meals: ["Breakfast", "Riverside lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Sep-Jun",
        difficulty: "Moderate",
        includes: ["Ashram stay", "All meals", "Yoga classes", "Rafting", "Temple visits"],
        excludes: ["Bungee jumping", "Personal shopping", "Advanced treatments"]
      },
      {
        id: "rishikesh-3day",
        name: "🕉️ Complete Yoga & Adventure Retreat",
        days: 3,
        cost: "₹12,000",
        type: "Wellness & Adventure",
        highlights: ["Yoga teacher training taste", "Multiple adventures", "Ashram life", "Himalayan trek"],
        details: [
          {
            day: 1,
            title: "Spiritual Foundation",
            activities: [
              "5:00 AM - Sunrise yoga and pranayama",
              "7:00 AM - Healthy breakfast at ashram",
              "9:00 AM - Yoga philosophy session",
              "11:00 AM - Multiple ashram visits",
              "1:00 PM - Vegetarian lunch",
              "3:00 PM - Meditation workshop",
              "5:00 PM - Ayurvedic consultation",
              "7:00 PM - Ganga Aarti participation",
              "9:00 PM - Satsang and kirtan"
            ],
            meals: ["Ashram breakfast", "Lunch", "Ashram dinner"],
            accommodation: "Premium ashram accommodation"
          },
          {
            day: 2,
            title: "Adventure & Nature",
            activities: [
              "6:00 AM - Morning yoga session",
              "8:00 AM - Breakfast",
              "9:00 AM - Full day white water rafting",
              "1:00 PM - Lunch during rafting",
              "4:00 PM - Bungee jumping and giant swing",
              "7:00 PM - Evening at Lakshman Jhula market",
              "9:00 PM - Dinner at Little Buddha Cafe"
            ],
            meals: ["Breakfast", "Rafting lunch", "Dinner"],
            accommodation: "Same ashram"
          },
          {
            day: 3,
            title: "Himalayan Connection",
            activities: [
              "5:00 AM - Final sunrise yoga",
              "7:00 AM - Breakfast",
              "8:00 AM - Short trek to waterfalls",
              "12:00 PM - Picnic lunch in nature",
              "3:00 PM - Visit Neelkanth Mahadev Temple",
              "5:00 PM - Certification ceremony (if applicable)",
              "7:00 PM - Final Ganga Aarti",
              "9:00 PM - Farewell dinner and departure prep"
            ],
            meals: ["Breakfast", "Picnic lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Sep-Jun",
        difficulty: "Moderate",
        includes: ["Premium ashram", "All meals", "Yoga certification", "All adventures", "Trekking", "Spiritual guidance"],
        excludes: ["Personal shopping", "Additional treatments", "Extended courses"]
      }
    ]
  },
  {
    cityName: "Varanasi",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/varanasi/mmt/activities/m_Varanasi_temple_l_400_640.jpg",
    description: "One of the world's oldest cities, the spiritual capital of India with ancient temples and Ganga ghats.",
    plans: [
      {
        id: "varanasi-1day",
        name: "🕉️ Sacred Varanasi",
        days: 1,
        cost: "₹3,000",
        type: "Spiritual & Cultural",
        highlights: ["Ganga Aarti", "Boat ride", "Kashi Vishwanath", "Sarnath"],
        details: [{
          day: 1,
          title: "Eternal City Experience",
          activities: [
            "5:00 AM - Sunrise boat ride on Ganges",
            "7:00 AM - Walking tour of ancient ghats",
            "9:00 AM - Kashi Vishwanath Temple visit",
            "11:00 AM - Breakfast at Blue Lassi Shop",
            "1:00 PM - Sarnath Buddhist site visit",
            "4:00 PM - Banaras Hindu University campus",
            "6:00 PM - Evening preparation for Aarti",
            "7:00 PM - Ganga Aarti ceremony at Dashashwamedh Ghat"
          ],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Boat ride", "Temple entries", "Sarnath tour", "Guide"],
        excludes: ["Hotel", "Personal donations", "Photography fees"]
      },
      {
        id: "varanasi-2day",
        name: "🏛️ Ancient Wisdom Trail",
        days: 2,
        cost: "₹7,500",
        type: "Deep Spiritual",
        highlights: ["Multiple ghats", "Spiritual discourses", "Classical music", "Ancient temples"],
        details: [
          {
            day: 1,
            title: "Spiritual Awakening",
            activities: [
              "4:30 AM - Pre-dawn boat ride and sunrise",
              "6:00 AM - Walking meditation along ghats",
              "8:00 AM - Traditional breakfast at Kachori Gali",
              "10:00 AM - Kashi Vishwanath and surrounding temples",
              "1:00 PM - Lunch at Dolphin Restaurant",
              "3:00 PM - Sarnath detailed exploration",
              "6:00 PM - Return for evening preparations",
              "7:00 PM - Ganga Aarti participation",
              "9:00 PM - Classical music performance"
            ],
            meals: ["Traditional breakfast", "Lunch", "Dinner"],
            accommodation: "Heritage guesthouse on ghats"
          },
          {
            day: 2,
            title: "Cultural Deep Dive",
            activities: [
              "5:00 AM - Morning prayers and rituals observation",
              "7:00 AM - Breakfast at guesthouse",
              "9:00 AM - Silk weaving workshop visit",
              "11:00 AM - Ramnagar Fort and museum",
              "1:00 PM - Traditional thali lunch",
              "3:00 PM - Bharat Mata Temple and BHU",
              "5:00 PM - Philosophy discussion with local scholar",
              "7:00 PM - Final Ganga Aarti",
              "9:00 PM - Farewell dinner with cultural program"
            ],
            meals: ["Breakfast", "Thali lunch", "Cultural dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Ghat-side stay", "All tours", "Cultural programs", "Spiritual guidance"],
        excludes: ["Personal donations", "Shopping", "Photography fees"]
      },
      {
        id: "varanasi-3day",
        name: "📿 Complete Spiritual Journey",
        days: 3,
        cost: "₹13,500",
        type: "Ultimate Spiritual",
        highlights: ["Extended Sarnath", "Village visits", "Meditation retreats", "Sanskrit learning"],
        details: [
          {
            day: 1,
            title: "Sacred City Immersion",
            activities: [
              "4:00 AM - Pre-dawn spiritual walk",
              "5:00 AM - Sunrise boat ride with prayers",
              "7:00 AM - Traditional breakfast",
              "9:00 AM - Extended temple tour with priest",
              "12:00 PM - Lunch with local family",
              "3:00 PM - Meditation session with guru",
              "5:00 PM - Classical music learning session",
              "7:00 PM - Ganga Aarti participation",
              "9:00 PM - Spiritual discourse"
            ],
            meals: ["Traditional breakfast", "Family lunch", "Dinner"],
            accommodation: "Premium heritage hotel"
          },
          {
            day: 2,
            title: "Buddhist Heritage & Learning",
            activities: [
              "6:00 AM - Morning meditation",
              "8:00 AM - Breakfast",
              "9:00 AM - Extended Sarnath tour with monastery visit",
              "1:00 PM - Lunch at Buddhist monastery",
              "3:00 PM - Sanskrit learning session",
              "5:00 PM - Village visit near Varanasi",
              "7:00 PM - Rural evening experience",
              "9:00 PM - Dinner with village family"
            ],
            meals: ["Breakfast", "Monastery lunch", "Village dinner"],
            accommodation: "Same heritage hotel"
          },
          {
            day: 3,
            title: "Arts, Crafts & Farewell",
            activities: [
              "5:00 AM - Final sunrise prayers",
              "8:00 AM - Breakfast",
              "9:00 AM - Silk and handicraft workshop tour",
              "12:00 PM - Traditional thali lunch",
              "3:00 PM - Final temple visits and shopping",
              "5:00 PM - Reflection and journal writing",
              "7:00 PM - Final Ganga Aarti",
              "9:00 PM - Farewell dinner with certificate ceremony"
            ],
            meals: ["Breakfast", "Thali lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Moderate",
        includes: ["Heritage hotel", "All experiences", "Learning sessions", "Village visit", "Cultural immersion"],
        excludes: ["Personal donations", "Extended courses", "Private ceremonies"]
      }
    ]
  },
  {
    cityName: "Darjeeling",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/darjeeling/mmt/activities/m_Darjeeling_toy_train_l_400_640.jpg",
    description: "The Queen of Hills in West Bengal, famous for tea gardens, toy train, and Himalayan views.",
    plans: [
      {
        id: "darjeeling-1day",
        name: "🚂 Tea Garden Express",
        days: 1,
        cost: "₹3,500",
        type: "Nature & Heritage",
        highlights: ["Tiger Hill sunrise", "Toy train", "Tea gardens", "Himalayan views"],
        details: [{
          day: 1,
          title: "Queen of Hills",
          activities: [
            "4:00 AM - Tiger Hill sunrise over Kanchenjunga",
            "6:00 AM - Ghoom Monastery visit",
            "8:00 AM - Breakfast at Keventers",
            "10:00 AM - Darjeeling Himalayan Railway (Toy Train)",
            "1:00 PM - Lunch at Glenary's",
            "3:00 PM - Happy Valley Tea Estate tour",
            "5:00 PM - Mall Road shopping and Observatory Hill",
            "7:00 PM - Dinner with mountain views"
          ],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Mar-May, Oct-Dec",
        difficulty: "Easy",
        includes: ["Tiger Hill trip", "Toy train ride", "Tea estate tour", "Guide"],
        excludes: ["Hotel", "Personal shopping", "Additional rides"]
      },
      {
        id: "darjeeling-2day",
        name: "🏔️ Himalayan Heritage",
        days: 2,
        cost: "₹8,500",
        type: "Complete Hill Experience",
        highlights: ["Multiple viewpoints", "Tea factory", "Local culture", "Monasteries"],
        details: [
          {
            day: 1,
            title: "Sunrise & Tea Culture",
            activities: [
              "3:30 AM - Early departure to Tiger Hill",
              "5:00 AM - Sunrise over Himalayan peaks",
              "6:00 AM - Ghoom Monastery and Batasia Loop",
              "8:00 AM - Breakfast at hill station hotel",
              "10:00 AM - Darjeeling Himalayan Railway experience",
              "1:00 PM - Lunch at The Park Hotel",
              "3:00 PM - Happy Valley Tea Estate detailed tour",
              "6:00 PM - Evening at Mall Road",
              "8:00 PM - Dinner at Sonam's Kitchen"
            ],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "3-star hill hotel"
          },
          {
            day: 2,
            title: "Culture & Adventure",
            activities: [
              "7:00 AM - Morning walk to Observatory Hill",
              "9:00 AM - Padmaja Naidu Himalayan Zoological Park",
              "11:00 AM - Himalayan Mountaineering Institute",
              "1:00 PM - Lunch at Dekeling Resort",
              "3:00 PM - Japanese Peace Pagoda visit",
              "5:00 PM - Lebong Race Course (world's smallest)",
              "7:00 PM - Cultural program at hotel",
              "9:00 PM - Farewell dinner"
            ],
            meals: ["Breakfast", "Lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Mar-May, Oct-Dec",
        difficulty: "Easy",
        includes: ["Hill hotel", "All tours", "Tiger Hill trip", "Cultural programs"],
        excludes: ["Personal shopping", "Additional activities", "Tips"]
      },
      {
        id: "darjeeling-3day",
        name: "🌿 Complete Tea & Himalaya Experience",
        days: 3,
        cost: "₹15,000",
        type: "Ultimate Hill Station",
        highlights: ["Tea master class", "Sandakphu trek", "Local villages", "Heritage experiences"],
        details: [
          {
            day: 1,
            title: "Himalayan Dawn & Heritage",
            activities: [
              "3:30 AM - Tiger Hill sunrise expedition",
              "5:30 AM - Ghoom Monastery prayers",
              "7:00 AM - Traditional breakfast",
              "9:00 AM - Heritage toy train full circuit",
              "1:00 PM - Lunch at Windamere Hotel",
              "3:00 PM - Tea estate with master class",
              "6:00 PM - Evening at Chowrasta Mall",
              "8:00 PM - Welcome dinner with cultural show"
            ],
            meals: ["Traditional breakfast", "Heritage lunch", "Cultural dinner"],
            accommodation: "4-star heritage hotel"
          },
          {
            day: 2,
            title: "Adventure & Wildlife",
            activities: [
              "6:00 AM - Early morning nature walk",
              "8:00 AM - Breakfast at hotel",
              "9:00 AM - Padmaja Naidu Zoo and Snow Leopard",
              "11:00 AM - Himalayan Mountaineering Institute",
              "1:00 PM - Lunch at The Elgin",
              "3:00 PM - Day trek to nearby village",
              "6:00 PM - Village interaction and tea ceremony",
              "8:00 PM - Dinner with local family"
            ],
            meals: ["Breakfast", "Lunch", "Village dinner"],
            accommodation: "Same heritage hotel"
          },
          {
            day: 3,
            title: "Spiritual & Scenic Finale",
            activities: [
              "7:00 AM - Japanese Peace Pagoda meditation",
              "9:00 AM - Breakfast with panoramic views",
              "10:00 AM - Rock Garden and Ganga Maya Park",
              "12:00 PM - Final tea garden visit with tasting",
              "2:00 PM - Farewell lunch at Glenary's",
              "4:00 PM - Last-minute shopping at Mall Road",
              "6:00 PM - Sunset viewing from Observatory Hill",
              "8:00 PM - Farewell dinner at Shangri-La"
            ],
            meals: ["Breakfast", "Farewell lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Mar-May, Oct-Dec",
        difficulty: "Moderate",
        includes: ["Heritage hotel", "All meals", "Tea master class", "Village trek", "Cultural immersion"],
        excludes: ["Extended treks", "Personal shopping", "Additional tours"]
      }
    ]
  },
  {
    cityName: "Amritsar",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/amritsar/mmt/activities/m_Amritsar_golden_temple_l_400_640.jpg",
    description: "The spiritual center of Sikhism, home to the Golden Temple and rich Punjabi culture.",
    plans: [
      {
        id: "amritsar-1day",
        name: "🏛️ Golden Temple Experience",
        days: 1,
        cost: "₹2,500",
        type: "Spiritual & Cultural",
        highlights: ["Golden Temple", "Jallianwala Bagh", "Wagah Border", "Langar"],
        details: [{
          day: 1,
          title: "Sacred Amritsar",
          activities: [
            "5:00 AM - Early morning Golden Temple visit",
            "6:00 AM - Participate in morning prayers",
            "8:00 AM - Langar (community kitchen) experience",
            "10:00 AM - Jallianwala Bagh memorial visit",
            "12:00 PM - Lunch at Bharawan Da Dhaba",
            "2:00 PM - Partition Museum visit",
            "4:00 PM - Drive to Wagah Border",
            "6:00 PM - Wagah Border ceremony",
            "8:00 PM - Dinner at Golden Temple community hall"
          ],
          meals: ["Langar breakfast", "Lunch", "Community dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Transportation", "Guide", "Border ceremony tickets"],
        excludes: ["Hotel", "Personal expenses", "Donations"]
      },
      {
        id: "amritsar-2day",
        name: "🙏 Sikh Heritage Trail",
        days: 2,
        cost: "₹6,500",
        type: "Heritage & Spiritual",
        highlights: ["Extended Golden Temple", "Guru heritage", "Rural Punjab", "Traditional crafts"],
        details: [
          {
            day: 1,
            title: "Golden Temple Deep Dive",
            activities: [
              "4:00 AM - Pre-dawn Golden Temple visit",
              "5:00 AM - Morning prayers participation",
              "7:00 AM - Langar service volunteering",
              "9:00 AM - Temple complex detailed tour",
              "12:00 PM - Lunch at temple community hall",
              "2:00 PM - Guru Ram Das Sarai visit",
              "4:00 PM - Akal Takht and Sikh Museum",
              "6:00 PM - Evening prayers and kirtan",
              "8:00 PM - Traditional Punjabi dinner"
            ],
            meals: ["Langar breakfast", "Community lunch", "Punjabi dinner"],
            accommodation: "Heritage hotel near temple"
          },
          {
            day: 2,
            title: "History & Border Experience",
            activities: [
              "8:00 AM - Breakfast and check-out",
              "9:00 AM - Jallianwala Bagh detailed visit",
              "11:00 AM - Partition Museum comprehensive tour",
              "1:00 PM - Lunch at Kulcha Land",
              "3:00 PM - Rural Punjab village visit",
              "5:00 PM - Drive to Wagah Border",
              "6:30 PM - Wagah Border ceremony",
              "8:30 PM - Farewell dinner at Haveli"
            ],
            meals: ["Breakfast", "Kulcha lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Heritage hotel", "All tours", "Village visit", "Border ceremony"],
        excludes: ["Personal shopping", "Donations", "Additional activities"]
      },
      {
        id: "amritsar-3day",
        name: "🌾 Complete Punjab Cultural Journey",
        days: 3,
        cost: "₹12,000",
        type: "Cultural Immersion",
        highlights: ["Spiritual immersion", "Rural Punjab", "Traditional arts", "Sikh history"],
        details: [
          {
            day: 1,
            title: "Spiritual Foundation",
            activities: [
              "3:30 AM - Pre-dawn Golden Temple meditation",
              "5:00 AM - Morning prayers and hymns",
              "7:00 AM - Volunteer in langar kitchen",
              "10:00 AM - Meeting with temple priests",
              "1:00 PM - Community lunch at temple",
              "3:00 PM - Sikh philosophy discussion",
              "5:00 PM - Temple complex photography tour",
              "7:00 PM - Evening prayers participation",
              "9:00 PM - Dinner and spiritual discourse"
            ],
            meals: ["Langar breakfast", "Community lunch", "Spiritual dinner"],
            accommodation: "Premium heritage hotel"
          },
          {
            day: 2,
            title: "Historical Journey",
            activities: [
              "8:00 AM - Breakfast at hotel",
              "9:00 AM - Jallianwala Bagh with historian guide",
              "11:00 AM - Partition Museum extended tour",
              "1:00 PM - Traditional Punjabi thali lunch",
              "3:00 PM - Gobindgarh Fort visit",
              "5:00 PM - Traditional Punjabi village experience",
              "7:00 PM - Village dinner with folk performance",
              "9:00 PM - Return to hotel"
            ],
            meals: ["Breakfast", "Thali lunch", "Village dinner"],
            accommodation: "Same heritage hotel"
          },
          {
            day: 3,
            title: "Border & Arts Experience",
            activities: [
              "8:00 AM - Breakfast and check-out",
              "9:00 AM - Traditional craft workshop (Phulkari)",
              "12:00 PM - Lunch at famous Amritsari kulcha place",
              "2:00 PM - Final Golden Temple visit",
              "4:00 PM - Drive to Wagah Border",
              "6:00 PM - VIP seating for border ceremony",
              "8:00 PM - Return journey",
              "9:00 PM - Farewell dinner at The Grand"
            ],
            meals: ["Breakfast", "Kulcha lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Premium hotel", "All cultural experiences", "VIP border ceremony", "Workshop participation", "Spiritual guidance"],
        excludes: ["Personal shopping", "Extended courses", "Private ceremonies"]
      }
    ]
  },
  {
    cityName: "Hyderabad",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/hyderabad/mmt/activities/m_Hyderabad_charminar_l_400_640.jpg",
    description: "The City of Pearls and IT hub, famous for Charminar, Golconda Fort, and world-famous biryani.",
    plans: [
      {
        id: "hyderabad-1day",
        name: "🏰 Nizami Heritage Express",
        days: 1,
        cost: "₹3,500",
        type: "Heritage & Cuisine",
        highlights: ["Charminar", "Golconda Fort", "Biryani tour", "Laad Bazaar"],
        details: [{
          day: 1,
          title: "City of Pearls",
          activities: [
            "8:00 AM - Golconda Fort exploration and sound show prep",
            "10:00 AM - Qutb Shahi Tombs visit",
            "12:00 PM - Lunch at famous Paradise Biryani",
            "2:00 PM - Charminar and surrounding old city",
            "4:00 PM - Laad Bazaar shopping (pearls, bangles)",
            "6:00 PM - Mecca Masjid visit",
            "7:30 PM - Golconda Fort sound and light show",
            "9:30 PM - Dinner at Shah Ghouse Cafe"
          ],
          meals: ["Breakfast", "Paradise lunch", "Cafe dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Fort entries", "Sound show", "Food tour", "Guide"],
        excludes: ["Hotel", "Shopping", "Personal expenses"]
      },
      {
        id: "hyderabad-2day",
        name: "💎 Nizami Culture & Modern Tech",
        days: 2,
        cost: "₹8,000",
        type: "Heritage & Modern",
        highlights: ["Multiple palaces", "Salar Jung Museum", "HITEC City", "Food tours"],
        details: [
          {
            day: 1,
            title: "Nizami Grandeur",
            activities: [
              "9:00 AM - Chowmahalla Palace royal tour",
              "11:00 AM - Salar Jung Museum (world's largest individual collection)",
              "1:00 PM - Traditional Hyderabadi lunch at Jewel of Nizam",
              "3:00 PM - Charminar and Mecca Masjid",
              "5:00 PM - Laad Bazaar pearl shopping",
              "7:00 PM - Hussain Sagar Lake and Buddha statue",
              "8:30 PM - Golconda Fort sound and light show"
            ],
            meals: ["Breakfast", "Nizami lunch", "Dinner"],
            accommodation: "4-star hotel in Banjara Hills"
          },
          {
            day: 2,
            title: "Modern Hyderabad & Food",
            activities: [
              "9:00 AM - Ramoji Film City tour (world's largest)",
              "1:00 PM - Lunch at film city",
              "4:00 PM - Return to city",
              "5:00 PM - HITEC City and Cyber Towers",
              "7:00 PM - Birla Mandir sunset views",
              "8:30 PM - Street food tour at Tank Bund",
              "10:00 PM - Late dinner at Bawarchi"
            ],
            meals: ["Breakfast", "Film city lunch", "Street food dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Hotel", "Film city tour", "All monuments", "Food tours"],
        excludes: ["Personal shopping", "Additional film city activities", "Tips"]
      },
      {
        id: "hyderabad-3day",
        name: "👑 Complete Deccan Experience",
        days: 3,
        cost: "₹15,500",
        type: "Ultimate Heritage & Modern",
        highlights: ["All palaces", "Nagarjunasagar", "Cooking classes", "Comprehensive tours"],
        details: [
          {
            day: 1,
            title: "Royal Heritage Circuit",
            activities: [
              "8:00 AM - Golconda Fort detailed exploration",
              "10:00 AM - Qutb Shahi Tombs archaeological tour",
              "1:00 PM - Royal lunch at Falaknuma Palace",
              "3:00 PM - Chowmahalla Palace with audio guide",
              "5:00 PM - Paigah Tombs visit",
              "7:00 PM - Traditional dinner at Adaa",
              "9:00 PM - Golconda sound and light show"
            ],
            meals: ["Breakfast", "Palace lunch", "Traditional dinner"],
            accommodation: "5-star heritage hotel"
          },
          {
            day: 2,
            title: "Culture & Entertainment",
            activities: [
              "8:00 AM - Salar Jung Museum comprehensive tour",
              "11:00 AM - Hyderabadi cooking class",
              "1:00 PM - Cooking class lunch (self-prepared)",
              "3:00 PM - Ramoji Film City full day experience",
              "8:00 PM - Film city cultural dinner show",
              "10:00 PM - Return to hotel"
            ],
            meals: ["Breakfast", "Cooking class lunch", "Film city dinner"],
            accommodation: "Same heritage hotel"
          },
          {
            day: 3,
            title: "Modern City & Day Trip",
            activities: [
              "7:00 AM - Day trip to Nagarjunasagar",
              "9:00 AM - Nagarjunasagar Dam and Buddhist sites",
              "1:00 PM - Lunch at lakeside resort",
              "3:00 PM - Return to Hyderabad",
              "5:00 PM - HITEC City and modern malls",
              "7:00 PM - Birla Mandir and city views",
              "9:00 PM - Farewell feast at Paradise"
            ],
            meals: ["Breakfast", "Lakeside lunch", "Farewell feast"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Moderate",
        includes: ["Heritage hotel", "Palace dining", "Cooking class", "Day trip", "All experiences"],
        excludes: ["Personal shopping", "Extended film city packages", "Spa treatments"]
      }
    ]
  },
  {
    cityName: "Bangalore",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/bangalore/mmt/activities/m_Bangalore_lalbagh_l_400_640.jpg",
    description: "India's Silicon Valley, known for its tech industry, pleasant climate, gardens, and vibrant nightlife.",
    plans: [
      {
        id: "bangalore-1day",
        name: "🌿 Garden City Express",
        days: 1,
        cost: "₹3,000",
        type: "City & Gardens",
        highlights: ["Lalbagh Gardens", "Bangalore Palace", "UB City Mall", "Pub culture"],
        details: [{
          day: 1,
          title: "Silicon Valley of India",
          activities: [
            "9:00 AM - Lalbagh Botanical Gardens morning walk",
            "11:00 AM - Bangalore Palace royal tour",
            "1:00 PM - Lunch at MTR (Mavalli Tiffin Room)",
            "3:00 PM - Cubbon Park and Government Museum",
            "5:00 PM - UB City Mall and shopping",
            "7:00 PM - Commercial Street evening",
            "9:00 PM - Microbrewery dinner at Toit"
          ],
          meals: ["Breakfast", "MTR lunch", "Brewery dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Oct-Feb",
        difficulty: "Easy",
        includes: ["Transportation", "Palace entry", "Guide"],
        excludes: ["Hotel", "Alcohol", "Personal shopping"]
      },
      {
        id: "bangalore-2day",
        name: "🏛️ Tech & Tradition",
        days: 2,
        cost: "₹7,500",
        type: "Modern & Heritage",
        highlights: ["Tech parks", "Traditional markets", "Nandi Hills", "Food tours"],
        details: [
          {
            day: 1,
            title: "Heritage & Gardens",
            activities: [
              "8:00 AM - Bangalore Palace detailed tour",
              "10:00 AM - Lalbagh morning photography",
              "12:00 PM - Traditional South Indian lunch",
              "2:00 PM - Cubbon Park and Vidhana Soudha",
              "4:00 PM - Bull Temple and Basavanagudi",
              "6:00 PM - KR Market spice shopping",
              "8:00 PM - Dinner at Karavalli"
            ],
            meals: ["Breakfast", "South Indian lunch", "Traditional dinner"],
            accommodation: "4-star hotel in MG Road"
          },
          {
            day: 2,
            title: "Modern Bangalore & Hills",
            activities: [
              "5:00 AM - Early drive to Nandi Hills",
              "6:30 AM - Sunrise viewing and trekking",
              "9:00 AM - Breakfast at hilltop",
              "11:00 AM - Return to city",
              "1:00 PM - Lunch at Koshy's Restaurant",
              "3:00 PM - Electronic City tech tour",
              "6:00 PM - Brigade Road shopping",
              "8:00 PM - Pub crawl on Church Street"
            ],
            meals: ["Breakfast", "Koshy's lunch", "Pub dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Feb",
        difficulty: "Moderate",
        includes: ["Hotel", "Nandi Hills trip", "Tech tour", "All meals"],
        excludes: ["Alcohol", "Personal shopping", "Tips"]
      },
      {
        id: "bangalore-3day",
        name: "🌟 Complete Silicon Valley Experience",
        days: 3,
        cost: "₹14,000",
        type: "Tech, Heritage & Nature",
        highlights: ["Multiple tech parks", "Day trip to Mysore", "Garden tours", "Nightlife"],
        details: [
          {
            day: 1,
            title: "Tech Capital & Gardens",
            activities: [
              "9:00 AM - Infosys Mysore campus tour",
              "11:00 AM - Electronic City corporate visits",
              "1:00 PM - Tech park lunch",
              "3:00 PM - Lalbagh and rose garden",
              "5:00 PM - Bangalore Palace with audio guide",
              "7:00 PM - UB City luxury shopping",
              "9:00 PM - Rooftop dinner at 13th Floor"
            ],
            meals: ["Breakfast", "Tech lunch", "Rooftop dinner"],
            accommodation: "5-star tech hotel"
          },
          {
            day: 2,
            title: "Mysore Day Trip",
            activities: [
              "7:00 AM - Drive to Mysore (3 hours)",
              "10:00 AM - Mysore Palace royal tour",
              "12:00 PM - Traditional Mysore lunch",
              "2:00 PM - Chamundi Hills and temple",
              "4:00 PM - Mysore silk factory visit",
              "6:00 PM - Return to Bangalore",
              "9:00 PM - Late dinner at hotel"
            ],
            meals: ["Breakfast", "Mysore lunch", "Late dinner"],
            accommodation: "Same tech hotel"
          },
          {
            day: 3,
            title: "Culture & Nightlife",
            activities: [
              "8:00 AM - Nandi Hills sunrise expedition",
              "11:00 AM - Return and fresh up",
              "1:00 PM - Farewell lunch at Rim Naam",
              "3:00 PM - Cubbon Park final walk",
              "5:00 PM - Commercial Street shopping",
              "7:00 PM - Craft beer tasting tour",
              "10:00 PM - Club hopping experience"
            ],
            meals: ["Breakfast", "Rim Naam lunch", "Club dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Feb",
        difficulty: "Moderate",
        includes: ["Tech hotel", "Mysore day trip", "Tech tours", "Nightlife guide", "All experiences"],
        excludes: ["Alcohol costs", "Personal shopping", "Extended tech visits"]
      }
    ]
  },
  {
    cityName: "Chennai",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/chennai/mmt/activities/m_Chennai_marina_beach_l_400_640.jpg",
    description: "Cultural capital of South India, famous for classical music, dance, temples, and Marina Beach.",
    plans: [
      {
        id: "chennai-1day",
        name: "🏛️ Cultural Chennai",
        days: 1,
        cost: "₹3,200",
        type: "Culture & Heritage",
        highlights: ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George", "Classical music"],
        details: [{
          day: 1,
          title: "Detroit of India",
          activities: [
            "8:00 AM - Fort St. George and museum",
            "10:00 AM - Kapaleeshwarar Temple (Mylapore)",
            "12:00 PM - Traditional Tamil lunch",
            "2:00 PM - Government Museum and bronze gallery",
            "4:00 PM - Marina Beach evening walk",
            "6:00 PM - San Thome Cathedral",
            "8:00 PM - Classical music concert (if available)",
            "10:00 PM - Dinner at Dakshin"
          ],
          meals: ["Breakfast", "Tamil lunch", "Cultural dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Nov-Feb",
        difficulty: "Easy",
        includes: ["Transportation", "Temple entries", "Museum tickets", "Guide"],
        excludes: ["Hotel", "Concert tickets", "Personal expenses"]
      },
      {
        id: "chennai-2day",
        name: "🎭 Temple Trail & Arts",
        days: 2,
        cost: "₹8,200",
        type: "Heritage & Arts",
        highlights: ["Multiple temples", "Bharatanatyam show", "Mahabalipuram", "Beach resorts"],
        details: [
          {
            day: 1,
            title: "Temple City Tour",
            activities: [
              "8:00 AM - Kapaleeshwarar Temple morning prayers",
              "10:00 AM - Parthasarathy Temple (Triplicane)",
              "12:00 PM - Traditional vegetarian meals",
              "2:00 PM - Government Museum complex",
              "4:00 PM - DakshinaChitra heritage village",
              "7:00 PM - Marina Beach sunset",
              "8:30 PM - Bharatanatyam dance performance",
              "10:00 PM - Dinner at Annalakshmi"
            ],
            meals: ["Breakfast", "Temple meals", "Cultural dinner"],
            accommodation: "Heritage hotel near Marina"
          },
          {
            day: 2,
            title: "Mahabalipuram Day Trip",
            activities: [
              "7:00 AM - Drive to Mahabalipuram",
              "9:00 AM - Shore Temple sunrise visit",
              "11:00 AM - Five Rathas and cave temples",
              "1:00 PM - Beachside seafood lunch",
              "3:00 PM - Arjuna's Penance rock carving",
              "5:00 PM - Beach relaxation",
              "7:00 PM - Return to Chennai",
              "9:00 PM - Farewell dinner at Peshawri"
            ],
            meals: ["Breakfast", "Seafood lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Nov-Feb",
        difficulty: "Easy",
        includes: ["Heritage hotel", "Mahabalipuram tour", "Cultural shows", "All meals"],
        excludes: ["Personal shopping", "Water sports", "Tips"]
      },
      {
        id: "chennai-3day",
        name: "🌊 Complete Tamil Culture Experience",
        days: 3,
        cost: "₹15,800",
        type: "Ultimate South Indian",
        highlights: ["Extended temple tours", "Kanchipuram trip", "Classical arts", "Culinary journey"],
        details: [
          {
            day: 1,
            title: "Chennai Heritage Deep Dive",
            activities: [
              "7:00 AM - Early morning temple hopping",
              "9:00 AM - Fort St. George detailed tour",
              "11:00 AM - Government Museum full experience",
              "1:00 PM - Chettinad cuisine lunch",
              "3:00 PM - Kalakshetra classical arts center",
              "5:00 PM - Theosophical Society gardens",
              "7:00 PM - Marina Beach cultural walk",
              "9:00 PM - Classical music concert"
            ],
            meals: ["Breakfast", "Chettinad lunch", "Concert dinner"],
            accommodation: "5-star cultural hotel"
          },
          {
            day: 2,
            title: "Kanchipuram Silk & Temples",
            activities: [
              "7:00 AM - Drive to Kanchipuram (2 hours)",
              "9:00 AM - Ekambareswarar Temple",
              "11:00 AM - Kailasanathar Temple",
              "1:00 PM - Traditional temple lunch",
              "3:00 PM - Silk weaving workshop and shopping",
              "5:00 PM - Varadharaja Perumal Temple",
              "7:00 PM - Return to Chennai",
              "9:30 PM - Late dinner at hotel"
            ],
            meals: ["Breakfast", "Temple lunch", "Late dinner"],
            accommodation: "Same cultural hotel"
          },
          {
            day: 3,
            title: "Arts, Crafts & Culinary Finale",
            activities: [
              "8:00 AM - Bharatanatyam learning workshop",
              "10:00 AM - DakshinaChitra extended visit",
              "1:00 PM - Cooking class - Tamil cuisine",
              "3:00 PM - Cooking class lunch (self-prepared)",
              "5:00 PM - T. Nagar shopping experience",
              "7:00 PM - Express Avenue mall",
              "9:00 PM - Grand farewell feast at Southern Spice"
            ],
            meals: ["Breakfast", "Cooking class lunch", "Grand farewell"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Nov-Feb",
        difficulty: "Moderate",
        includes: ["Cultural hotel", "Kanchipuram trip", "Arts workshops", "Cooking class", "All cultural experiences"],
        excludes: ["Silk shopping costs", "Extended courses", "Personal expenses"]
      }
    ]
  },
  {
    cityName: "Kolkata",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/kolkata/mmt/activities/m_Kolkata_victoria_memorial_l_400_640.jpg",
    description: "The Cultural Capital and City of Joy, famous for literature, art, Durga Puja, and colonial architecture.",
    plans: [
      {
        id: "kolkata-1day",
        name: "🏛️ City of Joy Express",
        days: 1,
        cost: "₹2,800",
        type: "Heritage & Culture",
        highlights: ["Victoria Memorial", "Howrah Bridge", "Park Street", "Bengali cuisine"],
        details: [{
          day: 1,
          title: "Cultural Capital Experience",
          activities: [
            "8:00 AM - Victoria Memorial and museum",
            "10:00 AM - Howrah Bridge and flower market",
            "12:00 PM - Traditional Bengali fish lunch",
            "2:00 PM - Indian Museum (oldest in India)",
            "4:00 PM - College Street book market",
            "6:00 PM - Kalighat Temple visit",
            "8:00 PM - Park Street evening and dinner at Peter Cat"
          ],
          meals: ["Breakfast", "Bengali lunch", "Park Street dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Transportation", "Museum entries", "Guide", "Heritage walk"],
        excludes: ["Hotel", "Book shopping", "Personal expenses"]
      },
      {
        id: "kolkata-2day",
        name: "📚 Literature & Heritage Trail",
        days: 2,
        cost: "₹7,800",
        type: "Cultural Deep Dive",
        highlights: ["Tagore House", "Writers' Building", "Dakshineswar", "Kumartuli"],
        details: [
          {
            day: 1,
            title: "Colonial Heritage",
            activities: [
              "8:00 AM - Victoria Memorial detailed tour",
              "10:00 AM - St. Paul's Cathedral",
              "12:00 PM - Lunch at 6 Ballygunge Place",
              "2:00 PM - Indian Museum comprehensive visit",
              "4:00 PM - Writers' Building and BBD Bagh",
              "6:00 PM - Howrah Bridge sunset walk",
              "8:00 PM - Cultural dinner at Oh! Calcutta"
            ],
            meals: ["Breakfast", "Bengali lunch", "Cultural dinner"],
            accommodation: "Heritage hotel on Park Street"
          },
          {
            day: 2,
            title: "Spiritual & Literary Journey",
            activities: [
              "8:00 AM - Dakshineswar Temple boat trip",
              "10:00 AM - Belur Math peaceful visit",
              "1:00 PM - Lunch at temple community kitchen",
              "3:00 PM - Rabindra Bharati Museum (Tagore House)",
              "5:00 PM - Kumartuli potter's quarter",
              "7:00 PM - College Street coffee house",
              "9:00 PM - Farewell dinner at Mocambo"
            ],
            meals: ["Breakfast", "Temple lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Heritage hotel", "River trip", "All cultural sites", "Literary tours"],
        excludes: ["Personal shopping", "Extended temple stays", "Tips"]
      },
      {
        id: "kolkata-3day",
        name: "🎭 Complete Bengal Cultural Immersion",
        days: 3,
        cost: "₹14,500",
        type: "Ultimate Cultural Experience",
        highlights: ["Shantiniketan trip", "Durga Puja sites", "Adda sessions", "Bengali arts"],
        details: [
          {
            day: 1,
            title: "Colonial Grandeur & Museums",
            activities: [
              "8:00 AM - Victoria Memorial private tour",
              "10:00 AM - Marble Palace hidden gem",
              "12:00 PM - Traditional Bengali thali",
              "2:00 PM - Indian Museum with expert guide",
              "4:00 PM - St. John's Church and cemetery",
              "6:00 PM - Princep Ghat evening boat ride",
              "8:00 PM - Cultural performance at Rabindra Sadan",
              "10:00 PM - Late dinner at Flurys"
            ],
            meals: ["Breakfast", "Bengali thali", "Cultural dinner"],
            accommodation: "5-star heritage hotel"
          },
          {
            day: 2,
            title: "Shantiniketan Day Trip",
            activities: [
              "6:00 AM - Early train to Shantiniketan",
              "9:00 AM - Visva Bharati University tour",
              "11:00 AM - Tagore's Ashram and museum",
              "1:00 PM - University canteen lunch",
              "3:00 PM - Kala Bhavan art galleries",
              "5:00 PM - Upasana Griha meditation",
              "7:00 PM - Return train to Kolkata",
              "10:00 PM - Late dinner at hotel"
            ],
            meals: ["Breakfast", "University lunch", "Late dinner"],
            accommodation: "Same heritage hotel"
          },
          {
            day: 3,
            title: "Arts, Crafts & Literary Finale",
            activities: [
              "8:00 AM - Kumartuli artisan workshops",
              "10:00 AM - Kalighat painting session",
              "1:00 PM - Cooking class - Bengali specialties",
              "3:00 PM - Cooking class lunch (self-made)",
              "5:00 PM - College Street adda at coffee house",
              "7:00 PM - New Market final shopping",
              "9:00 PM - Grand Bengali feast at Bhojohori Manna"
            ],
            meals: ["Breakfast", "Cooking class lunch", "Grand feast"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Moderate",
        includes: ["Heritage hotel", "Shantiniketan trip", "Art workshops", "Cooking class", "All cultural experiences"],
        excludes: ["Personal shopping", "Extended art courses", "Additional train bookings"]
      }
    ]
  },
  {
    cityName: "Pune",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/pune/mmt/activities/m_Pune_shaniwar_wada_l_400_640.jpg",
    description: "Oxford of the East, known for educational institutions, pleasant climate, and historical significance.",
    plans: [
      {
        id: "pune-1day",
        name: "🎓 Oxford of the East",
        days: 1,
        cost: "₹2,500",
        type: "Heritage & Education",
        highlights: ["Shaniwar Wada", "Aga Khan Palace", "Osho Ashram", "FC Road"],
        details: [{
          day: 1,
          title: "Cultural & Educational Hub",
          activities: [
            "8:00 AM - Shaniwar Wada fort and light show info",
            "10:00 AM - Aga Khan Palace and Gandhi connection",
            "12:00 PM - Traditional Maharashtrian lunch",
            "2:00 PM - Osho International Meditation Resort",
            "4:00 PM - Pune University campus tour",
            "6:00 PM - FC Road and German Bakery",
            "8:00 PM - Dinner at Malaka Spice"
          ],
          meals: ["Breakfast", "Maharashtrian lunch", "Dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Oct-Mar",
        difficulty: "Easy",
        includes: ["Transportation", "Fort entry", "Campus tour", "Guide"],
        excludes: ["Hotel", "Meditation sessions", "Personal expenses"]
      },
      {
        id: "pune-2day",
        name: "🏰 Hill Stations & Heritage",
        days: 2,
        cost: "₹7,200",
        type: "Heritage & Nature",
        highlights: ["Lonavala day trip", "Rajgad fort", "Pune heritage", "Hill station experience"],
        details: [
          {
            day: 1,
            title: "Pune Heritage Circuit",
            activities: [
              "8:00 AM - Shaniwar Wada detailed exploration",
              "10:00 AM - Lal Mahal (Shivaji's palace)",
              "12:00 PM - Traditional Pune lunch at Durvankur",
              "2:00 PM - Aga Khan Palace comprehensive tour",
              "4:00 PM - Pataleshwar Cave Temple",
              "6:00 PM - MG Road and Pune Central",
              "8:00 PM - Dinner at German Bakery",
              "9:30 PM - Shaniwar Wada light and sound show"
            ],
            meals: ["Breakfast", "Traditional lunch", "Bakery dinner"],
            accommodation: "3-star hotel near MG Road"
          },
          {
            day: 2,
            title: "Lonavala Hill Station",
            activities: [
              "7:00 AM - Early drive to Lonavala",
              "9:00 AM - Tiger's Leap viewpoint",
              "11:00 AM - Bhushi Dam and waterfalls",
              "1:00 PM - Hill station lunch",
              "3:00 PM - Karla and Bhaja Caves",
              "5:00 PM - Lonavala Lake sunset",
              "7:00 PM - Return to Pune",
              "9:00 PM - Farewell dinner at Shabree"
            ],
            meals: ["Breakfast", "Hill lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Moderate",
        includes: ["Hotel", "Lonavala trip", "Cave entries", "Light show"],
        excludes: ["Personal shopping", "Additional activities", "Tips"]
      },
      {
        id: "pune-3day",
        name: "⛰️ Complete Maharashtra Experience",
        days: 3,
        cost: "₹12,800",
        type: "Heritage, Hills & Adventure",
        highlights: ["Multiple forts", "Mahabaleshwar", "Adventure sports", "Local culture"],
        details: [
          {
            day: 1,
            title: "Pune Historical Deep Dive",
            activities: [
              "8:00 AM - Shaniwar Wada with historian guide",
              "10:00 AM - Lal Mahal and Shivaji Museum",
              "12:00 PM - Royal Maharashtrian thali",
              "2:00 PM - Aga Khan Palace extended tour",
              "4:00 PM - Raja Dinkar Kelkar Museum",
              "6:00 PM - Osho meditation session",
              "8:00 PM - Cultural dinner with folk show",
              "10:00 PM - Shaniwar Wada sound and light"
            ],
            meals: ["Breakfast", "Royal thali", "Cultural dinner"],
            accommodation: "4-star heritage hotel"
          },
          {
            day: 2,
            title: "Mahabaleshwar Hill Station",
            activities: [
              "6:00 AM - Early drive to Mahabaleshwar",
              "8:00 AM - Breakfast en route",
              "10:00 AM - Arthur's Seat viewpoint",
              "12:00 PM - Strawberry farms and lunch",
              "2:00 PM - Pratapgad Fort trek",
              "5:00 PM - Venna Lake boating",
              "7:00 PM - Hill station dinner",
              "8:00 PM - Overnight in Mahabaleshwar"
            ],
            meals: ["Breakfast", "Farm lunch", "Hill dinner"],
            accommodation: "Hill resort"
          },
          {
            day: 3,
            title: "Adventure & Return",
            activities: [
              "7:00 AM - Wilson Point sunrise",
              "9:00 AM - Breakfast at resort",
              "10:00 AM - Adventure activities (rappelling/zip-line)",
              "1:00 PM - Lunch at Mapro Garden",
              "3:00 PM - Return journey to Pune",
              "6:00 PM - FC Road final shopping",
              "8:00 PM - Farewell dinner at Malaka Spice"
            ],
            meals: ["Breakfast", "Garden lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Oct-Mar",
        difficulty: "Moderate",
        includes: ["Heritage hotel", "Hill resort", "All activities", "Adventure sports", "Cultural experiences"],
        excludes: ["Personal shopping", "Extended meditation courses", "Additional fort treks"]
      }
    ]
  },
  {
    cityName: "Leh-Ladakh",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/leh/mmt/activities/m_Leh_pangong_lake_l_400_640.jpg",
    description: "Land of High Passes, famous for stunning landscapes, Buddhist monasteries, and adventure tourism.",
    plans: [
      {
        id: "leh-1day",
        name: "🏔️ Leh Acclimatization",
        days: 1,
        cost: "₹4,000",
        type: "Acclimatization & Culture",
        highlights: ["Leh Palace", "Shanti Stupa", "Local market", "Monastery visit"],
        details: [{
          day: 1,
          title: "High Altitude Adjustment",
          activities: [
            "10:00 AM - Light breakfast and rest (altitude adjustment)",
            "12:00 PM - Leh Palace gentle tour",
            "2:00 PM - Traditional Ladakhi lunch",
            "4:00 PM - Local market exploration",
            "6:00 PM - Shanti Stupa sunset visit",
            "8:00 PM - Early dinner and rest",
            "Note: Complete rest day for altitude acclimatization"
          ],
          meals: ["Light breakfast", "Ladakhi lunch", "Early dinner"],
          accommodation: "Day trip (recommended overnight stay)"
        }],
        bestTime: "May-Sep",
        difficulty: "Easy (High Altitude)",
        includes: ["Gentle sightseeing", "Guide", "Acclimatization tips"],
        excludes: ["Hotel", "High altitude activities", "Strenuous tours"]
      },
      {
        id: "leh-2day",
        name: "🏛️ Monasteries & Culture",
        days: 2,
        cost: "₹9,500",
        type: "Buddhist Culture",
        highlights: ["Hemis Monastery", "Thiksey Monastery", "Indus Valley", "Traditional culture"],
        details: [
          {
            day: 1,
            title: "Leh Local Sightseeing",
            activities: [
              "9:00 AM - Gentle start with breakfast",
              "10:00 AM - Leh Palace and museum",
              "12:00 PM - Traditional Ladakhi lunch",
              "2:00 PM - Rest and acclimatization",
              "4:00 PM - Local market and handicrafts",
              "6:00 PM - Shanti Stupa for sunset",
              "8:00 PM - Early dinner and rest"
            ],
            meals: ["Breakfast", "Ladakhi lunch", "Early dinner"],
            accommodation: "High altitude hotel in Leh"
          },
          {
            day: 2,
            title: "Indus Valley Monasteries",
            activities: [
              "8:00 AM - Drive to Thiksey Monastery",
              "9:00 AM - Morning prayers at Thiksey",
              "11:00 AM - Hemis Monastery visit",
              "1:00 PM - Monastery lunch",
              "3:00 PM - Shey Palace ruins",
              "5:00 PM - Indus and Zanskar confluence",
              "7:00 PM - Return to Leh",
              "8:00 PM - Traditional dinner"
            ],
            meals: ["Breakfast", "Monastery lunch", "Traditional dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "May-Sep",
        difficulty: "Moderate (High Altitude)",
        includes: ["Altitude hotel", "Monastery visits", "Cultural guide", "All meals"],
        excludes: ["High altitude treks", "Adventure activities", "Personal shopping"]
      },
      {
        id: "leh-3day",
        name: "🌊 Pangong Lake Adventure",
        days: 3,
        cost: "₹18,000",
        type: "Ultimate Ladakh Experience",
        highlights: ["Pangong Lake", "Chang La Pass", "Nubra Valley", "Camel safari"],
        details: [
          {
            day: 1,
            title: "Leh Acclimatization & Culture",
            activities: [
              "9:00 AM - Gentle breakfast and health check",
              "10:00 AM - Leh Palace and local museum",
              "12:00 PM - Traditional lunch",
              "2:00 PM - Rest and altitude adjustment",
              "4:00 PM - Hall of Fame museum",
              "6:00 PM - Shanti Stupa peaceful visit",
              "8:00 PM - Welcome dinner with cultural show"
            ],
            meals: ["Breakfast", "Traditional lunch", "Cultural dinner"],
            accommodation: "Deluxe high altitude hotel"
          },
          {
            day: 2,
            title: "Pangong Lake Expedition",
            activities: [
              "6:00 AM - Early breakfast and departure",
              "8:00 AM - Chang La Pass (17,590 ft) - world's 3rd highest motorable pass",
              "12:00 PM - Arrive Pangong Lake",
              "1:00 PM - Lakeside lunch",
              "3:00 PM - Lake photography and relaxation",
              "6:00 PM - Sunset at the lake",
              "8:00 PM - Camping dinner under stars",
              "10:00 PM - Overnight camping by the lake"
            ],
            meals: ["Early breakfast", "Lakeside lunch", "Camping dinner"],
            accommodation: "Lakeside camping (heated tents)"
          },
          {
            day: 3,
            title: "Return via Monasteries",
            activities: [
              "6:00 AM - Sunrise at Pangong Lake",
              "8:00 AM - Breakfast at camp",
              "9:00 AM - Departure via different route",
              "11:00 AM - Hemis Monastery visit",
              "1:00 PM - Monastery lunch",
              "3:00 PM - Thiksey Monastery",
              "5:00 PM - Return to Leh",
              "8:00 PM - Farewell dinner"
            ],
            meals: ["Camp breakfast", "Monastery lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "May-Sep",
        difficulty: "Challenging (Very High Altitude)",
        includes: ["Deluxe accommodation", "Pangong camping", "All permits", "Oxygen cylinder", "All meals", "Professional guide"],
        excludes: ["Inner Line Permits (arranged separately)", "Personal medication", "Tips for local guides"]
      }
    ]
  },
  {
    cityName: "Andaman",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/andaman/mmt/activities/m_Andaman_radhanagar_beach_l_400_640.jpg",
    description: "Tropical paradise with pristine beaches, coral reefs, water sports, and historical significance.",
    plans: [
      {
        id: "andaman-1day",
        name: "🏖️ Port Blair Heritage",
        days: 1,
        cost: "₹4,500",
        type: "History & Beaches",
        highlights: ["Cellular Jail", "Corbyn's Cove", "Light & Sound show", "Water sports"],
        details: [{
          day: 1,
          title: "Island Capital Experience",
          activities: [
            "9:00 AM - Cellular Jail National Memorial",
            "11:00 AM - Fisheries Museum and Anthropological Museum",
            "1:00 PM - Seafood lunch at Amaya Restaurant",
            "3:00 PM - Corbyn's Cove Beach water sports",
            "5:00 PM - Chatham Saw Mill (Asia's oldest)",
            "7:00 PM - Return to Cellular Jail",
            "7:30 PM - Light and Sound Show",
            "9:00 PM - Dinner at Annapurna Cafeteria"
          ],
          meals: ["Breakfast", "Seafood lunch", "Dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Nov-Apr",
        difficulty: "Easy",
        includes: ["Transportation", "Museum entries", "Light show", "Guide"],
        excludes: ["Hotel", "Water sports fees", "Personal expenses"]
      },
      {
        id: "andaman-2day",
        name: "🐠 Havelock Island Paradise",
        days: 2,
        cost: "₹12,000",
        type: "Beach & Water Sports",
        highlights: ["Radhanagar Beach", "Elephant Beach", "Snorkeling", "Scuba diving"],
        details: [
          {
            day: 1,
            title: "Port Blair to Havelock",
            activities: [
              "8:00 AM - Ferry to Havelock Island (2.5 hours)",
              "11:00 AM - Check-in beach resort",
              "12:00 PM - Welcome lunch",
              "2:00 PM - Radhanagar Beach (Asia's best beach)",
              "4:00 PM - Beach relaxation and swimming",
              "6:00 PM - Sunset photography",
              "8:00 PM - Beachside dinner",
              "10:00 PM - Beach walk and stargazing"
            ],
            meals: ["Breakfast", "Welcome lunch", "Beachside dinner"],
            accommodation: "Beach resort Havelock"
          },
          {
            day: 2,
            title: "Water Sports & Return",
            activities: [
              "7:00 AM - Early breakfast",
              "8:00 AM - Elephant Beach boat trip",
              "9:00 AM - Snorkeling and coral viewing",
              "12:00 PM - Beach lunch",
              "2:00 PM - Optional scuba diving",
              "4:00 PM - Return to resort and pack",
              "6:00 PM - Ferry back to Port Blair",
              "9:00 PM - Dinner in Port Blair"
            ],
            meals: ["Breakfast", "Beach lunch", "Dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Nov-Apr",
        difficulty: "Moderate",
        includes: ["Beach resort", "Ferry tickets", "Snorkeling gear", "All meals"],
        excludes: ["Scuba diving", "Personal water sports", "Alcohol"]
      },
      {
        id: "andaman-3day",
        name: "🏝️ Complete Andaman Island Paradise",
        days: 3,
        cost: "₹22,000",
        type: "Ultimate Island Experience",
        highlights: ["Multi-island tour", "Neil Island", "Advanced water sports", "Tribal culture"],
        details: [
          {
            day: 1,
            title: "Port Blair Heritage & Culture",
            activities: [
              "8:00 AM - Cellular Jail comprehensive tour",
              "10:00 AM - Anthropological Museum (tribal culture)",
              "12:00 PM - Seafood lunch at Bayview",
              "2:00 PM - Ross Island ruins tour",
              "4:00 PM - North Bay Island coral viewing",
              "6:00 PM - Return to Port Blair",
              "7:30 PM - Cellular Jail Light & Sound Show",
              "9:30 PM - Dinner at SeaShell Restaurant"
            ],
            meals: ["Breakfast", "Seafood lunch", "Dinner"],
            accommodation: "4-star hotel Port Blair"
          },
          {
            day: 2,
            title: "Havelock Island Adventure",
            activities: [
              "7:00 AM - Morning ferry to Havelock",
              "10:00 AM - Check-in beach resort",
              "11:00 AM - Radhanagar Beach exploration",
              "1:00 PM - Beachside lunch",
              "3:00 PM - Elephant Beach water sports",
              "5:00 PM - Scuba diving experience",
              "7:00 PM - Sunset at Radhanagar",
              "9:00 PM - Beach barbecue dinner"
            ],
            meals: ["Breakfast", "Beach lunch", "Barbecue dinner"],
            accommodation: "Premium beach resort"
          },
          {
            day: 3,
            title: "Neil Island & Departure",
            activities: [
              "7:00 AM - Ferry to Neil Island",
              "9:00 AM - Bharatpur Beach snorkeling",
              "11:00 AM - Natural Bridge (Howrah Bridge)",
              "1:00 PM - Local lunch at Neil Island",
              "3:00 PM - Laxmanpur Beach sunset point",
              "5:00 PM - Ferry to Port Blair",
              "8:00 PM - Final shopping at Sagarika Emporium",
              "9:30 PM - Farewell dinner at Ananda Restaurant"
            ],
            meals: ["Breakfast", "Neil Island lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Nov-Apr",
        difficulty: "Moderate",
        includes: ["Premium accommodations", "All ferry tickets", "Scuba diving", "All water sports", "Island hopping", "Cultural tours"],
        excludes: ["Flight to Andaman", "Alcohol", "Personal shopping", "Advanced diving courses"]
      }
    ]
  },
  {
    cityName: "Shimla",
    cityImage: "https://hblimg.mmtcdn.com/content/hubble/img/shimla/mmt/activities/m_Shimla_mall_road_l_400_640.jpg",
    description: "The Queen of Hills and former summer capital of British India, famous for colonial architecture and mountain railways.",
    plans: [
      {
        id: "shimla-1day",
        name: "🚂 Colonial Hill Station",
        days: 1,
        cost: "₹3,200",
        type: "Heritage & Nature",
        highlights: ["Mall Road", "Christ Church", "Jakhu Temple", "Ridge"],
        details: [{
          day: 1,
          title: "Queen of Hills Experience",
          activities: [
            "8:00 AM - Toy train ride from Kalka (if arriving)",
            "10:00 AM - Mall Road colonial walk",
            "12:00 PM - Christ Church and The Ridge",
            "1:00 PM - Lunch at Indian Coffee House",
            "3:00 PM - Jakhu Temple and Hanuman statue",
            "5:00 PM - Scandal Point and Gaiety Theatre",
            "7:00 PM - Shopping at Lakkar Bazaar",
            "9:00 PM - Dinner at Ashiana Restaurant"
          ],
          meals: ["Breakfast", "Coffee House lunch", "Dinner"],
          accommodation: "Day trip"
        }],
        bestTime: "Mar-Jun, Oct-Feb",
        difficulty: "Easy",
        includes: ["Local transportation", "Temple entry", "Heritage walk", "Guide"],
        excludes: ["Hotel", "Toy train (if not arriving)", "Personal shopping"]
      },
      {
        id: "shimla-2day",
        name: "🌲 Hills & Heritage",
        days: 2,
        cost: "₹8,500",
        type: "Complete Hill Station",
        highlights: ["Kufri", "Green Valley", "Toy train", "Colonial architecture"],
        details: [
          {
            day: 1,
            title: "Shimla Colonial Heritage",
            activities: [
              "9:00 AM - Viceregal Lodge (Rashtrapati Niwas)",
              "11:00 AM - State Museum and Library",
              "1:00 PM - Lunch at Cecil Hotel",
              "3:00 PM - Christ Church and The Ridge walk",
              "5:00 PM - Mall Road evening stroll",
              "7:00 PM - Gaiety Theatre heritage walk",
              "9:00 PM - Dinner at Combermere Restaurant"
            ],
            meals: ["Breakfast", "Heritage lunch", "Dinner"],
            accommodation: "3-star heritage hotel"
          },
          {
            day: 2,
            title: "Kufri Adventure & Nature",
            activities: [
              "8:00 AM - Drive to Kufri hill station",
              "10:00 AM - Mahasu Peak hiking",
              "12:00 PM - Horse riding and yak rides",
              "1:00 PM - Lunch at mountain restaurant",
              "3:00 PM - Green Valley and Himalayan views",
              "5:00 PM - Return to Shimla",
              "7:00 PM - Lakkar Bazaar shopping",
              "9:00 PM - Farewell dinner at Park Restaurant"
            ],
            meals: ["Breakfast", "Mountain lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Mar-Jun, Oct-Feb",
        difficulty: "Moderate",
        includes: ["Heritage hotel", "Kufri excursion", "All sightseeing", "Horse riding"],
        excludes: ["Adventure sports", "Personal shopping", "Tips"]
      },
      {
        id: "shimla-3day",
        name: "🏔️ Complete Himachal Hill Experience",
        days: 3,
        cost: "₹15,500",
        type: "Ultimate Hill Station",
        highlights: ["Chail", "Naldehra", "Adventure sports", "Colonial immersion"],
        details: [
          {
            day: 1,
            title: "Colonial Shimla Deep Dive",
            activities: [
              "8:00 AM - Toy train experience (Kalka-Shimla)",
              "12:00 PM - Arrival and check-in heritage hotel",
              "2:00 PM - Viceregal Lodge detailed tour",
              "4:00 PM - State Museum and archives",
              "6:00 PM - The Ridge and Christ Church",
              "8:00 PM - Colonial dinner at Oberoi Cecil",
              "10:00 PM - Evening walk on Mall Road"
            ],
            meals: ["Breakfast", "Lunch", "Colonial dinner"],
            accommodation: "5-star heritage hotel"
          },
          {
            day: 2,
            title: "Chail Hill Station Day Trip",
            activities: [
              "7:00 AM - Early departure to Chail",
              "9:00 AM - Chail Palace and cricket ground",
              "11:00 AM - World's highest cricket ground",
              "1:00 PM - Palace lunch",
              "3:00 PM - Chail Wildlife Sanctuary",
              "5:00 PM - Kali Ka Tibba temple",
              "7:00 PM - Return to Shimla",
              "9:00 PM - Traditional Himachali dinner"
            ],
            meals: ["Breakfast", "Palace lunch", "Traditional dinner"],
            accommodation: "Same heritage hotel"
          },
          {
            day: 3,
            title: "Adventure & Golf at Naldehra",
            activities: [
              "8:00 AM - Drive to Naldehra",
              "9:00 AM - Golf at India's oldest course",
              "12:00 PM - Adventure activities (zip-lining)",
              "1:00 PM - Lunch at golf club",
              "3:00 PM - Nature walks in deodar forests",
              "5:00 PM - Return to Shimla",
              "7:00 PM - Final shopping at Mall Road",
              "9:00 PM - Farewell dinner at Indian Coffee House"
            ],
            meals: ["Breakfast", "Golf club lunch", "Farewell dinner"],
            accommodation: "Check-out"
          }
        ],
        bestTime: "Mar-Jun, Oct-Feb",
        difficulty: "Moderate",
        includes: ["Heritage hotel", "Toy train", "Chail trip", "Golf access", "Adventure activities", "All cultural experiences"],
        excludes: ["Golf fees", "Personal shopping", "Extended adventure packages"]
      }
    ]
  }
];
    
    const result = await collection.insertMany(data);
    console.log(`🎉 SUCCESS: ${result.insertedCount} cities inserted!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

quickInsert();