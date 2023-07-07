export default interface Account {
  id: string;
  index?: number;
  type?: "Cash" | "Debit Card" | "Credit Card";
  color?: string;
  value?: number;
}
