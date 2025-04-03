import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BreadCrumb from 'Common/BreadCrumb';
import Select from 'react-select';
import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";

// Icons
import { Search, Plus, Trash2, Pencil, ImagePlus } from 'lucide-react';
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
    getWasteRecords as onGetWasteRecords,
    addWasteRecord as onAddWasteRecord,
    updateWasteRecord as onUpdateWasteRecord,
    deleteWasteRecord as onDeleteWasteRecord
} from 'slices/thunk';
import { ToastContainer } from 'react-toastify';

const WasteList = () => {
    const dispatch = useDispatch<any>();

    const selectDataList = createSelector(
        (state: any) => state.WasteManagement,
        (state) => ({
            dataList: state.wastelist,
            loading: state.loading
        })
    );

    const { dataList, loading } = useSelector(selectDataList);

    const [data, setData] = useState<any>({});
    const [eventData, setEventData] = useState<any>();
    const [show, setShow] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<any>();

    // Status options
    const statusOptions = [
        { label: "Activo", value: "active" },
        { label: "Inactivo", value: "inactive" },
    ];

    // Get Data
    useEffect(() => {
        dispatch(onGetWasteRecords());
    }, [dispatch]);

    useEffect(() => {
        setData(dataList);
    }, [dataList]);

    // Image handling
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

    // Delete Modal
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const deleteToggle = () => setDeleteModal(!deleteModal);

    const onClickDelete = (cell: any) => {
        setDeleteModal(true);
        if (cell.id) {
            setEventData(cell);
        }
    };

    const handleDelete = () => {
        if (eventData) {
            dispatch(onDeleteWasteRecord(eventData.id));
            setDeleteModal(false);
        }
    };

    // Update Data
    const handleUpdateDataClick = (ele: any) => {
        setEventData({ ...ele });
        setIsEdit(true);
        setShow(true);
    };

    // Form validation
    const validation = useFormik<any>({
        enableReinitialize: true,
        initialValues: {
            waste_id: (eventData && eventData.waste_id) || '',
            name: (eventData && eventData.name) || '',
            weight: (eventData && eventData.weight) || 0,
            img: (eventData && eventData.img) || '',
            state: (eventData && eventData.state) || 'active'
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Por favor ingrese el nombre"),
            weight: Yup.number()
                .min(0, "El peso no puede ser negativo")
                .required("Por favor ingrese el peso")
                .test(
                    'is-decimal',
                    'Debe tener máximo 2 decimales',
                    value => (value + "").match(/^\d*\.?\d{0,2}$/) !== null
                ),
            img: Yup.string().required("Es necesario agregar una imagen"),
            state: Yup.string().required("Por favor seleccione un estado")
        }),
        onSubmit: (values) => {
            if (isEdit) {
                const updateData = {
                    ...values,
                    waste_id: eventData ? eventData.waste_id : 0,
                    weight: parseFloat(values.weight as string),
                    id: eventData ? eventData.id : 0,
                };
                dispatch(onUpdateWasteRecord(updateData));
            } else {
                const newData = {
                    ...values,
                    waste_id: "#IRON-WASTE-" + uuidv4().split("-")[0].toUpperCase(),
                    weight: parseFloat(values.weight as string),
                };
                dispatch(onAddWasteRecord(newData));
            }
            toggle();
        },
    });

    // Toggle modal
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

    // Table columns
    const columns = useMemo(() => [
        {
            header: "ID",
            accessorKey: "waste_id",
            enableColumnFilter: false,
            cell: (cell: any) => (
                <Link to="#!" className="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600">
                    {cell.getValue()}
                </Link>
            ),
        },
        {
            header: "Imagen",
            accessorKey: "img",
            enableColumnFilter: false,
            cell: (cell: any) => (
                <div className="size-10 rounded-full shrink-0 bg-slate-100">
                    <img src={cell.getValue()} alt="" className="h-10 rounded-full" />
                </div>
            ),
        },
        {
            header: "Nombre",
            accessorKey: "name",
            enableColumnFilter: false,
        },
        {
            header: "Peso (kg)",
            accessorKey: "weight",
            enableColumnFilter: false,
            cell: (cell: any) => (
                <span>{parseFloat(cell.getValue()).toFixed(2)} kg</span>
            )
        },
        {
            header: "Estado",
            accessorKey: "state",
            enableColumnFilter: false,
            cell: (cell: any) => (
                <span 
                    className={`px-2.5 py-0.5 text-xs inline-block font-medium rounded-full border ${
                        cell.getValue() === 'active' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                    } border-transparent dark:border-transparent ${
                        cell.getValue() === 'active' ? 'dark:bg-green-500/20' : 'dark:bg-red-500/20'
                    }`}
                    >
                    {cell.getValue() === 'active' ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
        {
            header: "Fecha",
            accessorKey: "creation_date",
            enableColumnFilter: false,
            cell: (cell: any) => {
                const fecha = DateTime.fromISO(cell.getValue(), { zone: 'America/Mexico_City' });
                return <span>{fecha.toFormat('dd-MM-yyyy')}</span>;
            }
        },
        {
            header: "Acciones",
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cell: any) => (
                <div className="flex gap-3">
                    <button className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500" 
                        onClick={() => handleUpdateDataClick(cell.row.original)}>
                        <Pencil className="size-4" />
                    </button>
                    <button className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 text-slate-500 hover:text-red-500 hover:bg-red-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-red-500/20 dark:hover:text-red-500" 
                        onClick={() => onClickDelete(cell.row.original)}>
                        <Trash2 className="size-4" />
                    </button>
                </div>
            ),
        }
    ], []);

    return (
        <React.Fragment>
            <BreadCrumb title='Registros de Merma' pageTitle='Gestión de Merma' />
            <DeleteModal show={deleteModal} onHide={deleteToggle} onDelete={handleDelete} />
            <ToastContainer closeButton={false} limit={1} />
            
            <div className="card" id="wasteTable">
                <div className="card-body">
                    <div className="flex items-center gap-3 mb-4">
                        <h6 className="text-15 grow">Registros de Merma (<b>{data.length}</b>)</h6>
                        <div className="shrink-0">
                            <button type="button" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20" 
                                onClick={toggle}>
                                <Plus className="inline-block size-4" /> <span className="align-middle">Nuevo Registro</span>
                            </button>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center py-6">
                            <div className="w-10 h-10 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
                        </div>
                    ) : data && data.length > 0 ? (
                        <TableContainer
                            isPagination={true}
                            columns={columns}
                            data={data}
                            customPageSize={10}
                            divclassName="-mx-5 overflow-x-auto"
                            tableclassName="w-full whitespace-nowrap"
                            theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
                            thclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-b border-slate-200 dark:border-zink-500"
                            tdclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500"
                            PaginationClassName="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row"
                        />
                    ) : (
                        <div className="noresult">
                            <div className="py-6 text-center">
                                <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                                <h5 className="mt-2 mb-1">No se encontraron registros</h5>
                                <p className="mb-0 text-slate-500 dark:text-zink-200">No hay registros de merma disponibles.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Waste Record Modal */}
            <Modal show={show} onHide={toggle} modal-center="true"
                className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600">
                
                <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-500"
                    closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500">
                    <Modal.Title className="text-16">{!!isEdit ? "Editar Registro" : "Agregar Registro"}</Modal.Title>
                </Modal.Header>
                
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                    }}>
                        <div id="alert-error-msg" className="hidden px-4 py-3 text-sm text-red-500 border border-transparent rounded-md bg-red-50 dark:bg-red-500/20"></div>
                        
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                            {/* Image Upload */}
                            <div className="xl:col-span-12">
                                <div className="relative size-24 mx-auto mb-4 rounded-full shadow-md bg-slate-100 profile-user dark:bg-zink-500">
                                    <img src={selectedImage || validation.values.img || dummyImg} alt="" className="object-cover w-full h-full rounded-full" />
                                    <div className="absolute bottom-0 flex items-center justify-center size-8 rounded-full ltr:right-0 rtl:left-0 profile-photo-edit">
                                        <input
                                            id="waste-img-file-input"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange} />
                                        <label htmlFor="waste-img-file-input" className="flex items-center justify-center size-8 bg-white rounded-full shadow-lg cursor-pointer dark:bg-zink-600">
                                            <ImagePlus className="size-4 text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500" />
                                        </label>
                                    </div>
                                </div>
                                {validation.touched.img && validation.errors.img ? (
                                    <p className="text-red-400">{validation.errors.img as string}</p>
                                ) : null}
                            </div>

                            {/* Name Field */}
                            <div className="xl:col-span-12">
                                <label htmlFor="nameInput" className="inline-block mb-2 text-base font-medium">Nombre</label>
                                <input type="text" id="nameInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" 
                                    placeholder="Ingrese el nombre"
                                    name="name"
                                    onChange={validation.handleChange}
                                    value={validation.values.name || ""}
                                />
                                {validation.touched.name && validation.errors.name ? (
                                    <p className="text-red-400">{validation.errors.name as string}</p>
                                ) : null}
                            </div>

                            {/* Weight Field */}
                            <div className="xl:col-span-6">
                                <label htmlFor="weightInput" className="inline-block mb-2 text-base font-medium">Peso (kg)</label>
                                <input type="number" id="weightInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" 
                                    placeholder="0.00"
                                    name="weight"
                                    step="0.01"
                                    min="0"
                                    onChange={validation.handleChange}
                                    value={validation.values.weight || ""}
                                />
                                {validation.touched.weight && validation.errors.weight ? (
                                    <p className="text-red-400">{validation.errors.weight as string}</p>
                                ) : null}
                            </div>

                            {/* Status Field */}
                            <div className="xl:col-span-6">
                                <label htmlFor="statusInput" className="inline-block mb-2 text-base font-medium">Estado</label>
                                <Select
                                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                    options={statusOptions}
                                    isSearchable={false}
                                    name="state"
                                    id="stateSelect"
                                    value={statusOptions.find(option => option.value === validation.values.state) || null}
                                    onChange={(selectedOption) => {
                                        validation.setFieldValue("state", selectedOption ? selectedOption.value : "");
                                    }}
                                />
                                {validation.touched.state && validation.errors.state ? (
                                    <p className="text-red-400">{validation.errors.state as string}</p>
                                ) : null}
                            </div>

                        </div>
                        
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10" onClick={toggle}>
                                Cancelar
                            </button>
                            <button type="submit" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">
                                {!!isEdit ? "Actualizar" : "Agregar"}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default WasteList;