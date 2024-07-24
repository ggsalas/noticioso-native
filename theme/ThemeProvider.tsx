import { useState, createContext, ReactNode, useContext } from "react";
import { Theme, getTheme } from "./theme";
import { useColorScheme } from "react-native";

type ThemeContextType = {
  theme: Theme;
  changeFontSize?: (action: "increase" | "decrease") => void;
};

export const DEFAULT_FONT_SIZE = 16;

export const ThemeContext = createContext<ThemeContextType>({
  theme: getTheme(DEFAULT_FONT_SIZE),
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [baseFontSize, setBaseFontSize] = useState(DEFAULT_FONT_SIZE);
  const [theme, setTheme] = useState(getTheme(baseFontSize, colorScheme));

  const changeFontSize = (action: "increase" | "decrease") => {
    if (action === "increase") {
      setBaseFontSize(baseFontSize + 2);
      setTheme(getTheme(baseFontSize + 2, colorScheme));
    } else {
      setBaseFontSize(baseFontSize - 2);
      setTheme(getTheme(baseFontSize - 2, colorScheme));
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
