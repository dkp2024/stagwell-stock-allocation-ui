import React from 'react'
import check from '../images/check_circle.svg';

export default function Success() {
  return (
    <div className='successWrap d-flex align-items-start justify-content-center'>
      <div className='messageBox d-flex align-items-center justify-content-center text-center flex-column g-10'>
        <img src={check} alt="" />
        <p>Your submission has been routed to your CFO.</p>
      </div>
    </div>
  )
}
