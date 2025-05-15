import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider attribute="class" defaultTheme="system">
      <App />
    </ThemeProvider>
  </Provider>
);
