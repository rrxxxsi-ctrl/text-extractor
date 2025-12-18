export interface ExtractionState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
}

export interface ProfileConfig {
  name: string;
  image: string;
  phone: string;
  email: string;
}
