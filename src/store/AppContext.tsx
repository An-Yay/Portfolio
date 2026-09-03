import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

export type Theme = "light" | "dark";

export interface AppState {
  theme: Theme;
  /** Whether UI click sounds are enabled. Persisted. */
  sounds: boolean;
  /** True once the user has explicitly chosen a theme, so we stop following the OS. */
  themeIsExplicit: boolean;
  paletteOpen: boolean;
  menuOpen: boolean;
}

type Action =
  | { type: "theme/toggle" }
  | { type: "theme/set"; payload: Theme; explicit?: boolean }
  | { type: "sounds/toggle" }
  | { type: "sounds/set"; payload: boolean }
  | { type: "palette/open" }
  | { type: "palette/close" }
  | { type: "palette/toggle" }
  | { type: "menu/open" }
  | { type: "menu/close" }
  | { type: "menu/toggle" };

const STORAGE_KEY = "ananay.portfolio.prefs";

const initialState: AppState = {
  theme: "light",
  sounds: true,
  themeIsExplicit: false,
  paletteOpen: false,
  menuOpen: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "theme/toggle":
      return {
        ...state,
        theme: state.theme === "dark" ? "light" : "dark",
        themeIsExplicit: true,
      };
    case "theme/set":
      return {
        ...state,
        theme: action.payload,
        themeIsExplicit: action.explicit ?? state.themeIsExplicit,
      };
    case "sounds/toggle":
      return { ...state, sounds: !state.sounds };
    case "sounds/set":
      return { ...state, sounds: action.payload };
    case "palette/open":
      return { ...state, paletteOpen: true, menuOpen: false };
    case "palette/close":
      return { ...state, paletteOpen: false };
    case "palette/toggle":
      return { ...state, paletteOpen: !state.paletteOpen, menuOpen: false };
    case "menu/open":
      return { ...state, menuOpen: true };
    case "menu/close":
      return { ...state, menuOpen: false };
    case "menu/toggle":
      return { ...state, menuOpen: !state.menuOpen };
    default:
      return state;
  }
}

/** Reads persisted prefs, falling back to the OS colour-scheme preference. */
function readInitialState(): AppState {
  if (typeof window === "undefined") return initialState;

  let stored: Partial<AppState> = {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) stored = JSON.parse(raw) as Partial<AppState>;
  } catch {
    // Corrupt or unavailable storage: fall through to defaults.
  }

  const prefersDark =
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;

  return {
    ...initialState,
    theme: stored.theme ?? (prefersDark ? "dark" : "light"),
    sounds: stored.sounds ?? true,
    themeIsExplicit: stored.themeIsExplicit ?? false,
  };
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  isDark: boolean;
  toggleTheme: () => void;
  toggleSounds: () => void;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, readInitialState);

  // Reflect the theme onto <html> so tokens and native UI both pick it up.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root
      .querySelector?.("meta[name='theme-color']")
      ?.setAttribute("content", state.theme === "dark" ? "#0a0a0a" : "#ffffff");
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", state.theme === "dark" ? "#0a0a0a" : "#ffffff");
  }, [state.theme]);

  // Persist only the durable prefs, never transient UI state.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          theme: state.theme,
          sounds: state.sounds,
          themeIsExplicit: state.themeIsExplicit,
        })
      );
    } catch {
      // Storage full or blocked — preferences just won't survive reload.
    }
  }, [state.theme, state.sounds, state.themeIsExplicit]);

  // Follow the OS until the user makes an explicit choice.
  useEffect(() => {
    if (state.themeIsExplicit) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) =>
      dispatch({ type: "theme/set", payload: e.matches ? "dark" : "light" });
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [state.themeIsExplicit]);

  const toggleTheme = useCallback(
    () => dispatch({ type: "theme/toggle" }),
    []
  );
  const toggleSounds = useCallback(
    () => dispatch({ type: "sounds/toggle" }),
    []
  );
  const openPalette = useCallback(() => dispatch({ type: "palette/open" }), []);
  const closePalette = useCallback(
    () => dispatch({ type: "palette/close" }),
    []
  );
  const togglePalette = useCallback(
    () => dispatch({ type: "palette/toggle" }),
    []
  );
  const closeMenu = useCallback(() => dispatch({ type: "menu/close" }), []);
  const toggleMenu = useCallback(() => dispatch({ type: "menu/toggle" }), []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      dispatch,
      isDark: state.theme === "dark",
      toggleTheme,
      toggleSounds,
      openPalette,
      closePalette,
      togglePalette,
      closeMenu,
      toggleMenu,
    }),
    [
      state,
      toggleTheme,
      toggleSounds,
      openPalette,
      closePalette,
      togglePalette,
      closeMenu,
      toggleMenu,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
