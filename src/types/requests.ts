export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
}

export interface RegisterRequestBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LogoutOptions {
  cookieHeader?: string;
}
