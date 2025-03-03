import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const API_KEY = "e27221f352826b0878fe9d6cb22a1269";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => console.error("Error getting location: ", error)
    );
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200 p-6">
      <h1 className="text-3xl font-bold mb-4">Weather App</h1>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Enter city name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button onClick={fetchWeatherByCity} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Search"}
        </Button>
      </div>
      {weather && (
        <Card className="w-96 p-4 bg-white shadow-lg rounded-lg">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold">{weather.name}</h2>
            <p className="text-lg">{weather.weather[0].description}</p>
            <p className="text-2xl font-bold">{weather.main.temp}°C</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
