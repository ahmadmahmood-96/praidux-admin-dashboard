import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";

import {
  ConfigProvider,
  theme as antdTheme,
  message,
  notification,
} from "antd";
import App from "./App.tsx";
import './index.css'
import "./styles/index.less";
import { ThemeProvider, useTheme } from "./context/themeContext.tsx";

const Root = () => {
  const { theme } = useTheme();

  const algorithm =
    theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  message.config({
    duration: 3.5,
    maxCount: 1,
  });

  notification.config({
    duration: 4.5,
    placement: "topRight",
    maxCount: 2,
  });

  return (
    <ConfigProvider
      theme={{
        algorithm,
        token: {
          colorPrimary: "#3498DB",
          fontFamily: "Albert Sans",
          borderRadius: 6,
          borderRadiusLG: 5,
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IntlProvider locale="en" defaultLocale="en">
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </IntlProvider>
  </React.StrictMode>
);
