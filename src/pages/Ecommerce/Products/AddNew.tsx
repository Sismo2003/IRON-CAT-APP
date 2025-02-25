import React, { useState } from "react";
import { Link } from "react-router-dom";
import Flatpickr from 'react-flatpickr';
import BreadCrumb from "Common/BreadCrumb";
import Select from 'react-select';

// Icon
import { Pencil, UploadCloud } from 'lucide-react';

// Image
import productImg03 from "assets/images/product/img-03.png";
import Dropzone from "react-dropzone";

const codigo_producto : string = "CODIGO_AQUI_DB";

const AddNew = () => {
    const [selectfiles, setSelectfiles] = useState([]);

    const handleAcceptfiles = (files: any) => {
        files?.map((file: any) => {
            return Object.assign(file, {
                priview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            });
        });
        setSelectfiles(files);
    };

    const formatBytes = (bytes: any, decimals = 2) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    const options = [
        { value: '', label: 'Select Category' },
        { value: 'Mobiles, Computers', label: 'Mobiles, Computers' },
        { value: 'TV, Appliances, Electronics', label: 'TV, Appliances, Electronics' },
        { value: "Men's Fashion", label: "Men's Fashion" },
        { value: "Women's Fashion", label: "Women's Fashion" },
        { value: 'Home, Kitchen, Pets', label: 'Home, Kitchen, Pets' },
        { value: 'Beauty, Health, Grocery', label: 'Beauty, Health, Grocery' },
        { value: 'Books', label: 'Books' },
    ];

    const productTypeSelect = [
        { value: '', label: 'Select Type' },
        { value: 'Single', label: 'Single' },
        { value: 'Unit', label: 'Unit' },
        { value: 'Boxed', label: 'Boxed' },
    ];

    const genderSelect = [
        { value: '', label: 'Select Gender' },
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Unisex', label: 'Unisex' },
    ];

    return (
        <React.Fragment>
            <BreadCrumb title='Nuevo Producto' pageTitle='Products' />
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-x-5">
                <div className="xl:col-span-9">
                    <div className="card">
                        <div className="card-body">
                            <h6 className="mb-4 text-15">Crear Producto</h6>

                            <form action="#!">
                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-12">
                                    <div className="xl:col-span-6">
                                        <label htmlFor="productNameInput" className="inline-block mb-2 text-base font-medium">Nombre del Material*</label>
                                        <input type="text" id="productNameInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Nombre del material" required />
                                        <p className="mt-1 text-sm text-slate-400 dark:text-zink-200">No se exceda de los 50 caracteres.</p>
                                    </div>

                                    <div className="xl:col-span-6">
                                        <label htmlFor="productVisibility" className="inline-block mb-2 text-base font-medium">Cliente Asociado</label>
                                        <select className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" data-choices data-choices-search-false name="productVisibility" id="productVisibility">
                                            <option value=" " defaultChecked>Ninguno - Por Defecto</option>
                                            <option value="Public">juan perez</option>
                                            <option value="Public">iker cobbi</option>
                                            <option value="Public">Famosin chkilin</option>
                                            <option value="Public">votanta</option>
                                            
                                        </select>
                                    </div>
                                
                                    
                                    <div className="xl:col-span-4">
                                        <label htmlFor="price_wholesale" className="inline-block mb-2 text-base font-medium">Precio Mayoreo por Kg*</label>
                                        <input type="number" id="price_wholesale"  placeholder="$ 10.2"  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" required />
                                    </div>
                                    <div className="xl:col-span-4">
                                        <label htmlFor="price_retail" className="inline-block mb-2 text-base font-medium">Precio Menudo por Kg*</label>
                                        <input type="number" id="price_retail"  placeholder="$ 13.2"  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" required />
                                    </div>
                                    <div className="xl:col-span-4">
                                        <label htmlFor="price_retail" className="inline-block mb-2 text-base font-medium">Precio Especial por Kg</label>
                                        <input type="number" id="price_retail"  placeholder="$ 9.00"  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"  />
                                    </div>

                                   

                                    <div className="lg:col-span-2 xl:col-span-12">
                                        <label htmlFor="genderSelect" className="inline-block mb-2 text-base font-medium">Imagen del producto*</label>
                                        <Dropzone
                                            onDrop={(acceptedFiles: File[]) => {
                                                handleAcceptfiles(acceptedFiles);
                                            }}
                                            accept={{
                                                "image/png": [],
                                                "image/jpeg": [],
                                                "image/jpg": [],
                                            }}
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
                                                            Arrastra y suelta las imágenes de tus productos o <Link to="#!">busca</Link> la imagen en tu ordenador
                                                        </h5>
                                                    </div>
                                                </div>
                                            )}
                                        </Dropzone>
                                        <ul className="flex flex-wrap mb-0 gap-x-5" id="dropzone-preview2">
                                            {
                                                (selectfiles || [])?.map((file: any, index: number) => {
                                                    return (
                                                        <li className="mt-5" id="dropzone-preview-list2">
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
                                                                        }}>Delete</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })
                                            }
                                        </ul>
                                    </div>
                               
                                 
                                    
                                    {/* <div className="xl:col-span-4">
                                        <label htmlFor="productStatus" className="inline-block mb-2 text-base font-medium">Status</label>
                                        <select className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" data-choices data-choices-search-false name="productStatus" id="productStatus">
                                            <option value="Draft">Draft</option>
                                            <option value="Published">Published</option>
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="Entertainment">Entertainment</option>
                                        </select>
                                    </div> */}
                                
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button type="reset" className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10">Reset</button>
                                    <button type="submit" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Create Product</button>
                                    <button type="button" className="text-white bg-green-500 border-green-500 btn hover:text-white hover:bg-green-600 hover:border-green-600 focus:text-white focus:bg-green-600 focus:border-green-600 focus:ring focus:ring-green-100 active:text-white active:bg-green-600 active:border-green-600 active:ring active:ring-green-100 dark:ring-green-400/10">Draft & Preview</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-3">
                    <div className="card sticky top-[calc(theme('spacing.header')_*_1.3)]">
                        <div className="card-body">
                            <h6 className="mb-4 text-15">Product Card Preview</h6>

                            <div className="px-5 py-8 rounded-md bg-sky-50 dark:bg-zink-600">
                                <img src={productImg03} alt="" className="block mx-auto h-44" />
                            </div>

                            <div className="mt-3">
                                <h5 className="mb-2">$145.99 <small className="font-normal line-through">299.99</small></h5>
                                <h6 className="mb-1 text-15">Fastcolors Typography Men</h6>
                                <p className="text-slate-500 dark:text-zink-200">Men's Fashion</p>
                            </div>
                            <h6 className="mt-3 mb-2 text-15">Colors</h6>
                            <div className="flex flex-wrap items-center gap-2">
                                <div>
                                    <input id="selectColorPre1" className="inline-block size-5 align-middle border rounded-full appearance-none cursor-pointer bg-sky-500 border-sky-500 checked:bg-sky-500 checked:border-sky-500 disabled:opacity-75 disabled:cursor-default" type="checkbox" value="color1" name="selectColorPre" />
                                </div>
                                <div>
                                    <input id="selectColorPre2" className="inline-block size-5 align-middle bg-orange-500 border border-orange-500 rounded-full appearance-none cursor-pointer checked:bg-orange-500 checked:border-orange-500 disabled:opacity-75 disabled:cursor-default" type="checkbox" value="color2" name="selectColorPre" defaultChecked />
                                </div>
                                <div>
                                    <input id="selectColorPre3" className="inline-block size-5 align-middle bg-green-500 border border-green-500 rounded-full appearance-none cursor-pointer checked:bg-green-500 checked:border-green-500 disabled:opacity-75 disabled:cursor-default" type="checkbox" value="color3" name="selectColorPre" />
                                </div>
                                <div>
                                    <input id="selectColorPre4" className="inline-block size-5 align-middle bg-purple-500 border border-purple-500 rounded-full appearance-none cursor-pointer checked:bg-purple-500 checked:border-purple-500 disabled:opacity-75 disabled:cursor-default" type="checkbox" value="color4" name="selectColorPre" />
                                </div>
                            </div>

                            <h6 className="mt-3 mb-2 text-15">Colors</h6>
                            <div className="flex flex-wrap items-center gap-2">
                                <div>
                                    <input id="selectSizePreXS" className="hidden peer" type="checkbox" value="XS" name="selectSizePre" />
                                    <label htmlFor="selectSizePreXS" className="flex items-center justify-center size-8 text-xs border rounded-md cursor-pointer border-slate-200 dark:border-zink-500 peer-checked:bg-custom-50 dark:peer-checked:bg-custom-500/20 peer-checked:border-custom-300 dark:peer-checked:border-custom-700 peer-disabled:bg-slate-50 dark:peer-disabled:bg-slate-500/15 peer-disabled:border-slate-100 dark:peer-disabled:border-slate-800 peer-disabled:cursor-default peer-disabled:text-slate-500 dark:peer-disabled:text-zink-200">XS</label>
                                </div>
                                <div>
                                    <input id="selectSizePreS" className="hidden peer" type="checkbox" value="S" name="selectSizePre" />
                                    <label htmlFor="selectSizePreS" className="flex items-center justify-center size-8 text-xs border rounded-md cursor-pointer border-slate-200 dark:border-zink-500 peer-checked:bg-custom-50 dark:peer-checked:bg-custom-500/20 peer-checked:border-custom-300 dark:peer-checked:border-custom-700 peer-disabled:bg-slate-50 dark:peer-disabled:bg-slate-500/15 peer-disabled:border-slate-100 dark:peer-disabled:border-slate-800 peer-disabled:cursor-default peer-disabled:text-slate-500 dark:peer-disabled:text-zink-200">S</label>
                                </div>
                                <div>
                                    <input id="selectSizePreM" className="hidden peer" type="checkbox" value="M" name="selectSizePre" />
                                    <label htmlFor="selectSizePreM" className="flex items-center justify-center size-8 text-xs border rounded-md cursor-pointer border-slate-200 dark:border-zink-500 peer-checked:bg-custom-50 dark:peer-checked:bg-custom-500/20 peer-checked:border-custom-300 dark:peer-checked:border-custom-700 peer-disabled:bg-slate-50 dark:peer-disabled:bg-slate-500/15 peer-disabled:border-slate-100 dark:peer-disabled:border-slate-800 peer-disabled:cursor-default peer-disabled:text-slate-500 dark:peer-disabled:text-zink-200">M</label>
                                </div>
                                <div>
                                    <input id="selectSizePreL" className="hidden peer" type="checkbox" value="L" name="selectSizePre" />
                                    <label htmlFor="selectSizePreL" className="flex items-center justify-center size-8 text-xs border rounded-md cursor-pointer border-slate-200 dark:border-zink-500 peer-checked:bg-custom-50 dark:peer-checked:bg-custom-500/20 peer-checked:border-custom-300 dark:peer-checked:border-custom-700 peer-disabled:bg-slate-50 dark:peer-disabled:bg-slate-500/15 peer-disabled:border-slate-100 dark:peer-disabled:border-slate-800 peer-disabled:cursor-default peer-disabled:text-slate-500 dark:peer-disabled:text-zink-200">L</label>
                                </div>
                                <div>
                                    <input id="selectSizePreXL" className="hidden peer" type="checkbox" value="XL" name="selectSizePre" />
                                    <label htmlFor="selectSizePreXL" className="flex items-center justify-center size-8 text-xs border rounded-md cursor-pointer border-slate-200 dark:border-zink-500 peer-checked:bg-custom-50 dark:peer-checked:bg-custom-500/20 peer-checked:border-custom-300 dark:peer-checked:border-custom-700 peer-disabled:bg-slate-50 dark:peer-disabled:bg-slate-500/15 peer-disabled:border-slate-100 dark:peer-disabled:border-slate-800 peer-disabled:cursor-default peer-disabled:text-slate-500 dark:peer-disabled:text-zink-200">XL</label>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button type="button" className="w-full bg-white border-dashed text-custom-500 btn border-custom-500 hover:text-custom-500 hover:bg-custom-50 hover:border-custom-600 focus:text-custom-600 focus:bg-custom-50 focus:border-custom-600 active:text-custom-600 active:bg-custom-50 active:border-custom-600 dark:bg-zink-700 dark:ring-custom-400/20 dark:hover:bg-custom-800/20 dark:focus:bg-custom-800/20 dark:active:bg-custom-800/20">Create Products</button>
                                <button type="button" className="w-full text-white bg-purple-500 border-purple-500 btn hover:text-white hover:bg-purple-600 hover:border-purple-600 focus:text-white focus:bg-purple-600 focus:border-purple-600 focus:ring focus:ring-purple-100 active:text-white active:bg-purple-600 active:border-purple-600 active:ring active:ring-purple-100 dark:ring-purple-400/10">Draft</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AddNew;