export interface DataProps {
  id: string;
  output: string | null; // output of prediction
  expired?: boolean; // if the data is expired
  failed?: boolean; // if the prediction failed
  created_at: string;
}
