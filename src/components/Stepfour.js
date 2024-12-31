import React, { useState, useEffect, useCallback } from "react";
import Multiselect from "./multiselect/Multiselect";
import { sessionStorageGet } from "../utils/storageHelper";
import sortWhite from "../images/sort-white.svg";
import avatar from "../images/tuser.svg";
import { STAGWELL, NETWORK, BASE_LOCAL_URL, AGENCY } from "../_constants/constants";
import { useSection } from "../utils/SectionContext";
import Loader from "./Loader";
import download from "../images/download.svg";
import * as XLSX from "xlsx";
import { useOktaAuth } from '@okta/okta-react';

const allOptions = [
  { value: "option 1", label: "option 1" },
  { value: "option 2", label: "option 2" },
  { value: "option 3", label: "option 3" },
  { value: "option 4", label: "option 4" },
];

export default function Stepfour({
  bonusData,
  cashAvailable,
  stockAvailable,
  cashRemaining,
  stockRemaining,
  agencyData,
  formatDollars,
  handleOnSaveApi
}) {
  const { showSection } = useSection();
  const [overAllEmployeeList, setOverAllEmployeeList] = useState([]);
  const [reformatedEmployeeData, setReformatedEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [agencyQuery, setAgencyQuery] = useState([]);
  const [userType, setUserType] = useState("");
  const [allagency, setAllAgency] = useState([]);
  const [totalCashAvailable, setTotalCashAvailable] = useState(0);
  const [totalStockAvailable, setTotalStockAvailable] = useState(0);
  const [remainingCash, setRemainingCash] = useState(0);
  const [remainingStock, setRemainingStock] = useState(0);
  const [isAllSubmitted, setIsAllSubmitted] = useState(false);
  const [specialRequest, setSpecialRequest] = useState([]);
  const [overAllRemainingCash, setOverAllRemainingCash] = useState(0);
  const [overAllRemainingStock, setOverAllRemainingStock] = useState(0);
  const [unFilteredDataOverAllCash, setUnFilteredDataOverAllCash] = useState(0);
  const [unFilteredDataOverAllStock, setUnFilteredDataOverAllStock] = useState(0);
  const [agencyDetails, setAgencyDetails] = useState({})
  const { oktaAuth, authState } = useOktaAuth();
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

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = oktaAuth.getAccessToken();
      setIsLoading(true);
      if (bonusData?.length && agencyDetails && agencyQuery) {
        try {
          const agencyId = agencyDetails.filter((agency) => agencyQuery.includes(agency.agencyName))
          console.log(agencyId);
          const response = await fetch(`${BASE_LOCAL_URL}sr/list?agency_id=${agencyId[0].id}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,  
              'Content-Type': 'application/json'
            },
            credentials: "include",
          });
          const result = await response.json();
          setSpecialRequest(result[0])
          console.log("🚀 ~ fetchData ~ result:", result)
  
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [agencyDetails, agencyQuery, bonusData])

  const calculateBalanceSum = useCallback(async () => {
    let flatEmployees = [];
    const filteredData = overAllEmployeeList.filter((entity) =>
      entity.employees.some((employee) =>
        agencyQuery.includes(employee.agencyName)
      )
    );
    flatEmployees = filteredData.flatMap((entity) => entity.employees);
    const totalCashBonus = flatEmployees.reduce(
      (sum, employee) => sum + employee.cashBonusPresent,
      0
    );
    const unSelectedFilteredData = overAllEmployeeList.filter((entity) =>
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
    let unSelectedRemainingCash = totalCashAvailable - unSelectedTotalCashBonus;
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
  }, [
    agencyQuery,
    cashAvailable,
    overAllEmployeeList,
    stockAvailable,
    totalCashAvailable,
    totalStockAvailable,
  ]);

  const calculateTotalSum = useCallback(() => {
    const filteredData = bonusData?.filter((item) =>
      agencyQuery.includes(item.agencyName)
    );
    const overallSumAmountForCash = filteredData?.reduce(
      (sum, entity) => sum + entity.amountForCash,
      0
    );

    const overallSumAmountForStock = filteredData?.reduce(
      (sum, entity) => sum + entity.amountForStock,
      0
    );
    const unFilteredData = bonusData?.filter((item) =>
      !agencyQuery.includes(item.agencyName)
    );
    const unFilteredOverallSumAmountForCash = unFilteredData?.reduce(
      (sum, entity) => sum + entity.amountForCash,
      0
    );

    const unFilteredOverallSumAmountForStock = unFilteredData?.reduce(
      (sum, entity) => sum + entity.amountForStock,
      0
    );
    setTotalCashAvailable(overallSumAmountForCash);
    setTotalStockAvailable(overallSumAmountForStock);
    setUnFilteredDataOverAllCash(unFilteredOverallSumAmountForCash)
    setUnFilteredDataOverAllStock(unFilteredOverallSumAmountForStock)
    calculateBalanceSum();
  }, [agencyQuery, bonusData, calculateBalanceSum]);

  useEffect(() => {
    calculateTotalSum();
  }, [DataTile, calculateTotalSum]);

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
          const agencies = bonusData.map((item) => item.agencyName);
          setAgencyQuery(agencies[0]);
          const temp = []
          bonusData.map((item) => {
            return temp.push({id: item.agencyId, agencyName: item.agencyName})
          })
          setAgencyDetails(temp)
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

          const employeesPerEntity = Object.keys(entitiesMap).map((entity) => ({
            entity,
            employees: entitiesMap[entity],
          }));
          const allSubmitted = employeesPerEntity.every(entity => {
            return entity.employees.every(employee => employee.submitted);
          });
          setIsAllSubmitted(allSubmitted)
          setOverAllEmployeeList(employeesPerEntity);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [bonusData, showSection]);

  const handleOnChange = async (
    agencyName,
    entityName,
    employeeId,
    value,
    key
  ) => {
    const userType = await sessionStorageGet("userType");
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

  const handleAgencyChange = (agency) => {
      setAgencyQuery(agency)
  }

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
      showSection("Stepfive")
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSpecialRequest = (key, value) => {
    const updatedSpecialRequest = {...specialRequest, [key]: value}
    setSpecialRequest(updatedSpecialRequest)
  }
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
        formatDollars(employee.baseCompPresent),
        formatDollars(employee.cashBonusPresent),
        formatDollars(employee.stockBonusPresent),
        formatDollars(employee.stockPremiumPresent),
        formatDollars(employee.totalBonusPresent),
        employee.vesting,
        employee.vestingPremiumPercentage,
        formatDollars(employee.baseCompPrevious),
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
    XLSX.writeFile(wb, "table_data.xlsx");
  };

  const handleSave = async () => {
    const accessToken = oktaAuth.getAccessToken();
    try {
      const approvedRequest = {
        specialRequestId: specialRequest.specialRequestId,
        agencyId: specialRequest.agencyId,
        approvedCashBonus: specialRequest.additionalCashBonusRequest,
        approvedStockBonus: specialRequest.additionalStockBonusRequest,
        approvalStatus: "Approved",
      };
      const response = await fetch(`${BASE_LOCAL_URL}sr/approve`, {
        credentials: "include",
        method: "post",
        body: JSON.stringify(approvedRequest),
        headers: 
        { "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
         },
      });
      if (response?.ok) {
        console.log(response);
        handleOnSaveApi();
      }
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <div className="container-fluid customPadding InfoSec">
      {isLoading && <Loader />}
      <div className="sectionTitle">
      Company: <span>{agencyQuery}</span>
      </div>

      <div className="showcaseWrap">
        <div className="row gx-3 gy-3 gx-0">
          <DataTile data={totalData} type="total" />
        </div>
      </div>

      <div className='row justify-content-start"'>
        <div className="col-md-4 col-sm-12 col-xs-12 customMultiselect mb-4">
          {/* <Multiselect placeholder="Select Agency" allOptions={allOptions} /> */}
          <Multiselect
            placeholder="Select Agency"
            allOptions={allagency}
            defaultSelectedOptions={allagency}
            onOptionsChange={(option) => {
              handleAgencyChange(option)
            }}
            isSingleSelect={true}
          />
        </div>
      </div>
      <div className="bonusSec">
        <div className="row">
          <div className="col">
            <h4 className="displayTitle">Allocated Bonus</h4>

            <div className="row">
              <div className="col-md-7 col-sm-12 col-xs-12">
                <div className="mb-3">
                  <label for="userMsg" className="form-label inputLabel">
                    Special requests
                  </label>
                  <textarea
                    className="form-control txtareaBase"
                    id="messageToApprover"
                    rows="5"
                    disabled={(userType === NETWORK) || (specialRequest?.approvalStatus === "Approved")}
                    // placeholder="Would like to request another $50,000 as stock"
                    onChange={(e) => handleSpecialRequest('messageToApprover', e.target.value)}
                    defaultValue={specialRequest?.messageToApprover ? specialRequest?.messageToApprover : ""}
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 col-sm-12 col-xs-12">
                    <div className="mb-3">
                      <label for="username" className="form-label inputLabel">
                        Total cash approved
                      </label>
                      <input
                        type="number"
                        disabled={(userType === NETWORK) || (specialRequest?.approvalStatus === "Approved")}
                        className="form-control inputBase mb-2"
                        id="additionalCashBonusRequest"
                        // placeholder="$25000"
                        onChange={(e) => handleSpecialRequest('additionalCashBonusRequest', e.target.value)}
                        defaultValue={specialRequest?.additionalCashBonusRequest}
                      />
                      {/* <p>Remaining: 0</p> */}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12 col-xs-12">
                    <div className="mb-3">
                      <label for="username" className="form-label inputLabel">
                        Total stock approved
                      </label>
                      <input
                        type="number"
                        className="form-control inputBase mb-2"
                        id="additionalStockBonusRequest"
                        // placeholder="$25000"
                        disabled={(userType === NETWORK) || (specialRequest?.approvalStatus === "Approved")}
                        onChange={(e) => handleSpecialRequest('additionalStockBonusRequest', e.target.value)}
                        defaultValue={specialRequest?.additionalStockBonusRequest}
                      />
                      {/* <p>Remaining: 0</p> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 offset-md-2"></div>
            </div>

            <div className="d-flex justify-content-start mb-2 mt-4">
              <button
              disabled = {specialRequest?.approvalStatus === "Approved" ? true : false}
              className={`${
                  specialRequest?.approvalStatus === "Approved"
                  ? "baseBtnDisabled"
                  : "baseBtn"
              } d-flex align-items-center justify-content-center`}
                onClick={handleSave}
              >
                Save
              </button>
            </div>
            {specialRequest?.approvalStatus === "Approved" && (userType === STAGWELL) &&
              <h6 className="text-danger mb-5">
                Please allocate the approved cash or stock amounts to employees in the table provided below.
              </h6>
            }
            <hr />
          </div>
        </div>
      </div>
      <div className="empWrap mt-4">
      <div className="d-flex justify-content-end">
              <button
                className="d-flex align-items-center justify-content-center g-3 btnOutlined btnXs mb-3"
                onClick={downloadExcel}
              >
                {" "}
                Download to XLS <img src={download} alt="" />
              </button>
            </div>
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
                      <th scope="col">
                        <div className="customSortHead">
                          Company <img src={sortWhite} alt="" />
                        </div>
                      </th>
                      <th scope="col">
                        <div className="customSortHead">
                          ENTITY <img src={sortWhite} alt="" />
                        </div>
                      </th>
                      <th scope="col">
                        <div className="customSortHead">
                          <div className="tHeadWrap d-flex flex-column g-3">
                            <span>Employee</span>
                            <span>id</span>
                          </div>
                        </div>
                      </th>
                      <th scope="col">
                        <div className="customSortHead">
                          <div className="tHeadWrap d-flex flex-column g-3">
                            <span>2023</span>
                            <span>Base comp</span>
                          </div>
                          <img src={sortWhite} alt="" />
                        </div>
                      </th>

                      <th scope="col">
                        <div className="customSortHead">
                          <div className="tHeadWrap d-flex flex-column g-3">
                            <span>2023</span>
                            <span>Cash bonus</span>
                          </div>
                          <img src={sortWhite} alt="" />
                        </div>
                      </th>

                      <th scope="col">
                        <div className="customSortHead">
                          <div className="tHeadWrap d-flex flex-column g-3">
                            <span>2023</span>
                            <span>Stock Bonus</span>
                          </div>
                          <img src={sortWhite} alt="" />
                        </div>
                      </th>

                      <th scope="col">
                        <div className="customSortHead">
                          <div className="tHeadWrap d-flex flex-column g-3">
                            <span>2023</span>
                            <span>Stock Premium</span>
                          </div>
                          <img src={sortWhite} alt="" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  {overAllEmployeeList?.map((entityData, entityIndex) => (
                    <tbody key={entityIndex}>
                      {/* Map over each entity's employees and render table rows */}
                      {entityData.employees
                        .filter(
                          (row) =>
                            !agencyQuery.length ||
                            agencyQuery.includes(row.agencyName)
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
                                <div className="inputBorder d-flex align-items-center">
                                  <span>$</span>
                                  <input
                                    type="number"
                                    disabled={userType === NETWORK}
                                    className="form-control"
                                    defaultValue={row.cashBonusPresent || 0}
                                    onChange={(e) =>
                                      handleOnChange(
                                        row.agencyName,
                                        row.entity,
                                        row.employeeId,
                                        e.target.value,
                                        "cashBonusPresent"
                                      )
                                    }
                                    style={{
                                      backgroundColor:
                                        userType === "ENTITY"
                                          ? "#fff"
                                          : "inherit",
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="customTableBody">
                                <div className="inputBorder d-flex align-items-center">
                                  <span>$</span>
                                  <input
                                    type="text"
                                    disabled={userType === NETWORK}
                                    className="form-control"
                                    defaultValue={row.stockBonusPresent || 0}
                                    onChange={(e) =>
                                      handleOnChange(
                                        row.agencyName,
                                        row.entity,
                                        row.employeeId,
                                        e.target.value,
                                        "stockBonusPresent"
                                      )
                                    }
                                    style={{
                                      backgroundColor:
                                        userType === "ENTITY"
                                          ? "#fff"
                                          : "inherit",
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="customTableBody">
                                <div className="d-flex align-items-center">
                                  <span>$</span>
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
            <div className="d-flex align-self-center justify-content-center w-100 mt-3">
                {isAllSubmitted && (
                  <h6 className="text-success text-center m-0">
                    Allocation for this stage is completed
                  </h6>
                )}
              </div>
            <div className="d-flex justify-content-end mb-5 mt-3 g-10 twoBtnSec">
              {/* <button className="baseBtn d-flex align-items-center justify-content-center">
                Save
              </button> */}
              <button
                className={`${
                  remainingCash >= 0 && remainingStock >= 0 && !isAllSubmitted
                    ? "baseBtn"
                    : "baseBtnDisabled"
                } d-flex align-items-center justify-content-center`}
                onClick={handleOnSubmit}
                disabled={
                  remainingCash >= 0 && remainingStock >= 0 &&
                  !isAllSubmitted
                    ? false
                    : true
                }>
                Submit
              </button>
              {isAllSubmitted && (
                <>
                  <button
                    className="baseBtn d-flex align-items-center justify-content-center"
                    onClick={() => { if(userType === STAGWELL || userType === NETWORK) {
                      showSection("Stepfive");
                    }}}>
                    Next
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
