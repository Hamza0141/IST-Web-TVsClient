import React from "react";
import { Routes, Route } from "react-router-dom";
import DisplaySelectorPage from "./pages/DisplaySelectorPage";
import DisplayPage from "./pages/DisplayPage";
import ScreenNotFoundPage from "./pages/ScreenNotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DisplaySelectorPage />} />
      <Route path="/display/:screenCode" element={<DisplayPage />} />
      <Route path="*" element={<ScreenNotFoundPage />} />
    </Routes>
  );
}