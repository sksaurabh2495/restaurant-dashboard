import React from 'react';

const Filters = ({ filters, onFilterChange }) => {
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value ? parseFloat(value) : '' });
  };

  const handleHourRangeChange = (e) => {
    onFilterChange({ hourRange: e.target.value });
  };

  return (
    <div className="filters">
      <h2>Filters</h2>
      <div className="filter-group">
        <div className="filter-item">
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleDateChange}
          />
        </div>
        
        <div className="filter-item">
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleDateChange}
          />
        </div>
        
        <div className="filter-item">
          <label>Min Amount:</label>
          <input
            type="number"
            name="minAmount"
            value={filters.minAmount}
            onChange={handleAmountChange}
            placeholder="Min amount"
          />
        </div>
        
        <div className="filter-item">
          <label>Max Amount:</label>
          <input
            type="number"
            name="maxAmount"
            value={filters.maxAmount}
            onChange={handleAmountChange}
            placeholder="Max amount"
          />
        </div>
        
        <div className="filter-item">
          <label>Hour Range (0-23):</label>
          <input
            type="text"
            name="hourRange"
            value={filters.hourRange}
            onChange={handleHourRangeChange}
            placeholder="e.g., 9,17"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;