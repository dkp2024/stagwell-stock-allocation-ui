import React, { useEffect, useState } from "react";
import "./Stepper.css";
import { useSection } from "../../utils/SectionContext";
import { ENTITY, STEP } from "../../_constants/constants";
import defaultRing from "../../images/defaultRing.svg";
import activeRing from "../../images/activeRing.svg";
import { sessionStorageGet } from "../../utils/storageHelper";

export default function Stepper() {
  const { activeSection, showSection } = useSection();
  const [userType, setUserType] = useState('');

  useEffect(() => {
    UserTypeInfo()
  }, []);

  const UserTypeInfo = async() => {
    const userType = await sessionStorageGet('userType')
    setUserType(userType)
  }

  const handleStepperClick = async (section) => {
    const userType = await sessionStorageGet('userType')
    if (section === STEP.STEPONE) {
      if (activeSection === "Steptwo" && userType != ENTITY) {
        showSection('Stepone')
      }
    } else if (section === STEP.STEPTWO) {
      if (activeSection === "Stepthree") {
        console.log("navigate two");
      }
    } else if (section === STEP.STEPTHREE) {
      if (activeSection === "Stepfour") {
        console.log("navigate three");
      }
    } 
  };

  return (
    <div className="boxWrap option-1 option-1-1">
      <ul className="c-stepper">
        <li
          className={`c-stepper__item ${
            activeSection === "Stepone" ? "active" : ""
          } ${activeSection === "Steptwo" && userType != ENTITY ? "active" : ""} ${
            activeSection === "Specialrequest" ? "active" : ""
          } ${activeSection === "Stepthree" ? "active" : ""} 
          ${activeSection === "Stepfour" ? "active" : ""}
          ${activeSection === "Stepfive" ? "active" : ""}
          }`}  onClick={() => handleStepperClick(STEP.STEPONE)}
        >
          <img className="defaultRing" src={defaultRing} alt="" />
          <img className="ActiveRing" src={activeRing} alt="" />
          <h5 className="c-stepper__title">Stage 1 </h5>
        </li>
        <li
          className={`c-stepper__item ${
            activeSection === "Steptwo" ? "active" : ""
          } ${activeSection === "Stepthree" ? "active" : ""} ${
            activeSection === "Specialrequest" ? "active" : ""
          } ${activeSection === "Stepfour" ? "active" : ""}
            ${activeSection === "Stepfive" ? "active" : ""}
          `}
          onClick={() => handleStepperClick(STEP.STEPTWO)}
        >
          <img className="defaultRing" src={defaultRing} alt="" />
          <img className="ActiveRing" src={activeRing} alt="" />
          <h5 className="c-stepper__title">Stage 2</h5>
        </li>
        <li
          className={`c-stepper__item ${
            activeSection === "Stepthree" ? "active" : ""
          } ${activeSection === "Stepfour" ? "active" : ""}
          ${activeSection === "Stepfive" ? "active" : ""}`}
          onClick={() => handleStepperClick(STEP.STEPTHREE)}
        >
          <img className="defaultRing" src={defaultRing} alt="" />
          <img className="ActiveRing" src={activeRing} alt="" />
          <h5 className="c-stepper__title">Stage 3</h5>
        </li>
        <li
          className={`c-stepper__item  ${
            activeSection === "Stepfour" ? "active" : ""
          }${activeSection === "Stepfive" ? "active" : ""}`} onClick={() => handleStepperClick(STEP.STEPFOUR)}
        >
          <img className="defaultRing" src={defaultRing} alt="" />
          <img className="ActiveRing" src={activeRing} alt="" />
          <h5 className="c-stepper__title">Stage 4</h5>
        </li>
        <li
          className={`c-stepper__item lastItem ${
            activeSection === "Stepfive" ? "active" : ""
          }`} onClick={() => handleStepperClick(STEP.STEPFIVE)}
        >
          <img className="defaultRing" src={defaultRing} alt="" />
          <img className="ActiveRing" src={activeRing} alt="" />
          <h5 className="c-stepper__title">Stage 5</h5>
        </li>
      </ul>
    </div>
  );
}
