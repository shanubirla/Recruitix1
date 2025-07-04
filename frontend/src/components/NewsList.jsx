import React, { useEffect, useState } from 'react';
import Card from './Card.jsx';
import Navbar from './shared/Navbar.jsx';

const NewsList = () => {
  
  const [newsData, setNewsData] = useState(null);
  

  const getData = async () => {
    const response = await fetch(
      "https://newsapi.org/v2/everything?q=software+engineering+job&apiKey=6dcc6cbcb5aa45a1a62050b2096c08f0"
    );
    const jsonData = await response.json();
    console.log(jsonData.articles);
    let dt = jsonData.articles.slice(0, 10);
    setNewsData(dt);
  };

  useEffect(() => {
    getData();
  }, []);

  
  return (
    <div>
     <Navbar/>
      <div className='text-center mt-8 '>
        <p className='text-2xl font-semibold'>Stay Updated with TrendyNews</p>
      </div>

      <div className='m-8 p-6'>
        {newsData ? <Card data={newsData} /> : null}
      </div> 
    </div>
  );
};

export default NewsList;