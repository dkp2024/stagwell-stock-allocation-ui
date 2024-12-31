export const STEP = {
    STEPONE: "stepOne",
    STEPTWO: "stepTwo",
    STEPTHREE: "stepThree",
    STEPFOUR: "stepFour",
    STEPFIVE: "stepFive"
}

//route costants
export const LOGIN_ROUTE = '/';
export const DASHBOARD_ROUTE = '/dashboard';
export const DETAIL_ROUTE = '/detail';
//string constants
export const AGENCY = 'AGENCY';
export const ENTITY = 'ENTITY';
export const STAGWELL = 'STAGWELL';
export const NETWORK = 'NETWORK';
const env = process.env;
console.log("APP ENV: ", env); 
//api constants
export const API_BASE_URL =  process.env.NODE_ENV==='production'?'http://localhost:8081/stagwell/':'http://localhost:8081/stagwell/'