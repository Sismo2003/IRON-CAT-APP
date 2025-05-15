import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BreadCrumb from 'Common/BreadCrumb';
import Select from 'react-select';
import { v4 as uuidv4 } from "uuid";
import { DateTime } from 'luxon';

// Icons
import { Search, Plus, Trash2, Eye, Pencil } from 'lucide-react';

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
    getDiscountCodes as onGetDiscountCodes,
    addDiscountCode as onAddDiscountCode,
    updateDiscountCode as onUpdateDiscountCode,
    deleteDiscountCode as onDeleteDiscountCode
} from 'slices/thunk';
import { ToastContainer } from 'react-toastify';

interface DiscountCode {
    id?: number;
    code_id: string;
    name: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    max_uses: number;
    uses: number;
    end_date: string;
    status: 'active' | 'inactive' | 'exhausted';
}

const DiscountCodeList = () => {
    const dispatch = useDispatch<any>();

    const selectDataList = createSelector(
        (state: any) => state.DiscountCodesManagement,
        (state) => ({
            dataList: state.discountCodeList,
            loading: state.loading
        })
    );

    const { dataList, loading } = useSelector(selectDataList);

    const [data, setData] = useState<DiscountCode[]>([]);
    const [eventData, setEventData] = useState<DiscountCode | null>(null);
    const [show, setShow] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // Opciones para el tipo de descuento
    const discountTypeOptions = [
        { label: "Porcentaje", value: "percentage" },
        { label: "Cantidad fija", value: "fixed" },
    ];

    // Opciones para el estado del código
    const statusOptions = [
        { label: "Activo", value: "active" },
        { label: "Inactivo", value: "inactive" },
    ];

    const getDiscountTypeOption = (type: string) => {
        return discountTypeOptions.find(option => option.value === type) || null;
    };

    const getStatusOption = (status: string) => {
        return statusOptions.find(option => option.value === status) || null;
    };

    // Get Data
    useEffect(() => {
        dispatch(onGetDiscountCodes());
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
        if (eventData && eventData.id) {
            dispatch(onDeleteDiscountCode(eventData.id));
            setDeleteModal(false);
        }
    };

    // Update Data
    const handleUpdateDataClick = (ele: any) => {
        setEventData({ ...ele });
        setIsEdit(true);
        setShow(true);
    };

    // Formik con inicialización condicional
    const initialValues = useMemo(() => ({
        code_id: eventData?.code_id || '',
        name: eventData?.name || '',
        discount_type: eventData?.discount_type || 'percentage',
        discount_value: eventData?.discount_value || 0,
        max_uses: eventData?.max_uses || 100,
        end_date: eventData?.end_date || DateTime.now().plus({ days: 30 }).endOf('day').toISO(),
        status: eventData?.status || 'active',
        uses: eventData?.uses || 0,
    }), [eventData]);

    // validation
    const validation = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            name: Yup.string().required("Por favor ingrese el nombre"),
            discount_type: Yup.string().required("Por favor seleccione el tipo de descuento"),
            discount_value: Yup.number()
                .required("Por favor ingrese el valor del descuento")
                .positive("El valor debe ser positivo")
                .when('discount_type', {
                    is: (val: string) => val === 'percentage',
                    then: (schema) => schema.max(100, "El porcentaje no puede ser mayor a 100"),
                }),
            max_uses: Yup.number()
                .required("Por favor ingrese el número máximo de usos")
                .positive("El número de usos debe ser positivo")
                .integer("Debe ser un número entero"),
            end_date: Yup.date()
                .required("Por favor ingrese la fecha de fin")
                .min(DateTime.now().toISO(), "La fecha de fin no puede ser anterior a hoy"),
        }),
        onSubmit: (values) => {

            const mysqlDate = DateTime.fromISO(values.end_date).toFormat("yyyy-MM-dd HH:mm:ss");

            if (isEdit && eventData && eventData.id) {
                const updateData = {
                    id: eventData.id,
                    ...values,
                    end_date: mysqlDate,
                    // Actualizar estado automáticamente basado en usos y fecha
                    status: DateTime.fromISO(values.end_date) < DateTime.now() ? 'inactive' : 
                        values.uses >= values.max_uses ? 'exhausted' : 
                        values.status
                };
                dispatch(onUpdateDiscountCode(updateData));
            } else {
                const newData = {
                    ...values,
                    id: Math.floor(Math.random() * (30 - 20)) + 20,
                    code_id: values.code_id || "#IRON-DESC-" + uuidv4().split("-")[0].toUpperCase(),
                    uses: 0,
                    status: 'active',
                    end_date: mysqlDate
                };
                console.log("newData", newData);
                dispatch(onAddDiscountCode(newData));
            }
            toggle();
        },
    });

    const toggle = useCallback(() => {
        if (show) {
            setShow(false);
            setEventData(null);
            setIsEdit(false);
        } else {
            setShow(true);
            setEventData({
                code_id: '',
                name: '',
                discount_type: 'percentage',
                discount_value: 0,
                max_uses: 100,
                uses: 0,
                end_date: DateTime.now().plus({ days: 30 }).set({ hour: 23, minute: 59, second: 59 }).toISO(),
                status: 'active'
            });
            validation.resetForm();
        }
    }, [show, validation]);

    // columns
    const columns = useMemo(() => [
        {
            header: "Código",
            accessorKey: "code_id",
            enableColumnFilter: false,
            cell: (cell: any) => (
                <span className="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600">{cell.getValue()}</span>
            ),
        },
        {
            header: "Nombre",
            accessorKey: "name",
            enableColumnFilter: false,
        },
        {
            header: "Tipo",
            accessorKey: "discount_type",
            enableColumnFilter: false,
            cell: (cell: any) => {
                const type = cell.getValue();
                return (
                    <span className={`px-2.5 py-0.5 text-xs inline-block font-medium rounded-full 
                        ${type === 'percentage' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200'}`}>
                        {type === 'percentage' ? 'Porcentaje' : 'Cantidad fija'}
                    </span>
                );
            },
        },
        {
            header: "Valor",
            accessorKey: "discount_value",
            enableColumnFilter: false,
            cell: (cell: any) => {
                const type = cell.row.original.discount_type;
                return (
                    <span>
                        {type === 'percentage' 
                            ? `${cell.getValue()}%` 
                            : `$${Number(cell.getValue()).toFixed(2)}`}
                    </span>
                );
            },
        },
        {
            header: "Usos",
            accessorKey: "uses",
            enableColumnFilter: false,
            cell: (cell: any) => {
                const uses = cell.getValue();
                const maxUses = cell.row.original.max_uses;
                return `${uses}/${maxUses}`;
            },
        },
        {
            header: "Estado",
            accessorKey: "status",
            enableColumnFilter: false,
            cell: (cell: any) => {
                const status = cell.getValue();
                const endDate = cell.row.original.end_date;
                const uses = cell.row.original.uses;
                const maxUses = cell.row.original.max_uses;
                
                let realStatus = status;
                if (DateTime.fromISO(endDate) < DateTime.now()) {
                    realStatus = 'inactive';
                } else if (uses >= maxUses) {
                    realStatus = 'exhausted';
                }
                
                let colorClass = '';
                switch(realStatus) {
                    case 'active':
                        colorClass = 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200';
                        break;
                    case 'inactive':
                        colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200';
                        break;
                    case 'exhausted':
                        colorClass = 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200';
                        break;
                    default:
                        colorClass = 'bg-gray-100 text-gray-800 dark:bg-zink-500/20 dark:text-zink-200';
                }
                
                return (
                    <span className={`px-2.5 py-0.5 text-xs inline-block font-medium rounded-full ${colorClass}`}>
                        {realStatus === 'active' ? 'Activo' : 
                            realStatus === 'inactive' ? 'Inactivo' : 'Agotado'}
                    </span>
                );
            },
        },
        {
            header: "Válido hasta",
            accessorKey: "end_date",
            enableColumnFilter: false,
            cell: (cell: any) => {
                const endDate = cell.getValue();
                const formattedDate = DateTime.fromISO(endDate).toFormat('dd/MM/yyyy');
                const isExpired = DateTime.fromISO(endDate) < DateTime.now();
                
                return (
                    <span className={isExpired ? 'text-red-500' : ''}>
                        {formattedDate}
                    </span>
                );
            },
        },
        {
            header: "Acciones",
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cell: any) => (
                <div className="flex gap-3">
                    <Link to="#!" className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500" onClick={() => {
                        const data = cell.row.original;
                        handleUpdateDataClick(data);
                    }}>
                        <Pencil className="size-4" />
                    </Link>
                    <Link to="#!" className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 text-slate-500 hover:text-red-500 hover:bg-red-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-red-500/20 dark:hover:text-red-500" onClick={() => {
                        const data = cell.row.original;
                        onClickDelete(data);
                    }}>
                        <Trash2 className="size-4" />
                    </Link>
                </div>
            ),
        }
    ], []);

    return (
        <React.Fragment>
            <BreadCrumb title='Lista de Códigos de Descuento' pageTitle='Gestión de Descuentos' />
            <DeleteModal show={deleteModal} onHide={deleteToggle} onDelete={handleDelete} />
            <ToastContainer closeButton={false} limit={1} />
            
            <div className="card" id="Table">
                <div className="card-body">
                    <div className="flex items-center gap-3 mb-4">
                        <h6 className="text-15 grow">Códigos de Descuento (<b>{data.length}</b>)</h6>
                        <div className="shrink-0">
                            <Link to="#!" data-modal-target="addDiscountModal" type="button" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20" onClick={toggle}>
                                <Plus className="inline-block size-4" /> <span className="align-middle">Añadir código</span>
                            </Link>
                        </div>
                    </div>
                    
                    {loading ? (
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
                                <h5 className="mt-2 mb-1">No se encontraron códigos</h5>
                                <p className="mb-0 text-slate-500 dark:text-zink-200">No hay códigos de descuento registrados. Puedes crear uno nuevo.</p>
                            </div>
                        </div>)
                    )}
                </div>
            </div>

            {/* Discount Code Modal */}
            <Modal show={show} onHide={toggle} modal-center="true"
                className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                dialogClassName="w-screen md:w-[35rem] bg-white shadow rounded-md dark:bg-zink-600">
                
                <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-500"
                    closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500">
                    <Modal.Title className="text-16">{!!isEdit ? "Editar Código" : "Añadir Código"}</Modal.Title>
                </Modal.Header>
                
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
                    <form className="create-form" id="create-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                        }}
                    >
                        <input type="hidden" id="id-field" />
                        <div id="alert-error-msg" className="hidden px-4 py-3 text-sm text-red-500 border border-transparent rounded-md bg-red-50 dark:bg-red-500/20"></div>
                        
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                            <div className="xl:col-span-12">
                                <label htmlFor="codeId" className="inline-block mb-2 text-base font-medium">CODIGO ID</label>
                                <input type="text" id="userId" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                    value={validation.values.code_id || "#IRON-DESC-1001557"} disabled />
                            </div>
                            
                            <div className="xl:col-span-12">
                                <label htmlFor="nameInput" className="inline-block mb-2 text-base font-medium">Nombre</label>
                                <input 
                                    type="text" 
                                    id="nameInput" 
                                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" 
                                    placeholder="Ej: Descuento de verano"
                                    name="name"
                                    onChange={validation.handleChange}
                                    value={validation.values.name || ""}
                                />
                                {validation.touched.name && validation.errors.name ? (
                                    <p className="text-red-400">{validation.errors.name}</p>
                                ) : null}
                            </div>
                            
                            <div className="xl:col-span-6">
                                <label htmlFor="discountTypeInput" className="inline-block mb-2 text-base font-medium">Tipo de descuento</label>
                                <Select
                                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                    options={discountTypeOptions}
                                    isSearchable={false}
                                    name="discount_type"
                                    value={getDiscountTypeOption(validation.values.discount_type)}
                                    id="discountTypeInput"
                                    onChange={(selectedOption) => {
                                        validation.setFieldValue("discount_type", selectedOption ? selectedOption.value : "");
                                    }}
                                />
                                {validation.touched.discount_type && validation.errors.discount_type ? (
                                    <p className="text-red-400">{validation.errors.discount_type}</p>
                                ) : null}
                            </div>
                            
                            <div className="xl:col-span-6">
                                <label htmlFor="discountValueInput" className="inline-block mb-2 text-base font-medium">
                                    {validation.values.discount_type === 'percentage' ? 'Porcentaje de descuento' : 'Cantidad de descuento'}
                                </label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        id="discountValueInput" 
                                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" 
                                        placeholder={validation.values.discount_type === 'percentage' ? 'Ej: 20' : 'Ej: 100'}
                                        name="discount_value"
                                        onChange={validation.handleChange}
                                        value={validation.values.discount_value || ""}
                                        min="0"
                                        step={validation.values.discount_type === 'percentage' ? "1" : "0.01"}
                                    />
                                    <span className="absolute top-0 bottom-0 right-0 flex items-center px-4 text-slate-500">
                                        {validation.values.discount_type === 'percentage' ? '%' : '$'}
                                    </span>
                                </div>
                                {validation.touched.discount_value && validation.errors.discount_value ? (
                                    <p className="text-red-400">{validation.errors.discount_value}</p>
                                ) : null}
                            </div>
                            
                            <div className="xl:col-span-6">
                                <label htmlFor="maxUsesInput" className="inline-block mb-2 text-base font-medium">Límite de usos</label>
                                <input 
                                    type="number" 
                                    id="maxUsesInput" 
                                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" 
                                    placeholder="Ej: 100"
                                    name="max_uses"
                                    onChange={validation.handleChange}
                                    value={validation.values.max_uses || ""}
                                    min="1"
                                />
                                {validation.touched.max_uses && validation.errors.max_uses ? (
                                    <p className="text-red-400">{validation.errors.max_uses}</p>
                                ) : null}
                            </div>
                            
                            <div className="xl:col-span-6">
                                <label htmlFor="endDateInput" className="inline-block mb-2 text-base font-medium">Fecha de vencimiento</label>
                                <input 
                                    type="date"
                                    id="endDateInput" 
                                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" 
                                    name="end_date"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            // Crear fecha con hora límite (23:59:59)
                                            const dateWithEndOfDay = DateTime.fromISO(e.target.value)
                                                .set({ hour: 23, minute: 59, second: 59 })
                                                .toISO();
                                            validation.setFieldValue("end_date", dateWithEndOfDay);
                                        } else {
                                            validation.setFieldValue("end_date", '');
                                        }
                                    }}
                                    value={validation.values.end_date 
                                        ? DateTime.fromISO(validation.values.end_date).toFormat("yyyy-MM-dd") 
                                        : ""}
                                    min={DateTime.now().toFormat("yyyy-MM-dd")}
                                />
                                {validation.touched.end_date && validation.errors.end_date ? (
                                    <p className="text-red-400">{validation.errors.end_date}</p>
                                ) : null}
                            </div>

                            {isEdit && (
                                <div className="xl:col-span-6">
                                    <label htmlFor="usesInput" className="inline-block mb-2 text-base font-medium">Usos actuales</label>
                                    <input 
                                        type="number" 
                                        id="usesInput" 
                                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" 
                                        name="uses"
                                        onChange={validation.handleChange}
                                        value={validation.values.uses || ""}
                                        min="0"
                                        disabled
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-4">
                            <button 
                                type="button" 
                                className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10" 
                                onClick={toggle}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                            >
                                {!!isEdit ? "Actualizar" : "Añadir Código"}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default DiscountCodeList;