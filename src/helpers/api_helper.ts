import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ENV_MODE : any = process.env.REACT_APP_MODE;

if(ENV_MODE === "dev") {
  axios.defaults.baseURL = process.env.REACT_APP_API_DEV;
}else if(ENV_MODE === "production") {
  axios.defaults.baseURL = process.env.REACT_APP_API_PROD;
}else {
  axios.defaults.baseURL = process.env.REACT_APP_API_LOCAL;
}

axios.defaults.headers.post["Content-Type"] = "application/json";

// Obtener token del localStorage
const getToken = () => {
  const authUser = localStorage.getItem('authUser');
  return authUser ? JSON.parse(authUser).token : null;
};

// // Redirigir al login
// const redirectToLogin = () => {
//   localStorage.removeItem('authUser');
//   window.location.href = '/login';
// };

// Configurar el token inicial
const token = getToken();
if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

// Interceptor de solicitudes simplificado
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas (mantenemos el original)
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    let message;
    switch (error.response?.status) {
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
 * Establece la autorización por defecto
 * @param {*} token
 */
const setAuthorization = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

class APIClient {
  /**
   * Obtiene datos de la URL proporcionada
   */
  get = (url: string, params?: any) => {
    let response;
    let paramKeys: string[] = [];

    if (params) {
      Object.keys(params).forEach(key => {
        paramKeys.push(key + '=' + params[key]);
      });

      const queryString = paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };

  /**
   * Envía datos a la URL proporcionada
   */
  create = (url: string, data: any) => {
    return axios.post(url, data);
  };

  /**
   * Actualiza datos
   */
  update = (url: string, data: any) => {
    return axios.patch(url, data);
  };

  /**
   * Actualiza todos los datos (PUT)
   */
  put = (url: string, data: any) => {
    return axios.put(url, data);
  };

  /**
   * Elimina un recurso
   */
  delete = (url: string, config?: any) => {
    return axios.delete(url, { ...config });
  };
}

/**
 * Obtiene el usuario autenticado del localStorage
 */
const getLoggedUser = () => {
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

export { APIClient, setAuthorization, getLoggedUser };