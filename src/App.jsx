import SummaryForm from "./pages/summary/SummaryForm";
import Options from "./pages/entry/Options";
import { Container } from "react-bootstrap";
import { OrderDetailsProvider } from "./contexts/OrederDetails";

function App() {
  return (
    <Container>
      <OrderDetailsProvider>
        <Options optionType="scoops"></Options>
      </OrderDetailsProvider>
      <SummaryForm />
    </Container>
  );
}

export default App;
