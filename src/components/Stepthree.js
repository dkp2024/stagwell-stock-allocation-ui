import React from 'react'
import Multiselect from '../components/multiselect/Multiselect';

import sortWhite from '../images/sort-white.svg';
import download from '../images/download.svg';
import avatar from '../images/tuser.svg';
import budget from '../images/budget.svg';
import cash from '../images/cash.svg';
import stock from '../images/stock.svg';

import { useSection } from '../utils/SectionContext';


const DataTile = ({ data, type }) => {
  return (
      <>
      {data.map(item => (
          <div className="col" key={item.id}>
              <div className='tileWrap singleCard'>
                  <div className='tileHeader d-flex align-items-center g-15'>
                      {type === 'total' ? null : <img src={item.image} alt="" />}
                      <div className='tileTxt'>
                          <h6>{item.title}</h6>
                          <h2>{item.amount}</h2>
                      </div>
                  </div>
              </div>
          </div>
      ))}
  </>
  )
  
  }


const allOptions = [
    { value: "option 1", label: "option 1" },
    { value: "option 2", label: "option 2" },
    { value: "option 3", label: "option 3" },
    { value: "option 4", label: "option 4" }
  ];

export default function Stepthree() {
    const { showSection } = useSection();

    const tileData = [
      { id: 1, image: budget, title: 'Overall Bonus Pool Budget:', amount: '$1,000,000' },
      { id: 1, image: cash, title: 'Amount allocated to Cash:', amount: '$250,000' },
      { id: 1, image: stock, title: 'Amount allocated to Stock:', amount: '$750,000' },
  ];

  return (
    <div className="container InfoSec">
      <div className='sectionTitle'>
          Company: <span>Assembly</span>
      </div>


            <div className='showcaseWrap'>
                <div className="row gx-3 gy-3 gx-0">
                    <DataTile data={tileData} />
                </div>
            </div>

      <div className='row justify-content-start"'>
        <div className="col-md-3 customMultiselect mb-4">
          <Multiselect placeholder="Consolidated" allOptions={allOptions} />
        </div>
      </div>

      <div className='row'>
        <div className="col-md-7">
          <div className="mb-3">
            <label for="userMsg" className="form-label inputLabel">Special requests</label>
            <textarea className="form-control txtareaBase" id="userMsg" rows="5" placeholder='If you have special requests, enter them here'></textarea>
          </div>
        </div>
        <div className="col-md-4 offset-md-1 mt-4">
          <div className='d-flex justify-content-end btnEnd'>
            <button className='d-flex align-items-center justify-content-center g-15 btnOutlined mb-3 '>Download to XLS <img src={download} alt="" /></button>
          </div>
        </div>
      </div>




      <div className='empWrap mt-4'>
        <div className="row">
          <div className="col">
            <div className='tableWrap'>
              <div className="table-responsive">
                <table className="table tableBase fixedcolumnTable">
                  <thead>
                    <tr>
                      <th scope="col" className="fixed-column columnUser userHead"><div className='customSortHead'>Name & JOB TITLE <img src={sortWhite} alt="" /></div></th>
                      <th scope="col" ><div className='customSortHead'>Company <img src={sortWhite} alt="" /></div></th>
                      <th scope="col" ><div className='customSortHead'>ENTITY <img src={sortWhite} alt="" /></div></th>
                      <th scope="col" ><div className='customSortHead'>
                        <div className='tHeadWrap d-flex flex-column g-3'>
                          <span>Employee</span>
                          <span>id</span>
                        </div>
                      </div>
                      </th>
                      <th scope="col" ><div className='customSortHead'>
                        <div className='tHeadWrap d-flex flex-column g-3'>
                          <span>2023</span>
                          <span>Base comp</span>
                        </div><img src={sortWhite} alt="" /></div></th>

                      <th scope="col" ><div className='customSortHead'>
                        <div className='tHeadWrap d-flex flex-column g-3'>
                          <span>2023</span>
                          <span>Cash bonus</span>
                        </div><img src={sortWhite} alt="" /></div></th>

                      <th scope="col" ><div className='customSortHead'>
                        <div className='tHeadWrap d-flex flex-column g-3'>
                          <span>2023</span>
                          <span>Stock Bonus</span>
                        </div><img src={sortWhite} alt="" /></div></th>

                      <th scope="col" ><div className='customSortHead'>
                        <div className='tHeadWrap d-flex flex-column g-3'>
                          <span>2023</span>
                          <span>Stock Premium</span>
                        </div><img src={sortWhite} alt="" /></div></th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='columnUser fixed-column'>
                        <div className='customTableBody d-flex g-10'>
                          <img src={avatar} alt="" />
                          <div className='fuserInfo'>
                            <h6>Giacomo Guilizzoni</h6>
                            <span className='caption'>Founder & CEO</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='customTableBody textBalck'>Assembly </div>
                      </td>
                      <td>
                        <div className='customTableBody textGray'>US </div>
                      </td>
                      <td>
                        <div className='customTableBody textGray'>1 </div>
                      </td>
                      <td>
                        <div className='customTableBody'>
                          <div className='inputBorder d-flex align-items-center'>
                            <span>$</span>
                            <input type="text" className="form-control" placeholder="180,000.00" />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='customTableBody'>
                          <div className='inputBorder d-flex align-items-center'>
                            <span>$</span>
                            <input type="text" className="form-control" placeholder="20,000.00" />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='customTableBody'>
                          <div className='inputBorder d-flex align-items-center'>
                            <span>$</span>
                            <input type="text" className="form-control" placeholder="30,000.00" />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='customTableBody'>
                          <div className='inputBorder d-flex align-items-center'>
                            <span>$</span>
                            <input type="text" className="form-control" placeholder="30,000.00" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>


            <div className='twoBtnSec d-flex justify-content-end flex-wrap mb-5 mt-3 g-10'>
              <button className="baseBtn btnLg d-flex align-items-center justify-content-center">Download report for MJP Approval</button>
              <button className="baseBtn btnLg d-flex align-items-center justify-content-center" onClick={() => showSection('Stepfour')}>Proceed to Modification & Approval</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
