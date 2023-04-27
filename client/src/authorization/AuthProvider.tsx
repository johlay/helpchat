import axios from "axios";
import { ReactNode, createContext, useContext, useState } from "react";

const base_url = "http://localhost:8000";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type NewUser = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type User = {
  data: {
    access_token: string;
  };
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export interface AuthResponseSuccess {
  data: NewUser | User;
  message: string;
  status: number;
}

export interface AuthResponseError {
  data: null;
  message: string;
  status: number;
}

type Context = {
  login: (
    userInformation: LoginCredentials
  ) => Promise<AuthResponseError | AuthResponseSuccess>;
  register: (
    userInformation: NewUser
  ) => Promise<AuthResponseError | AuthResponseSuccess>;
};

const AuthContext = createContext<Context>({} as Context);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  /**
   * login an user
   * @param userInformation - input of type "User"
   * @returns an object containing information on user's authentication status
   */
  const login = async (
    userInformation: LoginCredentials
  ): Promise<AuthResponseError | AuthResponseSuccess> => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/login`,
        userInformation
      );

      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          data: null,
          message: error.response.data.message,
          status: error.response.status,
        };
      } else {
        return {
          data: null,
          message: "Bad Gateway error",
          status: 502,
        };
      }
    }
  };

  /**
   * register a new user
   * @param userInformation - input of type "User"
   * @returns an object containing information on the newly registered user.
   */
  const register = async (
    userInformation: NewUser
  ): Promise<AuthResponseError | AuthResponseSuccess> => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/register`,
        userInformation
      );

      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          data: null,
          message: error.response.data.message,
          status: error.response.status,
        };
      } else {
        return {
          data: null,
          message: "Bad Gateway error",
          status: 502,
        };
      }
    }
  };
  return (
    <AuthContext.Provider value={{ login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
