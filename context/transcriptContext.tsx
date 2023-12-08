import React, { createContext, useContext, useState, useEffect } from "react";

export const TranscriptContext = createContext(null);

export const TranscriptProvider = ({ children }) => {
  return (
    <TranscriptContext.Provider value={{}}>
      {children}
    </TranscriptContext.Provider>
  );
};
