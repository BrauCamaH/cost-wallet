export default interface Account {
  id: string;
  type?: "Cash" | "Debit Card" | "Credit Card";
  color?: string;
  value?: number;
}
