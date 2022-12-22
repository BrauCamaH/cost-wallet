export default interface Account {
  id: string;
  name?: string;
  type?: "Cash" | "Debit Card" | "Credit Card";
  initialValue?: number;
  color?: string;
  value?: number
}
