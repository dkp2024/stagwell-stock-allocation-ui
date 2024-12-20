import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <div className='footerWrap d-flex align-items-center justify-content-between'>
      <ul className='d-flex align-items-center'>
        <li>The Stagwell Group</li>
        <li>Copyright © 2024</li>
        {/* <li><Link>Terms and Conditions</Link></li>
        <li><Link>Privacy</Link></li> */}
      </ul>
      {/* <div className='poweredWrap d-flex align-items-center g-10'>
        <span>Powered by</span>
        <Link>aciinfotech.com</Link>
      </div> */}
    </div>
  )
}
