import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionStorageGet } from "../utils/storageHelper";
import sortWhite from '../images/sort-white.svg';
import filter from '../images/filter.svg';
import { BASE_LOCAL_URL } from '../_constants/constants';
import { sessionStorageSet } from '../utils/storageHelper';
import { useOktaAuth } from '@okta/okta-react';




const Dashboardrow = ({ data, onRowClick }) => {
  
  const navigate = useNavigate();
  // const rowData = location.state.rowData;

  return (
    <>
    {data.map(item => (
      <tr key={item.id} onClick={() => onRowClick(item)} >
        <td>
          <div className='customTableBody textHiglight'>{item.agencyName}</div>
        </td>
        <td>
          <div className='customTableBody textHiglight'>{item.entityName}</div>
        </td>
        <td>
          <div className='customTableBody'>
            <div className='d-flex align-items-center'>
              <span>$</span>
              <span>{item.amountForCash}</span>
              {/* <input type="text" className="form-control" value={item.amountForCash} /> */}
            </div>
          </div>
        </td>
        <td>
          <div className='customTableBody'>
            <div className='d-flex align-items-center'>
              <span>$</span>
              <span>{item.amountForStock}</span>
              {/* <input type="text" className="form-control" value={item.amountForStock} /> */}
            </div>
            {item.status ? <span className='statusChip d-flex align-items-center'>{item.status}</span> : ''}
          </div>
        </td>
      </tr>
    ))}
  </>
  )
}


const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { oktaAuth, authState } = useOktaAuth();
  useEffect(() => {
    const fetchData = async () => {
      const isLoggedIn = await sessionStorageGet('isLoggedIn')
      const accessToken = oktaAuth.getAccessToken();
      if(isLoggedIn && accessToken) {
        try {
          const response = await fetch(`${BASE_LOCAL_URL}entity/list`,{
             headers: {
            'Authorization': `Bearer ${accessToken}`,  
            'Content-Type': 'application/json'
          }, 
          credentials: 'include'});
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
        window.location.href = '/'
      }
    };

    fetchData();
  }, []);

  
  

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

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Dashboard;