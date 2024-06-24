import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, CircularProgress } from '@mui/material';
import cooly from './Assets/cooly.webp';
import rainy from './Assets/rainy.webp';
import sunny from './Assets/sunny.webp';
import wind from './Assets/wind.webp';
import notfound from './Assets/notfound.webp';

function App() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [bgImage, setBgImage] = useState(cooly);
  const [loading, setLoading] = useState(false);

  const changeHandler = e => {
    setCity(e.target.value);
  };

  const submitHandler = e => {
    e.preventDefault();
    setLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=edbb1244564bd23bd1b71b3a34f6c0a5`)
      .then(response => {
        if (!response.ok) {
          throw new Error('City not found');
        }
        return response.json();
      })
      .then(data => {
        setLoading(false);

        // Convert temperature to Kelvin
        const kelvinTemp = data.main.temp;
        const celsiusTemp = kelvinTemp - 273.15;

        setResult({
          temperatureCelsius: celsiusTemp,
          temperatureKelvin: kelvinTemp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        });

        // Change background image based on weather conditions
        if (celsiusTemp > 30) {
          setBgImage(sunny);
        } else if (celsiusTemp > 20) {
          setBgImage(wind);
        } else if (data.weather[0].main.toLowerCase().includes('rain')) {
          setBgImage(rainy);
        } else {
          setBgImage(cooly);
        }
      })
      .catch(error => {
        setLoading(false);
        setResult('City not found');
        setBgImage(notfound);
      });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      transition: 'background-image 0.5s ease-in-out'
    }}>
      <Card style={{ maxWidth: 400, padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <CardContent>
          <Typography variant="h4" component="h2">Weather App Mawa</Typography>
          <form onSubmit={submitHandler}>
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              value={city}
              onChange={changeHandler}
              style={{ margin: '20px 0' }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Get Temperature'}
            </Button>
          </form>
          {result && typeof result === 'object' && (
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6">{`Temperature at ${city}: ${result.temperatureCelsius.toFixed(2)}°C `}</Typography>
              <Typography variant="body1">{`Humidity: ${result.humidity}%`}</Typography>
              <Typography variant="body1">{`Wind Speed: ${result.windSpeed} m/s`}</Typography>
              <Typography variant="body1">{`Description: ${result.description}`}</Typography>
              {/* <img
                src={`http://openweathermap.org/img/wn/${result.icon}.png`}
                alt={result.description}
                style={{ marginTop: '10px' }}
              /> */}
            </div>
          )}
          {result && typeof result === 'string' && (
            <Typography variant="h6" color="error" style={{ marginTop: '20px' }}>{result}</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
