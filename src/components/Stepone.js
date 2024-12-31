import React, { useEffect, useState } from "react";

import budget from "../images/budget.svg";
import cash from "../images/cash.svg";
import stock from "../images/stock.svg";
import sortWhite from "../images/sort-white.svg";

import { useSection } from "../utils/SectionContext";
import { sessionStorageGet } from "../utils/storageHelper";
import { ENTITY, NETWORK, STAGWELL } from "../_constants/constants";
import Loader from "./Loader";

const DataTile = ({ image, title, amount, type }) => {
  return (
    <>
      <div className="col">
        <div className="tileWrap singleCard">
          <div className="tileHeader d-flex align-items-center g-15">
            {type === "total" ? null : <img src={image} alt="" />}
            <div className="tileTxt">
              <h6>{title}</h6>
              <h2>{amount}</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Bonusrow = ({ data, handleOnChange, isCashOver, isStockOver, isCashUnder, isStockUnder, userType }) => (
    <>
    {data?.map((item, key) => (
      <tr key={`id_${key}`}>
        <td>
          <div className="customTableBody textHiglight">{item.entityName}</div>
        </td>
        <td>
          <div className="customTableBody">
            <div className="inputBorder d-flex align-items-center">
              <span style={{ color: isCashOver ? "red" : "#000" }}>$</span>
              <input
                type="number"
                className="form-control"
                defaultValue={item.amountForCash}
                onChange={(e) =>
                  handleOnChange(e.target.value, item.entityName, "amountForCash")
                }
                style={{ color: isCashOver ? "red" : "#000", backgroundColor: userType === 'ENTITY' ? '#fff' : 'inherit' }}
                disabled={userType === NETWORK || item.submitted }
              />
            </div>
            {isCashOver && (
              <div className="d-flex align-items-center justify-content-center mb-0">
                <p className="mb-0" style={{ color: "red" }}>
                  Allocation incorrect!
                </p>
              </div>
            )}
            {isCashUnder && (
              <div className="d-flex align-items-center justify-content-center mb-0">
                {/* <p className="mb-0" style={{ color: "red" }}>
                  Cash doesn't meet!
                </p> */}
              </div>
            )}
          </div>
        </td>
        <td>
          <div className="customTableBody">
            <div className="inputBorder d-flex align-items-center">
              <span style={{ color: isStockOver ? "red" : "#000" }}>$</span>
              <input
                type="number"
                className="form-control"
                defaultValue={item.amountForStock}
                onChange={(e) =>
                  handleOnChange(e.target.value, item.entityName, "amountForStock")
                }
                style={{ color: isStockOver ? "red" : "#000", backgroundColor: userType === 'ENTITY' ? '#fff' : 'inherit' }}
                disabled={userType === NETWORK || item.submitted }
              />
            </div>
            {isStockOver && (
              <div className="d-flex align-items-center justify-content-center">
                <p className="mb-0" style={{ color: "red" }}>
                  Allocation incorrect!
                </p>
              </div>
            )}
            {isStockUnder && (
              <div className="d-flex align-items-center justify-content-center">
                {/* <p className="mb-0" style={{ color: "red" }}>
                   Stock doesn't meet!
                </p> */}
              </div>
            )}
            {item.submitted ? (
              <span className="statusChip d-flex align-items-center">
                {item.currentStage ? item.currentStage : 'Stage 2'}
              </span>
            ) : (
              ""
            )}
          </div>
        </td>
      </tr>
    ))}
  </>
  );

export default function Stepone({ agencyData, bonusData, isCashOver, isStockOver, isCashUnder, isStockUnder, handleOnChange, handleOnSave, formatDollars }) {
  const { showSection } = useSection();
  const [userType, setUserType] = useState('')
  const allSubmitted = Array.isArray(bonusData) && bonusData.length > 0 && bonusData.every(item => item.submitted);

  useEffect(() => {
    (async () => {
      const activeSection = await sessionStorageGet("activeSection");
      const userType = await sessionStorageGet('userType')
      showSection(activeSection);
      setUserType(userType)
      if (userType === STAGWELL || userType === NETWORK || userType === ENTITY) {
        showSection("Steptwo")
      }
    })();
  }, [showSection]);

  return (
    <div className="container InfoSec">
      {/* <Loader /> */}
      <div className="sectionTitle">
        Company: <span>{agencyData?.agencyName}</span>
      </div>

      <div className="showcaseWrap">
        <div className="row gx-3 gy-3 gx-0">
          <DataTile
            image={budget}
            title={"Overall Bonus Pool Budget:"}
            amount={formatDollars(agencyData?.overallBonusPoolBudget)}
          />
          <DataTile
            image={cash}
            title={"Amount allocated to Cash:"}
            amount={formatDollars(agencyData?.amountForCash)}
          />
          <DataTile
            image={stock}
            title={"Amount allocated to Stock:"}
            amount={formatDollars(agencyData?.amountForStock)}
          />
        </div>
      </div>

      <div className="bonusSec">
        <div className="row">
          <div className="col">
            <h4 className="displayTitle">Allocated Bonus</h4>

            <div className="tableWrap">
              <div className="table-responsive">
                <table className="table tableBase bonusTable">
                  <thead>
                    <tr>
                      <th scope="col">
                        <div className="customSortHead">
                          ENTITY <img src={sortWhite} alt="" />
                        </div>
                      </th>
                      <th scope="col">
                        <div className="customSortHead">
                          CASH <img src={sortWhite} alt="" />
                        </div>
                      </th>
                      <th scope="col">
                        <div className="customSortHead">
                          STOCK <img src={sortWhite} alt="" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <Bonusrow
                      data={bonusData}
                      handleOnChange={handleOnChange}
                      agencyData={agencyData}
                      isCashOver={isCashOver}
                      isStockOver={isStockOver}
                      isCashUnder={isCashUnder}
                      isStockUnder={isStockUnder}
                      userType={userType}
                    />
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-flex align-self-center justify-content-center w-100 mt-3">
                {allSubmitted && (
                  <h6 className="text-success text-center m-0">
                    Allocation for this stage is completed
                  </h6>
                )}
              </div>
            <div className="d-flex justify-content-end mb-5 mt-3 g-10 w-100">
              <div className="d-flex justify-content-end g-10">
                {userType !== NETWORK && (
                    <button
                      className={`${isCashOver || isStockOver || isCashUnder || isStockUnder || allSubmitted ? "baseBtnDisabled" : "baseBtn"
                      } d-flex align-items-center justify-content-center`} disabled={isCashOver || isStockOver || isCashUnder || isStockUnder || allSubmitted ? true : false}
                      onClick={() => handleOnSave()}>
                      Submit
                    </button>
                  )}
                {allSubmitted && (
                    <button
                      className="baseBtn baseBtn d-flex align-items-center justify-content-center"
                      onClick={() => showSection("Steptwo")}>
                      Next
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
