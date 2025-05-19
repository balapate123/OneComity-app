const axios = require('axios');
exports.getNearbyStores = async (req, res) => {
  const { lat, lng, type } = req.query;

  if (!lat || !lng || !type) {
    return res.status(400).json({ msg: 'lat, lng, and type are required' });
  }

  const queryMap = {
    weed: 'cannabis store',
    wine: 'liquor store',
    restaurant: 'restaurant'
  };

  const textQuery = `${queryMap[type] || 'store'} near ${lat},${lng}`;

  try {
    const response = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      {
        textQuery,
        maxResultCount: 10
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location'
        }
      }
    );

    const results = response.data.places || [];

    const places = results.map(place => ({
      name: place.displayName?.text,
      address: place.formattedAddress,
      location: place.location
    }));

    res.json({ places });
  } catch (err) {
    console.error('❌ Google Maps API Error:', err.response?.data || err.message);
    res.status(500).send('Error fetching stores');
  }
};
