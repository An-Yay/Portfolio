import React, { useReducer, createContext, useEffect, useContext, useRef } from "react";
import logo from './logo.svg';
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar/Navbar";
import Cursor from "./components/Cursor/Cursor";
import './App.scss';

export const store = createContext<any>(null);

// Create store provider to wrap subcomponents in

function App() {
  return (
    <div
        className="App"
        // onClick={hideContextMenu}
        // onMouseMove={(e) => setCursorLocation(e)}
        // onScroll={(e) => setCursorLocation(e)}
        // onMouseDown={(e) => setCursorAppearance(e)}
        // onMouseUp={(e) => setCursorAppearance(e)}
        // onContextMenu={(e) => toggleContextMenu(e)}
      >
        <Toaster />
        
        <Cursor />
        <Navbar />
       
      </div>
    
  );
}

export default App;
