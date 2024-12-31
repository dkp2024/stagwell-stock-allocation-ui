import * as XLSX from "xlsx";

export const downloadExcel = (data, formatDollars) => {
    // Prepare the data for Excel
    const dataForExcel = data.flatMap((row) =>
      row.employees.map((employee) => [
        employee.firstName,
        employee.lastName,
        employee.jobTitle,
        employee.agencyName,
        employee.entity,
        employee.employeeId,
        formatDollars(employee.baseCompPresent),
        formatDollars(employee.cashBonusPresent),
        formatDollars(employee.stockBonusPresent),
        formatDollars(employee.stockPremiumPresent),
        formatDollars(employee.totalBonusPresent),
        employee.vesting,
        employee.vestingPremiumPercentage,
        formatDollars( employee.baseCompPrevious),
        formatDollars(employee.cashBonusPrevious),
        formatDollars(employee.stockBonusPrevious),
        formatDollars(employee.stockPremiumPrevious),
        employee.year,
        employee.costType,
        employee.retentionCurrentYear,
        employee.ssn,
        employee.emailAddress,
        employee.homeAddress,
        employee.homeAddressCity,
        employee.homeAddressStateCode,
        employee.homeAddressStateName,
        employee.homeAddressZipCode,
        employee.homeAddressCountry,
        employee.countryOfPayrollTaxation,
        employee.birthDate,
        employee.hireDate,
        employee.agencyID,
      ])
    );

    // Add headers to the data
    const headers = [
      "First Name",
      "Last Name",
      "Job Title",
      "Agency Name",
      "Entity",
      "Employee ID",
      "Base Comp",
      "2023 Cash Bonus",
      "2023 Stock Bonus",
      "2023 Stock Premium",
      "2023 Total Bonus",
      "Vesting",
      "2023 Vesting Premium",
      "2022 Base Comp",
      "2022 Cash Bonus",
      "2022 Stock Bonus",
      "2022 Stock Premium",
      "Year",
      "Cost Type",
      "2023 Year Retention",
      "SSN",
      "Email Address",
      "Home Address",
      "Home Address City",
      "Home Address State Code",
      "Home Address State Name",
      "Home Address Zip Code",
      "Home Address Country",
      "Country of Payroll Taxation",
      "Birth Date",
      "Hire Date",
      "Agency ID",
    ]; // Add more headers as needed
    const dataWithHeaders = [headers, ...dataForExcel];

    // Create a new workbook
    const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save the workbook to a file and trigger the download
    XLSX.writeFile(wb, "AST_data.xlsx");
  };