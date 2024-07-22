export interface ILoginProps {
  title: string;
  description: string;
  buttonText: string;
  input: ILoginInput;
  onLogin: (input: ILoginInput) => Promise<void>;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
}
