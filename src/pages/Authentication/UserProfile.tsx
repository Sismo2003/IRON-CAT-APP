import React, { useState, useEffect, useMemo } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect';
import BreadCrumb from "Common/BreadCrumb";
import withRouter from "Common/withRouter";
import { editProfile } from "slices/thunk";

// Interfaces para tipado
interface AppUser {
  email: string;
  username: string;
  uid: number;
  id: number;
  img: string;
}

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  idx: number;
}

interface ProfileState {
  user: AppUser | null;
  error: any;
  success: boolean;
}

// Componente FormInput independiente
const FormInput = ({ 
  label, 
  name, 
  type, 
  placeholder, 
  required = false,
  value,
  onChange,
  onBlur,
  touched,
  error
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  value: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  touched: boolean;
  error?: string;
}) => (
  <div>
    <label className="inline-block mb-2 text-base font-medium">
      {label}
    </label>
    <input
      name={name}
      className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      required={required}
    />
    {touched && error && (
      <div className="mt-1 text-sm text-red-500">
        {error}
      </div>
    )}
  </div>
);

// Componente UserInfoCard independiente
const UserInfoCard = ({ userData }: { userData: AppUser | null }) => (
  <div className="card">
    <div className="card-body">
      <div className="flex gap-3 items-center">
        <div className="flex-shrink-0">
          <img
            src={userData?.img || '/assets/images/users/avatar-1.jpg'}
            alt="Perfil de usuario"
            className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-zink-600 shadow-sm"
          />
        </div>
        <div className="text-slate-500 dark:text-zink-200">
          <h5 className="text-lg font-medium text-slate-500">{userData?.username || 'Usuario'}</h5>
          <p className="mb-1 text-sm">{userData?.email || 'correo@ejemplo.com'}</p>
          <p className="mb-0 text-xs text-slate-400 dark:text-zink-400">ID: {userData?.uid || '000'}</p>
        </div>
      </div>
    </div>
  </div>
);

// Componente principal
const UserProfile = () => {
  // Configuración inicial
  document.title = "Perfil | Iron Cat Recicladora";
  const dispatch = useDispatch<any>();

  // Selector de Redux con tipado claro
  const selectProfileState = createSelector(
    (state: any) => state.Profile,
    (profile): ProfileState => ({
      user: profile.user,
      error: profile.error,
      success: profile.success
    })
  );

  // Estado y efectos
  const { user: reduxUser, error, success } = useSelector(selectProfileState);
  const [localUser, setLocalUser] = useState<AppUser | null>(null);

  // Helpers para manejo de datos
  const isUserEmpty = (user: any): boolean => {
    return !user || (typeof user === 'object' && Object.keys(user).length === 0);
  };

  const parseUserFromStorage = (storedUser: string): AppUser | null => {
    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.email && !parsedUser.username && !parsedUser.uid) {
        console.warn("Datos de usuario incompletos en localStorage");
        return null;
      }
      return {
        email: parsedUser.email || '',
        username: parsedUser.username || parsedUser.email?.split('@')[0] || 'Usuario',
        uid: parsedUser.uid || 0,
        id: parsedUser.id || 0,
        img: parsedUser.img || '/assets/images/users/avatar-1.jpg'
      };
    } catch (e) {
      console.error("Error al parsear usuario", e);
      return null;
    }
  };

  // Efecto para cargar datos del usuario
  useEffect(() => {
    if (isUserEmpty(reduxUser)) {
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        const parsedUser = parseUserFromStorage(storedUser);
        if (parsedUser) setLocalUser(parsedUser);
      }
    }
  }, [reduxUser]);

  // Datos combinados del usuario
  const userData = isUserEmpty(reduxUser) ? localUser : reduxUser;

  // Configuración de Formik
  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      username: userData?.username || '',
      email: userData?.email || '',
      password: '',
      confirmPassword: '',
      idx: userData?.uid || 0
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .required("Ingresa tu Usuario")
        .min(3, "Mínimo 3 caracteres"),
      email: Yup.string()
        .email("Correo inválido")
        .required("Ingresa tu correo"),
      password: Yup.string()
        .min(6, "Mínimo 6 caracteres")
        .test(
          'password-required-if-confirm',
          'Ingresa tu contraseña',
          function(value) {
            return !this.parent.confirmPassword || !!value;
          }
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], "Las contraseñas no coinciden")
        .test(
          'confirm-required-if-password',
          'Confirma tu contraseña',
          function(value) {
            return !this.parent.password || !!value;
          }
        ),
    }),
    onSubmit: (values: FormValues) => {
      if (!values.idx) {
        console.error("ID de usuario no válido");
        return;
      }

      const profileData = {
        username: values.username,
        idx: values.idx,
        ...(values.password && { password: values.password }),
        ...(values.email && { email: values.email })
      };

      dispatch(editProfile(profileData));
    }
  });

  // Efecto para manejo de errores
  useEffect(() => {
    if (error) {
      console.error("Error en perfil:", error);
    }
  }, [error]);

  return (
    <React.Fragment>
      <div className="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">
        <BreadCrumb title="Editar Usuario" pageTitle="Usuario" />

        <div className="row">
          <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-1">
            {/* Mensajes de estado */}
            {success && (
              <div className="px-4 py-3 mb-3 text-sm text-green-500 border border-green-200 rounded-md bg-green-50 dark:bg-green-400/20 dark:border-green-500/50">
                Se actualizó con <b>éxito</b> el perfil del usuario.
              </div>
            )}
            {error && (
              <div className="px-4 py-3 mb-3 text-sm text-red-500 border border-red-200 rounded-md bg-red-50 dark:bg-red-400/20 dark:border-red-500/50">
                Error al actualizar el perfil: {error.message || "Error desconocido"}
              </div>
            )}

            <UserInfoCard userData={userData} />
          </div>
        </div>

        <h5 className="mb-4">Datos generales</h5>

        <div className="card">
          <div className="card-body">
            <form className="form-horizontal" onSubmit={formik.handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="Nombre de usuario"
                  name="username"
                  type="text"
                  placeholder="Ingrese el nombre del usuario"
                  required
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={!!formik.touched.username}
                  error={formik.errors.username}
                />

                <FormInput
                  label="Correo"
                  name="email"
                  type="email"
                  placeholder="Ingresa tu correo, ejem: user@gmail.com"
                  required
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={!!formik.touched.email}
                  error={formik.errors.email}
                />

                <FormInput
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="Ingresa tu contraseña (dejar vacío para no cambiar)"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={!!formik.touched.password}
                  error={formik.errors.password}
                />

                <FormInput
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmar tu contraseña"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={!!formik.touched.confirmPassword}
                  error={formik.errors.confirmPassword}
                />
              </div>

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="px-2 py-1.5 text-xs text-white btn bg-red-500 hover:text-white hover:bg-red-600 focus:text-white focus:bg-red-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:ring active:ring-custom-100 dark:bg-red-500/20 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:focus:bg-red-500 dark:focus:text-white dark:active:bg-red-500 dark:active:text-white dark:ring-red-400/20"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Actualizando...' : 'Actualizar usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);