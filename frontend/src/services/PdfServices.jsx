import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

// Generate PDF from HTML element
export const generatePDF = async (elementId, filename = 'expense-report.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error('Element not found for PDF generation');
      return;
    }

    toast.loading('Generating PDF...', { id: 'pdf-loading' });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(filename);

    toast.success('PDF generated successfully!', { id: 'pdf-loading' });
  } catch (error) {
    toast.error('Failed to generate PDF', { id: 'pdf-loading' });
    console.error('PDF generation error:', error);
  }
};

// Generate expense report PDF using HTML table (to preserve ₹ symbol)
export const generateExpenseReportPDF = async (expenses, userInfo, filterInfo = {}) => {
  try {
    toast.loading('Generating PDF...', { id: 'pdf-loading' });

    // Create a temporary container for the PDF content
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm'; // A4 width
    tempDiv.style.padding = '20px';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.fontFamily = 'Arial, sans-serif';

    // Calculate total amount
    const totalAmount = expenses.reduce((sum, exp) => sum + (exp.exptotalAmount || 0), 0);

    // Prepare filter information display
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let filterDetails = [];
    
    // Add filter type information
    if (filterInfo.filterType && filterInfo.filterType !== 'none') {
      const filterTypeNames = {
        dateRange: 'Date Range Filter',
        yearMonthDay: 'Year/Month/Day Filter'
      };
      filterDetails.push(`<strong>Filter Type:</strong> ${filterTypeNames[filterInfo.filterType] || filterInfo.filterType}`);
    }
    
    if (filterInfo.filterType === 'dateRange') {
      if (filterInfo.dateRangeFrom || filterInfo.dateRangeTo) {
        let rangeText = '';
        if (filterInfo.dateRangeFrom && filterInfo.dateRangeTo) {
          rangeText = `${new Date(filterInfo.dateRangeFrom).toLocaleDateString()} to ${new Date(filterInfo.dateRangeTo).toLocaleDateString()}`;
        } else if (filterInfo.dateRangeFrom) {
          rangeText = `From ${new Date(filterInfo.dateRangeFrom).toLocaleDateString()}`;
        } else if (filterInfo.dateRangeTo) {
          rangeText = `Until ${new Date(filterInfo.dateRangeTo).toLocaleDateString()}`;
        }
        filterDetails.push(`<strong>Date Range:</strong> ${rangeText}`);
      }
    } else if (filterInfo.filterType === 'yearMonthDay') {
      if (filterInfo.filterYear) {
        let dateFilter = `Year: ${filterInfo.filterYear}`;
        if (filterInfo.filterMonth) {
          dateFilter += `, Month: ${monthNames[parseInt(filterInfo.filterMonth) - 1]}`;
        }
        if (filterInfo.filterDay) {
          dateFilter += `, Day: ${filterInfo.filterDay}`;
        }
        filterDetails.push(`<strong>Chart Filter:</strong> ${dateFilter}`);
      }
      
      if (filterInfo.selectedDateLabel) {
        filterDetails.push(`<strong>Date Filter:</strong> ${filterInfo.selectedDateLabel}`);
      }
    }
    
    if (filterInfo.sortColumn) {
      const sortColumnNames = {
        expname: 'Name',
        exppurpose: 'Purpose',
        expquantity: 'Quantity',
        expprice: 'Price',
        exptotalAmount: 'Total Amount',
        expexpenseDate: 'Date'
      };
      const sortDir = filterInfo.sortDirection === 'asc' ? 'Ascending' : 'Descending';
      filterDetails.push(`<strong>Sorted By:</strong> ${sortColumnNames[filterInfo.sortColumn]} (${sortDir})`);
    }

    const filterSection = filterDetails.length > 0 
      ? `<div style="background-color: #e7f3ff; border-left: 4px solid #667eea; padding: 12px; margin-bottom: 15px; border-radius: 4px;">
          <div style="font-weight: bold; color: #667eea; margin-bottom: 8px; font-size: 11px;">APPLIED FILTERS & SORTING:</div>
          ${filterDetails.map(detail => `<div style="color: #495057; font-size: 10px; margin: 4px 0;">${detail}</div>`).join('')}
        </div>`
      : '';

    // Create HTML content
    tempDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 24px; color: #212529; margin: 0 0 15px 0;">Expense Report</h1>
        <div style="text-align: left; color: #6c757d; font-size: 12px; margin-bottom: 15px;">
          <p style="margin: 5px 0;"><strong>User:</strong> ${userInfo?.username || 'N/A'}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${userInfo?.useremail || 'N/A'}</p>
          <p style="margin: 5px 0;"><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        ${filterSection}
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px;">
        <thead>
          <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff;">
            <th style="padding: 10px 8px; text-align: left; border: 1px solid #667eea;">Name</th>
            <th style="padding: 10px 8px; text-align: left; border: 1px solid #667eea;">Purpose</th>
            <th style="padding: 10px 8px; text-align: left; border: 1px solid #667eea;">Description</th>
            <th style="padding: 10px 8px; text-align: center; border: 1px solid #667eea;">Quantity</th>
            <th style="padding: 10px 8px; text-align: right; border: 1px solid #667eea;">Price</th>
            <th style="padding: 10px 8px; text-align: right; border: 1px solid #667eea;">Total</th>
            <th style="padding: 10px 8px; text-align: center; border: 1px solid #667eea;">Date</th>
          </tr>
        </thead>
        <tbody>
          ${expenses
            .map(
              (expense, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#f8f9fa' : '#ffffff'};">
              <td style="padding: 8px; border: 1px solid #dee2e6; word-wrap: break-word; max-width: 80px;">${expense.expname || 'N/A'}</td>
              <td style="padding: 8px; border: 1px solid #dee2e6; word-wrap: break-word; max-width: 70px;">${expense.exppurpose || 'N/A'}</td>
              <td style="padding: 8px; border: 1px solid #dee2e6; word-wrap: break-word; max-width: 150px; white-space: normal;">${expense.expdescription || 'N/A'}</td>
              <td style="padding: 8px; border: 1px solid #dee2e6; text-align: center;">${expense.expquantity || 0}</td>
              <td style="padding: 8px; border: 1px solid #dee2e6; text-align: right;">₹${(expense.expprice || 0).toFixed(2)}</td>
              <td style="padding: 8px; border: 1px solid #dee2e6; text-align: right; font-weight: 600;">₹${(expense.exptotalAmount || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</td>
              <td style="padding: 8px; border: 1px solid #dee2e6; text-align: center;">${new Date(expense.expexpenseDate).toLocaleDateString()}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr style="background-color: #f8f9fa;">
            <td colspan="5" style="padding: 12px 8px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 12px;">Total:</td>
            <td style="padding: 12px 8px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 12px; color: #667eea;">₹${totalAmount.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</td>
            <td style="padding: 12px 8px; border: 1px solid #dee2e6;"></td>
          </tr>
        </tfoot>
      </table>
    `;

    // Append to body temporarily
    document.body.appendChild(tempDiv);

    // Wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture with html2canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Remove temporary element
    document.body.removeChild(tempDiv);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pdfWidth / imgWidth;
    const imgHeightMM = imgHeight * ratio;

    // Handle multiple pages if content is too long
    let heightLeft = imgHeightMM;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightMM);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeightMM;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightMM);
      heightLeft -= pdfHeight;
    }

    pdf.save(`expense-report-${Date.now()}.pdf`);
    toast.success('PDF report generated successfully!', { id: 'pdf-loading' });
  } catch (error) {
    toast.error('Failed to generate PDF report', { id: 'pdf-loading' });
    console.error('PDF generation error:', error);
  }
};
