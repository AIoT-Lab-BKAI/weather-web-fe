import "@ant-design/v5-patch-for-react-19";
import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigurationError } from "./components/error/configuration-error";
import "./css/index.css";

const root = createRoot(document.getElementById("root")!);

const App = lazy(async () => {
  const module = await import("./app");
  return { default: module.App };
});

async function main() {
  try {
    await import("./config/env.client");
  }
  catch (e) {
    root.render(
      <ConfigurationError
        message="Environment configuration error"
      />,
    );
    throw e;
  }

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

main();
