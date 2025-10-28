require('dotenv').config();
const { getAmadeusToken } = require('./utils/amadeus');

async function testAmadeus() {
  try {
    console.log('Testing Amadeus credentials...');
    console.log('Client ID:', process.env.AMADEUS_CLIENT_ID);
    console.log('Client Secret length:', process.env.AMADEUS_CLIENT_SECRET?.length);
    
    const token = await getAmadeusToken();
    console.log('Successfully got Amadeus token:', token);
  } catch (error) {
    console.error('Failed to get Amadeus token:', error.message);
    if (error.response && error.response.data) {
      console.error('Error details:', error.response.data);
    }
  }
}

testAmadeus();