import React, { useCallback, useEffect, useState } from "react";
import Multiselect from "../components/multiselect/Multiselect";
import * as XLSX from "xlsx";
import search from "../images/search.svg";
import sortWhite from "../images/sort-white.svg";
import download from "../images/download.svg";
import avatar from "../images/tuser.svg";
import { useSection } from "../utils/SectionContext";
import { AGENCY, BASE_LOCAL_URL, ENTITY, NETWORK, STAGWELL } from "../_constants/constants";
import { sessionStorageGet } from "../utils/storageHelper";
import Success from "../pages/Success";
import Loader from "./Loader";
import { useOktaAuth } from '@okta/okta-react';

const allNewOptions = [
  { value: "Agency Name", label: "Agency Name" },
  { value: "Entity", label: "Entity" },
  { value: "Employee ID", label: "Employee ID" },
  { value: "Base Comp", label: "Cash Bonus" },
  { value: "2023 Cash Bonus", label: "2023 Cash Bonus" },
  { value: "2023 Stock Bonus", label: "2023 Stock Bonus" },
  { value: "2023 Stock Premium", label: "2023 Stock Premium" },
  { value: "2023 Total Bonus", label: "2023 Total Bonus" },
  { value: "2023 Vesting", label: "2023 Vesting" },
  { value: "2023 Vesting Premium", label: "2023 Vesting Premium" },
  { value: "2022 Base Comp", label: "2022 Base Comp" },
  { value: "2022 Cash Bonus", label: "2022 Cash Bonus" },
  { value: "2022 Stock Bonus", label: "2022 Stock Bonus" },
  { value: "2022 Stock Premium", label: "2022 Stock Premium" },
  { value: "Year", label: "Year" },
  { value: "Cost Type", label: "Cost Type" },
  { value: "2023 Retention", label: "2023 Retention" },
  { value: "SSN", label: "SSN" },
  { value: "Email Address", label: "Email Address" },
  { value: "Home Address", label: "Home Address" },
  { value: "Home Address City", label: "Home Address City" },
  { value: "Home Address State Code", label: "Home Address State Code" },
  { value: "Home Address State Name", label: "Home Address State Name" },
  { value: "Home Address Zip Code", label: "Home Address Zip Code" },
  { value: "Home Address Country", label: "Home Address Country" },
  { value: "Country of Payroll Taxation", label: "Country of Payroll Taxation" },
  { value: "Birth Date", label: "Birth Date" },
  { value: "Hire Date", label: "Hire Date" },
  { value: "Agency ID", label: "Agency ID" },
];

export default function Steptwo({ bonusData, cashAvailable, stockAvailable, cashRemaining, stockRemaining, agencyData }) {
  const { showSection } = useSection();
  const [overAllEmployeeList, setOverAllEmployeeList] = useState([]);
  const [reformatedEmployeeData, setReformatedEmployeeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [entityQuery, setEntityQuery] = useState([]);
  const [allagency, setAllAgency] = useState([]);
  const [agencyQuery, setAgencyQuery] = useState([]);
  const [totalCashAvailable, setTotalCashAvailable] = useState(0);
  const [totalStockAvailable, setTotalStockAvailable] = useState(0);
  const [remainingCash, setRemainingCash] = useState(0);
  const [remainingStock, setRemainingStock] = useState(0);
  const [overAllRemainingCash, setOverAllRemainingCash] = useState(0);
  const [overAllRemainingStock, setOverAllRemainingStock] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [userType, setUserType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const allEntites = bonusData?.map((item) => ({
    value: item.entityName,
    label: item.entityName,
  }));
  
  const { oktaAuth, authState } = useOktaAuth();

  // Define default selected options
  const defaultSelectedOptions = [
    { value: "Agency Name", label: "Agency Name" },
    { value: "Entity", label: "Entity" },
    { value: "Base Comp", label: "Base Comp" },
    { value: "2023 Cash Bonus", label: "2023 Cash Bonus" },
    { value: "2023 Stock Bonus", label: "2023 Stock Bonus" }
  ];

  const [selectedColumns, setSelectedColumns] = useState(defaultSelectedOptions.map(option => option.value));

  const totalData = [
    { id: 1, title: "Total Cash Available", amount: `$${totalCashAvailable ? totalCashAvailable : cashAvailable ? cashAvailable : 0}` },
    { id: 2, title: "Total Cash Remaining", amount: `$${remainingCash}` },
    { id: 3, title: "Total Stock Available", amount: `$${totalStockAvailable ? totalStockAvailable : stockAvailable ? stockAvailable : 0}` },
    { id: 4, title: "Total Stock Remaining", amount: `$${remainingStock}` },
  ];

  const DataTile = useCallback(({ data, type }) => {
    return (
      <>
        {data.map((item) => (
          <div className="col" key={item.id}>
            <div className="tileWrap singleCard">
              <div className="tileHeader d-flex align-items-center g-15">
                {type === "total" ? null : <img src={item.image} alt="" />}
                <div className="tileTxt">
                  <h6>{item.title}</h6>
                  <h2>{item.amount}</h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }, []);

  const calculateBalanceSum = useCallback(async() => {
    if (entityQuery.length === 0) {
      setRemainingCash(cashRemaining);
      setRemainingStock(stockRemaining)
    } else {
      let flatEmployees = [];
        const filteredData = overAllEmployeeList.filter(entity =>
          entityQuery.includes(entity.entity) && entity.employees.some(employee =>
              agencyQuery.includes(employee.agencyName)
          )
      );
        flatEmployees = filteredData.flatMap(entity => entity.employees);
      const totalCashBonus = flatEmployees.reduce((sum, employee) => sum + employee.cashBonusPresent, 0);
      const unSelectedFilteredData = overAllEmployeeList.filter(entity => !entityQuery.includes(entity.entity) && entity.employees.some(employee =>
        !agencyQuery.includes(employee.agencyName)));
      const unSelectedFlatEmployees = unSelectedFilteredData.flatMap(entity => entity.employees);
      const unSelectedTotalCashBonus = unSelectedFlatEmployees.reduce((sum, employee) => sum + employee.cashBonusPresent, 0);
      let remainingCash = totalCashAvailable - totalCashBonus
      let unSelectedRemainingCash = totalCashAvailable - unSelectedTotalCashBonus
      const remainingCashForAllEntites = cashAvailable - totalCashBonus
      setOverAllRemainingCash(remainingCash === 0 && unSelectedRemainingCash === 0 ? 0 : remainingCashForAllEntites)
      setRemainingCash(remainingCash);
      const totalStockBonus = flatEmployees.reduce((sum, employee) => sum + employee.stockBonusPresent, 0);
      const unSelectedTotalStockBonus = unSelectedFlatEmployees.reduce((sum, employee) => sum + employee.stockBonusPresent, 0);
      let remainingStock = totalStockAvailable - totalStockBonus
      let unSelectedRemainingStock = totalStockAvailable - unSelectedTotalStockBonus
      const remainingStockForAllEntites = stockAvailable - totalStockBonus
      setOverAllRemainingStock(remainingStock === 0 && unSelectedRemainingStock === 0 ? 0 : remainingStockForAllEntites);
      setRemainingStock(remainingStock)
    }
  }, [agencyQuery, cashAvailable, cashRemaining, entityQuery, overAllEmployeeList, stockAvailable, stockRemaining, totalCashAvailable, totalStockAvailable]);

  const calculateTotalSum = useCallback(() => {
    if (entityQuery.length === 0) {
      setTotalCashAvailable(cashAvailable);
      setTotalStockAvailable(stockAvailable);
    } else {
      const filteredData = bonusData.filter((item) =>
        entityQuery.includes(item.entityName) && agencyQuery.includes(item.agencyName)
      );
      const overallSumAmountForCash = filteredData.reduce(
        (sum, entity) => sum + entity.amountForCash,
        0
      );

      const overallSumAmountForStock = filteredData.reduce(
        (sum, entity) => sum + entity.amountForStock,
        0
      );
      setTotalCashAvailable(overallSumAmountForCash);
      setTotalStockAvailable(overallSumAmountForStock);
      calculateBalanceSum();
    }
  }, [agencyQuery, bonusData, calculateBalanceSum, cashAvailable, entityQuery, stockAvailable]);

  useEffect(() => {
    calculateTotalSum();
  }, [entityQuery, DataTile, calculateTotalSum]);

  useEffect(() => {
    const accessToken = oktaAuth.getAccessToken();
    const fetchData = async () => {
      setIsLoading(true);
      const userType = await sessionStorageGet('userType')
      setUserType(userType)
        if (bonusData?.length) {
          try {
            const entities = bonusData.map((item) => item.entityName);
            setEntityQuery(entities);
            const agencies = bonusData.map((item) => item.agencyName);
            setAgencyQuery(agencies)
            const response = await fetch(`${BASE_LOCAL_URL}employee/list`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,  
                'Content-Type': 'application/json'
              },
              credentials: "include",
            });
            const result = await response.json();
            setReformatedEmployeeData(result);
            const uniqueAgencyNames = [
              ...new Set(result.map((item) => item.agencyName)),
            ];
            let entityDataArray = [];
            uniqueAgencyNames.map((data) => {
              entityDataArray.push({ value: data, label: data });
            });
            setAllAgency(entityDataArray);
            const entitiesMap = {};
            result.forEach((employee) => {
              const entity = employee.entity;
              if (!entitiesMap[entity]) {
                entitiesMap[entity] = [];
              }
              entitiesMap[entity].push(employee);
            });

            const employeesPerEntity = Object.keys(entitiesMap).map(
              (entity) => ({
                entity,
                employees: entitiesMap[entity],
              })
            );
            setOverAllEmployeeList(employeesPerEntity);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
      setIsLoading(false);
    };
    fetchData();
  }, [bonusData]);

  // Handler for when options change in Multiselect
  const handleOptionsChange = (selectedOptions) => {
    setSelectedColumns(selectedOptions);
  };

  const downloadExcel = () => {
    // Prepare the data for Excel
    const dataForExcel = overAllEmployeeList.flatMap((row) =>
      row.employees.map((employee) => [
        employee.firstName,
        employee.lastName,
        employee.jobTitle,
        employee.agencyName,
        employee.entity,
        employee.employeeId,
        employee.baseCompPresent,
        employee.cashBonusPresent,
        employee.stockBonusPresent,
        employee.stockPremiumPresent,
        employee.totalBonusPresent,
        employee.vesting,
        employee.vestingPremiumPercentage,
        employee.baseCompPrevious,
        employee.cashBonusPrevious,
        employee.stockBonusPrevious,
        employee.stockPremiumPrevious,
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
    XLSX.writeFile(wb, "table_data.xlsx");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleOnChange = async(agencyName, entityName, employeeId, value, key) => {
    const userType = await sessionStorageGet('userType')
    if (userType === STAGWELL || userType === NETWORK) {
      const entityIndex = overAllEmployeeList.findIndex((entity) =>
        entity.employees.some(
          (employee) =>
            employee.employeeId === employeeId && employee.entity === entityName
        )
      );

      if (entityIndex !== -1) {
        const employeeIndex = overAllEmployeeList[
          entityIndex
        ].employees.findIndex(
          (employee) =>
            employee.employeeId === employeeId && employee.entity === entityName
        );

        if (employeeIndex !== -1) {
          const updatedEntities = [...overAllEmployeeList];
          updatedEntities[entityIndex].employees[employeeIndex][key] = parseInt(
            value.length !== 0 ? value : 0
          );
          setOverAllEmployeeList(updatedEntities);
          const reversedResult = updatedEntities.flatMap(
            ({ entity, employees }) =>
              employees.map((employee) => ({ ...employee, entity }))
          );
          setReformatedEmployeeData(reversedResult);
        }
      }
    } else {
      const entityIndex = overAllEmployeeList.findIndex(
        (entity) => entity.entity === entityName
      );
      if (entityIndex !== -1) {
        const employeeIndex = overAllEmployeeList[
          entityIndex
        ].employees.findIndex(
          (employee) =>
            employee.employeeId === employeeId && employee.entity === entityName
        );
        if (employeeIndex !== -1) {
          const updatedEntities = [...overAllEmployeeList];
          updatedEntities[entityIndex].employees[employeeIndex][key] = parseInt(
            value.length !== 0 ? value : 0
          );
          setOverAllEmployeeList(updatedEntities);
        }
      }
    }
  };

  const handleOnSubmit = async () => {
    const accessToken = oktaAuth.getAccessToken();
    try {
      const response = await fetch(`${BASE_LOCAL_URL}employee/save`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,  
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify(reformatedEmployeeData),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        {
          userType != ENTITY && showSection("Stepthree");
          userType === STAGWELL && showSection("Stepfour");
        }
      }, 800);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container InfoSec">
      {showAlert && <Success />}
      {isLoading && <Loader />}
      <div className="sectionTitle">
        Company: <span>{agencyData?.agencyName}</span>
      </div>

      <div className="showcaseWrap">
        <div className="row gx-3 gy-3 gx-0">
          <DataTile data={totalData} type="total" />
        </div>
      </div>

      <div>
        <div className="selectSec mt-3">
          <div className="row gy-3">
            <div className="col-md-11">
              <div className="row gx-3 gy-3">
                <div className={userType != ENTITY ? "col-md-3" : "col-md-6"}>
                  <div className="searchWrap d-flex align-items-center">
                    <img src={search} alt="" />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Employee"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                {userType !== ENTITY && (
                  <div className="col-md-3 customMultiselect columnSelect">
                    <Multiselect
                      placeholder="Consolidated"
                      allOptions={allagency}
                      defaultSelectedOptions={allagency}
                      onOptionsChange={(option) => {
                        setAgencyQuery(option);
                      }}
                    />
                  </div>
                )}
                {userType !== ENTITY && (
                  <div className="col-md-3 customMultiselect columnSelect">
                    <Multiselect
                      placeholder="Entity"
                      allOptions={allEntites}
                      defaultSelectedOptions={allEntites}
                      onOptionsChange={(option) => setEntityQuery(option)}
                    />
                  </div>
                )}
                <div
                  className={
                    userType !== ENTITY
                      ? "col-md-3 customMultiselect columnSelect"
                      : "col-md-6 customMultiselect columnSelect"
                  }
                >
                  {/* <Multiselect placeholder="Colums" allOptions={allOptions} /> */}
                  <Multiselect
                    placeholder="Colums"
                    allOptions={allNewOptions}
                    onOptionsChange={handleOptionsChange}
                    defaultSelectedOptions={defaultSelectedOptions}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-1">
              <button
                className="d-flex align-items-center justify-content-center g-3 btnOutlined btnXs"
                onClick={downloadExcel}
              >
                {" "}
                XLS <img src={download} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="empWrap mt-4">
        <div className="row">
          <div className="col">
            <div className="tableWrap">
              <div className="table-responsive resTable">
                <table className="table tableBase fixedcolumnTable">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="fixed-column columnUser userHead"
                      >
                        <div className="customSortHead">
                          Name & JOB TITLE <img src={sortWhite} alt="" />
                        </div>
                      </th>

                      {selectedColumns.map((item, index) => (
                        <th scope="col" key={index}>
                          <div className="customSortHead">
                            {item} <img src={sortWhite} alt="" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {overAllEmployeeList.map((entityData, entityIndex) => (
                    <tbody key={entityIndex}>
                      {/* Map over each entity's employees and render table rows */}
                      {entityData.employees
                        .filter(
                          (row) =>
                            (row.firstName
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                              row.lastName
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())) &&
                            (!entityQuery.length ||
                              entityQuery.includes(row.entity)) &&
                            (!agencyQuery.length ||
                              agencyQuery.includes(row.agencyName))
                        )
                        .map((row, index) => (
                          <tr key={index}>
                            <td className="columnUser fixed-column">
                              <div className="customTableBody d-flex g-10">
                                <img src={avatar} alt="" />
                                <div className="fuserInfo">
                                  <h6>
                                    {row.firstName} {row.lastName}
                                  </h6>
                                  <span className="caption">
                                    {row.jobTitle}
                                  </span>
                                </div>
                              </div>
                            </td>
                            {selectedColumns.map((columnName, columnIndex) => (
                              <td key={columnIndex}>
                                <div className="customTableBody textBalck">
                                  {columnName === "Agency Name" && (
                                    <span>{row.agencyName}</span>
                                  )}
                                  {columnName === "Entity" && (
                                    <span>{row.entity}</span>
                                  )}
                                  {columnName === "Employee ID" && (
                                    <span>{row.employeeId}</span>
                                  )}
                                  {columnName === "Base Comp" && (
                                    <span>{row.baseCompPresent}</span>
                                  )}
                                  {columnName === "2023 Cash Bonus" && (
                                    <div className="inputBorder d-flex align-items-center">
                                      <span>$</span>
                                      <input
                                        type="number"
                                        className="form-control"
                                        placeholder=""
                                        defaultValue={row.cashBonusPresent || 0}
                                        // value={row.cashBonusPresent}
                                        onChange={(e) =>
                                          handleOnChange(
                                            row.agencyName,
                                            row.entity,
                                            row.employeeId,
                                            e.target.value,
                                            "cashBonusPresent"
                                          )
                                        }
                                        disabled={userType === NETWORK}
                                        style={{
                                          backgroundColor:
                                            userType === "ENTITY"
                                              ? "#fff"
                                              : "inherit",
                                        }}
                                      />
                                    </div>
                                  )}
                                  {columnName === "2023 Stock Bonus" && (
                                    <div className="inputBorder d-flex align-items-center">
                                      <span>$</span>
                                      <input
                                        type="number"
                                        className="form-control"
                                        placeholder=""
                                        defaultValue={
                                          row.stockBonusPresent || 0
                                        }
                                        onChange={(e) =>
                                          handleOnChange(
                                            row.agencyName,
                                            row.entity,
                                            row.employeeId,
                                            e.target.value,
                                            "stockBonusPresent"
                                          )
                                        }
                                        disabled={userType === NETWORK}
                                        style={{
                                          backgroundColor:
                                            userType === "ENTITY"
                                              ? "#fff"
                                              : "inherit",
                                        }}
                                      />
                                    </div>
                                  )}
                                  {columnName === "2023 Stock Premium" && (
                                    <span>{row.stockPremiumPresent}</span>
                                  )}
                                  {columnName === "2023 Total Bonus" && (
                                    <span>{row.totalBonusPresent}</span>
                                  )}
                                  {columnName === "2023 Vesting" && (
                                    <span>{row.vesting}</span>
                                  )}
                                  {columnName === "2023 Vesting Premium" && (
                                    <span>{row.vestingPremiumPercentage}</span>
                                  )}
                                  {columnName === "2022 Base Comp" && (
                                    <span>{row.baseCompPrevious}</span>
                                  )}
                                  {columnName === "2022 Cash Bonus" && (
                                    <span>{row.cashBonusPrevious}</span>
                                  )}
                                  {columnName === "2022 Stock Bonus" && (
                                    <span>{row.stockBonusPrevious}</span>
                                  )}
                                  {columnName === "2022 Stock Premium" && (
                                    <span>{row.stockPremiumPrevious}</span>
                                  )}
                                  {columnName === "Year" && (
                                    <span>{row.year}</span>
                                  )}
                                  {columnName === "Cost Type" && (
                                    <span>{row.costType}</span>
                                  )}
                                  {columnName === "2023 Retention" && (
                                    <span>{row.retentionCurrentYear}</span>
                                  )}
                                  {columnName === "SSN" && (
                                    <span>{row.ssn}</span>
                                  )}
                                  {columnName === "Email Address" && (
                                    <span>{row.emailAddress}</span>
                                  )}
                                  {columnName === "Home Address" && (
                                    <span>{row.homeAddress}</span>
                                  )}
                                  {columnName === "Home Address City" && (
                                    <span>{row.homeAddressCity}</span>
                                  )}
                                  {columnName === "Home Address State Code" && (
                                    <span>{row.homeAddressStateCode}</span>
                                  )}
                                  {columnName === "Home Address State Name" && (
                                    <span>{row.homeAddressStateName}</span>
                                  )}
                                  {columnName === "Home Address Zip Code" && (
                                    <span>{row.homeAddressZipCode}</span>
                                  )}
                                  {columnName === "Home Address Country" && (
                                    <span>{row.homeAddressCountry}</span>
                                  )}
                                  {columnName ===
                                    "Country of Payroll Taxation" && (
                                    <span>{row.countryOfPayrollTaxation}</span>
                                  )}
                                  {columnName === "Birth Date" && (
                                    <span>{formatDate(row.birthDate)}</span>
                                  )}
                                  {columnName === "Hire Date" && (
                                    <span>{formatDate(row.hireDate)}</span>
                                  )}
                                  {columnName === "Agency ID" && (
                                    <span>{row.agencyID}</span>
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
            <div className="d-flex justify-content-end mb-5 mt-3 g-10">
              <button className="baseBtn d-flex align-items-center justify-content-center">
                Save
              </button>
              <button
                className={`${
                  overAllRemainingCash === 0 && overAllRemainingStock === 0
                    ? "baseBtn"
                    : "baseBtnDisabled"
                } d-flex align-items-center justify-content-center`}
                onClick={handleOnSubmit}
                disabled={
                  overAllRemainingCash === 0 && overAllRemainingStock === 0
                    ? false
                    : true
                }
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
