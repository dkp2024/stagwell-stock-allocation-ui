import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Stepper from "../components/stepper/Stepper";
import Stepone from "../components/Stepone";
import Steptwo from "../components/Steptwo";
import Stepthree from "../components/Stepthree";
import Stepfour from "../components/Stepfour";
import { useSection } from "../utils/SectionContext";
import Specialrequest from "../components/Specialrequest";
import { AGENCY, API_BASE_URL , ENTITY, LOGIN_ROUTE, NETWORK, STAGWELL} from "../_constants/constants";
import { sessionStorageGet } from "../utils/storageHelper";
import Stepfive from "../components/Stepfive";
import { useOktaAuth } from '@okta/okta-react';

export default function Detail() {
  const { activeSection, showSection } = useSection();
  const [agencyData, setAgencyData] =useState();
  const [bonusData, setBonusData] = useState();
  const [isCashOver, setIsCashOver] = useState(false)
  const [isStockOver, setIsStockOver] = useState(false);
  const [isCashUnder, setIsCashUnder] = useState(false)
  const [isStockUnder, setIsStockUnder] = useState(false);
  const cashAvailable = bonusData?.reduce((total, entity) => total + entity.amountForCash, 0);
  const stockAvailable = bonusData?.reduce((total, entity) => total + entity.amountForStock, 0);
  const [cashRemaining, setCashRemaining] = useState();
  const [userType, setUserType] = useState("")
  const [stockRemaining, setTotalStockAvailable] = useState();
  const location = useLocation();
  const rowData = location.state && location.state.rowData;
  const navigate = useNavigate();
  const { oktaAuth, authState } = useOktaAuth();

  useEffect(() => {
      const fetchData = async () => {
        const accessToken = oktaAuth.getAccessToken();
        const isLoggedIn = await sessionStorageGet('isLoggedIn')
        const userType = await sessionStorageGet('userType')
        setUserType(userType)
        if (isLoggedIn) {
          try {
            const response = await fetch(
              `${API_BASE_URL}agency/list`,
              { 
                headers: {
                  'Authorization': `Bearer ${accessToken}`,  
                  'Content-Type': 'application/json'
                },
                credentials: "include" 
              }
            );
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            else {
              const result = await response.json();
              if (userType === AGENCY) {
                setAgencyData(result[0]);
              } else if (userType !== ENTITY) {
                const uniqueDataResult = Array.from(new Map(result.map(item => [item.agencyId, item])).values());
                const uniqueData = Object.values(
                  uniqueDataResult.reduce((accumulator, current) => {
                    const existing = accumulator[current.agencyId];

                    if (existing) {
                      existing.overallBonusPoolBudget +=
                        current.overallBonusPoolBudget;
                      existing.amountForCash += current.amountForCash;
                      existing.amountForStock += current.amountForStock;

                      if (!existing.agencyNames.includes(current.agencyName)) {
                        existing.agencyNames.push(current.agencyName);
                      }
                    } else {
                      accumulator[current.agencyId] = {
                        ...current,
                        agencyNames: [current.agencyName],
                      };
                    }

                    return accumulator;
                  }, {})
                );
                // Consolidate into one object
                const finalResult = uniqueData.reduce(
                  (consolidated, current) => {
                    consolidated.agencyName = consolidated.agencyName
                      ? `${consolidated.agencyName}, ${current.agencyNames.join(
                          ", "
                        )}`
                      : current.agencyNames.join(", ");
                    consolidated.overallBonusPoolBudget +=
                      current.overallBonusPoolBudget;
                    consolidated.amountForCash += current.amountForCash;
                    consolidated.amountForStock += current.amountForStock;

                    return consolidated;
                  },
                  {
                    agencyName: "",
                    overallBonusPoolBudget: 0,
                    amountForCash: 0,
                    amountForStock: 0,
                  }
                );
                setAgencyData(finalResult);
              }
              try {
                const bonusResponse = await fetch(
                  `${API_BASE_URL}entity/list`,
                  { 
                    headers: {
                      'Authorization': `Bearer ${accessToken}`,  
                      'Content-Type': 'application/json'
                    },
                    credentials: "include"
                   }
                );
                if(bonusResponse.ok && !bonusData) {
                  const bonusResult = await bonusResponse.json();
                  setBonusData(bonusResult);
                  if (userType === ENTITY) setAgencyData(bonusResult[0])
                }
              } catch (err){
                console.log(err)
              }
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          navigate(LOGIN_ROUTE, {replace: true})
        }
      };
      fetchData();
  }, [bonusData, navigate]);

  useEffect(() => {
    if (agencyData) {
      setIsCashOver(agencyData.amountForCash < cashAvailable);
      setIsCashUnder(agencyData.amountForCash > cashAvailable);
      setIsStockOver(agencyData.amountForStock < stockAvailable);
      setIsStockUnder(agencyData.amountForStock > stockAvailable);
    }
  }, [agencyData, cashAvailable, stockAvailable]);

  const handleOnChange = (value, entity, key) => {
    setBonusData((prevBonusData) => {
      const index = prevBonusData.findIndex(
        (data) => data.entityName === entity
      );
      if (index !== -1) {
        return [
          ...prevBonusData.slice(0, index),
          {
            ...prevBonusData[index],
            [key]: parseInt(value),
          },
          ...prevBonusData.slice(index + 1),
        ];
      }
    });
  };

  const handleOnSave = async() => {
    const accessToken = oktaAuth.getAccessToken();
    const userType = await sessionStorageGet('userType')
    setUserType(userType)
    let updatedData = [];
    if(userType === AGENCY) {
      //showSection("Steptwo")
      updatedData = bonusData.map(item => ({ ...item, submitted: true }));
    } else {
      updatedData = bonusData;
      //showSection("Steptwo")
    }
    try {
      const response = await fetch(`${API_BASE_URL}entity/save`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,  
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify(updatedData),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      showSection("Steptwo")
    } catch (error) {
      console.log(error);
    }
  }
  const formatDollars = (amount) => {
    const formattedAmount = amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedAmount ? `$${formattedAmount}` : null;
  };

  const handleOnSaveApi = async() => {
    const accessToken = oktaAuth.getAccessToken();
    try {
      const bonusResponse = await fetch(
        `${API_BASE_URL}entity/list`,
        { 
          headers: {
            'Authorization': `Bearer ${accessToken}`,  
            'Content-Type': 'application/json'
          },
          credentials: "include" }
      );
      if(bonusResponse.ok) {
        const bonusResult = await bonusResponse.json();
        setBonusData(bonusResult);
        if (userType === ENTITY) setAgencyData(bonusResult[0])
      }
    } catch (err){
      console.log(err)
    }
  }

  return (
    <div className="mainWrap">
      {/* ----Stepper ---- */}
      <div className="stepperWrap">
        <Stepper />
      </div>
      <div className="viewWrap">
        {activeSection === "Stepone" && userType !== STAGWELL && (
          <Stepone
            agencyData={agencyData}
            bonusData={bonusData}
            isCashOver={isCashOver}
            isStockOver={isStockOver}
            handleOnChange={handleOnChange}
            isCashUnder={isCashUnder}
            isStockUnder={isStockUnder}
            handleOnSave={handleOnSave}
            formatDollars={formatDollars}
          />
        )}
        {activeSection === "Steptwo" && (
          <Steptwo
            bonusData={bonusData}
            cashAvailable={cashAvailable}
            stockAvailable={stockAvailable}
            cashRemaining={cashRemaining ? cashRemaining : cashAvailable}
            stockRemaining={stockRemaining ? stockRemaining : stockAvailable}
            agencyData={agencyData}
            formatDollars={formatDollars}
          />
        )}
        {activeSection === "Stepthree" && agencyData && (
          <Specialrequest agencyData={agencyData} formatDollars={formatDollars}/>
        )}
        {activeSection === "Stepfour" && (
          <Stepfour
            bonusData={bonusData}
            handleOnSaveApi = {handleOnSaveApi}
            cashAvailable={cashAvailable}
            stockAvailable={stockAvailable}
            cashRemaining={cashRemaining ? cashRemaining : cashAvailable}
            stockRemaining={stockRemaining ? stockRemaining : stockAvailable}
            agencyData={agencyData}
            formatDollars={formatDollars}
          />
        )}
        {activeSection === "Stepfive" && <Stepfive 
        bonusData={bonusData}
        cashAvailable={cashAvailable}
        stockAvailable={stockAvailable}
        cashRemaining={cashRemaining ? cashRemaining : cashAvailable}
        stockRemaining={stockRemaining ? stockRemaining : stockAvailable}
        agencyData={agencyData}
        formatDollars={formatDollars}/>}
      </div>
    </div>
  );
}
