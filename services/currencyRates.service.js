const axios = require('axios');

exports.getCurrencyRates = async (base = 'USD') => {
  try {
    const url = `https://api.frankfurter.dev/v1/latest?base=${base}`;
    const response = await axios.get(url);

    console.log(`📡 Frankfurter API (${base}) Response:`, response.data);

    return response.data;
  } catch (error) {
    console.error('❌ Error calling Frankfurter API:', error.message);
    throw error;
  }
};