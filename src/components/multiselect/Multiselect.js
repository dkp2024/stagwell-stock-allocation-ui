import React, { useState } from "react";
import Select, { components } from "react-select";
import './Multiselect.css'

const InputOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = "transparent";
  if (isFocused) bg = "#eee";
  if (isActive) bg = "#B2D4FF";

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "inherit",
    display: "flex "
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      <div className="d-flex g-10">
        <input type="checkbox" checked={isSelected} id="custom-checkbox" />
        {children}
      </div>
    </components.Option>
  );
};


const Multiselect = ({ placeholder, allOptions, onOptionsChange, defaultSelectedOptions, isSingleSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState(defaultSelectedOptions);

    // Handler for when options change
  const handleOptionsChange = (options) => {
    setSelectedOptions(options);
    isSingleSelect ? onOptionsChange(options.value) : onOptionsChange(options.map((opt) => opt.value)); // Pass selected options to parent
  };


  return (
    <>
      <Select
        defaultValue={selectedOptions} // Set the default selected options
        isMulti={isSingleSelect ? false: true}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        placeholder={placeholder}
        onChange={handleOptionsChange}
        options={allOptions}
        components={{
          Option: InputOption
        }}
      />
    </>
  );
};

export default Multiselect;
