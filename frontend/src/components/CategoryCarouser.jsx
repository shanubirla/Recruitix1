import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/JobSlice.jsx';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };
    
    return (
        <div className='py-8 rounded-lg my-6'>
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">Popular Categories</h3>
            <Carousel className="w-full max-w-xl mx-auto" aria-label="Job Categories">
                <CarouselContent role="list" className="px-6">
                    {category.length === 0 ? (
                        <p className="text-gray-500 text-center">No categories available.</p>
                    ) : (
                        category.map((cat, index) => (
                            <CarouselItem
                                key={index}
                                role="listitem"
                                className="basis-full sm:basis-1/2 lg:basis-1/3 p-2"
                            >
                                <Button
                                    onClick={() => searchJobHandler(cat)}
                                    variant="outline"
                                    className="w-full rounded-full hover:bg-gradient-to-r hover:from-teal-50 hover:to-indigo-50 border-teal-200 text-gray-700 hover:text-teal-700 font-medium focus:ring focus:ring-teal-200 transition-all"
                                    aria-label={`Search jobs for ${cat}`}
                                >
                                    {cat}
                                </Button>
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
                <CarouselPrevious aria-label="Previous category" className="bg-white text-teal-600 border-teal-200 hover:bg-teal-50" />
                <CarouselNext aria-label="Next category" className="bg-white text-teal-600 border-teal-200 hover:bg-teal-50" />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
