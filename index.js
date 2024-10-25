import http from "http";
import "dotenv/config";
import url from "url";
const PORT = process.env.PORT;
let weatherData = {
  London: { temp: 18, condition: "Cloudy" },
  Tokyo: { temp: 25, condition: "Sunny" },
};

const server = http.createServer((req, res) => {
  if (req.url === "/cities" && req.method === "GET") {
    res.write(JSON.stringify(Object.keys(weatherData)));
    res.end();
  }
  if (req.url === "/weather" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      weatherData = {
        ...weatherData,
        ...JSON.stringify(JSON.parse(body)),
      };
      res.statusCode = 200;
      res.write(
        JSON.stringify({
          message: "Weather added successfully",
        })
      );
      res.end();
    });
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // Handle dynamic routes
  if (path.startsWith("/weather/")) {
    const cityId = path.split("/")[2]; // Extract city ID from the URL

    // Check if the city exists
    const city = weatherData[cityId];
    if (city) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(city)); // Respond with user data
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" })); // User not found
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" })); // Route not found
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
