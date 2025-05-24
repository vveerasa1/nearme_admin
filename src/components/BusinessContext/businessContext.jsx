import React, { createContext, useState } from "react";

export const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businessList, setBusinessList] = useState([]);
  const [searchText, setSearchText] = useState("");

  return (
    <BusinessContext.Provider
      value={{ businessList, setBusinessList, searchText, setSearchText }}
    >
      {children}
    </BusinessContext.Provider>
  );
};
