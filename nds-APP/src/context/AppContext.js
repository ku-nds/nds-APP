import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [position, setPosition] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);

  return (
    <AppContext.Provider value={{ 
      weatherData, 
      setWeatherData, 
      position, 
      setPosition,
      userPreferences,
      setUserPreferences,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// 다른 컴포넌트에서 쉽게 쓰기 위한 훅
export const useAppContext = () => useContext(AppContext);
