import axios from "axios";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = "http://thegrid.myddns.me:3000"; // production
// axios.defaults.baseURL = "http://localhost:3000"; // development
axios.defaults.headers.post["Content-Type"] = "application/json";

// Obtener token del localStorage
const getToken = () => {
  const authUser = localStorage.getItem('authUser');
  return authUser ? JSON.parse(authUser).token : null;
};

// Verificar si el token está expirado
const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (error) {
    return true;
  }
};

// Verificar si el token está cerca de expirar (5 minutos)
const isTokenCloseToExpire = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000;
    return decoded.exp < (now + 300); // 300 segundos = 5 minutos
  } catch (error) {
    return false;
  }
};

// Función para renovar el token
const renewToken = async () => {
  const currentToken = getToken();
  if (!currentToken) throw new Error('No token available');
  
  const response = await axios.post('/auth/refresh-token', {
    token: currentToken,
  });
  
  const newToken = response.data.token;
  const authUser = localStorage.getItem('authUser');
  const userData = authUser ? JSON.parse(authUser) : {};
  
  localStorage.setItem('authUser', JSON.stringify({ ...userData, token: newToken }));
  setAuthorization(newToken);
  return newToken;
};

// Redirigir al login
const redirectToLogin = () => {
  // Aquí puedes implementar tu lógica de redirección
  localStorage.removeItem('authUser');
  window.location.href = '/login'; // Ajusta según tu ruta de login
};

// Configurar el token inicial
const token = getToken();
if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

// Interceptor de solicitudes para manejar la renovación del token
axios.interceptors.request.use(
  async (config) => {
    const token = getToken();
    
    if (token) {
      if (isTokenExpired(token)) {
        // Token expirado - redirigir al login
        redirectToLogin();
        return Promise.reject(new Error('Token expired'));
      }
      
      if (isTokenCloseToExpire(token)) {
        try {
          const newToken = await renewToken();
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          // Si falla la renovación, redirigir al login
          redirectToLogin();
          return Promise.reject(error);
        }
      }
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
        // Opcional: podrías redirigir al login aquí también
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