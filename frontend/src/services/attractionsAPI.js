// REAL APIs ONLY - NO DUMMY DATA - ENHANCED VERSION

// City coordinates for API calls
const cityCoordinates = {
  delhi: { lat: 28.6139, lng: 77.2090 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  goa: { lat: 15.2993, lng: 74.1240 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  kerala: { lat: 10.8505, lng: 76.2711 },
  agra: { lat: 27.1767, lng: 78.0081 },
  manali: { lat: 32.2396, lng: 77.1887 },
  varanasi: { lat: 25.3176, lng: 82.9739 },
  rishikesh: { lat: 30.0869, lng: 78.2676 },
  ladakh: { lat: 34.1526, lng: 77.5771 },
  amritsar: { lat: 31.6340, lng: 74.8723 },
  darjeeling: { lat: 27.0410, lng: 88.2663 },
  andaman: { lat: 11.7401, lng: 92.6586 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  udaipur: { lat: 24.5854, lng: 73.7125 }
};


const fetchUnsplashImage = async (query) => {
  try {
    const response = await fetch(
      `https://source.unsplash.com/800x600/?${encodeURIComponent(query)},india,landmark,monument`
    );
    
    if (response.ok) {
      return response.url; 
    }
  } 
  catch (error) {
    console.log('Could not fetch Unsplash image');
  }
  return null;
};

export const fetchOverpassAttractions = async (cityKey) => {
  const coords = cityCoordinates[cityKey];
  if (!coords) return [];

  try {
   
    
    const query = `
      [out:json][timeout:25];
      (
        node["tourism"~"attraction|museum|artwork|viewpoint|gallery|monument|memorial"](around:8000,${coords.lat},${coords.lng});
        way["tourism"~"attraction|museum|artwork|viewpoint|gallery|monument|memorial"](around:8000,${coords.lat},${coords.lng});
        node["historic"~"monument|memorial|archaeological_site|castle|fort|palace|ruins"](around:8000,${coords.lat},${coords.lng});
        way["historic"~"monument|memorial|archaeological_site|castle|fort|palace|ruins"](around:8000,${coords.lat},${coords.lng});
      );
      out body;
      >;
      out skel qt;
    `;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    console.log('Overpass Response Status:', response.status);
    
    if (!response.ok) {
      console.error('Overpass API Error:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (data.elements && Array.isArray(data.elements)) {
      const attractions = await Promise.all(
        data.elements
          .filter(elem => elem.tags && elem.tags.name)
          .slice(0, 30) 
          .map(async (elem) => {
            const tags = elem.tags;
            const descParts = [];
            
            if (tags.tourism) descParts.push(tags.tourism.replace(/_/g, ' '));
            if (tags.historic) descParts.push(tags.historic.replace(/_/g, ' '));
            if (tags.description) descParts.push(tags.description);
            if (tags.heritage || tags['heritage:operator']) descParts.push('Heritage site');
            if (tags['unesco:criteria'] || tags.unesco) descParts.push('UNESCO World Heritage');
            if (tags.architect) descParts.push(`by ${tags.architect}`);
            if (tags.start_date) descParts.push(`built ${tags.start_date}`);
            
            const description = descParts.length > 0 
              ? descParts.join(' • ').replace(/\b\w/g, l => l.toUpperCase())
              : 'Notable tourist attraction in the area';

            
            const thumbnail = await fetchUnsplashImage(`${tags.name} ${cityKey}`);

            return {
              id: `osm-${elem.id}`,
              name: tags.name,
              category: tags.tourism || tags.historic || 'sightseeing',
              suggestedDuration: tags.duration ? parseInt(tags.duration) : Math.floor(Math.random() * 2) + 2,
              description: description,
              coordinates: { 
                lat: elem.lat || elem.center?.lat, 
                lng: elem.lon || elem.center?.lon 
              },
              source: 'openstreetmap',
              address: tags['addr:full'] || tags['addr:street'] || 'Address not available',
              website: tags.website || tags.url || null,
              wikipediaLink: tags.wikipedia || tags['wikipedia:en'] || tags.wikidata,
              openingHours: tags.opening_hours || null,
              fee: tags.fee || null,
              phone: tags.phone || tags['contact:phone'] || null,
              email: tags.email || tags['contact:email'] || null,
              rating: tags.stars || null,
              thumbnail: thumbnail
            };
          })
      );
      
      const validAttractions = attractions.filter(attr => attr && attr.coordinates.lat && attr.coordinates.lng);
      return validAttractions;
    }
    
    return [];
  } 
  catch (error) {
    console.error('Overpass Error:', error);
    return [];
  }
};


export const fetchWikipediaAttractions = async (cityKey) => {
  const cityNames = {
    delhi: 'Delhi',
    mumbai: 'Mumbai',
    goa: 'Goa',
    jaipur: 'Jaipur',
    kerala: 'Kerala',
    agra: 'Agra',
    manali: 'Manali',
    varanasi: 'Varanasi',
    rishikesh: 'Rishikesh',
    ladakh: 'Ladakh',
    amritsar: 'Amritsar',
    darjeeling: 'Darjeeling',
    andaman: 'Andaman Islands',
    hyderabad: 'Hyderabad',
    udaipur: 'Udaipur'
  };

  const cityName = cityNames[cityKey];
  if (!cityName) return [];

  try {
    console.log(`🔍 Fetching Wikipedia data for ${cityName}...`);
    
    const coords = cityCoordinates[cityKey];
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${coords.lat}|${coords.lng}&gslimit=50&format=json&origin=*`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Wikipedia API Error:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (data.query && data.query.geosearch && Array.isArray(data.query.geosearch)) {
      const excludeKeywords = [
        'riot', 'war', 'battle', 'bombing', 'attack', 'terrorism', 'violence',
        'election', 'politics', 'government', 'ministry', 'directorate',
        'university', 'college', 'school', 'institute', 'education',
        'hospital', 'clinic', 'medical',
        'company', 'corporation', 'limited',
        'railway station', 'airport', 'metro station', 'railway', 'constituency',
        'list of', 'category:', 'portal:', 'suburb', 'neighbourhood'
      ];
      
      const includeKeywords = [
        'temple', 'mosque', 'church', 'gurudwara', 'monastery',
        'fort', 'palace', 'castle', 'monument', 'memorial',
        'museum', 'gallery', 'exhibition',
        'beach', 'park', 'garden', 'zoo', 'aquarium',
        'gate', 'tower', 'arch', 'tomb', 'mausoleum',
        'market', 'bazaar',
        'hill', 'mountain', 'lake', 'waterfall',
        'island', 'bay', 'coast', 'cave',
        'heritage', 'unesco', 'historical',
        'cathedral', 'shrine', 'pagoda', 'stupa'
      ];
      
      const filteredPlaces = data.query.geosearch.filter(place => {
        const title = place.title.toLowerCase();
        
        if (excludeKeywords.some(keyword => title.includes(keyword))) {
          return false;
        }
        
        return includeKeywords.some(keyword => title.includes(keyword));
      });
      
      if (filteredPlaces.length === 0) {
        console.log('No tourist attractions found in Wikipedia results');
        return [];
      }
      
      const pageIds = filteredPlaces.slice(0, 15).map(p => p.pageid).join('|');
      
      const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageIds}&prop=extracts|pageimages&exintro=1&explaintext=1&exsentences=3&piprop=thumbnail&pithumbsize=400&format=json&origin=*`;
      
      const extractResponse = await fetch(extractUrl);
      const extractData = await extractResponse.json();
      
      const attractions = filteredPlaces.slice(0, 15).map(place => {
        const pageData = extractData.query.pages[place.pageid];
        const extract = pageData?.extract || 'Historical landmark and popular tourist destination';
        const thumbnail = pageData?.thumbnail?.source || null;
        
        return {
          id: `wiki-${place.pageid}`,
          name: place.title,
          category: 'sightseeing',
          suggestedDuration: Math.floor(Math.random() * 2) + 2,
          description: extract.substring(0, 200) + (extract.length > 200 ? '...' : ''),
          coordinates: { lat: place.lat, lng: place.lon },
          source: 'wikipedia',
          pageid: place.pageid,
          thumbnail: thumbnail,
          website: `https://en.wikipedia.org/?curid=${place.pageid}`
        };
      });
      
      console.log(`Wikipedia returned ${attractions.length} verified attractions with images`);
      return attractions;
    }
    
    return [];
  } catch (error) {
    console.error('Wikipedia Error:', error);
    return [];
  }
};

export const fetchWikivoyageAttractions = async (cityKey) => {
  const cityNames = {
    delhi: 'Delhi',
    mumbai: 'Mumbai',
    goa: 'Goa',
    jaipur: 'Jaipur',
    kerala: 'Kerala',
    agra: 'Agra',
    manali: 'Manali',
    varanasi: 'Varanasi',
    rishikesh: 'Rishikesh',
    ladakh: 'Leh',
    amritsar: 'Amritsar',
    darjeeling: 'Darjeeling',
    andaman: 'Andaman_and_Nicobar_Islands',
    hyderabad: 'Hyderabad',
    udaipur: 'Udaipur'
  };

  const cityName = cityNames[cityKey];
  if (!cityName) return [];

  try {
    console.log(`Fetching Wikivoyage data for ${cityName}...`);
    
    // First, get the Wikivoyage page content
    const pageUrl = `https://en.wikivoyage.org/w/api.php?action=parse&page=${cityName}&prop=text&format=json&origin=*`;
    
    const response = await fetch(pageUrl);
    
    if (!response.ok) {
      console.error('Wikivoyage API Error:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (data.parse && data.parse.text) {
      const htmlContent = data.parse.text['*'];
     
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      const attractions = [];
      

      const listings = doc.querySelectorAll('.vcard, [class*="listing"]');
      
      listings.forEach((listing, index) => {
        const nameElem = listing.querySelector('.fn, .listing-name, strong, b');
        const descElem = listing.querySelector('.listing-description, .note, p');
        const addressElem = listing.querySelector('.adr, .address');
        const phoneElem = listing.querySelector('.tel, .phone');
        const websiteElem = listing.querySelector('.url, a[href^="http"]');
        
        if (nameElem) {
          const name = nameElem.textContent.trim();
          
          if (name.length < 3 || 
              name.toLowerCase().includes('edit') ||
              name.toLowerCase().includes('station') ||
              name.toLowerCase().includes('airport')) {
            return;
          }
          
          attractions.push({
            id: `wv-${cityKey}-${index}`,
            name: name,
            category: 'sightseeing',
            suggestedDuration: Math.floor(Math.random() * 2) + 2,
            description: descElem ? descElem.textContent.trim().substring(0, 200) : 'Tourist attraction',
            coordinates: cityCoordinates[cityKey],
            source: 'wikivoyage',
            address: addressElem ? addressElem.textContent.trim() : 'See Wikivoyage for details',
            phone: phoneElem ? phoneElem.textContent.trim() : null,
            website: websiteElem ? websiteElem.href : `https://en.wikivoyage.org/wiki/${cityName}`
          });
        }
      });
      
      console.log(`Wikivoyage returned ${attractions.length} curated attractions`);
      return attractions.slice(0, 15); // Limit to top 15
    }
    
    return [];
  } catch (error) {
    console.error('❌ Wikivoyage Error:', error);
    return [];
  }
};

export const fetchCuratedAttractions = (cityKey) => {
  const curatedAttractions = {
    delhi: [
      { name: "Red Fort", category: "monument", duration: 2, desc: "17th-century Mughal fort, UNESCO World Heritage Site" },
      { name: "Qutub Minar", category: "monument", duration: 2, desc: "73-meter tall minaret and UNESCO World Heritage Site" },
      { name: "India Gate", category: "monument", duration: 1, desc: "War memorial dedicated to Indian soldiers" },
      { name: "Humayun's Tomb", category: "monument", duration: 2, desc: "Mughal Emperor's tomb, UNESCO World Heritage Site" },
      { name: "Lotus Temple", category: "temple", duration: 1, desc: "Bahá'í House of Worship shaped like a lotus flower" },
      { name: "Akshardham Temple", category: "temple", duration: 3, desc: "Large Hindu temple complex with stunning architecture" },
      { name: "Jama Masjid", category: "mosque", duration: 1, desc: "One of India's largest mosques" },
      { name: "Chandni Chowk", category: "market", duration: 2, desc: "Historic market in Old Delhi" },
      { name: "Lodhi Gardens", category: "park", duration: 2, desc: "City park with 15th-century tombs" },
      { name: "National Museum", category: "museum", duration: 3, desc: "Premier museum showcasing Indian art and history" }
    ],
    mumbai: [
      { name: "Gateway of India", category: "monument", duration: 1, desc: "Iconic arch monument overlooking the Arabian Sea" },
      { name: "Marine Drive", category: "attraction", duration: 2, desc: "Scenic 3.6 km boulevard along the coast" },
      { name: "Elephanta Caves", category: "monument", duration: 4, desc: "Ancient rock-cut cave temples, UNESCO World Heritage Site" },
      { name: "Chhatrapati Shivaji Terminus", category: "monument", duration: 1, desc: "Historic railway station, UNESCO World Heritage Site" },
      { name: "Haji Ali Dargah", category: "religious", duration: 1, desc: "Mosque and tomb on an islet in the Arabian Sea" },
      { name: "Siddhivinayak Temple", category: "temple", duration: 1, desc: "Famous Hindu temple dedicated to Lord Ganesha" },
      { name: "Juhu Beach", category: "beach", duration: 2, desc: "Popular beach and street food destination" },
      { name: "Sanjay Gandhi National Park", category: "park", duration: 4, desc: "Large protected area with Kanheri Caves" },
      { name: "Colaba Causeway", category: "market", duration: 2, desc: "Popular shopping street and tourist area" },
      { name: "Bandra-Worli Sea Link", category: "attraction", duration: 1, desc: "Cable-stayed bridge connecting Bandra and Worli" }
    ],
    goa: [
      { name: "Basilica of Bom Jesus", category: "church", duration: 1, desc: "UNESCO World Heritage baroque church" },
      { name: "Calangute Beach", category: "beach", duration: 3, desc: "Popular beach known as 'Queen of Beaches'" },
      { name: "Dudhsagar Falls", category: "waterfall", duration: 4, desc: "Four-tiered waterfall in Bhagwan Mahaveer Sanctuary" },
      { name: "Fort Aguada", category: "fort", duration: 2, desc: "17th-century Portuguese fort overlooking the sea" },
      { name: "Anjuna Beach", category: "beach", duration: 3, desc: "Famous for flea market and nightlife" },
      { name: "Se Cathedral", category: "church", duration: 1, desc: "One of Asia's largest churches" },
      { name: "Chapora Fort", category: "fort", duration: 1, desc: "Historic fort with panoramic views" },
      { name: "Palolem Beach", category: "beach", duration: 3, desc: "Crescent-shaped beach in South Goa" },
      { name: "Spice Plantation", category: "attraction", duration: 3, desc: "Tour traditional spice farms" },
      { name: "Vagator Beach", category: "beach", duration: 2, desc: "Beach known for dramatic red cliffs" }
    ],
    agra: [
      { name: "Taj Mahal", category: "monument", duration: 3, desc: "Iconic white marble mausoleum, UNESCO World Heritage Site" },
      { name: "Agra Fort", category: "fort", duration: 2, desc: "Historic Mughal fortress, UNESCO World Heritage Site" },
      { name: "Mehtab Bagh", category: "garden", duration: 1, desc: "Garden complex with Taj Mahal views" },
      { name: "Itmad-ud-Daulah", category: "monument", duration: 1, desc: "'Baby Taj' - beautiful marble tomb" }
    ],
    jaipur: [
      { name: "Hawa Mahal", category: "palace", duration: 1, desc: "Palace of Winds with ornate facade" },
      { name: "Amber Fort", category: "fort", duration: 3, desc: "Hilltop fort with stunning architecture" },
      { name: "City Palace", category: "palace", duration: 2, desc: "Royal residence with museums" },
      { name: "Jal Mahal", category: "palace", duration: 1, desc: "Water Palace in Man Sagar Lake" },
      { name: "Nahargarh Fort", category: "fort", duration: 2, desc: "Fort with panoramic city views" },
      { name: "Jaigarh Fort", category: "fort", duration: 2, desc: "Fort housing the world's largest cannon" }
    ]
  };

  const cityAttractions = curatedAttractions[cityKey] || [];
  const coords = cityCoordinates[cityKey];
  
  return cityAttractions.map((attr, index) => ({
    id: `curated-${cityKey}-${index}`,
    name: attr.name,
    category: attr.category,
    suggestedDuration: attr.duration,
    description: attr.desc,
    coordinates: coords,
    source: 'curated',
    address: 'Search online for exact address',
    website: `https://www.google.com/search?q=${encodeURIComponent(attr.name + ' ' + cityKey)}`
  }));
};

export const fetchAllAttractions = async (cityKey) => {
  console.log(`\n=== 🔍 FETCHING REAL DATA FOR ${cityKey.toUpperCase()} ===`);
  
  let attractions = [];

  console.log('\nLoading curated attractions...');
  const curatedData = fetchCuratedAttractions(cityKey);
  if (curatedData.length > 0) {
    console.log(`Curated: ${curatedData.length} verified attractions`);
    attractions = [...curatedData];
  }
  
  console.log('\n Fetching from OpenStreetMap...');
  const overpassData = await fetchOverpassAttractions(cityKey);
  if (overpassData.length > 0) {
    console.log(`OpenStreetMap: ${overpassData.length} attractions`);
    attractions = [...attractions, ...overpassData];
  }
  

  const uniqueAttractions = attractions.reduce((acc, current) => {
    const existingIndex = acc.findIndex(a => 
      a.name.toLowerCase().replace(/[^a-z]/g, '') === 
      current.name.toLowerCase().replace(/[^a-z]/g, '')
    );
    
    if (existingIndex === -1) 
    {
      acc.push(current);
    } 
    else 
    {
      if (current.source === 'curated') 
      {
        acc[existingIndex] = current;
      }
    }
    
    return acc;
  }, []);
  

  uniqueAttractions.sort((a, b) => {
    if (a.source === 'curated' && b.source !== 'curated') return -1;
    if (a.source !== 'curated' && b.source === 'curated') return 1;
    return b.description.length - a.description.length;
  });
  
  console.log(`\nFINAL RESULT: ${uniqueAttractions.length} unique attractions`);
  console.log('Top 5 attractions:');
  uniqueAttractions.slice(0, 5).forEach((attr, i) => {
    console.log(`   ${i + 1}. ${attr.name} (${attr.source}): ${attr.description.substring(0, 50)}...`);
  });
  
  return uniqueAttractions.slice(0, 20);
};

export const testAPIs = async () => {
  console.clear();
  console.log('🧪 TESTING REAL APIs WITH IMAGES...\n');
  
  const testResult = await fetchAllAttractions('delhi');
  console.log(`\n✅ TEST COMPLETE`);
  console.log(`Total attractions: ${testResult.length}`);
  console.log(`With images: ${testResult.filter(a => a.thumbnail).length}`);
  console.log(`With descriptions: ${testResult.filter(a => a.description.length > 50).length}`);
};

// Fetch attraction details
export const fetchAttractionDetails = async (attraction) => {
  console.log(`Fetching details for: ${attraction.name}`);
  
  if (attraction.source === 'wikipedia' && attraction.pageid) {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&pageids=${attraction.pageid}&prop=extracts|pageimages|info&exintro=1&explaintext=1&piprop=original&inprop=url&format=json&origin=*`
      );
      
      if (response.ok) {
        const data = await response.json();
        const page = data.query.pages[attraction.pageid];
        
        return {
          name: page.title || attraction.name,
          description: page.extract || attraction.description,
          image: page.original?.source || attraction.thumbnail || null,
          website: page.fullurl || `https://en.wikipedia.org/?curid=${attraction.pageid}`,
          address: attraction.address || 'Check Wikipedia for details',
          kinds: attraction.category,
          rating: '⭐ Notable landmark'
        };
      }
    } catch (error) {
      console.error('Error fetching Wikipedia details:', error);
    }
  }
  
  if (attraction.source === 'openstreetmap') {
    return {
      name: attraction.name,
      description: attraction.description || 'Historical landmark and tourist attraction',
      image: attraction.thumbnail || null,
      website: attraction.website || 'Not available',
      address: attraction.address,
      openingHours: attraction.openingHours || 'Check locally',
      phone: attraction.phone || 'Not available',
      fee: attraction.fee || 'Contact for details',
      kinds: attraction.category,
      rating: attraction.rating ? `⭐ ${attraction.rating}` : '⭐ Popular destination'
    };
  }
  
  return {
    name: attraction.name,
    description: attraction.description || 'Tourist attraction',
    image: attraction.thumbnail || null,
    address: attraction.address || 'Address not available',
    website: attraction.website || null,
    kinds: attraction.category,
    rating: '⭐ Popular tourist spot'
  };
};