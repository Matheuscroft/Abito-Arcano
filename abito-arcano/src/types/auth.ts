export interface AuthenticationDTO {
  login: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: string; // ou um union type com os valores possíveis, se souber
}
