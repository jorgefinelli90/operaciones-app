export const REQUIRED_COLUMNS = [
    "ID",
    "Purchase Date",
    "Customer Name",
    "Customer Email",
    "Shipping Information",
    "Status",
    "Grand Total (Purchased)",
    "Payment Method",
  ];
  
  export interface ValidationResult {
    valid: boolean;
    missingColumns: string[];
  }
  
  export function validateCSV(rows: Record<string, string>[]): ValidationResult {
    if (rows.length === 0) {
      return {
        valid: false,
        missingColumns: ["El archivo está vacío"],
      };
    }
  
    const headers = Object.keys(rows[0]);
  
    const missingColumns = REQUIRED_COLUMNS.filter(
      (column) => !headers.includes(column)
    );
  
    return {
      valid: missingColumns.length === 0,
      missingColumns,
    };
  }