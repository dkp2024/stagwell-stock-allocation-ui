import React from "react";

const Toast = (props) => {

    const style={

        textAlign:'center',
        color:'red'

    }
    return(
     <>
     <div style={style}>
        <p>{props.msg=='Failed to fetch'?'Internal Server Error':props.msg}</p>
     </div>
     </>);
}
export default Toast;