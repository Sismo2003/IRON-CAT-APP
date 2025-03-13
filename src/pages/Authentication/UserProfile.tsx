import React, { useState, useEffect } from "react";

// Formik Validation
import * as Yup from "yup";
import { useFormik as useFormic } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import userProfile from "assets/images/users/user-profile.png";

import { createSelector } from 'reselect';
import BreadCrumb from "Common/BreadCrumb";
import withRouter from "Common/withRouter";
import { editProfile } from "slices/thunk";

const UserProfile = () => {

  //meta title
  document.title = "Perfil | Iron Cat Recicladora";

  const dispatch = useDispatch<any>();

  const [email, setEmail] = useState<string>("ikerFamoso1260@gmail.com");
  const [name, setName] = useState<string>('Iker Famoso');
  const [idx, setIdx] = useState<number>(1);

  const selectProperties = createSelector(
    (state: any) => state.Profile,
    (profile) => ({
      user: profile.user,
      error: profile.error,
      success: profile.success
    })
  );

  const { error, success, user } = useSelector(selectProperties);

  useEffect(() => {
    if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
      setEmail(user.email)
      setName(user.username);
      setIdx(user.uid)
    } else if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      setEmail(user.email)
      setName(user.username);
      setIdx(user.uid)
    }
  }, [user]);

  const validation = useFormic({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true, 

    initialValues: {
      username: name || 'admin',
      idx: idx || 1, 
      email: name || '',
      
      password: name || '',
      
      confirmPassword: name || '',
      



    },
    validationSchema: Yup.object({
      username: Yup.string().required("Ingresa tu Usuario"),
      email: Yup.string().required("Ingresa tu correo"),
      password: Yup.string().required("Ingresa tu contraseña"),
      confirmPassword: Yup.string().required("Confirma tu contraseña"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    }
  });

  return (
    <React.Fragment>
      <div className="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">
        {/* Render Breadcrumb */}
        <BreadCrumb title="Editar Usuario" pageTitle="Usuario" />

        <div className="row">
          <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-1">
            {success && <div className="px-4 py-3 mb-3 text-sm text-green-500 border border-green-200 rounded-md bg-green-50 dark:bg-green-400/20 dark:border-green-500/50" id="successAlert">
              Se actualizo con <b>exito</b> el perfil del usuario.
            </div>}
            {error && <div className="px-4 py-3 mb-3 text-sm text-red-500 border border-red-200 rounded-md bg-red-50 dark:bg-red-400/20 dark:border-red-500/50" id="successAlert">
              Error <b>desconocido</b> al ajustar el perfil.
            </div>}


            <div className="card">
              <div className="card-body">
                <div className="flex gap-3">
                  <div>
                    <img
                      src={userProfile}
                      alt=""
                      className="avatar-md rounded-circle img-thumbnail"
                    />
                  </div>
                  <div className="text-slate-500 dark:text-zink-200">
                    <h5 className="text-slate-500">{name || "admin"}</h5>
                    <p className="mb-1">{email || "admin@gmail.com"}</p>
                    <p className="mb-0">Id no: #{idx || 1}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h5 className="mb-4">Datos generales</h5>

        <div className="card">
          <div className="card-body">
            <form
              className="form-horizontal"
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
            {
              //<div> class="flex flex-col-reverse..."
              //<div>01</div>
              //<div>02</div>
              //<div>03</div>
              //<div>04</div>
              //</div>
            }
            
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nombre de usuario */}
              <div>
                <label className="inline-block mb-2 text-base font-medium">Nombre de usuario</label>
                <input
                  name="username"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Ingrese el nombre del usuario"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.username || ""}
                />
                {validation.touched.username && validation.errors.username ? (
                  <div className="mt-1 text-sm text-red-500">{validation.errors.username}</div>
                ) : null}
              </div>

              {/* Correo */}
              <div>
                <label className="inline-block mb-2 text-base font-medium">Correo</label>
                <input
                  name="email"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Ingresa tu correo, ejem: user@gmail.com"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.email || ""}
                />
                {validation.touched.email && validation.errors.email ? (
                  <div className="mt-1 text-sm text-red-500">{validation.errors.email}</div>
                ) : null}
              </div>

              {/* Contraseña */}
              <div>
                <label className="inline-block mb-2 text-base font-medium">Contraseña</label>
                <input
                  name="password"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Ingresa tu contraseña o Crea tu contraseña"
                  type="password"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.password || ""}
                />
                {validation.touched.password && validation.errors.password ? (
                  <div className="mt-1 text-sm text-red-500">{validation.errors.password}</div>
                ) : null}
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="inline-block mb-2 text-base font-medium">Confirmar contraseña</label>
                <input
                  name="confirmPassword"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Confirmar tu contraseña"
                  type="password"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.confirmPassword || ""}
                />
                {validation.touched.confirmPassword && validation.errors.confirmPassword ? (
                  <div className="mt-1 text-sm text-red-500">{validation.errors.confirmPassword}</div>
                ) : null}
              </div>
            </div>


              <div className="text-center mt-4">
                <button type="submit" className="px-2 py-1.5 text-xs text-white btn bg-red-500 hover:text-white hover:bg-red-600 focus:text-white focus:bg-red-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:ring active:ring-custom-100 dark:bg-red-500/20 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:focus:bg-red-500 dark:focus:text-white dark:active:bg-red-500 dark:active:text-white dark:ring-red-400/20">
                  Actualizar usuario
                </button>
            
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment >
  );
};

export default withRouter(UserProfile);