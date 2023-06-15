import SummaryForm from "./SummaryForm";
import { useOrderDetails } from "../../contexts/OrederDetails";
import { formatCurrency } from "../../utilitues";

function OrderSummary(props) {
  const { totals, optionCounts } = useOrderDetails();

  const scoopArray = Object.entries(optionCounts.scoops);
  const scoopList = scoopArray.map(([key, value]) => (
    <li key={key}>
      {value} {key}
    </li>
  ));

  const toppingArray = Object.keys(optionCounts.toppings);
  const toppingList = toppingArray.map((key) => <li key={key}>{key}</li>);

  return (
    <div>
      <h1>OrderSummary</h1>
      <h2>Scoops: {formatCurrency(totals.scoops)}</h2>
      {scoopList}
      <h2>Toppings: {formatCurrency(totals.toppings)}</h2>
      {toppingList}
      <SummaryForm />
    </div>
  );
}

export default OrderSummary;
