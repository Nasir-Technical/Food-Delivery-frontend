import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import Fooditem from '../Fooditem/Fooditem';

const FoodDisplay = ({ category }) => {
  const { food_list, loading } = useContext(StoreContext);

  // Filtered list based on selected category
  const filteredFood = (food_list || []).filter(item =>
    category === "All" || category === item.category
  );

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="food-display-list">
          {filteredFood.length > 0 ? (
            filteredFood.map((item, index) => (
              <Fooditem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            ))
          ) : (
            <p>No items available for this category.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
