import React, { useState, useEffect } from 'react';
import RestaurantList from './components/RestaurantList';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TopRestaurants from './components/TopRestaurants';
import Filters from './components/Filters';
import './App.css';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    minAmount: '',
    maxAmount: '',
    hourRange: ''
  });

  useEffect(() => {
    fetchRestaurants();
    fetchTopRestaurants();
  }, [filters]);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchAnalytics();
    }
  }, [selectedRestaurant, filters]);

  const fetchRestaurants = async (search = '') => {
    try {
      const url = `http://localhost:8000/api.php?action=restaurants${search ? `&search=${search}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams({
        restaurant_id: selectedRestaurant.id,
        start_date: filters.startDate,
        end_date: filters.endDate
      });
      
      const response = await fetch(`http://localhost:8000/api.php?action=analytics&${params}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchTopRestaurants = async () => {
    try {
      const params = new URLSearchParams({
        start_date: filters.startDate,
        end_date: filters.endDate
      });
      
      const response = await fetch(`http://localhost:8000/api.php?action=top-restaurants&${params}`);
      const data = await response.json();
      setTopRestaurants(data);
    } catch (error) {
      console.error('Error fetching top restaurants:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    fetchRestaurants(searchTerm);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({...filters, ...newFilters});
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Restaurant Order Trends</h1>
      </header>
      <div className="container">
        <Filters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
        
        <div className="dashboard">
          <div className="left-panel">
            <RestaurantList 
              restaurants={restaurants} 
              selectedRestaurant={selectedRestaurant}
              onSelectRestaurant={setSelectedRestaurant}
              onSearch={handleSearch}
            />
            <TopRestaurants restaurants={topRestaurants} />
          </div>
          
          <div className="right-panel">
            {selectedRestaurant ? (
              <AnalyticsDashboard 
                analytics={analytics} 
                restaurant={selectedRestaurant} 
              />
            ) : (
              <div className="placeholder">
                <p>Select a restaurant to view analytics</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;