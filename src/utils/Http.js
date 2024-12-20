import { BASE_LOCAL_URL } from "../_constants/constants";
export const executeHttpCall = async (resource, method, body, token) => {
    console.log('Calling:', resource, 'Method:', method, 'Body:', body);
    let response = null;
    if (method === 'GET') {
        response = await fetch(BASE_LOCAL_URL + resource, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,  // Add token if needed
                'Content-Type': 'application/json'
            },
            credentials: 'include'  // This is important if your API uses cookies or sessions
        })
    } else if (method === 'POST') {
        response = await fetch(BASE_LOCAL_URL + resource,{
            body:JSON.stringify({...body}),
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,  // Add token if needed
                'Content-Type': 'application/json'
            },
            credentials: 'include'  // This is important if your API uses cookies or sessions
        })

    } else {
        response = null;

    }
    return response;

};