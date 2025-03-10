import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
// import Flatpickr from 'react-flatpickr';
import BreadCrumb from "Common/BreadCrumb";
// import Select from 'react-select';

// react-redux
import { useDispatch /*, useSelector */} from 'react-redux';
// import { createSelector } from 'reselect';

// Icon
import { /*Penci, l*/ UploadCloud } from 'lucide-react';

// Dropzone
import Dropzone from "react-dropzone";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import {
    addShopProductList as onAddProductList,
    updateShopProductList as onUpdateProductList
} from 'slices/thunk';

// const codigo_producto : string = "CODIGO_AQUI_DB";

const AddNew = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mode, data } = location.state || { mode: "create", data: null };
    interface FileWithPreview {
        name: string;
        size: number;
        type: string;
        priview: string;
        formattedSize: string;
    }

    const dispatch = useDispatch<any>();

    const [selectfiles, setSelectfiles] = useState<FileWithPreview[]>([]);
    const [eventData, setEventData] = useState<any>(mode === "edit" ? data : null);


    const formatBytes = (bytes: any, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const handleAcceptfiles = (files: File[]) => {
        const file = files[0]; // Solo tomamos el primer archivo
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const base64 = reader.result as string; // Convertir a base64
    
                // Crear el objeto con la estructura correcta
                const fileWithPreview: FileWithPreview = {
                    ...file,
                    priview: base64,
                    formattedSize: formatBytes(file.size),
                };

                validation.setFieldValue('img', e.target.result);

                // Actualizar el estado con la imagen en base64
                setSelectfiles([fileWithPreview]);
                
            };
            reader.readAsDataURL(file); // Leer el archivo como base64
        }
    };

    useEffect(() => {
        if (mode === "edit" && data.img) {
            const fileWithPreview = {
                name: "imagen.jpg",
                size: 0,
                type: "image/jpeg",
                priview: data.img,
                formattedSize: "0 Bytes",
            };
            setSelectfiles([fileWithPreview]);
        }
    }, [mode, data]);

    // validation
    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            material: (eventData && eventData.material) || '',
            wholesale_price_buy: (eventData && eventData.wholesale_price_buy) || '',
            wholesale_price_sell: (eventData && eventData.wholesale_price_sell) || '',
            retail_price_buy: (eventData && eventData.retail_price_buy) || '',
            retail_price_sell: (eventData && eventData.retail_price_sell) || '',
            client_id: (eventData && eventData.client_id) || '',
            img: (eventData && eventData.img) || null, // Incluir la imagen en los valores iniciales
        },
        validationSchema: Yup.object({
            material: Yup.string().required("Por favor ingresa el nombre del material"),
            wholesale_price_buy: Yup.number(),
            wholesale_price_sell: Yup.number(),
            retail_price_buy: Yup.number(),
            retail_price_sell: Yup.number(),
            img: Yup.mixed()
                .required("Por favor selecciona una imagen")
                .test("fileSize", "La imagen es demasiado grande", (value) => {
                    if (typeof value === "string") {
                        // Calcular el tamaño en bytes de la cadena base64
                        const base64Length = value.length - (value.indexOf(",") + 1);
                        const padding = value.charAt(value.length - 2) === "=" ? 2 : value.charAt(value.length - 1) === "=" ? 1 : 0;
                        const sizeInBytes = (base64Length * 3) / 4 - padding;
        
                        // Limitar el tamaño a 5MB (en bytes)
                        return sizeInBytes <= 5 * 1024 * 1024;
                    }
                    return false; // Si no es una cadena base64, no es válido
                })
                .test("fileType", "Formato de imagen no válido", (value) => {
                    if (typeof value === "string") {
                        // Verificar el tipo de imagen basado en el prefijo de la cadena base64
                        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
                        const prefix = value.split(";")[0].split(":")[1];
                        return validTypes.includes(prefix);
                    }
                    return false; // Si no es una cadena base64, no es válido
                }),
        }),
        onSubmit: (values) => {
            const newData = {
                ...values,
                wholesale_price_buy: parseFloat(values.wholesale_price_buy),
                retail_price_buy: parseFloat(values.retail_price_buy),
                wholesale_price_sell: parseFloat(values.wholesale_price_sell),
                retail_price_sell: parseFloat(values.retail_price_sell),
            };

            if (mode === "edit") {
                console.log("Actualizando producto:", newData);
                dispatch(onUpdateProductList({ id: data.id, ...newData })).then(() => {
                    navigate("/apps-materials-product-list");
                });
            } else {
                console.log("Creando nuevo producto:", newData);
                dispatch(onAddProductList(newData)).then(() => {
                    navigate("/apps-materials-product-list");
                });
            }
        },
    });

    return (
        <React.Fragment>
            <BreadCrumb title={ mode === "edit" ? "Producto" : "Nuevo Producto" } pageTitle='Productos' />
            {/* <ToastContainer closeButton={false} limit={1} /> */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-x-5">
                <div className="xl:col-span-12">
                    <div className="card">
                        <div className="card-body">
                            <h6 className="mb-4 text-15">{ mode === "edit" ? "Editar Producto" : "Crear Producto" }</h6>

                            <form className="create-form" id="create-form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    validation.handleSubmit();
                                    return false;
                                }}
                            >
                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-12">
                                    <div className="xl:col-span-6">
                                        <label htmlFor="materialNameInput" className="inline-block mb-2 text-base font-medium">Nombre del Material*</label>
                                        <input type="text" id="materialNameInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Nombre del material" 
                                            name="material"
                                            onChange={validation.handleChange}
                                            value={validation.values.material || ""}
                                        />
                                        {validation.touched.material && validation.errors.material ? (
                                            <p className="text-red-400">{validation.errors.material}</p>
                                        ) : null}
                                        <p className="mt-1 text-sm text-slate-400 dark:text-zink-200">No se exceda de los 50 caracteres.</p>
                                    </div>

                                    <div className="xl:col-span-6">
                                        <label htmlFor="productVisibility" className="inline-block mb-2 text-base font-medium">Cliente Asociado</label>
                                        <select className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" data-choices data-choices-search-false id="productVisibility"
                                            name="client_id"
                                            onChange={validation.handleChange}
                                            value={validation.values.client_id || ""}
                                        >
                                            <option value="" defaultChecked>Ninguno - Por Defecto</option>
                                            <option value="1">juan perez</option>
                                            <option value="2">iker cobbi</option>
                                            <option value="3">Famosin chkilin</option>
                                            <option value="4">votanta</option>
                                        </select>
                                        {validation.touched.client_id && validation.errors.client_id ? (
                                            <p className="text-red-400">{validation.errors.client_id}</p>
                                        ) : null}
                                    </div>
                                
                                    
                                    {/* Sección de Precios en Compra */}
                                    <div className="xl:col-span-12 p-4 bg-slate-50 dark:bg-zink-600 rounded-md">
                                        <h4 className="mb-4 text-15">Precios en Compra</h4>
                                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                            <div>
                                                <label htmlFor="wholesale_price_buy" className="inline-block mb-2 text-base font-medium">
                                                    Precio Mayoreo por Kg*
                                                </label>
                                                <input
                                                    type="number"
                                                    id="wholesale_price_buy"
                                                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                    placeholder="$ 10.2"
                                                    name="wholesale_price_buy"
                                                    onChange={validation.handleChange}
                                                    value={validation.values.wholesale_price_buy || ""}
                                                />
                                                {validation.touched.wholesale_price_buy && validation.errors.wholesale_price_buy ? (
                                                    <p className="text-red-400">{validation.errors.wholesale_price_buy}</p>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label htmlFor="retail_price_buy" className="inline-block mb-2 text-base font-medium">
                                                    Precio Menudeo por Kg*
                                                </label>
                                                <input
                                                    type="number"
                                                    id="retail_price_buy"
                                                    placeholder="$ 13.2"
                                                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                    name="retail_price_buy"
                                                    onChange={validation.handleChange}
                                                    value={validation.values.retail_price_buy || ""}
                                                />
                                                {validation.touched.retail_price_buy && validation.errors.retail_price_buy ? (
                                                    <p className="text-red-400">{validation.errors.retail_price_buy}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sección de Precios en Venta */}
                                    <div className="xl:col-span-12 p-4 bg-slate-50 dark:bg-zink-600 rounded-md">
                                        <h4 className="mb-4 text-15">Precios en Venta</h4>
                                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                            <div>
                                                <label htmlFor="retail_price_sell" className="inline-block mb-2 text-base font-medium">
                                                    Precio Mayoreo por Kg*
                                                </label>
                                                <input
                                                    type="number"
                                                    id="retail_price_sell"
                                                    placeholder="$ 13.2"
                                                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                    name="retail_price_sell"
                                                    onChange={validation.handleChange}
                                                    value={validation.values.retail_price_sell || ""}
                                                />
                                                {validation.touched.retail_price_sell && validation.errors.retail_price_sell ? (
                                                    <p className="text-red-400">{validation.errors.retail_price_sell}</p>
                                                ) : null}
                                            </div>
                                            <div>
                                                <label htmlFor="retail_price_sell" className="inline-block mb-2 text-base font-medium">
                                                    Precio Menudeo por Kg*
                                                </label>
                                                <input
                                                    type="number"
                                                    id="retail_price_sell"
                                                    placeholder="$ 13.2"
                                                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                    name="retail_price_sell"
                                                    onChange={validation.handleChange}
                                                    value={validation.values.retail_price_sell || ""}
                                                />
                                                {validation.touched.retail_price_sell && validation.errors.retail_price_sell ? (
                                                    <p className="text-red-400">{validation.errors.retail_price_sell}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="lg:col-span-2 xl:col-span-12">
                                        <label htmlFor="genderSelect" className="inline-block mb-2 text-base font-medium">Imagen del producto*</label>
                                        <Dropzone
                                            onDrop={(acceptedFiles: File[]) => {
                                                if (acceptedFiles.length > 0) {
                                                    handleAcceptfiles([acceptedFiles[0]]); // Solo toma el primer archivo
                                                }
                                            }}
                                            accept={{
                                                "image/png": [],
                                                "image/jpeg": [],
                                                "image/jpg": [],
                                            }}
                                            maxFiles={1} // Solo permite un archivo
                                        >
                                            {({ getRootProps, getInputProps }) => (
                                                <div 
                                                    className="flex items-center justify-center bg-white border border-dashed rounded-md cursor-pointer dropzone border-slate-300 dark:bg-zink-700 dark:border-zink-500 dropzone2"
                                                    {...getRootProps()}
                                                >
                                                    <input {...getInputProps()} />
                                                    <div className="w-full py-5 text-lg text-center dz-message needsclick">
                                                        <div className="mb-3">
                                                            <UploadCloud className="block size-12 mx-auto text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500" />
                                                        </div>
                                                        <h5 className="mb-0 font-normal text-slate-500 dark:text-zink-200 text-15">
                                                            Arrastra y suelta la imagen de tu producto o <Link to="#!">busca</Link> la imagen en tu ordenador
                                                        </h5>
                                                    </div>
                                                </div>
                                            )}
                                        </Dropzone>
                                        {validation.touched.img && validation.errors.img ? (
                                            <p className="text-red-400">{validation.errors.img}</p>
                                        ) : null}
                                        <ul className="flex flex-wrap mb-0 gap-x-5" id="dropzone-preview2">
                                            {
                                                (selectfiles || [])?.map((file: any, index: number) => {
                                                    return (
                                                        <li className="mt-5" id="dropzone-preview-list2" key={index}>
                                                            <div className="border rounded border-slate-200 dark:border-zink-500">
                                                                <div className="p-2 text-center">
                                                                    <div>
                                                                        <div className="p-2 mx-auto rounded-md size-14 bg-slate-100 dark:bg-zink-600">
                                                                            <img className="block w-full h-full rounded-md" src={file.priview} alt={file.name} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="pt-3">
                                                                        <h5 className="mb-1 text-15" data-dz-name>{file.path}</h5>
                                                                        <p className="mb-0 text-slate-500 dark:text-zink-200" data-dz-size>{file.formattedSize}</p>
                                                                        <strong className="error text-danger" data-dz-errormessage></strong>
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        <button data-dz-remove className="px-2 py-1.5 text-xs text-white bg-red-500 border-red-500 btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20" onClick={() => {
                                                                            const newImages = [...selectfiles];
                                                                            newImages.splice(index, 1);
                                                                            setSelectfiles(newImages);
                                                                            setEventData((prevData: any) => ({
                                                                                ...prevData,
                                                                                img: null, // Limpiar la imagen en eventData
                                                                            }));
                                                                        }}>Eliminar</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })
                                            }
                                        </ul>
                                    </div>
                                
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button type="reset" onClick={ () => navigate("/apps-materials-product-list")} className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10">Cancelar</button>
                                    <button type="submit" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">{ mode === "edit" ? "Editar Producto" : "Crear Producto" }</button>
                                    {/* <button type="button" className="text-white bg-green-500 border-green-500 btn hover:text-white hover:bg-green-600 hover:border-green-600 focus:text-white focus:bg-green-600 focus:border-green-600 focus:ring focus:ring-green-100 active:text-white active:bg-green-600 active:border-green-600 active:ring active:ring-green-100 dark:ring-green-400/10">Draft & Preview</button> */}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AddNew;