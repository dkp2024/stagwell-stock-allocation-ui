import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionStorageGet } from "../utils/storageHelper";
import sortWhite from '../images/sort-white.svg';
import filter from '../images/filter.svg';
import { AGENCY, API_BASE_URL, DETAIL_ROUTE, ENTITY } from '../_constants/constants';
import { sessionStorageSet } from '../utils/storageHelper';
import { LOGIN_ROUTE } from '../_constants/constants';
import { useOktaAuth } from '@okta/okta-react';

const Dashboardrow = ({ data, onRowClick }) => {
  // const rowData = location.state.rowData;

  const formatDollars = (amount) => {
    const formattedAmount = amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedAmount ? `$${formattedAmount}` : null;
  };

  return (
    <>
    {data.map(item => (
      <tr key={item.id} 
        // onClick={() => onRowClick(item)} 
      >
        <td>
          <div className='customTableBody textHiglight'>{item.agencyName}</div>
        </td>
        <td>
          <div className='customTableBody textHiglight'>{item.entityName}</div>
        </td>
        <td>
          <div className='customTableBody'>
            <div className='d-flex align-items-center'>
              <span>{formatDollars(item.amountForCash)}</span>
              {/* <input type="text" className="form-control" value={item.amountForCash} /> */}
            </div>
          </div>
        </td>
        <td>
          <div className='customTableBody'>
            <div className='d-flex align-items-center'>
              <span>{formatDollars(item.amountForStock)}</span>
              {/* <input type="text" className="form-control" value={item.amountForStock} /> */}
            </div>
            {item.submitted ? <span className='statusChip d-flex align-items-center'>{item.currentStage ? item.currentStage : 'Stage 2'}</span> : ''}
          </div>
        </td>
      </tr>
    ))}
  </>
  )
}


const Dashboard = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = oktaAuth.getAccessToken();
      const isLoggedIn = await sessionStorageGet('isLoggedIn')
      const userType = await sessionStorageGet('userType')
      // sessionStorageSet('activeSection', 'Steptwo')
        // navigate(DETAIL_ROUTE, {replace: true});
      if(isLoggedIn && userType !== ENTITY && userType !== AGENCY) {
        try {
          const response = await fetch(`${API_BASE_URL}entity/list`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,  
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const result = await response.json();
          setData(result);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate(LOGIN_ROUTE, {replace: true})
      }
    };

    fetchData();
  }, [navigate]);

  
  

  const handleRowClick = (rowData) => {
    sessionStorageSet('activeSection', 'Stepone')
    navigate('/detail', { state: { rowData } });
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className='mainWrap'>
      <div className="container InfoSec">

        <div className='bonusSec'>
          <div className="row">
            <div className="col">
              <div className='d-flex align-items-center justify-content-between mb-3 mdashTitle'>
                <h4 className='displayTitle'>Dashboard</h4>
                {/* <button className='d-flex align-items-center justify-content-center g-15 btnOutlined mTitleBtm'><img src={filter} alt="" /> Filter</button> */}
              </div>


              <div className='tableWrap'>
                <div className='table-responsive'>
                  <table className="table tableBase dashboardTable">
                    <thead>
                      <tr>
                        <th scope="col" ><div className='customSortHead'>AGENCY <img src={sortWhite} alt="" /></div></th>
                        <th scope="col" ><div className='customSortHead'>ENTITY <img src={sortWhite} alt="" /></div></th>
                        <th scope="col" ><div className='customSortHead'>CASH <img src={sortWhite} alt="" /></div></th>
                        <th scope="col" ><div className='customSortHead'>STOCK <img src={sortWhite} alt="" /></div></th>
                      </tr>
                    </thead>
                    <tbody>
                      <Dashboardrow data={data} onRowClick={handleRowClick} />
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="d-flex justify-content-end mb-5 mt-3 g-10 w-100">
                <div className="d-flex justify-content-end g-10">
                  <button
                    className="baseBtn baseBtn d-flex align-items-center justify-content-center p-3"
                    onClick={() => handleRowClick(data)}
                  >
                    View Employee Allocation Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Dashboard;