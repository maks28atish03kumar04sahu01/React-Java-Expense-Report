import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaChartBar,
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { Bar, Pie } from 'react-chartjs-2';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';
import { expenseService } from '../../services/Services';
import useStore from '../../store/useStore';
import { ProtectedRoute } from '../../Middleware';
import {
  prepareDateBasedChartData,
  prepareDateRangeChartData,
  getDateBasedChartOptions,
  getAvailableFilters,
  preparePieChartData,
  pieChartOptions,
} from '../../services/ChartServices';
import { generateExpenseReportPDF } from '../../services/PdfServices';
import '../../styles/Expense.css';

const Expense = () => {
  const { userid } = useParams();
  const user = useStore((state) => state.user);
  const expenses = useStore((state) => state.expenses);
  const loading = useStore((state) => state.loading);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showCharts, setShowCharts] = useState(false);
  const [filterType, setFilterType] = useState('none'); // 'none', 'dateRange', 'yearMonthDay'
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [dateRangeFrom, setDateRangeFrom] = useState('');
  const [dateRangeTo, setDateRangeTo] = useState('');
  const [showDateRangeTable, setShowDateRangeTable] = useState(false);
  const [selectedDateLabel, setSelectedDateLabel] = useState(null); // For filtering expenses by clicked date
  const [selectedExpenseIds, setSelectedExpenseIds] = useState([]); // For filtering specific expenses
  const [sortColumn, setSortColumn] = useState('expexpenseDate'); // Default sort by date
  const [sortDirection, setSortDirection] = useState('asc'); // Default ascending
  const [formData, setFormData] = useState({
    expname: '',
    exppurpose: '',
    expdescription: '',
    expquantity: '',
    expprice: '',
    expexpenseDate: new Date().toISOString().split('T')[0],
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (userid) {
      expenseService.readExpenses(userid);
    }
  }, [userid]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      expname: '',
      exppurpose: '',
      expdescription: '',
      expquantity: '',
      expprice: '',
      expexpenseDate: new Date().toISOString().split('T')[0],
    });
    setEditingExpense(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const expenseData = {
        ...formData,
        expquantity: parseFloat(formData.expquantity),
        expprice: parseFloat(formData.expprice),
        expexpenseDate: new Date(formData.expexpenseDate).toISOString(),
      };

      if (editingExpense) {
        await expenseService.updateExpense(userid, editingExpense.id, expenseData);
      } else {
        await expenseService.createExpense(userid, expenseData);
      }
      resetForm();
      await expenseService.readExpenses(userid);
    } catch (error) {
      console.error('Expense operation error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      expname: expense.expname,
      exppurpose: expense.exppurpose,
      expdescription: expense.expdescription,
      expquantity: expense.expquantity.toString(),
      expprice: expense.expprice.toString(),
      expexpenseDate: new Date(expense.expexpenseDate).toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(userid, expenseId);
        await expenseService.readExpenses(userid);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  // Handle bar click to filter expenses by date or specific expenses
  const handleBarClick = (dateLabel, expenseDetails, purpose = null) => {
    // Only allow bar clicks to set filters when a filter type is selected (not 'none')
    if (filterType === 'none') {
      return; // Don't apply any filter when filterType is 'none'
    }
    
    if (purpose && Array.isArray(expenseDetails) && expenseDetails.length > 0) {
      // Clicked on a specific purpose bar - filter by those specific expenses
      const expenseIds = expenseDetails.map((exp) => exp.id || exp._id);
      setSelectedExpenseIds(expenseIds);
      setSelectedDateLabel(null);
    } else {
      // Clicked on date - filter by date
      setSelectedDateLabel(dateLabel);
      setSelectedExpenseIds([]);
    }
    
    // Show table if date range filter is active
    if (filterType === 'dateRange') {
      setShowDateRangeTable(true);
    }
    
    // Scroll to expenses list
    setTimeout(() => {
      const expensesSection = document.querySelector('.expenses-list');
      if (expensesSection) {
        expensesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.exptotalAmount, 0);

  // Get filtered expenses for chart based on active filter type
  const getExpensesForChart = () => {
    if (filterType === 'dateRange' && (dateRangeFrom || dateRangeTo)) {
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.expexpenseDate);
        expenseDate.setHours(0, 0, 0, 0);

        if (dateRangeFrom && dateRangeTo) {
          const fromDate = new Date(dateRangeFrom);
          fromDate.setHours(0, 0, 0, 0);
          const toDate = new Date(dateRangeTo);
          toDate.setHours(23, 59, 59, 999);
          return expenseDate >= fromDate && expenseDate <= toDate;
        } else if (dateRangeFrom) {
          const fromDate = new Date(dateRangeFrom);
          fromDate.setHours(0, 0, 0, 0);
          return expenseDate >= fromDate;
        } else if (dateRangeTo) {
          const toDate = new Date(dateRangeTo);
          toDate.setHours(23, 59, 59, 999);
          return expenseDate <= toDate;
        }
        return true;
      });
    }
    // For yearMonthDay filter type, chart uses the filterYear/filterMonth/filterDay through prepareDateBasedChartData
    return expenses;
  };

  const expensesForChart = getExpensesForChart();

  // Get available filters and prepare chart data
  const availableFilters = getAvailableFilters(expensesForChart);
  
  // Use different chart data preparation based on filter type
  let dateChartData, dateChartOptions;
  if (filterType === 'dateRange' && (dateRangeFrom || dateRangeTo)) {
    dateChartData = prepareDateRangeChartData(expensesForChart, dateRangeFrom, dateRangeTo);
    dateChartOptions = getDateBasedChartOptions(dateChartData, handleBarClick, true);
  } else if (filterType === 'none') {
    // When no filter is selected, show expenses grouped by individual dates (day level)
    // This gives a better default view instead of a single year bar
    dateChartData = prepareDateBasedChartData(expensesForChart, '', '', '');
    // Override to show by individual dates instead of year
    if (dateChartData.labels.length > 0) {
      // Re-group by individual dates
      const expenseMap = {};
      const expenseDetails = {};
      const labelDates = {};
      
      expensesForChart.forEach((expense) => {
        const expenseDate = new Date(expense.expexpenseDate);
        // Format as "DD MMM YYYY" for individual dates
        const dateKey = expenseDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        
        if (!expenseMap[dateKey]) {
          expenseMap[dateKey] = 0;
          expenseDetails[dateKey] = [];
          labelDates[dateKey] = expenseDate.getTime();
        }
        
        expenseMap[dateKey] += expense.exptotalAmount;
        expenseDetails[dateKey].push({
          name: expense.expname,
          purpose: expense.exppurpose,
          quantity: expense.expquantity,
          amount: expense.exptotalAmount,
        });
      });
      
      // Sort labels chronologically
      const labels = Object.keys(expenseMap).sort((a, b) => {
        const timeA = labelDates[a] || 0;
        const timeB = labelDates[b] || 0;
        return timeA - timeB;
      });
      
      const amounts = labels.map((label) => expenseMap[label]);
      
      dateChartData = {
        labels,
        datasets: [
          {
            label: 'Total Amount (₹)',
            data: amounts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
        _expenseDetails: expenseDetails,
        _expenseMap: {},
      };
    }
    dateChartOptions = getDateBasedChartOptions(dateChartData, handleBarClick, false);
  } else {
    dateChartData = prepareDateBasedChartData(expensesForChart, filterYear, filterMonth, filterDay);
    dateChartOptions = getDateBasedChartOptions(dateChartData, handleBarClick, false);
  }

  // Get available months and days based on selected year
  const getFilteredMonths = () => {
    if (!filterYear) return availableFilters.months;
    return expenses
      .filter((exp) => new Date(exp.expexpenseDate).getFullYear() === parseInt(filterYear))
      .map((exp) => new Date(exp.expexpenseDate).getMonth() + 1)
      .filter((month, index, self) => self.indexOf(month) === index)
      .sort((a, b) => a - b);
  };

  const getFilteredDays = () => {
    if (!filterYear || !filterMonth) return availableFilters.days;
    return expenses
      .filter((exp) => {
        const expDate = new Date(exp.expexpenseDate);
        return (
          expDate.getFullYear() === parseInt(filterYear) &&
          expDate.getMonth() + 1 === parseInt(filterMonth)
        );
      })
      .map((exp) => new Date(exp.expexpenseDate).getDate())
      .filter((day, index, self) => self.indexOf(day) === index)
      .sort((a, b) => a - b);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'year') {
      setFilterYear(value);
      setFilterMonth('');
      setFilterDay('');
      setSelectedDateLabel(null); // Clear selected date when filters change
    } else if (type === 'month') {
      setFilterMonth(value);
      setFilterDay('');
      setSelectedDateLabel(null);
    } else {
      setFilterDay(value);
      setSelectedDateLabel(null);
    }
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    // Clear all filters when switching filter types
    setFilterYear('');
    setFilterMonth('');
    setFilterDay('');
    setDateRangeFrom('');
    setDateRangeTo('');
    setSelectedDateLabel(null);
    setSelectedExpenseIds([]);
    setShowDateRangeTable(false);
    
    // If switching to 'none', ensure all filter states are cleared
    if (type === 'none') {
      setSelectedDateLabel(null);
      setSelectedExpenseIds([]);
      setShowDateRangeTable(false);
    }
  };

  const handleDateRangeChange = (type, value) => {
    if (type === 'from') {
      setDateRangeFrom(value);
    } else {
      setDateRangeTo(value);
    }
  };

  const clearFilters = () => {
    setFilterYear('');
    setFilterMonth('');
    setFilterDay('');
    setDateRangeFrom('');
    setDateRangeTo('');
    setSelectedDateLabel(null);
    setSelectedExpenseIds([]);
    setShowDateRangeTable(false);
    // Optionally reset filter type to 'none'
    // setFilterType('none');
  };
  
  const handleShowDateRangeTable = () => {
    setShowDateRangeTable(true);
    setSelectedDateLabel(null);
    setSelectedExpenseIds([]);
    // Scroll to expenses list
    setTimeout(() => {
      const expensesSection = document.querySelector('.expenses-list');
      if (expensesSection) {
        expensesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Filter expenses for date range filter type
  const getFilteredExpensesForDisplay = () => {
    if (!dateRangeFrom && !dateRangeTo) return expenses;
    
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.expexpenseDate);
      expenseDate.setHours(0, 0, 0, 0);

      if (dateRangeFrom && dateRangeTo) {
        const fromDate = new Date(dateRangeFrom);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(dateRangeTo);
        toDate.setHours(23, 59, 59, 999);
        return expenseDate >= fromDate && expenseDate <= toDate;
      } else if (dateRangeFrom) {
        const fromDate = new Date(dateRangeFrom);
        fromDate.setHours(0, 0, 0, 0);
        return expenseDate >= fromDate;
      } else if (dateRangeTo) {
        const toDate = new Date(dateRangeTo);
        toDate.setHours(23, 59, 59, 999);
        return expenseDate <= toDate;
      }
      return true;
    });
  };

  // Filter expenses based on selected date label and date range (for yearMonthDay filter type)
  const getFilteredExpenses = () => {
    let filtered = expenses;

    // Apply selected date label filter if set
    if (selectedDateLabel) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.expexpenseDate);
        let dateKey;

        // Match the exact same logic used in prepareDateBasedChartData
        if (filterYear && filterMonth && filterDay) {
          // Show by day
          dateKey = expenseDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        } else if (filterYear && filterMonth) {
          // Show by day of the month
          dateKey = `${expenseDate.getDate()} ${expenseDate.toLocaleDateString('en-US', { month: 'short' })}`;
        } else if (filterYear) {
          // Show by month
          dateKey = expenseDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } else {
          // Show by year
          dateKey = expenseDate.getFullYear().toString();
        }

        return dateKey === selectedDateLabel;
      });
    }

    return filtered;
  };

  // Get display expenses based on filter type
  const getDisplayExpenses = () => {
    let filtered = expenses;
    
    // If showDateRangeTable is true, show date range filtered data
    if (showDateRangeTable && filterType === 'dateRange') {
      filtered = getFilteredExpensesForDisplay();
    } else if (filterType === 'none') {
      return expenses;
    } else if (filterType === 'dateRange') {
      // If date range is set but table not shown, still filter
      filtered = getFilteredExpensesForDisplay();
    } else if (filterType === 'yearMonthDay') {
      filtered = getFilteredExpenses();
    }
    
    // Apply selected expense IDs filter if set (for specific bar clicks)
    if (selectedExpenseIds.length > 0) {
      filtered = filtered.filter((exp) => 
        selectedExpenseIds.includes(exp.id) || selectedExpenseIds.includes(exp._id)
      );
    }
    
    // Apply selected date label filter if set
    if (selectedDateLabel && !selectedExpenseIds.length) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.expexpenseDate);
        let dateKey;

        // Match the exact same logic used in prepareDateBasedChartData and getFilteredExpenses
        if (filterType === 'yearMonthDay') {
          // Use the same logic as getFilteredExpenses for yearMonthDay filter type
          if (filterYear && filterMonth && filterDay) {
            // Show by day
            dateKey = expenseDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
          } else if (filterYear && filterMonth) {
            // Show by day of the month (matches chart format like "11 Jan")
            dateKey = `${expenseDate.getDate()} ${expenseDate.toLocaleDateString('en-US', { month: 'short' })}`;
          } else if (filterYear) {
            // Show by month
            dateKey = expenseDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          } else {
            // Show by year
            dateKey = expenseDate.getFullYear().toString();
          }
        } else {
          // For date range or other filter types, use full date format
          dateKey = expenseDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        }

        return dateKey === selectedDateLabel;
      });
    }
    
    return filtered;
  };

  const displayExpenses = getDisplayExpenses();
  
  // Sort expenses
  const sortedExpenses = [...displayExpenses].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortColumn) {
      case 'expname':
        aValue = a.expname.toLowerCase();
        bValue = b.expname.toLowerCase();
        break;
      case 'exppurpose':
        aValue = a.exppurpose.toLowerCase();
        bValue = b.exppurpose.toLowerCase();
        break;
      case 'expquantity':
        aValue = a.expquantity;
        bValue = b.expquantity;
        break;
      case 'expprice':
        aValue = a.expprice;
        bValue = b.expprice;
        break;
      case 'exptotalAmount':
        aValue = a.exptotalAmount;
        bValue = b.exptotalAmount;
        break;
      case 'expexpenseDate':
        aValue = new Date(a.expexpenseDate).getTime();
        bValue = new Date(b.expexpenseDate).getTime();
        break;
      default:
        return 0;
    }
    
    if (typeof aValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
  });
  
  const displayTotalAmount = sortedExpenses.reduce((sum, exp) => sum + exp.exptotalAmount, 0);

  // Handle PDF generation with filtered and sorted expenses
  const handleGeneratePDF = async () => {
    // Prepare filter information
    const filterInfo = {
      filterType,
      selectedDateLabel,
      selectedExpenseIds,
      sortColumn,
      sortDirection,
      filterYear,
      filterMonth,
      filterDay,
      dateRangeFrom,
      dateRangeTo,
    };
    // Use sortedExpenses to include filters and sorting
    await generateExpenseReportPDF(sortedExpenses, user, filterInfo);
  };

  // Handle column sort
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <ProtectedRoute>
      <>
        <Header />
        <div className="expense-page">
          <div className="expense-container">
            <div className="expense-header">
              <div>
                <h1>Expense Management</h1>
                <p>Welcome, {user?.username}!</p>
              </div>
              <div className="expense-actions">
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(!showForm);
                  }}
                  className="btn btn-primary"
                >
                  <FaPlus /> {showForm ? 'Cancel' : 'Add Expense'}
                </button>
                <button onClick={() => setShowCharts(!showCharts)} className="btn btn-secondary">
                  <FaChartBar /> {showCharts ? 'Hide Charts' : 'Show Charts'}
                </button>
                {expenses.length > 0 && (
                  <button onClick={handleGeneratePDF} className="btn btn-secondary">
                    <FaFilePdf /> Generate PDF
                  </button>
                )}
              </div>
            </div>

            {showForm && (
              <div className="expense-form-card">
                <h3>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
                <form onSubmit={handleSubmit} className="expense-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expense Name *</label>
                      <input
                        type="text"
                        name="expname"
                        value={formData.expname}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Office Supplies"
                      />
                    </div>
                    <div className="form-group">
                      <label>Purpose *</label>
                      <input
                        type="text"
                        name="exppurpose"
                        value={formData.exppurpose}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Buying stationery"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="expdescription"
                      value={formData.expdescription}
                      onChange={handleChange}
                      required
                      rows="3"
                      placeholder="Describe the expense..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Quantity *</label>
                      <input
                        type="number"
                        name="expquantity"
                        value={formData.expquantity}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Price (per unit) *</label>
                      <input
                        type="number"
                        name="expprice"
                        value={formData.expprice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        name="expexpenseDate"
                        value={formData.expexpenseDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-submit" disabled={formLoading}>
                    {formLoading ? (
                      <ClipLoader size={16} color="#fff" />
                    ) : editingExpense ? (
                      'Update Expense'
                    ) : (
                      'Add Expense'
                    )}
                  </button>
                </form>
              </div>
            )}

            {showCharts && expenses.length > 0 && (
              <div className="charts-section">
                <div className="chart-card">
                  <div className="chart-header">
                    <h3>
                      <FaChartBar /> Expenses by Date
                    </h3>
                    <div className="chart-header-actions">
                      <div className="filter-type-selector">
                        <label>Filter Type:</label>
                        <select
                          value={filterType}
                          onChange={(e) => handleFilterTypeChange(e.target.value)}
                          className="filter-type-select"
                        >
                          <option value="none">No Filter</option>
                          <option value="dateRange">Date Range</option>
                          <option value="yearMonthDay">Year/Month/Day</option>
                        </select>
                      </div>
                      <button onClick={clearFilters} className="btn-clear-filters">
                        Clear Filters
                      </button>
                    </div>
                  </div>
                  <div className="chart-filters">
                    {filterType === 'dateRange' && (
                      <div className="filter-group date-range-filter">
                        <label>Date Range Filter:</label>
                        <div className="date-range-inputs">
                          <input
                            type="date"
                            value={dateRangeFrom}
                            onChange={(e) => handleDateRangeChange('from', e.target.value)}
                            className="filter-date-input"
                            placeholder="From Date"
                          />
                          <span className="date-range-separator">to</span>
                          <input
                            type="date"
                            value={dateRangeTo}
                            onChange={(e) => handleDateRangeChange('to', e.target.value)}
                            className="filter-date-input"
                            placeholder="To Date"
                          />
                          <button
                            onClick={handleShowDateRangeTable}
                            className="btn-show-table"
                            disabled={!dateRangeFrom && !dateRangeTo}
                          >
                            Show Table
                          </button>
                        </div>
                      </div>
                    )}
                    {filterType === 'yearMonthDay' && (
                      <>
                        <div className="filter-group">
                          <label>Filter by Year:</label>
                          <select
                            value={filterYear}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="filter-select"
                          >
                            <option value="">All Years</option>
                            {availableFilters.years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                        {filterYear && (
                          <div className="filter-group">
                            <label>Filter by Month:</label>
                            <select
                              value={filterMonth}
                              onChange={(e) => handleFilterChange('month', e.target.value)}
                              className="filter-select"
                            >
                              <option value="">All Months</option>
                              {getFilteredMonths().map((month) => (
                                <option key={month} value={month}>
                                  {monthNames[month - 1]}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        {filterYear && filterMonth && (
                          <div className="filter-group">
                            <label>Filter by Day:</label>
                            <select
                              value={filterDay}
                              onChange={(e) => handleFilterChange('day', e.target.value)}
                              className="filter-select"
                            >
                              <option value="">All Days</option>
                              {getFilteredDays().map((day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </>
                    )}
                    {filterType === 'none' && (
                      <div className="no-filter-message">
                        <p>Showing all expenses by date. Select a filter type from the dropdown above to apply specific filters.</p>
                      </div>
                    )}
                  </div>
                  <div className="chart-container">
                    {dateChartData.labels.length > 0 ? (
                      <Bar data={dateChartData} options={dateChartOptions} />
                    ) : (
                      <div className="no-data-message">
                        <p>No expenses found for the selected filters.</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="chart-card">
                  <h3>
                    <FaChartPie /> Expenses by Purpose
                  </h3>
                  <div className="chart-container">
                    <Pie data={preparePieChartData(expenses)} options={pieChartOptions} />
                  </div>
                </div>
              </div>
            )}

            <div className="expense-summary">
              <div className="summary-card">
                <h3>
                  {selectedDateLabel 
                    ? `Expenses for ${selectedDateLabel}` 
                    : showDateRangeTable && (dateRangeFrom || dateRangeTo)
                    ? `Expenses from ${dateRangeFrom ? new Date(dateRangeFrom).toLocaleDateString() : 'start'} to ${dateRangeTo ? new Date(dateRangeTo).toLocaleDateString() : 'end'}`
                    : 'Total Expenses'}
                  {(selectedDateLabel || showDateRangeTable) && (
                    <button
                      onClick={() => {
                        setSelectedDateLabel(null);
                        setSelectedExpenseIds([]);
                        setShowDateRangeTable(false);
                      }}
                      className="btn-clear-date-filter"
                      title="Show all expenses"
                    >
                      ✕
                    </button>
                  )}
                </h3>
                <p className="total-amount">₹{displayTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="expense-count">{sortedExpenses.length} expense(s)</p>
              </div>
            </div>

            {/* Only show notification when a filter is actually active (not when filterType is 'none' without any active filters) */}
            {filterType !== 'none' && (
              (selectedDateLabel || 
                (showDateRangeTable && (dateRangeFrom || dateRangeTo)) ||
                (filterType === 'yearMonthDay' && (filterYear || filterMonth || filterDay)) ||
                (filterType === 'dateRange' && (dateRangeFrom || dateRangeTo))) && (
                <div className="date-filter-active">
                  <p>
                    {selectedDateLabel ? (
                      <>
                        Showing expenses for <strong>{selectedDateLabel}</strong>. Click on any bar in the chart to filter by date, or click ✕ to show all expenses.
                      </>
                    ) : showDateRangeTable && (dateRangeFrom || dateRangeTo) ? (
                      <>
                        Showing expenses from <strong>{dateRangeFrom ? new Date(dateRangeFrom).toLocaleDateString() : 'start'}</strong> to <strong>{dateRangeTo ? new Date(dateRangeTo).toLocaleDateString() : 'end'}</strong>. Click on any bar in the chart to filter by specific date or purpose, or click ✕ to show all expenses.
                      </>
                    ) : (filterType === 'yearMonthDay' && (filterYear || filterMonth || filterDay)) ? (
                      <>
                        Showing filtered expenses. Click on any bar in the chart to filter by specific date, or click ✕ to show all expenses.
                      </>
                    ) : (filterType === 'dateRange' && (dateRangeFrom || dateRangeTo)) ? (
                      <>
                        Showing expenses from <strong>{dateRangeFrom ? new Date(dateRangeFrom).toLocaleDateString() : 'start'}</strong> to <strong>{dateRangeTo ? new Date(dateRangeTo).toLocaleDateString() : 'end'}</strong>. Click on any bar in the chart to filter by specific date or purpose, or click ✕ to show all expenses.
                      </>
                    ) : null}
                  </p>
                </div>
              )
            )}

            <div className="expenses-list">
              {loading ? (
                <div className="loading-container">
                  <ClipLoader size={50} color="#007bff" />
                  <p>Loading expenses...</p>
                </div>
              ) : sortedExpenses.length === 0 ? (
                <div className="empty-state">
                  <p>
                    {selectedDateLabel
                      ? `No expenses found for ${selectedDateLabel}.`
                      : 'No expenses yet. Add your first expense to get started!'}
                  </p>
                </div>
              ) : (
                <div className="expenses-table-container">
                  <table className="expenses-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('expname')} className="sortable">
                          <span>Name</span>
                          <span className="sort-icons">
                            <FaArrowUp className={sortColumn === 'expname' && sortDirection === 'asc' ? 'active' : ''} />
                            <FaArrowDown className={sortColumn === 'expname' && sortDirection === 'desc' ? 'active' : ''} />
                          </span>
                        </th>
                        <th onClick={() => handleSort('exppurpose')} className="sortable">
                          <span>Purpose</span>
                          <span className="sort-icons">
                            <FaArrowUp className={sortColumn === 'exppurpose' && sortDirection === 'asc' ? 'active' : ''} />
                            <FaArrowDown className={sortColumn === 'exppurpose' && sortDirection === 'desc' ? 'active' : ''} />
                          </span>
                        </th>
                        <th>Description</th>
                        <th onClick={() => handleSort('expquantity')} className="sortable">
                          <span>Quantity</span>
                          <span className="sort-icons">
                            <FaArrowUp className={sortColumn === 'expquantity' && sortDirection === 'asc' ? 'active' : ''} />
                            <FaArrowDown className={sortColumn === 'expquantity' && sortDirection === 'desc' ? 'active' : ''} />
                          </span>
                        </th>
                        <th onClick={() => handleSort('expprice')} className="sortable">
                          <span>Price (₹)</span>
                          <span className="sort-icons">
                            <FaArrowUp className={sortColumn === 'expprice' && sortDirection === 'asc' ? 'active' : ''} />
                            <FaArrowDown className={sortColumn === 'expprice' && sortDirection === 'desc' ? 'active' : ''} />
                          </span>
                        </th>
                        <th onClick={() => handleSort('exptotalAmount')} className="sortable">
                          <span>Total (₹)</span>
                          <span className="sort-icons">
                            <FaArrowUp className={sortColumn === 'exptotalAmount' && sortDirection === 'asc' ? 'active' : ''} />
                            <FaArrowDown className={sortColumn === 'exptotalAmount' && sortDirection === 'desc' ? 'active' : ''} />
                          </span>
                        </th>
                        <th onClick={() => handleSort('expexpenseDate')} className="sortable">
                          <span>Date</span>
                          <span className="sort-icons">
                            <FaArrowUp className={sortColumn === 'expexpenseDate' && sortDirection === 'asc' ? 'active' : ''} />
                            <FaArrowDown className={sortColumn === 'expexpenseDate' && sortDirection === 'desc' ? 'active' : ''} />
                          </span>
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedExpenses.map((expense) => (
                        <tr key={expense.id}>
                          <td className="expense-name">{expense.expname}</td>
                          <td>{expense.exppurpose}</td>
                          <td className="expense-description-cell">{expense.expdescription}</td>
                          <td>{expense.expquantity}</td>
                          <td>₹{expense.expprice.toFixed(2)}</td>
                          <td className="expense-total">
                            ₹{expense.exptotalAmount.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td>{new Date(expense.expexpenseDate).toLocaleDateString()}</td>
                          <td className="expense-actions-cell">
                            <button
                              onClick={() => handleEdit(expense)}
                              className="btn-icon"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(expense.id)}
                              className="btn-icon delete"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    </ProtectedRoute>
  );
};

export default Expense;
