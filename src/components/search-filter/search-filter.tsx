import React from "react";
import { Input } from "antd";

interface Props {
  handleTyping: (query: string) => void;
}
const SearchFilter: React.FC<Props> = ({ handleTyping }) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTyping(e.target.value);
  };
  return (
    <>
      <Input
        className="search-filter"
        onChange={handleOnChange}
        placeholder={"Search for users"}
      />
    </>
  );
};

export default SearchFilter;
