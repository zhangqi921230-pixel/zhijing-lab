import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { Sun, Moon } from "lucide-react";
import "./Theme.css";
export const THEME_KEY = "zhijing:appearance:v1";
const ThemeContext = createContext({ theme: "light", setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* Private browsing may disable storage. */
    }
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="theme-switch" role="group" aria-label="页面外观">
      {[
        ["light", "浅色", Sun],
        ["dark", "深色", Moon],
      ].map(([id, label, Icon]) => (
        <button
          key={id}
          aria-pressed={theme === id}
          onClick={() => setTheme(id)}
        >
          <Icon size={15} />
          {label}
        </button>
      ))}
    </div>
  );
}
export const panelHeading = (subject) =>
  ({ math: "图形与变量", geography: "观察与设置", biology: "观察与操作" })[
    subject
  ] ?? "实验条件";
