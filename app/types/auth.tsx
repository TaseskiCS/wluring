export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
}

export interface AuthToken {
  token: string;
  isValid: boolean;
}
