import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    const themeLink =
      document.getElementById("theme-link");

    if (themeLink) {

      themeLink.href = darkMode
        ? "https://unpkg.com/primereact/resources/themes/lara-dark-cyan/theme.css"
        : "https://unpkg.com/primereact/resources/themes/lara-light-cyan/theme.css";
    }

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};