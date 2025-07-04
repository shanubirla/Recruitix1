import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Card = ({ data }) => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {data.map((curItem, index) => {
                if (!curItem.urlToImage) {
                    return null;
                } else {
                    return (
                        <div 
                            key={index} 
                            className='bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden border border-gray-100'
                        >
                            <div className="h-48 overflow-hidden">
                                <LazyLoadImage
                                    src={curItem.urlToImage}
                                    alt={curItem.title}
                                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                                />
                            </div>
                            <div className='p-5'>
                                <a
                                    href={curItem.url}
                                    className='text-xl font-semibold text-gray-800 hover:text-teal-600 transition-colors line-clamp-2'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    {curItem.title}
                                </a>
                                <p className='text-gray-600 mt-3 text-sm line-clamp-3'>{curItem.description}</p>
                                <button
                                    onClick={() => window.open(curItem.url)}
                                    className='mt-4 px-4 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white rounded-md transition-colors'
                                >
                                    Read More
                                </button>
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default Card;
