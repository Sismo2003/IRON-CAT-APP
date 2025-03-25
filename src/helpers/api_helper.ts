import axios from "axios";
import { jwtDecode } from "jwt-decode"; // o usa jwt.decode si usas jsonwebtoken
// import { api } from "../config";

axios.defaults.baseURL = "http://thegrid.myddns.me:3000";
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";


// Obtener token del localStorage
const getToken = () => {
  const authUser = localStorage.getItem('authUser');
  return authUser ? JSON.parse(authUser).token : null;
};

// Verificar si el token está expirado
const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode(token) as { exp: number };
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Función para renovar el token (llama a tu endpoint de renovación)
const renewToken = async () => {
  try {
    const response = await axios.post('/auth/refresh-token', {
      token: getToken(),
    });
    const newToken = response.data.token;
    localStorage.setItem('authUser', JSON.stringify({ token: newToken }));
    return newToken;
  } catch (error) {
    throw new Error('Error renovando token');
  }
};

// Interceptor para añadir token a cada petición
axios.interceptors.request.use(async (config) => {
  const token = getToken();
  
  if (token) {
    if (isTokenExpired(token)) {
      // Redirigir a login si el token está expirado
      localStorage.removeItem('authUser');
      // window.location.href = '/login';
      return Promise.reject('Token expirado');
    } else {
      // Renovar token si está activo (opcional, depende de tu lógica)
      const newToken = await renewToken();
      config.headers.Authorization = `Bearer ${newToken}`;
    }
  }
  return config;
});

// content type
const authUser: any = localStorage.getItem("authUser")
const token = JSON.parse(authUser) ? JSON.parse(authUser).token : null;
if (token)
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token: any) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url: any, params: any) => {
    let response;

    let paramKeys: any = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url: any, data: any) => {
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url: any, data: any) => {
    return axios.patch(url, data);
  };

  put = (url: any, data: any) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url: any, config: any) => {
    return axios.delete(url, { ...config });
  };
}
const getLoggedUser = () => {

  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedUser };