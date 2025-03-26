/* eslint-disable @typescript-eslint/no-explicit-any */
const formatValue = (value: any) => {
  if (value === undefined || value === null) {
    return '0';
  }
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseValue = (value: any) => {
  return value ? value.toString().replace(/\./g, '') : '';
};

const handleKeyPress = (e: any) => {
  const charCode = e.which ? e.which : e.keyCode;
  if (
    (charCode >= 48 && charCode <= 57) || // 0-9
    charCode === 46 // .
  ) {
    return true;
  }
  e.preventDefault();
  return false;
};

export { formatValue, parseValue, handleKeyPress };
