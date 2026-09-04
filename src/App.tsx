import { Toaster } from "react-hot-toast";
import { AppProvider } from "./store/AppContext";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Experience from "./components/Experience/Experience";
import Work from "./components/Work/Work";
import Skills from "./components/Skills/Skills";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import CommandPalette from "./components/CommandPalette/CommandPalette";
import ContextMenu from "./components/ContextMenu/ContextMenu";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import Cursor from "./components/Cursor/Cursor";
import ScrollProgress from "./components/ui/ScrollProgress";
import AmbientBackground from "./components/ui/AmbientBackground";
import "./styles/global.scss";

export default function App() {
  return (
    <AppProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <AmbientBackground />
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <CommandPalette />
      <ContextMenu />
      <ThemeToggle />

      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Work />
        <Skills />
        <Contact />
      </main>

      <Footer />

      <div className="grain" aria-hidden="true" />

      <Toaster
        position="bottom-center"
        toastOptions={{ duration: 3200 }}
        containerStyle={{ zIndex: 600 }}
      />
    </AppProvider>
  );
}
