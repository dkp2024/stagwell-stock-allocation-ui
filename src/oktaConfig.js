 export  const oktaConfig = {
    clientId: '0oalwkpwl0RMmqiW65d7',
    issuer: 'https://dev-94284605.okta.com/oauth2/default',
    redirectUri: window.location.origin + '/login/callback',
    scopes: ['openid', 'profile', 'email']  
  };