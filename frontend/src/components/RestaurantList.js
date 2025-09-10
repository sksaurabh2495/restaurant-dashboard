import React, { useState } from 'react';

const RestaurantList = ({ restaurants, selectedRestaurant, onSelectRestaurant, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="restaurant-list">
      <h2>Restaurants</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="list">
        {restaurants.map(restaurant => (
          <div 
            key={restaurant.id} 
            className={`restaurant-item ${selectedRestaurant?.id === restaurant.id ? 'selected' : ''}`}
            onClick={() => onSelectRestaurant(restaurant)}
          >
            <h3>{restaurant.name}</h3>
            <p>{restaurant.cuisine} • {restaurant.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;