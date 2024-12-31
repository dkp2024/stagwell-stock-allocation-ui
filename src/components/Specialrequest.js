import React, { useState } from "react";
import { BASE_LOCAL_URL } from "../_constants/constants";
import { sessionStorageGet } from "../utils/storageHelper";
import Success from "../pages/Success";

import budget from "../images/budget.svg";
import cash from "../images/cash.svg";
import stock from "../images/stock.svg";

import { useSection } from "../utils/SectionContext";
import { useOktaAuth } from '@okta/okta-react';
const SpecialRequestObject = {
  additionalCashBonusRequest: "",
  additionalStockBonusRequest: "",
  messageToApprover: "",
  cfoName: "",
  jobTitle: "",
};

const Specialrequest = ({ agencyData, formatDollars }) => {
  const { oktaAuth, authState } = useOktaAuth();
  const { showSection } = useSection();
  const [formData, setFormData] = useState({ ...SpecialRequestObject });
  const [isSubmitCompleted, setSubmitCompleted] = useState(false);

  const handleChange = (event) =>
    setFormData((state) => ({
      ...state,
      [event.target.id]: event.target.value,
    }));

  const handleSubmit = async () => {
    const accessToken = oktaAuth.getAccessToken();
    const userName = await sessionStorageGet('userName');
    const specialRequestBody = JSON.stringify({
      agencyId: agencyData.agencyId,
      cfoName: formData.cfoName,
      jobTitle: formData.jobTitle,
      additionalCashBonusRequest: formData.additionalCashBonusRequest,
      additionalStockBonusRequest: formData.additionalStockBonusRequest,
      messageToApprover: formData.messageToApprover,
      approvalStatus: "Pending",
      createdBy: userName,
      updatedDate: "2019-01-06T18:30:00.000+00:00",
    });
    const response = await fetch(`${BASE_LOCAL_URL}sr/save`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,  
        'Content-Type': 'application/json'
      },
      credentials: "include",
      method: "post",
      body: specialRequestBody
    });
    if (response?.ok) {
      setSubmitCompleted(true);
      setTimeout(() => setSubmitCompleted(false), 800);
    }
  };

  return (
    <div className="container InfoSec">
      <div className="sectionTitle">
        Company: <span>{agencyData.agencyName}</span>
      </div>

      <div className="showcaseWrap">
        <div className="row gx-3 gy-3 gx-0">
          <div className="col">
            <div className="tileWrap">
              <div className="tileHeader d-flex align-items-center g-15">
                <img src={budget} alt="" />
                <div className="tileTxt">
                  <h6>Overall Bonus Pool Budget:</h6>
                  <h2>{formatDollars(agencyData.overallBonusPoolBudget)}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="tileWrap">
              <div className="tileHeader d-flex align-items-center g-15">
                <img src={cash} alt="" />
                <div className="tileTxt">
                  <h6>Amount allocated to Cash:</h6>
                  <h2>{formatDollars(agencyData.amountForCash)}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="tileWrap">
              <div className="tileHeader d-flex align-items-center g-15">
                <img src={stock} alt="" />
                <div className="tileTxt">
                  <h6>Amount allocated to Stock:</h6>
                  <h2>{formatDollars(agencyData.amountForStock)}</h2>
                </div>
              </div>
            </div>
          </div>
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
                    placeholder="If you have special requests, enter them here"
                    onChange={handleChange}
                    value={formData.messageToApprover}
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 col-sm-12 col-xs-12">
                    <div className="mb-3">
                      <label for="username" className="form-label inputLabel">
                        Additional Cash bonus requested
                      </label>
                      <input
                        type="number"
                        className="form-control inputBase"
                        id="additionalCashBonusRequest"
                        placeholder=""
                        onChange={handleChange}
                        value={formData.additionalCashBonusRequest}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12 col-xs-12">
                    <div className="mb-3">
                      <label for="username" className="form-label inputLabel">
                        Additional Stock bonus requested
                      </label>
                      <input
                        type="number"
                        className="form-control inputBase"
                        id="additionalStockBonusRequest"
                        placeholder=""
                        onChange={handleChange}
                        value={formData.additionalStockBonusRequest}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-12 col-xs-12">
                    <div className="mb-3">
                      <label for="username" className="form-label inputLabel">
                        Name
                      </label>
                      <input
                        type="email"
                        className="form-control inputBase"
                        id="cfoName"
                        placeholder=""
                        onChange={handleChange}
                        value={formData.cfoName}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-12 col-xs-12">
                    <div className="mb-3">
                      <label for="username" className="form-label inputLabel">
                        Title
                      </label>
                      <input
                        type="email"
                        className="form-control inputBase"
                        id="jobTitle"
                        placeholder=""
                        onChange={handleChange}
                        value={formData.jobTitle}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 offset-md-2"></div>
            </div>

            <div className="d-flex justify-content-start mb-5 mt-4">
              <button
                className="baseBtn d-flex align-items-center justify-content-center"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {isSubmitCompleted && <Success />}
    </div>
  );
};

export default Specialrequest;
