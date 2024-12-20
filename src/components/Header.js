import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from '../images/logo.svg';
import mail from '../images/mail.svg';
import user from '../images/user.svg';
import { BASE_LOCAL_URL } from "../_constants/constants";
import { sessionStorageClear } from "../utils/storageHelper";
import { sessionStorageGet } from "../utils/storageHelper";
import { useOktaAuth } from '@okta/okta-react';
export default function Header() {
  const [userName, setUserName] = useState('');
  const { authState, oktaAuth} = useOktaAuth();
  const logout = async () => oktaAuth.signOut();
  const handleLogout= async () =>{
    const accessToken = oktaAuth.getAccessToken();
    await sessionStorageClear();
    try {//logout from backend
      const response = await fetch(`${BASE_LOCAL_URL}clearCookie`, {
        
        headers: {
          'Authorization': `Bearer ${accessToken}`,  
          "Content-Type": "application/json",
          
        },
        credentials: "include",
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }else{
        logout();  // logout from Okta
      }

    } catch (error) {
      logout();  // logout from Okta
      console.log(error);
    }
    
   
  }
  useEffect(() => {
  if(authState?.idToken?.claims){
    const { name} = authState?.idToken?.claims;
    console.log('Claims::',authState?.idToken?.claims);
    setUserName(name);
  }

  }, [authState]);

  return (
    <nav className="navbar fixed-top headerWrap">
      <div className="container-fluid">
        <div className='d-flex align-items-center justify-content-between w-100'>
          <div className='logoBox'><img src={logo} alt="" /></div>
          <div className='headerAction d-flex align-items-center g-20'>
            {/* <Link className='d-flex align-items-center justify-content-between g-5 hAlerts'>
              <img src={mail} alt="" /> <span>Alerts</span>
            </Link> */}

            <div>
              <div className='dropdown'>
                <button className='dropdown-toggle d-flex align-items-center g-3 userBtn' type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className='d-flex align-items-center justify-content-between g-20'>
                    <span className='uName'>{userName}</span>
                    <img src={user} alt="" />
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  {/* <li><button className='dropdown-item' type="button">Profile</button></li> */}
                  <li onClick={handleLogout}><button className='dropdown-item' type="button">Logout</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
