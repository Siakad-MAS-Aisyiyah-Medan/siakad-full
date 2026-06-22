import ExcelJS from 'exceljs';

export async function exportToExcel(filename, rows) {
  if (!rows || !rows.length) {
    return;
  }

  const keys = Object.keys(rows[0]);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  // Define columns
  worksheet.columns = keys.map(key => ({
    header: key,
    key: key,
    width: 25, // Default width
  }));

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF059669' }, // Emerald 600 from the design
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 25;

  // Add rows
  rows.forEach(rowData => {
    worksheet.addRow(rowData);
  });

  // Style all data rows and auto-adjust widths
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      // Add borders to all cells
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };

      if (rowNumber > 1) {
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      }
    });
  });

  // Auto-fit column widths based on content
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    // Set a minimum width and add some padding
    column.width = Math.max(maxLength + 2, 15);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.xlsx') ? filename : filename.replace(/\.csv$/, '') + '.xlsx');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
