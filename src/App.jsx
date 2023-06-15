import { useState } from "react";
import SummaryForm from "./pages/summary/SummaryForm";
import Options from "./pages/entry/Options";

function App() {
  return (
    <div>
      <Options optionType="scoops"></Options>
      <SummaryForm />
    </div>
  );
}

export default App;
