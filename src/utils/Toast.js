import React from "react";

const Toast = (props) => {

    const style={

        textAlign:'center'

    }
    return(
     <>
     <div style={style}>
        <p>{props.msg}</p>
     </div>
     </>);
}
export default Toast;