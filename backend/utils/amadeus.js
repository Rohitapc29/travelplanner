const axios = require('axios');

let amadeusToken = null;
let tokenExpiry = 0;

const getAmadeusToken = async () => {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET not configured");
  }

  if (amadeusToken && Date.now() < tokenExpiry) return amadeusToken;

  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    amadeusToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;
    console.log("Amadeus token fetched successfully");
    return amadeusToken;
  } catch (error) {
    console.error("Failed to get Amadeus token:", error.message);
    if (error.response && error.response.data) {
      console.error("Amadeus error details:", error.response.data);
    }
    throw new Error("Amadeus authentication failed");
  }
};

const searchAirports = async (keyword) => {
  const token = await getAmadeusToken();
  const response = await axios.get(
    "https://test.api.amadeus.com/v1/reference-data/locations",
    {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        subType: "AIRPORT,CITY",
        keyword: keyword,
        page: { limit: 10 }
      }
    }
  );

  return response.data.data.map(location => ({
    iataCode: location.iataCode,
    name: location.name,
    city: location.address?.cityName || "",
    country: location.address?.countryName || "",
    type: location.subType
  }));
};

const searchFlights = async (params) => {
  const token = await getAmadeusToken();
  const response = await axios.get(
    "https://test.api.amadeus.com/v2/shopping/flight-offers",
    { 
      headers: { Authorization: `Bearer ${token}` }, 
      params: {
        ...params,
        currencyCode: "USD"
      }
    }
  );

  return response.data.data;
};

const confirmFlightPrice = async (flightOffers) => {
  const token = await getAmadeusToken();
  const response = await axios.post(
    "https://test.api.amadeus.com/v1/shopping/flight-offers/pricing",
    { data: { type: "flight-offers-pricing", flightOffers } },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data.data.flightOffers[0];
};

module.exports = {
  getAmadeusToken,
  searchAirports,
  searchFlights,
  confirmFlightPrice
};