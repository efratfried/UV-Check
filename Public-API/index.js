import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

const OPENUV_API_KEY = process.env.OPENUV_API_KEY;
const LATITUDE = process.env.LATITUDE;
const LONGITUDE = process.env.LONGITUDE;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.post('/check', async (req, res) => {
  try {
    const response = await axios.get('https://api.openuv.io/api/v1/uv', {
      headers: { 'x-access-token': OPENUV_API_KEY },
      params: { lat: LATITUDE, lng: LONGITUDE }
    });
    const uvIndex = response.data.result.uv;

    const advice = uvIndex >= 3 ? 'You need to apply sunscreen today!' : 'No need for sunscreen today.';

    res.render('index.ejs',  {advice:advice} );
  } catch (error) {
    res.status(500).json({ error: 'Error fetching UV index' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
