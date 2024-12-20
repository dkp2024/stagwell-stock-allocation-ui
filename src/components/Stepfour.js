import React from 'react'
import Multiselect from '../components/multiselect/Multiselect';


import sortWhite from '../images/sort-white.svg';
import avatar from '../images/tuser.svg';

import { useSection } from '../utils/SectionContext';



const allOptions = [
  { value: "option 1", label: "option 1" },
  { value: "option 2", label: "option 2" },
  { value: "option 3", label: "option 3" },
  { value: "option 4", label: "option 4" }
];

export default function Stepfour() {
    const { showSection } = useSection();
  return (
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
              <button className="baseBtn btnLg d-flex align-items-center justify-content-center" onClick={() => showSection("Stepfive")}>Download Report for AST</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
