import React, { useCallback } from "react";
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

export default function Stepfive() {
    const { showSection } = useSection();

    const headerColumns = [
        { value: "Agency Name", label: "Agency Name" },
        { value: "Entity", label: "Entity" },
        { value: "Eployee Id", label: "Eployee Id" },
        { value: "Base Comp", label: "Base Comp" },
        { value: "2023 Cash Bonus", label: "2023 Cash Bonus" },
        { value: "2023 Stock Bonus", label: "2023 Stock Bonus" },
        { value: "2023 Stock Premium", label: "2023 Stock Premium" } 
      ];
    
      const totalData = [
        { id: 1, title: "Total Cash Available", amount: '$1,30,000' },
        { id: 2, title: "Total Cash Remaining", amount: '$100,000'},
        { id: 3, title: "Total Stock Available", amount: '5,00,000'},
        { id: 4, title: "Total Stock Remaining", amount: '100,000' },
      ];

      const DataTile = useCallback(({ data, type }) => {
        return (
          <>
            {data.map((item) => (
              <div className="col" key={item.id}>
                <div className="tileWrap singleCard">
                  <div className="tileHeader d-flex align-items-center g-15">
                    {type === "total" ? null : <img src={item.image} alt="" />}
                    <div className="tileTxt">
                      <h6>{item.title}</h6>
                      <h2>{item.amount}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        );
      }, []);

  return (
    <div className="container InfoSec">
      <div className='sectionTitle'>
        Company: <span>Assembly</span>
      </div>

      <div className='showcaseWrap'>
        <div className="row gx-3 gy-3 gx-0">
            <DataTile data={totalData} type="total" />
        </div>
      </div>

      <div className='row justify-content-start"'>
        <div className="col-md-3 col-sm-12 col-xs-12 customMultiselect mb-4">
          <Multiselect placeholder="Select Agency" allOptions={allOptions} />
        </div>
        <div className="col-md-3 col-sm-12 col-xs-12  customMultiselect mb-4">
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
                      <th scope="col" className="fixed-column columnUser userHead">
                        <div className='customSortHead'>Name & JOB TITLE <img src={sortWhite} alt="" /></div>
                        </th>
                        {headerColumns.map((item, index) => (
                            <th scope="col" key={index}>
                                <div className="customSortHead">
                                    {item.label} <img src={sortWhite} alt="" />
                                </div>
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
                      <div className='customTableBody textGray'>$180,000.00</div>
                      </td>
                      <td>
                      <div className='customTableBody textGray'>$20,000.00</div>
                      </td>
                      <td>
                      <div className='customTableBody textGray'>$30,000.00</div>
                      </td>
                      <td>
                      <div className='customTableBody textGray'>$33,000.00</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>


            <div className='d-flex justify-content-end mb-5 mt-3 g-10 twoBtnSec'>
              <button className="baseBtn btnLg d-flex align-items-center justify-content-center">Download MJP Report</button>
              <button className="baseBtn btnLg d-flex align-items-center justify-content-center">Download Report for AST</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
