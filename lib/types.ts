export interface DataProps {
  id: string;
  output: string | null; // output of prediction
  failed?: boolean; // if the prediction failed
  created_at: string;
}
