import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/JobSlice.jsx';
import { Filter } from 'lucide-react';

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const dispatch = useDispatch();
  
  const changeHandler = (value) => {
    setSelectedValue(value);
  };
  
  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setSearchedQuery(selectedValue));
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [selectedValue, dispatch]);
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden  max-h-[80vh] overflow-y-auto">
      <div className="bg-gradient-to-r from-teal-600 to-indigo-600 px-4 py-3">
        <div className="flex items-center text-white">
          <Filter className="h-5 w-5 mr-2" />
          <h2 className="font-semibold text-lg">Filter Jobs</h2>
        </div>
      </div>
      
      <div className="p-4">
        {filterData.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No filters available.
          </p>
        ) : (
          <div className="space-y-6">
            {filterData.map((data, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <button 
                  onClick={() => toggleSection(index)}
                  className="flex justify-between items-center w-full text-left font-medium text-gray-800 mb-3 hover:text-teal-600 transition-colors"
                >
                  <span>{data.filterType}</span>
                  <span className="text-gray-400">
                    {expandedSections[index] ? '−' : '+'}
                  </span>
                </button>
                
                {(expandedSections[index] !== false) && (
                  <RadioGroup 
                    value={selectedValue} 
                    onValueChange={changeHandler}
                    className="space-y-2"
                  >
                    {data.array.map((item, idx) => {
                      const itemId = `id${index}-${idx}`;
                      return (
                        <div key={itemId} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            id={itemId} 
                            value={item}
                            className="text-teal-600 border-gray-300 focus:ring-teal-500"
                          />
                          <Label 
                            htmlFor={itemId} 
                            className="text-gray-700 cursor-pointer hover:text-teal-600 transition-colors"
                          >
                            {item}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterCard;
