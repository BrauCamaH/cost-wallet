export default interface Account {
  id: string;
  name?: string;
  type?: "Cash" | "Debit Card" | "Credit Card";
  color?: string;
  value?: number;
}
