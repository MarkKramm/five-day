import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/caveat/latin-500.css";
import "@fontsource/caveat/latin-700.css";
import "./index.css";
import App from "./App";
import { COLOR_VARS, LAYOUT, PRINT_LAYOUT } from "./constants";
import { handleResetParam } from "./lib/query";

/**
 * CSS colours and the polaroid width are injected from the single constants
 * file. This keeps design tokens editable in TypeScript and in the CSS.
 */
const root = document.documentElement;
Object.entries(COLOR_VARS).forEach(([name, value]) => {
  root.style.setProperty(name, value);
});
root.style.setProperty("--pw", LAYOUT.polaroidWidthCss);
root.style.setProperty("--polaroid-h", "calc(var(--pw) + 52px)");
root.style.setProperty("--app-max", `${LAYOUT.appMaxWidth}px`);
root.style.setProperty("--topbar-h", `${LAYOUT.topBarHeight}px`);
root.style.setProperty(
  "--printer-w",
  `calc(var(--pw) * ${PRINT_LAYOUT.printerWidthFactor})`,
);
root.style.setProperty(
  "--print-slot-w",
  `calc(var(--pw) + ${PRINT_LAYOUT.printerSlotExtraPx}px)`,
);
root.style.setProperty("--printer-h", PRINT_LAYOUT.printerHeightCss);
root.style.setProperty("--printer-compact-scale", `${PRINT_LAYOUT.compactScale}`);
root.style.setProperty("--print-heading-h", `${PRINT_LAYOUT.headingHeightPx}px`);
root.style.setProperty("--paper-lip", `${PRINT_LAYOUT.paperLipPx}px`);

if (!handleResetParam()) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
