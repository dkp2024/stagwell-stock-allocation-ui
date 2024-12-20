import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.svg";
import { Link } from "react-router-dom";
import { AGENCY, BASE_LOCAL_URL, DASHBOARD_ROUTE, DETAIL_ROUTE, ENTITY, NETWORK, STAGWELL } from "../_constants/constants";
import { executeHttpCall } from "../utils/Http";
import { sessionStorageSet } from "../utils/storageHelper";
import Loader from "../components/Loader";
import Toast from "../utils/Toast";
import { sessionStorageGet } from "../utils/storageHelper";
import { useOktaAuth } from '@okta/okta-react';
//import { Navigate } from 'react-router-dom';
export default function Login() {
  const { oktaAuth, authState } = useOktaAuth();
  const login = async () => oktaAuth.signInWithRedirect();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isUserAuthErr, setIsUserAuthErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  
  const validateUser = async (userDetail) => {

    setIsLoading(true);
    const accessToken = oktaAuth.getAccessToken();
    console.log('Token Receive:');
    //fetch('http://localhost:8081/stagwell/api/external', {
    console.log('userDetail::',userDetail);
    await executeHttpCall('user', 'POST', {email:userDetail['email_address'],roles:userDetail['user_types']}, accessToken)
      .then(response => {
        if (response == null) {
          throw new Error('Http method is not correct!');
        }
        else if (response.ok) {
          // console.log('response:', response); 
          return response.json(); // Parse the JSON data from the response
        } else if (response.status === 401) {
          console.log('User is not authorized, token is not validated');
          throw new Error('User is not authorized, token is not validated');
        } else if (response.BAD_REQUEST) {
          return response.json();
        } else {
          throw new Error('Failed to fetch');
        }
      })
      .then(data => {
        setIsLoading(false);
        console.log('Data:', data);  // Handle the actual response data
        if (data !== null  && (data.userType!=null || data.userId!=null)) {
          setIsUserAuthErr(false);
          setErrMsg('')
          sessionStorageSet('isLoggedIn', true);
          console.log("Fetched data:", data);
          sessionStorageSet('userType', data.userType)
          sessionStorageSet('userId', data.userId);
          sessionStorageSet('userName', data.userName)
         
          if (data.userType === AGENCY) {
            sessionStorageSet('activeSection', 'Stepone')
            navigate(DETAIL_ROUTE, { replace: true });
          } else if (data.userType === ENTITY) {
            sessionStorageSet('activeSection', 'Steptwo')
            navigate(DETAIL_ROUTE, { replace: true });
          } else if (data.userType === STAGWELL || data.userType === NETWORK) {
            navigate(DASHBOARD_ROUTE, { replace: true });
          }
        }else{
          setIsUserAuthErr(true);
          setErrMsg('You are not mapped in backend, Please reach out to application owner to map the roles!');

        }
      })
      .catch(error => {
        setErrMsg(error.message);
        setIsUserAuthErr(true);
        setIsLoading(false);
        console.error('Error:', error);  // Handle errors
      })

    //await getToken();
    //console.log('Token:', token);

  }
  useEffect(() => {
    let accessToken = null;
    let usrDetail = {};
    if (authState && authState.isAuthenticated) {
      setIsLoading(false);
      accessToken = oktaAuth.getAccessToken();
      console.log('accessToken:');
      const decodedToken = JSON.parse(atob(accessToken.split('.')[1])); // Decode the JWT
      const usrDtls = decodedToken;
      console.log('claims:', usrDtls);
      usrDetail['user_types'] = usrDtls['roles'];
      if (authState?.idToken?.claims) {
        const { name, email } = authState?.idToken?.claims;
        usrDetail['user_name'] = name;
        usrDetail['email_address'] = email;
        console.log('usrDetail:', usrDetail);
       
      }
    } else {
      setIsLoading(false);
    }
    if (accessToken) {
      setTimeout(()=>{
        validateUser(usrDetail);
      },500)
     
    }
  }, [authState])

  useEffect(() => {
    /*
     (async() => {
       const isLoggedIn = await sessionStorageGet('isLoggedIn')
       const userType = await sessionStorageGet('userType')
       if(userType === AGENCY && isLoggedIn) {
         sessionStorageSet('activeSection', 'Stepone')
         navigate(DETAIL_ROUTE, {replace: true});
     } else if(userType === ENTITY && isLoggedIn) {
         sessionStorageSet('activeSection', 'Steptwo')
         navigate(DETAIL_ROUTE, {replace: true});
     } else if(isLoggedIn && (userType === STAGWELL || userType === NETWORK)) {
         navigate(DASHBOARD_ROUTE, {replace: true});
     }
     })() */
  }, [navigate])

  const handleLogin = async () => {
    // validateEmail();
    // validatePassword();


    // debugger;
    try {
      const response = await fetch(`${BASE_LOCAL_URL}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          // email: 'allison.clu@allisonpr.com',
          email: "merrill.raman@stagwellglobal.com",
          //password: password,
          //email: userDetail.email_address,
          password: 'Test@123',
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      sessionStorageSet('isLoggedIn', true);
      sessionStorageSet('userType', result.userType)
      sessionStorageSet('userName', result.userName)
      console.log("Fetched data:", result);
      if (result.userType === AGENCY) {
        sessionStorageSet('activeSection', 'Stepone')
        navigate(DETAIL_ROUTE, { replace: true });
      } else if (result.userType === ENTITY) {
        sessionStorageSet('activeSection', 'Steptwo')
        navigate(DETAIL_ROUTE, { replace: true });
      } else if (result.userType === STAGWELL || result.userType === NETWORK) {
        navigate(DASHBOARD_ROUTE, { replace: true });
      }
    } catch (error) {

      console.log(error);
    } finally {
      setIsLoading(false);
    }

  };

  return <div className="loginWrap d-flex align-items-center justify-content-center">
    {/* <Toast msg={errMsg} /> */}
    
    {isLoading && <Loader />}
   
    <div className="loginBox">
    
      <div className="loginInfo d-flex align-items-center flex-column g-20 mb-2">
        <img src={logo} alt="" />
        <h3>Employee Stock Allocation</h3>
      </div>

      <div className="loginFooter d-flex align-items-center justify-content-center flex-column g-10 mt-3 mb-3">
        <button
          className="loginBtn d-flex align-items-center justify-content-center"
          onClick={login}
        >
          Login
        </button>
        { isUserAuthErr &&<Toast msg={errMsg}/> }
      </div>
    </div>
  </div>
  // }

}
