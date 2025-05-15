import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BreadCrumb from 'Common/BreadCrumb';
// import Flatpickr from "react-flatpickr";
// import moment from "moment";
import { v4 as uuidv4 } from "uuid";

// Icons
import { Search, Plus, Trash2, Eye, Pencil, ImagePlus } from 'lucide-react';

import dummyImg from "assets/images/users/user-dummy-img.jpg";

import TableContainer from 'Common/TableContainer';
import { Link } from 'react-router-dom';

import DeleteModal from 'Common/DeleteModal';
import Modal from 'Common/Components/Modal';

// react-redux
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import {
    getCustomer as onGetCustomer,
    addCustomer as onAddCustomer,
    updateCustomer as onUpdateCustomer,
    deleteCustomer as onDeleteCustomer
} from 'slices/thunk';
import { ToastContainer } from 'react-toastify';

const CustomerList = () => {

    const dispatch = useDispatch<any>();

    const selectDataList = createSelector(
        (state: any) => state.CUSTOMERManagement,
        (state) => ({
            dataList: state.customerlist,
            loading: state.loading
        })
    );

    const { dataList, loading } = useSelector(selectDataList);

    const [data, setData] = useState<any>([]);
    const [eventData, setEventData] = useState<any>();

    const [show, setShow] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // Image
    const [selectedImage, setSelectedImage] = useState<any>();

    const handleImageChange = (event: any) => {
        const fileInput = event.target;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                validation.setFieldValue('img', e.target.result);
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Get Data
    useEffect(() => {
        dispatch(onGetCustomer());
    }, [dispatch]);

    useEffect(() => {
        setData(dataList);
    }, [dataList]);

    // Delete Modal
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const deleteToggle = () => setDeleteModal(!deleteModal);

    // Delete Data
    const onClickDelete = (cell: any) => {
        setDeleteModal(true);
        if (cell.id) {
            setEventData(cell);
        }
    };

    const handleDelete = () => {
        if (eventData) {
            dispatch(onDeleteCustomer(eventData.id));
            setDeleteModal(false);
        }
    };
    // 

    // Update Data
    const handleUpdateDataClick = (ele: any) => {
        setEventData({ ...ele });
        setIsEdit(true);
        setShow(true);
    };

    // validation
    const validation: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            customer_id: (eventData && eventData.customer_id) || '',
            name: (eventData && eventData.name) || '',
            last_name: (eventData && eventData.last_name) || '',
            img: (eventData && eventData.img) || '',
            address: (eventData && eventData.address) || '',
            email: (eventData && eventData.email) || '',
            phone: (eventData && eventData.phone) || '',
            rfc: (eventData && eventData.rfc) || ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Porfavor ingrese el nombre"),
            last_name: Yup.string().required("Porfavor ingrese el apellido"),
            img: Yup.string().required("Es necesario agregar una imagen"),
            address: Yup.string().required("Porfavor ingrese la dirección"),
            email: Yup.string()
            .email("El formato de correo electrónico no es válido")
            .required("Porfavor ingrese el email"),
            phone: Yup.string().required("Porfavor ingrese el número de telefono"),
            rfc: Yup.string()
        }),

        onSubmit: (values) => {
            if (isEdit) {
                const updateData = {
                    id: eventData ? eventData.id : 0,
                    fullname: values.name + " " + values.last_name,
                    ...values,
                };
                // update user
                dispatch(onUpdateCustomer(updateData));
            } else {
                const newData = {
                    ...values,
                    id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
                    fullname: values.name + " " + values.last_name,
                    customer_id: "#IRON-" + uuidv4().split("-")[0].toUpperCase()
                };
                // save new user
                console.log("newData", newData);
                dispatch(onAddCustomer(newData));
            }
            toggle();
        },
    });

    const toggle = useCallback(() => {
        if (show) {
            setShow(false);
            setEventData("");
            setIsEdit(false);
            setSelectedImage("");
        } else {
            setShow(true);
            setEventData("");
            setSelectedImage("");
            validation.resetForm();
        }
    }, [show, validation]);

    // columns
    const columns = useMemo(() => [
        {
            header: "Cliente ID",
            accessorKey: "customer_id",
            enableColumnFilter: false,
            cell: (cell: any) => (
                <Link to="#!" className="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600">{cell.getValue()}</Link>
            ),
        },
        {
            header: "Nombre",
            accessorKey: "fullname",
            enableColumnFilter: false,
            cell: (cell: any) => (
                <Link to="#!" className="flex items-center gap-3">
                    <div className="size-6 rounded-full shrink-0 bg-slate-100">
                        <img src={cell.row.original.img} alt="" className="h-6 rounded-full" />
                    </div>
                    <h6 className="grow">{cell.getValue()}</h6>
                </Link>
            ),
        },
        {
            header: "Email",
            accessorKey: "email",
            enableColumnFilter: false
        },
        {
            header: "Telefono",
            accessorKey: "phone",
            enableColumnFilter: false,
        },
        {
            header: "RFC",
            accessorKey: "rfc",
            enableColumnFilter: false,
        },
        // {
        //     header: "Ubicación",
        //     accessorKey: "location",
        //     enableColumnFilter: false,
        // },
        // {
        //     header: "Experiencia",
        //     accessorKey: "experience",
        //     enableColumnFilter: false,
        // },
        // {
        //     header: "Fecha de ingreso",
        //     accessorKey: "joinDate",
        //     enableColumnFilter: false,
        // },
        {
            header: "Acciones",
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cell: any) => (
                <div className="flex gap-3">
                    {/* Botón Ver (ojito) - amarillo */}
                    <Link
                        className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 text-slate-500
                        hover:text-yellow-600 hover:bg-yellow-100
                        dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-yellow-500/20 dark:hover:text-yellow-400"
                        to="/pages-account"
                        state={{ data: cell.row.original }}
                        title="Ver"
                    >
                        <Eye className="inline-block size-3" />
                    </Link>
        
                    {/* Botón Editar (lápiz) - azul */}
                    <Link
                        to="#!"
                        data-modal-target="viewTicketModal"
                        className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md edit-item-btn bg-slate-100 text-slate-500
                        hover:text-blue-600 hover:bg-blue-100
                        dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-blue-500/20 dark:hover:text-blue-400"
                        onClick={() => {
                            const data = cell.row.original;
                            handleUpdateDataClick(data);
                        }}
                        title="Editar"
                    >
                        <Pencil className="size-4" />
                    </Link>
        
                    {/* Botón Eliminar (basura) - rojo */}
                    <Link
                        to="#!"
                        className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md remove-item-btn bg-slate-100 text-slate-500
                        hover:text-red-600 hover:bg-red-100
                        dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                        onClick={() => {
                            const data = cell.row.original;
                            onClickDelete(data);
                        }}
                        title="Borrar"
                    >
                        <Trash2 className="size-4" />
                    </Link>
                </div>
            ),
        }        
    ], []
    );

    return (
        <React.Fragment>
            <BreadCrumb title='Lista de Clientes' pageTitle='Administración Clientes' />
            <DeleteModal show={deleteModal} onHide={deleteToggle} onDelete={handleDelete} />
            <ToastContainer closeButton={false} limit={1} />
            <div className="card" id="Table">
                <div className="card-body">
                    <div className="flex items-center gap-3 mb-4">
                        <h6 className="text-15 grow">Clientes (<b className="total-Employs">{data.length}</b>)</h6>
                        <div className="shrink-0">
                            <Link to="#!" data-modal-target="addEmployeeModal" type="button" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20 add-employee" onClick={toggle}>
                                <Plus className="inline-block size-4" /> <span className="align-middle">Añadir cliente</span>
                            </Link>
                        </div>
                    </div>
                    {
                        loading ? (
                            // Spinner de carga
                            <div className="flex justify-center py-6">
                                <div className="w-10 h-10 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
                            </div>
                        ) : (
                            data && data.length > 0 ?
                            <TableContainer
                                isPagination={true}
                                columns={(columns || [])}
                                data={(data || [])}
                                customPageSize={data.length > 10 ? 10 : data.length}
                                divclassName="-mx-5 overflow-x-auto"
                                tableclassName="w-full whitespace-nowrap"
                                theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
                                thclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500"
                                tdclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500"
                                PaginationClassName="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row"
                            />
                            :
                            (<div className="noresult">
                                <div className="py-6 text-center">
                                    <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                                    <h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
                                    <p className="mb-0 text-slate-500 dark:text-zink-200">We've searched more than 299+ Employee We did not find any Employee for you search.</p>
                                </div>
                            </div>)
                        )
                    }
                        
                </div>
            </div>

            {/* Client Modal */}
            <Modal show={show} onHide={toggle} modal-center="true"
                className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600">
                <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-500"
                    closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500">
                    <Modal.Title className="text-16">{!!isEdit ? "Editar Cliente" : "Añadir Cliente"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
                    <form className="create-form" id="create-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                        }}
                    >
                        <input type="hidden" value="" name="id" id="id" />
                        <input type="hidden" value="add" name="action" id="action" />
                        <input type="hidden" id="id-field" />
                        <div id="alert-error-msg" className="hidden px-4 py-3 text-sm text-red-500 border border-transparent rounded-md bg-red-50 dark:bg-red-500/20"></div>
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                            <div className="xl:col-span-12">
                                <div className="relative size-24 mx-auto mb-4 rounded-full shadow-md bg-slate-100 profile-user dark:bg-zink-500">
                                    <img src={selectedImage || validation.values.img || dummyImg} alt="" className="object-cover w-full h-full rounded-full user-profile-image" />
                                    <div className="absolute bottom-0 flex items-center justify-center size-8 rounded-full ltr:right-0 rtl:left-0 profile-photo-edit">
                                        <input
                                            id="profile-img-file-input"
                                            name="profile-img-file-input"
                                            type="file"
                                            accept="image/*"
                                            className="hidden profile-img-file-input"
                                            onChange={handleImageChange} />
                                        <label htmlFor="profile-img-file-input" className="flex items-center justify-center size-8 bg-white rounded-full shadow-lg cursor-pointer dark:bg-zink-600 profile-photo-edit">
                                            <ImagePlus className="size-4 text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500" />
                                        </label>
                                    </div>
                                </div>
                                {validation.touched.img && validation.errors.img ? (
                                    <p className="text-red-400">{validation.errors.img}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-12">
                                <label htmlFor="customerId" className="inline-block mb-2 text-base font-medium">Cliente ID</label>
                                <input type="text" id="customerId" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                    value={validation.values.customer_id || "#IRON-1001557"} disabled />
                            </div>
                            <div className="xl:col-span-12">
                                <label htmlFor="customerInput" className="inline-block mb-2 text-base font-medium">Nombre/s</label>
                                <input type="text" id="customerInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Ingrese su nombre/s"
                                    name="name"
                                    onChange={validation.handleChange}
                                    value={validation.values.name || ""}
                                />
                                {validation.touched.name && validation.errors.name ? (
                                    <p className="text-red-400">{validation.errors.name}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-12">
                                <label htmlFor="lastNameInput" className="inline-block mb-2 text-base font-medium">Apellidos</label>
                                <input type="text" id="lastNameInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Ingrese sus apellidos"
                                    name="last_name"
                                    onChange={validation.handleChange}
                                    value={validation.values.last_name || ""}
                                />
                                {validation.touched.last_name && validation.errors.last_name ? (
                                    <p className="text-red-400">{validation.errors.last_name}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-12">
                                <label htmlFor="emailInput" className="inline-block mb-2 text-base font-medium">Email</label>
                                <input type="email" id="emailInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="ejemplo@ironcat.com"
                                    name="email"
                                    onChange={validation.handleChange}
                                    value={validation.values.email || ""}
                                />
                                {validation.touched.email && validation.errors.email ? (
                                    <p className="text-red-400">{validation.errors.email}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-6">
                                <label htmlFor="phoneNumberInput" className="inline-block mb-2 text-base font-medium">Número de Telefono</label>
                                <input type="text" id="phoneNumberInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="XX-XXXX-XXXX"
                                    name="phone"
                                    onChange={validation.handleChange}
                                    value={validation.values.phone || ""}
                                />
                                {validation.touched.phone && validation.errors.phone ? (
                                    <p className="text-red-400">{validation.errors.phone}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-6">
                                <label htmlFor="addressInput" className="inline-block mb-2 text-base font-medium">Dirección</label>
                                <input type="text" id="addressInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Ingrese su domicilio"
                                    name="address"
                                    onChange={validation.handleChange}
                                    value={validation.values.address || ""}
                                />
                                {validation.touched.address && validation.errors.address ? (
                                    <p className="text-red-400">{validation.errors.address}</p>
                                ) : null}
                            </div>
                            <div className="xl:col-span-12">
                                <label htmlFor="rfcInput" className="inline-block mb-2 text-base font-medium">RFC</label>
                                <input type="text" id="rfcInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Ingrese su RFC"
                                    name="rfc"
                                    onChange={validation.handleChange}
                                    value={validation.values.rfc || ""}
                                />
                                {validation.touched.rfc && validation.errors.rfc ? (
                                    <p className="text-red-400">{validation.errors.rfc}</p>
                                ) : null}
                            </div>
                            
                            
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="reset" id="close-modal" data-modal-close="addEmployeeModal" className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10" onClick={toggle}>Cancel</button>
                            <button type="submit" id="addNew" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">
                                {!!isEdit ? "Update" : "Add Employee"}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

        </React.Fragment>
    );
};

export default CustomerList;
