require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;

app.use(express.json());

// Endpoint Cek Status Server
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Weather API Wrapper Server is Running!'
    });
});

// Endpoint Utama Data Cuaca
app.get('/api/weather', async (req, res) => {
    const city = req.query.city || 'Jakarta';

    try {
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json`, {
            params: {
                key: API_KEY,
                q: city
            }
        });

        const data = response.data;

        res.json({
            status: 'success',
            data: {
                location: `${data.location.name}, ${data.location.country}`,
                temperature_celsius: data.current.temp_c,
                condition: data.current.condition.text,
                humidity: data.current.humidity,
                wind_kph: data.current.wind_kph,
                last_updated: data.current.last_updated
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil data cuaca dari penyedia layanan.',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`[SERVER] Berjalan di http://localhost:${PORT}`);
});
