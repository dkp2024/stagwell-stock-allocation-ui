import React, { useState, useEffect } from 'react';
import Stepper from '../components/stepper/Stepper'
import Success from './Success';
import Multiselect from '../components/multiselect/Multiselect';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import budget from '../images/budget.svg';
import cash from '../images/cash.svg';
import stock from '../images/stock.svg';
import sort from '../images/sort.svg';
import sortWhite from '../images/sort-white.svg';
import download from '../images/download.svg';
import avatar from '../images/tuser.svg';
import search from '../images/search.svg';
import filter from '../images/filter.svg';
import Multiselectforoptions from '../components/multiselect/Multiselectforoptions';



const allOptions = [
  { value: "option 1", label: "option 1" },
  { value: "option 2", label: "option 2" },
  { value: "option 3", label: "option 3" },
  { value: "option 4", label: "option 4" }
];


const nallOptions = [
  { value: "option 1", label: "option 1" },
  { value: "option 2", label: "option 2" },
  { value: "option 3", label: "option 3" },
  { value: "option 4", label: "option 4" }
];



const DataTile = ({ data, type }) => (
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
);


const Bonusrow = ({ data }) => (
  <>
    {data.map(item => (
      <tr key={item.id}>
        <td>
          <div className='customTableBody textHiglight'>{item.entity}</div>
        </td>
        <td>
          <div className='customTableBody'>
            <div className='inputBorder d-flex align-items-center'>
              <span>$</span>
              <input type="text" className="form-control" placeholder={item.cash} />
            </div>
          </div>
        </td>
        <td>
          <div className='customTableBody'>
            <div className='inputBorder d-flex align-items-center'>
              <span>$</span>
              <input type="text" className="form-control" placeholder={item.stock} />
            </div>
            {item.status ? <span className='statusChip d-flex align-items-center'>{item.status}</span> : ''}
          </div>
        </td>
      </tr>
    ))}
  </>
);


const DetailDummy = () => {

    const tileData = [
        { id: 1, image: budget, title: 'Overall Bonus Pool Budget:', amount: '$1,000,000' },
        { id: 1, image: cash, title: 'Amount allocated to Cash:', amount: '$250,000' },
        { id: 1, image: stock, title: 'Amount allocated to Stock:', amount: '$750,000' },
      ];
    
      const bonusRow = [
        { id: 1, entity: 'Assembly NA', cash: '1,30,000', stock: '5,000,000', status: 'completed' },
        { id: 2, entity: 'Assembly NA', cash: '1,20,000', stock: '4,000,000', status: '' },
        { id: 3, entity: 'Assembly NA', cash: '1,10,000', stock: '3,000,000', status: 'completed' },
      ];
    
      const totalData = [
        { id: 1, title: 'Total Cash Available', amount: '$1,30,000' },
        { id: 1, title: 'Total Cash Remaining', amount: '$100,000' },
        { id: 1, title: 'Total Stock Available', amount: '$5,00,000' },
        { id: 1, title: 'Total Stock Remaining', amount: '100,000' },
      ];
    
      const [eColumns, setEcolumns] = useState([
        { sortImg: sortWhite, name: 'name', year: '', isSelected: true },
        { sortImg: sortWhite, name: 'company', year: '', isSelected: true },
        { sortImg: sortWhite, name: 'entity', year: '', isSelected: false },
        { sortImg: sortWhite, name: 'employee_id', year: '', isSelected: false },
        { sortImg: sortWhite, name: 'base_comp', year: '2023', isSelected: false },
        { sortImg: sortWhite, name: 'cash_bonus', year: '2023', isSelected: false },
        { sortImg: sortWhite, name: 'stock_bonus', year: '2023', isSelected: false },
        { sortImg: sortWhite, name: 'stock_premimum', year: '2023', isSelected: false },
      ]);
    
      const [eData, seteData] = useState([
        { name: 'Giacomo Guilizzoni', designation: 'Founder & CEO', company: 'Assembly', entity: 'US', employee_id: 1, base_comp: '180,000.00', cash_bonus: '20,000.00', stock_bonus: '30,000.00', stock_premimum: '30,000.00' },
        { name: 'Giacomo Guilizzoni', designation: 'Founder & CEO', company: 'Assembly', entity: 'US', employee_id: 1, base_comp: '180,000.00', cash_bonus: '20,000.00', stock_bonus: '30,000.00', stock_premimum: '30,000.00' },
        { name: 'Giacomo Guilizzoni', designation: 'Founder & CEO', company: 'Assembly', entity: 'US', employee_id: 1, base_comp: '180,000.00', cash_bonus: '20,000.00', stock_bonus: '30,000.00', stock_premimum: '30,000.00' },
      ]);


  const [selectedColumns, setSelectedColumns] = useState(['name', 'company', 'entity']); // State to track selected columns

  // Options for Select component
  const allOptions = [
    { value: 'name', label: 'Name' },
    { value: 'company', label: 'Company' },
    { value: 'entity', label: 'Entity' },
    { value: 'employee_id', label: 'Employee ID' },
    { value: 'base_comp', label: 'Base Compensation' },
    { value: 'cash_bonus', label: 'Cash Bonus' },
    { value: 'stock_bonus', label: 'Stock Bonus' },
    { value: 'stock_premimum', label: 'Stock Premium' }
  ];

  // Handler for when options change in Multiselect
  const handleOptionsChange = (selectedOptions) => {
    setSelectedColumns(selectedOptions);
  };


  return (
    <div className='mainWrap'>
    {/* ----Stepper ---- */}
    <div className='stepperWrap'>
      <Stepper />
    </div>

    {/* ----Container   page 1 ---- */}

    <div className="container InfoSec">
      <div className='sectionTitle'>
        Company: <span>Assembly</span>
      </div>


      <div className='showcaseWrap'>
        <div className="row gx-3 gy-3 gx-0">
          <DataTile data={tileData} />
        </div>
      </div>


      <div className='bonusSec'>
        <div className="row">
          <div className="col">
            <h4 className='displayTitle'>Allocated Bonus</h4>

            <div className='tableWrap'>
              <div className='table-responsive'>
                <table className="table tableBase bonusTable">
                  <thead>
                    <tr>
                      <th scope="col" ><div className='customSortHead'>ENTITY <img src={sortWhite} alt="" /></div></th>
                      <th scope="col" ><div className='customSortHead'>CASH <img src={sortWhite} alt="" /></div></th>
                      <th scope="col" ><div className='customSortHead'>STOCK <img src={sortWhite} alt="" /></div></th>
                    </tr>
                  </thead>
                  <tbody>
                    <Bonusrow data={bonusRow} />
                  </tbody>
                </table>
              </div>
            </div>

            <div className='d-flex justify-content-end mb-5 mt-3'>
              <button className="baseBtn d-flex align-items-center justify-content-center">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ----Success   page 3 ---- */}
    {/* <Success /> */}


    {/* ----Container   page 4 ---- */}
    <div className="container InfoSec">
      <div className='sectionTitle'>
        Company: <span>Assembly</span>
      </div>

      <div className='showcaseWrap'>
        <div className="row gx-3 gy-3 gx-0">
          <DataTile data={totalData} type="total" />
        </div>
      </div>

      <div>
        <div className='selectSec mt-3'>
          <div className="row gy-3">
            <div className="col-md-11">
              <div className="row gx-3 gy-3">
                <div className='col-md-3'>
                  <div className='searchWrap d-flex align-items-center'>
                    <img src={search} alt="" />
                    <input type="text" className="form-control" placeholder='Search Employee' />
                  </div>
                </div>
                <div className="col-md-3 customMultiselect">
                  <Multiselect placeholder="Consolidated" allOptions={allOptions} />
                </div>
                <div className="col-md-3 customMultiselect">
                  <Multiselect placeholder="Entity" allOptions={allOptions} />
                </div>
                <div className="col-md-3 customMultiselect">
                  <Multiselect placeholder="Colums" allOptions={allOptions} />
                </div>
              </div>
            </div>
            <div className="col-md-1">
              <button className='d-flex align-items-center justify-content-center g-3 btnOutlined btnXs'> XLS <img src={download} alt="" /></button>
            </div>
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
                      {eColumns.map((column, index) => (
                        <th key={index} scope="col" className={column.name === 'name' ? 'fixed-column columnUser userHead' : ''}>
                          {column.name === 'employee_id' ? (
                            <div className='customSortHead'>
                              <div className='tHeadWrap d-flex flex-column g-3'>
                                <span>Employee</span>
                                <span>id</span>
                              </div>
                            </div>
                          ) : (
                            <>
                              {column.name === 'base_comp' || column.name === 'cash_bonus' || column.name === 'stock_bonus' || column.name === 'stock_premimum' ? (
                                <div className='customSortHead'>
                                  <div className='tHeadWrap d-flex flex-column g-3'>
                                    <span>{column.year}</span>
                                    <span>{column.name}</span>
                                  </div>
                                  <img src={sortWhite} alt="" />
                                </div>
                              ) : (
                                <div className='customSortHead'>
                                  {column.name} <img src={column.sortImg} alt="" />
                                </div>
                              )}
                            </>
                          )}
                        </th>
                      ))}
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


            <div className='d-flex justify-content-end mb-5 mt-3 g-10'>
              <button className="baseBtn d-flex align-items-center justify-content-center">Save</button>
              <button className="baseBtn d-flex align-items-center justify-content-center">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>


    {/* page  -- 4 */}
    <div className="container InfoSec">
      <div className='sectionTitle'>
        Company: <span>Assembly</span>
      </div>


      <div className='showcaseWrap'>
        <div className="row gx-3 gy-3 gx-0">
          <div className="col">
            <div className='tileWrap'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <img src={budget} alt="" />
                <div className='tileTxt'>
                  <h6>Overall Bonus Pool Budget:</h6>
                  <h2>$1,000,000</h2>
                </div>
              </div>

            </div>
          </div>
          <div className="col">
            <div className='tileWrap'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <img src={cash} alt="" />
                <div className='tileTxt'>
                  <h6>Amount allocated to Cash:</h6>
                  <h2>$250,000</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className='tileWrap'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <img src={stock} alt="" />
                <div className='tileTxt'>
                  <h6>Amount allocated to Stock:</h6>
                  <h2>$750,000</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className='bonusSec'>
        <div className="row">
          <div className="col">
            <h4 className='displayTitle'>Allocated Bonus</h4>

            <div className='row'>
              <div className="col-md-7 col-sm-12 col-xs-12">
                <div className="mb-3">
                  <label for="userMsg" className="form-label inputLabel">Special requests</label>
                  <textarea className="form-control txtareaBase" id="userMsg" rows="5" placeholder='If you have special requests, enter them here'></textarea>
                </div>
                <div className='row'>
                  <div className='col-md-6 col-sm-12 col-xs-12'>
                    <div className="mb-3">
                      <label for="username" className="form-label inputLabel">Additional Cash bonus requested</label>
                      <input type="email" className="form-control inputBase" id="username" placeholder="" />
                    </div>
                  </div>
                  <div className='col-md-6 col-sm-12 col-xs-12'>
                    <div className="mb-3">
                      <label for="username" className="form-label inputLabel">Additional Stock bonus requested</label>
                      <input type="email" className="form-control inputBase" id="username" placeholder="" />
                    </div>
                  </div>
                </div>


                <div className='row'>
                  <div className='col-md-6 col-sm-12 col-xs-12'>
                    <div className="mb-3">
                      <label for="username" className="form-label inputLabel">Name</label>
                      <input type="email" className="form-control inputBase" id="username" placeholder="" />
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-6 col-sm-12 col-xs-12'>
                    <div className="mb-3">
                      <label for="username" className="form-label inputLabel">Title</label>
                      <input type="email" className="form-control inputBase" id="username" placeholder="" />
                    </div>
                  </div>
                </div>

              </div>
              <div className="col-md-3 offset-md-2"></div>
            </div>



            <div className='d-flex justify-content-start mb-5 mt-4'>
              <button className="baseBtn d-flex align-items-center justify-content-center">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>



    {/* ----Container   page 5  ---- */}
    <div className="container InfoSec">
      <div className='sectionTitle'>
        Company: <span>Assembly</span>
      </div>

      <div className='showcaseWrap'>
        <div className="row gx-3 gy-3 gx-0">
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Cash Available </h6>
                </div>
              </div>
              <h2>$1,30,000</h2>
            </div>
          </div>
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Cash  Remaining </h6>
                </div>
              </div>
              <h2>$100,000</h2>
            </div>
          </div>
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Stock Available </h6>
                </div>
              </div>
              <h2>$5,00,000</h2>
            </div>
          </div>
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Stock Remaining </h6>
                </div>
              </div>
              <h2>100,000</h2>
            </div>
          </div>
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
              <button className="baseBtn btnLg d-flex align-items-center justify-content-center">Proceed to Modification & Approval</button>
            </div>
          </div>
        </div>
      </div>
    </div>


    {/* ----Container   page 6  ---- */}
    <div className="container InfoSec">
      <div className='sectionTitle'>
        Company: <span>Assembly</span>
      </div>

      <div className='showcaseWrap'>
        <div className="row gx-3 gy-3 gx-0">
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Cash Available </h6>
                </div>
              </div>
              <h2>$1,30,000</h2>
            </div>
          </div>
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Cash  Remaining </h6>
                </div>
              </div>
              <h2>$100,000</h2>
            </div>
          </div>
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Stock Available </h6>
                </div>
              </div>
              <h2>$5,00,000</h2>
            </div>
          </div>
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Stock Remaining </h6>
                </div>
              </div>
              <h2>100,000</h2>
            </div>
          </div>
        </div>
      </div>

      <div className='row justify-content-start"'>
        <div className="col-md-3 col-sm-12 col-xs-12 customMultiselect mb-4">
          <Multiselect placeholder="Consolidated" allOptions={allOptions} />
        </div>
      </div>

      <div className='row justify-content-start'>
        <div className="col-md-7 col-sm-12 col-xs-12">
          <div className="mb-3">
            <label for="userMsg" className="form-label inputLabel">Special requests</label>
            <textarea className="form-control txtareaBase" id="userMsg" rows="5" placeholder='If you have special requests, enter them here'></textarea>
          </div>
          <div className='row'>
            <div className='col-md-6 col-sm-12 col-xs-12'>
              <div className="mb-3">
                <label for="username" className="form-label inputLabel">Total cash approved</label>
                <input type="email" className="form-control inputBase mb-1" id="username" placeholder="" />
                <label for="username" className="form-label inputLabel">Remaining : 0</label>
              </div>
            </div>
            <div className='col-md-6 col-sm-12 col-xs-12'>
              <div className="mb-3">
                <label for="username" className="form-label inputLabel">Total stock approved</label>
                <input type="email" className="form-control inputBase mb-1" id="username" placeholder="" />
                <label for="username" className="form-label inputLabel">Remaining : 0</label>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className="d-flex justify-content-start mb-3 mt-3 mjustifyCenter">
              <button className="baseBtn d-flex align-items-center justify-content-center">Save</button>
            </div>
          </div>

        </div>
      </div>

      <hr />

      <div className="row mt-4">
        <div className="col">
          <div className="d-flex justify-content-end btnEnd">
            <button className="d-flex align-items-center justify-content-center g-15 btnOutlined mb-3 ">Download to XLS <img src="/static/media/download.37127dedcc841d7cf20d97da478ca984.svg" alt="" /></button></div></div>
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


            <div className='d-flex justify-content-end mb-5 mt-3 g-10 mjustifyCenter'>
              <button className="baseBtn d-flex align-items-center justify-content-center">Save</button>
              <button className="baseBtn d-flex align-items-center justify-content-center">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>


    {/* ----Container   page 7  ---- */}
    <div className="container InfoSec">
      <div className='sectionTitle'>
        Company: <span>Assembly</span>
      </div>

      <div className='showcaseWrap'>
        <div className="row gx-3 gy-3 gx-0">
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Cash Available </h6>
                </div>
              </div>
              <h2>$1,30,000</h2>
            </div>
          </div>
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Cash  Remaining </h6>
                </div>
              </div>
              <h2>$100,000</h2>
            </div>
          </div>
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Stock Available </h6>
                </div>
              </div>
              <h2>$5,00,000</h2>
            </div>
          </div>
          <div className="col">
            <div className='tileWrap singleCard'>
              <div className='tileHeader d-flex align-items-center g-15'>
                <div className='tileTxt'>
                  <h6>Total Stock Remaining </h6>
                </div>
              </div>
              <h2>100,000</h2>
            </div>
          </div>
        </div>
      </div>

      <div className='row justify-content-start"'>
        <div className="col-md-4 col-sm-12 col-xs-12 customMultiselect mb-4">
          <Multiselect placeholder="Select Agency" allOptions={allOptions} />
        </div>
        <div className="col-md-4 col-sm-12 col-xs-12  customMultiselect mb-4">
          <Multiselect placeholder="Entity: US" allOptions={allOptions} />
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


            <div className='d-flex justify-content-end mb-5 mt-3 g-10 twoBtnSec'>
              <button className="baseBtn btnLg d-flex align-items-center justify-content-center">Download Report for Comp Com</button>
              <button className="baseBtn btnLg d-flex align-items-center justify-content-center">Download Report for AST</button>
            </div>
          </div>
        </div>
      </div>
    </div>



      {/* workout ======== */}


      <div className='container'>
      <Multiselect
        placeholder="Select columns"
        allOptions={allOptions}
        onOptionsChange={handleOptionsChange}
      />
      <table className="table tableBase fixedcolumnTable">
        <thead>
          <tr>
            {allOptions.map((option) => {
              if (selectedColumns.includes(option.value)) {
                return <th key={option.value} scope="col">{option.label}</th>;
              }
            })}
          </tr>
        </thead>
        <tbody>
          {/* Map over eData and render table rows */}
          {eData.map((row, index) => (
            <tr key={index}>
              {selectedColumns.map((column) => (
                <td key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>



    <Multiselect
        placeholder="Select colnew"
        allOptions={allOptions}
        onOptionsChange={handleOptionsChange}
      />




</div>
  )
}







export default DetailDummy;
