export interface StrapiCustomer {
  id: number;
  documentId: string;
  email: string;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  customer?: StrapiCustomer;
}
