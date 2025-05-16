import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "Common/BreadCrumb";
import { UploadCloud } from 'lucide-react';
import Dropzone from "react-dropzone";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
    addShopProductList as onAddProductList,
    updateShopProductList as onUpdateProductList
} from 'slices/thunk';
import { useDispatch } from 'react-redux';

const AddNew = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const dataRef = useRef(location.state?.data || null);
    const modeRef = useRef(location.state?.mode || "create");

    interface FileWithPreview {
        name: string;
        size: number;
        type: string;
        priview: string;
        formattedSize: string;
    }

    const [selectfiles, setSelectfiles] = useState<FileWithPreview[]>([]);

    const formatBytes = (bytes: any, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const handleAcceptfiles = (files: File[]) => {
        const file = files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const base64 = reader.result as string;

                const fileWithPreview: FileWithPreview = {
                    ...file,
                    priview: base64,
                    formattedSize: formatBytes(file.size),
                };

                validation.setFieldValue('img', e.target.result);
                setSelectfiles([fileWithPreview]);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (modeRef.current === "edit" && dataRef.current?.img) {
            const fileWithPreview = {
                name: "imagen.jpg",
                size: 0,
                type: "image/jpeg",
                priview: dataRef.current.img,
                formattedSize: "0 Bytes",
            };
            setSelectfiles([fileWithPreview]);
        }
    }, []);

    // validation
    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            material: dataRef.current?.material || '',
            wholesale_price_buy: dataRef.current?.wholesale_price_buy || '',
            wholesale_price_sell: dataRef.current?.wholesale_price_sell || '',
            retail_price_buy: dataRef.current?.retail_price_buy || '',
            retail_price_sell: dataRef.current?.retail_price_sell || '',
            client_id: dataRef.current?.client_id || '',
            img: dataRef.current?.img || null,
            existence: dataRef.current?.existence || 0,
        },
        validationSchema: Yup.object({
            material: Yup.string().required("Por favor ingresa el nombre del material"),
            wholesale_price_buy: Yup.number(),
            wholesale_price_sell: Yup.number(),
            retail_price_buy: Yup.number(),
            retail_price_sell: Yup.number(),
            existence: Yup.number()
                .required("Por favor ingresa la existencia"),
            img: Yup.mixed()
                .required("Por favor selecciona una imagen")
                .test("fileSize", "La imagen es demasiado grande", (value) => {
                    if (typeof value === "string") {
                        const base64Length = value.length - (value.indexOf(",") + 1);
                        const padding = value.charAt(value.length - 2) === "=" ? 2 : value.charAt(value.length - 1) === "=" ? 1 : 0;
                        const sizeInBytes = (base64Length * 3) / 4 - padding;
                        return sizeInBytes <= 5 * 1024 * 1024;
                    }
                    return false;
                })
                .test("fileType", "Formato de imagen no válido", (value) => {
                    if (typeof value === "string") {
                        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
                        const prefix = value.split(";")[0].split(":")[1];
                        return validTypes.includes(prefix);
                    }
                    return false;
                }),
        }),
        onSubmit: (values) => {
            const newData = {
                ...values,
                wholesale_price_buy: parseFloat(values.wholesale_price_buy || 0).toFixed(2),
                retail_price_buy: parseFloat(values.retail_price_buy || 0).toFixed(2),
                wholesale_price_sell: parseFloat(values.wholesale_price_sell || 0).toFixed(2),
                retail_price_sell: parseFloat(values.retail_price_sell || 0).toFixed(2),
                existence: parseFloat(values.existence || 0).toFixed(2),
            };

            if (modeRef.current === "edit") {
                dispatch(onUpdateProductList({ id: dataRef.current.id, ...newData })).then(() => {
                    navigate("/apps-materials-product-list");
                });
            } else {
                dispatch(onAddProductList(newData)).then(() => {
                    navigate("/apps-materials-product-list");
                });
            }
        },
    });

    return (
        <React.Fragment>
            <BreadCrumb title={modeRef.current === "edit" ? "Producto" : "Nuevo Producto"} pageTitle='Productos' />
            <div className="grid grid-cols-1 gap-5">
                <div className="card">
                    <div className="card-body">
                        <h6 className="mb-6 text-16">{modeRef.current === "edit" ? "Editar Producto" : "Crear Producto"}</h6>

                        <form className="create-form" id="create-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                            }}
                        >
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {/* Campo de Nombre del Material */}
                                <div className="md:col-span-1 lg:col-span-2">
                                    <label htmlFor="materialNameInput" className="inline-block mb-2 text-base font-medium">Nombre del Material*</label>
                                    <input
                                        type="text"
                                        id="materialNameInput"
                                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                        placeholder="Nombre del material"
                                        name="material"
                                        onChange={validation.handleChange}
                                        value={validation.values.material || ""}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    {validation.touched.material && validation.errors.material ? (
                                        <p className="text-red-400">{validation.errors.material}</p>
                                    ) : null}
                                    <p className="mt-1 text-sm text-slate-400 dark:text-zink-200">No se exceda de los 50 caracteres.</p>
                                </div>

                                {/* Campo de Existencia */}
                                <div>
                                    <label htmlFor="existence" className="inline-block mb-2 text-base font-medium">
                                        Cantidad en Kg*
                                    </label>
                                    <input
                                        type="number"
                                        id="existence"
                                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                        placeholder="0.00"
                                        name="existence"
                                        onChange={validation.handleChange}
                                        value={validation.values.existence || ""}
                                        step="0.01"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    {validation.touched.existence && validation.errors.existence ? (
                                        <p className="text-red-400">{validation.errors.existence}</p>
                                    ) : null}
                                </div>

                                {/* Sección de Precios en Compra */}
                                <div className="md:col-span-2 lg:col-span-3 p-4 bg-slate-50 dark:bg-zink-600 rounded-md">
                                    <h4 className="mb-4 text-15">Precios en Compra</h4>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="wholesale_price_buy" className="inline-block mb-2 text-base font-medium">
                                                Precio Mayoreo por Kg*
                                            </label>
                                            <input
                                                type="number"
                                                id="wholesale_price_buy"
                                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                placeholder="$ 10.20"
                                                name="wholesale_price_buy"
                                                onChange={validation.handleChange}
                                                value={validation.values.wholesale_price_buy || ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                step="0.01"
                                                min="0"
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
                                                placeholder="$ 13.20"
                                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                name="retail_price_buy"
                                                onChange={validation.handleChange}
                                                value={validation.values.retail_price_buy || ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                step="0.01"
                                                min="0"
                                            />
                                            {validation.touched.retail_price_buy && validation.errors.retail_price_buy ? (
                                                <p className="text-red-400">{validation.errors.retail_price_buy}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                {/* Sección de Precios en Venta */}
                                <div className="md:col-span-2 lg:col-span-3 p-4 bg-slate-50 dark:bg-zink-600 rounded-md">
                                    <h4 className="mb-4 text-15">Precios en Venta</h4>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="wholesale_price_sell" className="inline-block mb-2 text-base font-medium">
                                                Precio Mayoreo por Kg*
                                            </label>
                                            <input
                                                type="number"
                                                id="wholesale_price_sell"
                                                placeholder="$ 13.20"
                                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                name="wholesale_price_sell"
                                                onChange={validation.handleChange}
                                                value={validation.values.wholesale_price_sell || ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                step="0.01"
                                                min="0"
                                            />
                                            {validation.touched.wholesale_price_sell && validation.errors.wholesale_price_sell ? (
                                                <p className="text-red-400">{validation.errors.wholesale_price_sell}</p>
                                            ) : null}
                                        </div>
                                        <div>
                                            <label htmlFor="retail_price_sell" className="inline-block mb-2 text-base font-medium">
                                                Precio Menudeo por Kg*
                                            </label>
                                            <input
                                                type="number"
                                                id="retail_price_sell"
                                                placeholder="$ 13.20"
                                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                name="retail_price_sell"
                                                onChange={validation.handleChange}
                                                value={validation.values.retail_price_sell || ""}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                step="0.01"
                                                min="0"
                                            />
                                            {validation.touched.retail_price_sell && validation.errors.retail_price_sell ? (
                                                <p className="text-red-400">{validation.errors.retail_price_sell}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                {/* Área de carga de imágenes - Ocupa todo el ancho */}
                                <div className="md:col-span-2 lg:col-span-3">
                                    <label htmlFor="genderSelect" className="inline-block mb-2 text-base font-medium">Imagen del producto*</label>
                                    <Dropzone
                                        onDrop={(acceptedFiles: File[]) => {
                                            if (acceptedFiles.length > 0) {
                                                handleAcceptfiles([acceptedFiles[0]]);
                                            }
                                        }}
                                        accept={{
                                            "image/png": [],
                                            "image/jpeg": [],
                                            "image/jpg": [],
                                        }}
                                        maxFiles={1}
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
                                    <ul className="flex flex-wrap gap-4 mt-4 mb-0" id="dropzone-preview2">
                                        {(selectfiles || [])?.map((file: any, index: number) => {
                                            return (
                                                <li className="w-full sm:w-auto" id="dropzone-preview-list2" key={index}>
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
                                                                <button
                                                                    data-dz-remove
                                                                    className="px-2 py-1.5 text-xs text-white bg-red-500 border-red-500 btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20"
                                                                    onClick={() => {
                                                                        const newImages = [...selectfiles];
                                                                        newImages.splice(index, 1);
                                                                        setSelectfiles(newImages);
                                                                        validation.setFieldValue('img', null);
                                                                    }}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex flex-col gap-2 mt-6 sm:flex-row sm:justify-end">
                                <button
                                    type="reset"
                                    onClick={() => navigate("/apps-materials-product-list")}
                                    className="w-full sm:w-auto text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                                >
                                    {modeRef.current === "edit" ? "Editar Producto" : "Crear Producto"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AddNew;