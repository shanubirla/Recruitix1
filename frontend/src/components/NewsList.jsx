import React, { useEffect, useState } from "react";
import Card from "./Card.jsx";
import Navbar from "./shared/Navbar.jsx";

const NewsList = () => {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(
        "https://newsapi.org/v2/everything?q=software+engineering+job&apiKey=6dcc6cbcb5aa45a1a62050b2096c08f0"
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const jsonData = await response.json();

      if (jsonData.articles && Array.isArray(jsonData.articles)) {
        const dt = jsonData.articles.slice(0, 10);
        setNewsData(dt);
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="text-center mt-8">
        <p className="text-2xl font-semibold">Stay Updated with TrendyNews</p>
      </div>

      <div className="m-8 p-6">
        {error && (
          <div className="text-red-500 text-center mb-4">
            Error: {error}
          </div>
        )}
        {newsData.length > 0 ? (
          <Card data={newsData} />
        ) : !error ? (
          <div className="text-gray-500 text-center">Loading news...</div>
        ) : null}
      </div>
    </div>
  );
};

export default NewsList;
