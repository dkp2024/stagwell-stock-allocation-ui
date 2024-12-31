import React, { useCallback, useState, useEffect } from "react";
import Multiselect from "../components/multiselect/Multiselect";
import { sessionStorageGet } from "../utils/storageHelper";
import { API_BASE_URL, AGENCY } from "../_constants/constants";
import sortWhite from "../images/sort-white.svg";
import avatar from "../images/tuser.svg";
import Loader from "./Loader";
import { useSection } from "../utils/SectionContext";
import { downloadExcel } from "../utils/excelDownload";
import * as XLSX from "xlsx";
// Function to format the input value with commas
import { useOktaAuth } from '@okta/okta-react';

const allOptions = [
  { value: "option 1", label: "option 1" },
  { value: "option 2", label: "option 2" },
  { value: "option 3", label: "option 3" },
  { value: "option 4", label: "option 4" },
];

export default function Stepfive({
  bonusData,
  cashAvailable,
  stockAvailable,
  cashRemaining,
  stockRemaining,
  agencyData,
  formatDollars,
}) {
  const { oktaAuth, authState } = useOktaAuth();
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
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const allEntites = bonusData?.map((item) => ({
    value: item.entityName,
    label: item.entityName,
  }));

  const headerColumns = [
    { value: "Agency Name", label: "Agency Name" },
    { value: "Entity", label: "Entity" },
    { value: "Eployee Id", label: "Eployee Id" },
    { value: "Base Comp", label: "Base Comp" },
    { value: "2023 Cash Bonus", label: "2023 Cash Bonus" },
    { value: "2023 Stock Bonus", label: "2023 Stock Bonus" },
    { value: "2023 Stock Premium", label: "2023 Stock Premium" },
  ];

  const totalData = [
    {
      id: 1,
      title: "Total Cash Available",
      amount: `${
        totalCashAvailable
          ? totalCashAvailable
          : cashAvailable
          ? cashAvailable
          : 0
      }`,
    },
    { id: 2, title: "Total Cash Remaining", amount: `${remainingCash}` },
    {
      id: 3,
      title: "Total Stock Available",
      amount: `${
        totalStockAvailable
          ? totalStockAvailable
          : stockAvailable
          ? stockAvailable
          : 0
      }`,
    },
    { id: 4, title: "Total Stock Remaining", amount: `${remainingStock}` },
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
                  <h2>{formatDollars(item.amount)}</h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }, [formatDollars]);

  const calculateBalanceSum = useCallback(async () => {
    if (entityQuery.length === 0) {
      setRemainingCash(cashRemaining);
      setRemainingStock(stockRemaining);
    } else {
      let flatEmployees = [];
      const filteredData = overAllEmployeeList.filter(
        (entity) =>
          entityQuery.includes(entity.entity) &&
          entity.employees.some((employee) =>
            agencyQuery.includes(employee.agencyName)
          )
      );
      flatEmployees = filteredData.flatMap((entity) => entity.employees);
      const totalCashBonus = flatEmployees.reduce(
        (sum, employee) => sum + employee.cashBonusPresent,
        0
      );
      const unSelectedFilteredData = overAllEmployeeList.filter(
        (entity) =>
          !entityQuery.includes(entity.entity) &&
          entity.employees.some(
            (employee) => !agencyQuery.includes(employee.agencyName)
          )
      );
      const unSelectedFlatEmployees = unSelectedFilteredData.flatMap(
        (entity) => entity.employees
      );
      const unSelectedTotalCashBonus = unSelectedFlatEmployees.reduce(
        (sum, employee) => sum + employee.cashBonusPresent,
        0
      );
      let remainingCash = totalCashAvailable - totalCashBonus;
      let unSelectedRemainingCash =
        totalCashAvailable - unSelectedTotalCashBonus;
      const remainingCashForAllEntites = cashAvailable - totalCashBonus;
      setOverAllRemainingCash(
        remainingCash === 0 && unSelectedRemainingCash === 0
          ? 0
          : remainingCashForAllEntites
      );
      setRemainingCash(remainingCash);
      const totalStockBonus = flatEmployees.reduce(
        (sum, employee) => sum + employee.stockBonusPresent,
        0
      );
      const unSelectedTotalStockBonus = unSelectedFlatEmployees.reduce(
        (sum, employee) => sum + employee.stockBonusPresent,
        0
      );
      let remainingStock = totalStockAvailable - totalStockBonus;
      let unSelectedRemainingStock =
        totalStockAvailable - unSelectedTotalStockBonus;
      const remainingStockForAllEntites = stockAvailable - totalStockBonus;
      setOverAllRemainingStock(
        remainingStock === 0 && unSelectedRemainingStock === 0
          ? 0
          : remainingStockForAllEntites
      );
      setRemainingStock(remainingStock);
    }
  }, [
    agencyQuery,
    cashAvailable,
    cashRemaining,
    entityQuery,
    overAllEmployeeList,
    stockAvailable,
    stockRemaining,
    totalCashAvailable,
    totalStockAvailable,
  ]);

  const calculateTotalSum = useCallback(() => {
    if (entityQuery.length === 0) {
      setTotalCashAvailable(cashAvailable);
      setTotalStockAvailable(stockAvailable);
    } else {
      const filteredData = bonusData.filter(
        (item) =>
          entityQuery.includes(item.entityName) &&
          agencyQuery.includes(item.agencyName)
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
  }, [
    agencyQuery,
    bonusData,
    calculateBalanceSum,
    cashAvailable,
    entityQuery,
    stockAvailable,
  ]);

  useEffect(() => {
    calculateTotalSum();
  }, [entityQuery, DataTile, calculateTotalSum]);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = oktaAuth.getAccessToken();
      setIsLoading(true);
      const userType = await sessionStorageGet("userType");
      if (userType === AGENCY) {
        showSection("Stepthree")
      }
      setUserType(userType);
      if (bonusData?.length) {
        try {
          const entities = bonusData.map((item) => item.entityName);
          setEntityQuery(entities);
          const agencies = bonusData.map((item) => item.agencyName);
          setAgencyQuery(agencies);
          const response = await fetch(`${API_BASE_URL}employee/list`, {
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

          const employeesPerEntity = Object.keys(entitiesMap).map((entity) => ({
            entity,
            employees: entitiesMap[entity],
          }));
          setOverAllEmployeeList(employeesPerEntity);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [bonusData, showSection]);

  const downloadMjpExcel = () => {
    // Prepare the data for Excel
    const dataForExcel = overAllEmployeeList.flatMap((row) =>
      row.employees.map((employee) => [
        employee.firstName,
        employee.lastName,
        employee.jobTitle,
        employee.agencyName,
        employee.entity,
        formatDollars(employee.baseCompPresent),
        formatDollars(employee.cashBonusPresent),
        formatDollars(employee.stockBonusPresent),
        formatDollars(employee.stockPremiumPresent),
        formatDollars(employee.totalBonusPresent),
        employee.vesting,
        employee.vestingPremiumPercentage,
        employee.costType,
        employee.retentionCurrentYear,
        employee.countryOfPayrollTaxation,
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
      "Base Comp",
      "2023 Cash Bonus",
      "2023 Stock Bonus",
      "2023 Stock Premium",
      "2023 Total Bonus",
      "Vesting",
      "2023 Vesting Premium",
      "Cost Type",
      "2023 Year Retention",
      "Country of Payroll Taxation",
      "Agency ID",
    ]; // Add more headers as needed
    const dataWithHeaders = [headers, ...dataForExcel];

    // Create a new workbook
    const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save the workbook to a file and trigger the download
    XLSX.writeFile(wb, "MJP_data.xlsx");
  };

  return (
    <div className="container-fluid customPadding InfoSec">
      {isLoading && <Loader />}
      <div className="sectionTitle">
      Company: <span>{agencyData?.agencyName}</span>
      </div>

      <div className="showcaseWrap">
        <div className="row gx-3 gy-3 gx-0">
          <DataTile data={totalData} type="total" />
        </div>
      </div>

      <div className='row justify-content-start"'>
        <div className="col-md-3 col-sm-12 col-xs-12 customMultiselect mb-4">
          <Multiselect
            placeholder="Select Agency"
            allOptions={allagency}
            defaultSelectedOptions={allagency}
            onOptionsChange={(option) => {
              setAgencyQuery(option);
            }}
          />
        </div>
        <div className="col-md-3 col-sm-12 col-xs-12  customMultiselect mb-4">
          <Multiselect
            placeholder="Entity"
            allOptions={allEntites}
            defaultSelectedOptions={allEntites}
            onOptionsChange={(option) => setEntityQuery(option)}
          />
        </div>
      </div>

      <div className="empWrap mt-4">
        <div className="row">
          <div className="col">
            <div className="tableWrap">
              <div className="table-responsive">
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
                      {headerColumns.map((item, index) => (
                        <th scope="col" key={index}>
                          <div className="customSortHead">
                            {item.label} <img src={sortWhite} alt="" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {overAllEmployeeList?.map((entityData, entityIndex) => (
                    <tbody key={entityIndex}>
                      {/* Map over each entity's employees and render table rows */}
                      {entityData.employees
                        .filter(
                          (row) =>
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
                            <td>
                              <div className="customTableBody textBalck">
                                {row.agencyName}
                              </div>
                            </td>
                            <td>
                              <div className="customTableBody textGray">
                                {row.entity}{" "}
                              </div>
                            </td>
                            <td>
                              <div className="customTableBody textGray">
                                {row.employeeId}{" "}
                              </div>
                            </td>
                            <td>
                              <div className="customTableBody">
                                <div className="d-flex align-items-center">
                                  <span>{formatDollars(row.baseCompPresent)}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="customTableBody">
                                <div className="d-flex align-items-center">
                                  <span>{formatDollars(row.cashBonusPresent)}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="customTableBody">
                                <div className="d-flex align-items-center">
                                  <span>{formatDollars(row.stockBonusPresent)}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="customTableBody">
                                <div className="d-flex align-items-center">
                                  <span>{formatDollars(row.stockPremiumPresent)}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  ))}
                </table>
              </div>
            </div>

            <div className="d-flex justify-content-end mb-5 mt-3 g-10 twoBtnSec">
              <button className="baseBtn btnLg d-flex align-items-center justify-content-center" onClick={()=> downloadMjpExcel()}>
                Download MJP Report
              </button>
              <button className="baseBtn btnLg d-flex align-items-center justify-content-center" onClick={()=> downloadExcel(overAllEmployeeList, formatDollars)}>
                Download Report for AST
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
