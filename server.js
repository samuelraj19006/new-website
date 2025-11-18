
const API_KEY = "23848b900e79c9ea2444cc2f2965c6c1"; // replace with your key

const districtCoordinates = {
  "Adilabad": { lat: 0, lon: 0 },
  "Bhadradri Kothagudem": { lat: 0, lon: 0 },
  "Hyderabad": { lat: 17.3850, lon: 78.4867 },
  "Jagtial": { lat: 0, lon: 0 },
  "Jangaon": { lat: 0, lon: 0 }
  // add others as needed
};

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("district-select");

    // Populate dropdown
    for (let district in districtCoordinates) {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        select.appendChild(option);
    }

    select.addEventListener("change", fetchWeatherData);
});


  // Add change event listener
  select.addEventListener("change", async () => {
    const district = select.value;

    if (district !== "Hyderabad") {
      alert("Weather data available only for Hyderabad.");
      return;
    }

    const coords = districtCoordinates[district];
    try {
      const resp = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&units=metric&exclude=minutely,alerts&appid=${API_KEY}`);
      const weather = await resp.json();

      document.getElementById("temp-value").innerText = Math.round(weather.current.temp) + "°C";
      document.getElementById("humidity-value").innerText = weather.current.humidity + "%";
      document.getElementById("windspeed-value").innerText = weather.current.wind_speed + " km/h";
      document.getElementById("rainfall-value").innerText = (weather.daily[0].rain || 0) + " mm";

      updateAdvisory(weather);
    } catch (err) {
      console.error(err);
      alert("Weather fetch failed: " + err.message);
    }
  });


function updateAdvisory(weather) {
  const box = document.getElementById("advisory-message");
  box.className = ""; // reset

  const wind = weather.current.wind_speed;
  const humidity = weather.current.humidity;
  const rainToday = weather.daily[0].rain || 0;

  if (wind > 15) {
    box.classList.add("critical");
    box.innerHTML = `⚠️ Strong winds (${wind} km/h). Secure equipment & avoid aerial spraying.`;
  } else if (rainToday > 20) {
    box.classList.add("critical");
    box.innerHTML = `🚨 Heavy rain expected (${rainToday} mm). Delay irrigation & fertilizer application.`;
  } else if (humidity > 85) {
    box.classList.add("warning");
    box.innerHTML = `⚠️ High humidity (${humidity}%). Monitor for fungal disease.`;
  } else {
    box.classList.add("normal");
    box.innerHTML = `✅ Normal conditions. Proceed with scheduled operations.`;
  }
}

