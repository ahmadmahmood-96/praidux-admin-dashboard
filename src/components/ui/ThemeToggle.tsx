import { Switch } from "antd";
import { useTheme } from "../../context/themeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ marginTop: 4, marginRight: 18 }}>
      <Switch
        checkedChildren="🌙"
        unCheckedChildren="☀️"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
    </div>
  );
};

export default ThemeToggle;
