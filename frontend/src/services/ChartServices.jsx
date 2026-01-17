import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Prepare data for date-based bar chart with filters
export const prepareDateBasedChartData = (expenses, filterYear, filterMonth, filterDay) => {
  if (!expenses || expenses.length === 0) {
    return {
      labels: [],
      datasets: [],
      expenseDetails: {},
    };
  }

  // Filter expenses based on selected filters
  let filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.expexpenseDate);
    const year = expenseDate.getFullYear();
    const month = expenseDate.getMonth() + 1; // getMonth() returns 0-11
    const day = expenseDate.getDate();

    if (filterYear && year !== parseInt(filterYear)) return false;
    if (filterMonth && month !== parseInt(filterMonth)) return false;
    if (filterDay && day !== parseInt(filterDay)) return false;

    return true;
  });

  // Group expenses by date based on filter level
  const expenseMap = {};
  const expenseDetails = {}; // Store full expense details for tooltips
  const labelDates = {}; // Store date timestamps for sorting

  filteredExpenses.forEach((expense) => {
    const expenseDate = new Date(expense.expexpenseDate);
    let dateKey;

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

  // Sort labels chronologically using stored timestamps
  const labels = Object.keys(expenseMap).sort((a, b) => {
    const timeA = labelDates[a] || 0;
    const timeB = labelDates[b] || 0;
    return timeA - timeB;
  });

  const amounts = labels.map((label) => expenseMap[label]);

  return {
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
    _expenseDetails: expenseDetails, // Store details for tooltip (using _ prefix to avoid Chart.js processing)
  };
};

// Prepare data for date range chart with individual dates and purpose-based colors
export const prepareDateRangeChartData = (expenses, dateRangeFrom, dateRangeTo) => {
  if (!expenses || expenses.length === 0) {
    return {
      labels: [],
      datasets: [],
      expenseDetails: {},
      expenseMap: {},
    };
  }

  // Filter expenses by date range
  const filteredExpenses = expenses.filter((expense) => {
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

  // Get all unique dates and purposes
  const dateSet = new Set();
  const purposeSet = new Set();
  const expenseDetails = {}; // Store full expense details by date and index
  const expenseMap = {}; // Map date -> array of expenses

  filteredExpenses.forEach((expense) => {
    const expenseDate = new Date(expense.expexpenseDate);
    expenseDate.setHours(0, 0, 0, 0);
    const dateKey = expenseDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    dateSet.add(dateKey);
    purposeSet.add(expense.exppurpose);
    
    if (!expenseMap[dateKey]) {
      expenseMap[dateKey] = [];
    }
    
    expenseMap[dateKey].push({
      id: expense.id || expense._id,
      expname: expense.expname,
      exppurpose: expense.exppurpose,
      expdescription: expense.expdescription,
      expquantity: expense.expquantity,
      expprice: expense.expprice,
      exptotalAmount: expense.exptotalAmount,
      expexpenseDate: expense.expexpenseDate,
      dateKey,
    });
  });

  // Sort dates chronologically
  const dateTimestamps = {};
  Array.from(dateSet).forEach((dateKey) => {
    // Find a date from expenseMap to get the timestamp
    const expensesForDate = expenseMap[dateKey];
    if (expensesForDate && expensesForDate.length > 0) {
      dateTimestamps[dateKey] = new Date(expensesForDate[0].expexpenseDate).getTime();
    }
  });
  
  const sortedDates = Array.from(dateSet).sort((a, b) => {
    const timeA = dateTimestamps[a] || 0;
    const timeB = dateTimestamps[b] || 0;
    return timeA - timeB;
  });

  const purposes = Array.from(purposeSet);
  
  // Color palette for purposes
  const colorPalette = [
    'rgba(54, 162, 235, 0.6)',   // Blue
    'rgba(255, 99, 132, 0.6)',   // Red
    'rgba(255, 206, 86, 0.6)',   // Yellow
    'rgba(75, 192, 192, 0.6)',   // Teal
    'rgba(153, 102, 255, 0.6)',  // Purple
    'rgba(255, 159, 64, 0.6)',   // Orange
    'rgba(199, 199, 199, 0.6)',  // Grey
    'rgba(83, 102, 255, 0.6)',   // Indigo
    'rgba(255, 99, 255, 0.6)',   // Magenta
    'rgba(99, 255, 132, 0.6)',   // Green
  ];

  const borderColorPalette = [
    'rgba(54, 162, 235, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
    'rgba(83, 102, 255, 1)',
    'rgba(255, 99, 255, 1)',
    'rgba(99, 255, 132, 1)',
  ];

  // Create datasets for each purpose (stacked bars)
  const datasets = purposes.map((purpose, purposeIndex) => {
    const data = sortedDates.map((dateKey) => {
      const expensesForDate = expenseMap[dateKey] || [];
      const expensesForPurpose = expensesForDate.filter(
        (exp) => exp.exppurpose === purpose
      );
      return expensesForPurpose.reduce((sum, exp) => sum + exp.exptotalAmount, 0);
    });

    return {
      label: purpose,
      data: data,
      backgroundColor: colorPalette[purposeIndex % colorPalette.length],
      borderColor: borderColorPalette[purposeIndex % borderColorPalette.length],
      borderWidth: 1,
    };
  });

  // Store expense details for tooltips and clicks
  sortedDates.forEach((dateKey) => {
    expenseDetails[dateKey] = expenseMap[dateKey] || [];
  });

  return {
    labels: sortedDates,
    datasets: datasets,
    _expenseDetails: expenseDetails,
    _expenseMap: expenseMap,
  };
};

// Get available years, months, and days from expenses
export const getAvailableFilters = (expenses) => {
  if (!expenses || expenses.length === 0) {
    return { years: [], months: [], days: [] };
  }

  const yearsSet = new Set();
  const monthsSet = new Set();
  const daysSet = new Set();

  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.expexpenseDate);
    yearsSet.add(expenseDate.getFullYear());
    monthsSet.add(expenseDate.getMonth() + 1);
    daysSet.add(expenseDate.getDate());
  });

  return {
    years: Array.from(yearsSet).sort((a, b) => b - a), // Latest first
    months: Array.from(monthsSet).sort((a, b) => a - b),
    days: Array.from(daysSet).sort((a, b) => a - b),
  };
};

// Prepare data for bar chart (keeping for backward compatibility)
export const prepareBarChartData = (expenses) => {
  if (!expenses || expenses.length === 0) {
    return {
      labels: [],
      datasets: [],
    };
  }

  // Group expenses by name
  const expenseMap = {};
  expenses.forEach((expense) => {
    if (expenseMap[expense.expname]) {
      expenseMap[expense.expname] += expense.exptotalAmount;
    } else {
      expenseMap[expense.expname] = expense.exptotalAmount;
    }
  });

  const labels = Object.keys(expenseMap);
  const amounts = Object.values(expenseMap);

  return {
    labels,
    datasets: [
      {
        label: 'Total Amount (₹)',
        data: amounts,
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
};

// Prepare data for pie chart
export const preparePieChartData = (expenses) => {
  if (!expenses || expenses.length === 0) {
    return {
      labels: [],
      datasets: [],
    };
  }

  // Group expenses by purpose
  const purposeMap = {};
  expenses.forEach((expense) => {
    if (purposeMap[expense.exppurpose]) {
      purposeMap[expense.exppurpose] += expense.exptotalAmount;
    } else {
      purposeMap[expense.exppurpose] = expense.exptotalAmount;
    }
  });

  const labels = Object.keys(purposeMap);
  const amounts = Object.values(purposeMap);

  return {
    labels,
    datasets: [
      {
        label: 'Amount (₹)',
        data: amounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
};

// Chart options for date-based chart with custom tooltip
export const getDateBasedChartOptions = (chartData, onBarClick, isDateRange = false) => {
  const expenseDetails = chartData?._expenseDetails || {};
  const expenseMap = chartData?._expenseMap || {};
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: isDateRange,
      },
      y: {
        stacked: isDateRange,
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '₹' + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      intersect: false, // Allow clicking anywhere near the bar, not just exact position
      mode: 'index', // Show tooltip for all datasets at the same index
    },
    // Make bars more clickable
    elements: {
      bar: {
        borderSkipped: false, // Make entire bar area clickable
      },
    },
    onHover: (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
    },
    onClick: (event, elements) => {
      // Ensure clicks work even when tooltip is visible
      // Check if click is on a bar element
      if (elements && elements.length > 0 && onBarClick) {
        const element = elements[0];
        const label = chartData.labels[element.index];
        const datasetIndex = element.datasetIndex;
        
        if (isDateRange && expenseMap[label]) {
          // For date range, get expenses for the clicked purpose
          const purpose = chartData.datasets[datasetIndex].label;
          const expensesForDate = expenseMap[label] || [];
          const expensesForPurpose = expensesForDate.filter(
            (exp) => exp.exppurpose === purpose
          );
          onBarClick(label, expensesForPurpose, purpose);
        } else {
          // For year/month/day filter, get all expenses for that date
          onBarClick(label, expenseDetails[label] || []);
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expenses by Date',
        font: {
          size: 16,
        },
      },
      tooltip: {
        intersect: false, // Don't require exact mouse position - tooltip shows when near bar
        position: 'nearest', // Position tooltip near cursor, not blocking the bar
        // Tooltip won't block clicks because intersect: false allows clicks on the bar area
        callbacks: {
          title: function (context) {
            return `Date: ${context[0].label}`;
          },
          label: function (context) {
            const label = context.label;
            const value = context.parsed.y;
            const datasetIndex = context.datasetIndex;
            
            if (isDateRange && expenseMap[label]) {
              // For date range chart, show purpose-specific tooltip
              const purpose = chartData.datasets[datasetIndex].label;
              const expensesForDate = expenseMap[label] || [];
              const expensesForPurpose = expensesForDate.filter(
                (exp) => exp.exppurpose === purpose
              );
              
              if (expensesForPurpose.length === 0) {
                return `${purpose}: ₹0`;
              }
              
              let tooltipContent = [`Date: ${label}`, `Purpose: ${purpose}`, `Total: ₹${value.toLocaleString()}`, ''];
              
              expensesForPurpose.forEach((expense, index) => {
                if (index > 0) tooltipContent.push('');
                tooltipContent.push(`Name: ${expense.expname}`);
                tooltipContent.push(`Quantity: ${expense.expquantity}`);
                tooltipContent.push(`Amount: ₹${expense.exptotalAmount.toLocaleString()}`);
              });
              
              if (expensesForPurpose.length > 1) {
                tooltipContent.push('');
                tooltipContent.push('(Click to view all)');
              }
              
              return tooltipContent;
            } else {
              // Original tooltip logic
              const details = expenseDetails[label] || [];

              if (details.length === 0) {
                return `Total: ₹${value.toLocaleString()}`;
              }

              // Show first expense + count of remaining
              let tooltipContent = [`Total: ₹${value.toLocaleString()}`, ''];
              
              // Show first expense details
              const firstExpense = details[0];
              tooltipContent.push(`Name: ${firstExpense.name}`);
              tooltipContent.push(`Purpose: ${firstExpense.purpose}`);
              tooltipContent.push(`Quantity: ${firstExpense.quantity}`);
              tooltipContent.push(`Amount: ₹${firstExpense.amount.toLocaleString()}`);
              
              // Show remaining count if there are more expenses
              if (details.length > 1) {
                tooltipContent.push('');
                tooltipContent.push(`${details.length - 1}+ expenses are there`);
                tooltipContent.push('(Click anywhere on bar to view all)');
              }

              return tooltipContent;
            }
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
      },
    },
  };
};

// Chart options (keeping for backward compatibility)
export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Expenses by Name',
      font: {
        size: 16,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return '₹' + value.toLocaleString();
        },
      },
    },
  },
};

export const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Expenses by Purpose',
      font: {
        size: 16,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
        },
      },
    },
  },
};
