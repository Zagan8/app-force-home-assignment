import React from "react";
import { Input } from "antd";

interface Props {
  handleTyping: (query: string) => void;
}
const SearchFilter: React.FC<Props> = ({ handleTyping }) => {
  return (
    <>
      <Input
        onChange={(e) => {
          handleTyping(e.target.value);
        }}
        placeholder={"Search for users"}
        style={{ width: "300px" }}
      />
    </>
  );
};

export default SearchFilter;
