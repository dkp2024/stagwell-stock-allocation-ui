import React from "react";
import { components } from "react-select";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          onClick={() => props.selectOption(props.data)}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export default Option;
