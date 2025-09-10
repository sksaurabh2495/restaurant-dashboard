import React from 'react';

const TopRestaurants = ({ restaurants }) => {
  return (
    <div className="top-restaurants">
      <h2>Top 3 Restaurants by Revenue</h2>
      {restaurants.length > 0 ? (
        <div className="top-list">
          {restaurants.map((restaurant, index) => (
            <div key={restaurant.id} className="top-item">
              <div className="rank">#{index + 1}</div>
              <div className="details">
                <h3>{restaurant.name}</h3>
                <p>Revenue: ₹{restaurant.revenue.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default TopRestaurants;