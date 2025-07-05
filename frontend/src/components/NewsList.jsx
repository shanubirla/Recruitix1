import React, { useEffect, useState } from "react";
import Card from "./Card.jsx";
import Navbar from "./shared/Navbar.jsx";
import { CONTACT_API_END_POINT } from "@/constants.js";
import axios from "axios";
const NewsList = () => {
  const [newsData, setNewsData] = useState([]);
  const [error, setError] = useState(null);

  const getData = async () => {
  try {
    const response = await axios.get(`${CONTACT_API_END_POINT}/news`, {
      withCredentials: true,
    });
    console.log("${CONTACT_API_END_POINT}/news")
    const jsonData = response.data;

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
