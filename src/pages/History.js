import React, { useState, useEffect } from 'react';
import sortWhite from '../images/sort-white.svg';


const History = () => {
    return (
        <div className="container InfoSec">

        <div className='bonusSec'>
          <div className="row">
            <div className="col">
              <div className='d-flex align-items-center justify-content-between mb-3'>
                <h4 className='displayTitle'>History</h4>

              </div>


              <div className='tableWrap'>
                <div className='table-responsive'>
                  <table className="table tableBase dashboardTable">
                    <thead>
                      <tr>
                        <th scope="col" ><div className='customSortHead'>TIME <img src={sortWhite} alt="" /></div></th>
                        <th scope="col" ><div className='customSortHead'>CHANGED BY <img src={sortWhite} alt="" /></div></th>
                        <th scope="col" ><div className='customSortHead'>SUMMARY <img src={sortWhite} alt="" /></div></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className='customTableBody textHiglight'>2023-11-14 09:46 </div>
                        </td>
                        <td>
                          <div className="customTableBody textBalck">Admin</div>
                        </td>
                        <td>
                          <div className="customTableBody textGray">Cash approved</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default History;