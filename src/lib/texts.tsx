import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AppTexts } from "../types";

const TextContext = createContext<AppTexts | null>(null);

export function TextProvider({ texts, children }: { texts: AppTexts; children: ReactNode }) {
  return <TextContext.Provider value={texts}>{children}</TextContext.Provider>;
}

/** Returns owner-editable UI strings; a safe fallback keeps components usable. */
export function useTexts(): AppTexts {
  const texts = useContext(TextContext);
  if (!texts) throw new Error("useTexts must be used inside TextProvider");
  return texts;
}

export function fillText(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.split(`{${key}}`).join(String(value)),
    template,
  );
}
