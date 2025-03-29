import React, { useState, useRef } from 'react';
import { MoreVertical, Eye, Edit, Trash2, X, Plus, FileText, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Dropdown } from 'Common/Components/Dropdown';

// Importa tus imágenes por defecto
import img02 from "assets/images/product/img-02.png";
import img03 from "assets/images/product/img-03.png";
import img04 from "assets/images/product/img-04.png";

interface Transporte {
  id: number;
  imagen: string | ArrayBuffer | null | undefined;
  nombre: string;
  placa: string;
  conductor: string;
  kilometraje: string;
  adeudos: string;
  novedades: string;
}

const TopSellingProducts = () => {
  // Estado para los transportes
  const [transportes, setTransportes] = useState<Transporte[]>([
    {
      id: 1,
      imagen: img02,
      nombre: "Camion F350 Diesel Blanco",
      placa: "ABC-1234",
      conductor: "Juan Pérez",
      kilometraje: "85,250 km",
      adeudos: "$2,500.00",
      novedades: "Requiere cambio de aceite y revisión de frenos"
    },
    {
      id: 2,
      imagen: img03,
      nombre: "Camioneta Chevrolet Silverado",
      placa: "DEF-5678",
      conductor: "María García",
      kilometraje: "62,100 km",
      adeudos: "$0.00",
      novedades: "En buen estado, sin observaciones"
    },
    {
      id: 3,
      imagen: img04,
      nombre: "Vehículo de reparto Ford Transit",
      placa: "GHI-9012",
      conductor: "Carlos López",
      kilometraje: "120,750 km",
      adeudos: "$1,200.00",
      novedades: "Necesita alineación y balanceo"
    },
    {
      id: 4,
      imagen: img02,
      nombre: "Camion Volvo FH16",
      placa: "JKL-3456",
      conductor: "Pedro Martínez",
      kilometraje: "95,300 km",
      adeudos: "$3,200.00",
      novedades: "Requiere revisión de suspensión"
    }
  ]);

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const transportesPorPagina = 3;
  
  // Calcular transportes para la página actual
  const indiceUltimo = paginaActual * transportesPorPagina;
  const indicePrimero = indiceUltimo - transportesPorPagina;
  const transportesActuales = transportes.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(transportes.length / transportesPorPagina);

  // Estados para los modales
  const [transporteSeleccionado, setTransporteSeleccionado] = useState<Transporte | null>(null);
  const [editando, setEditando] = useState(false);
  const [agregando, setAgregando] = useState(false);
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [datosEditados, setDatosEditados] = useState<Partial<Transporte>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para obtener la URL de la imagen segura
  const getImageUrl = (imagen: string | ArrayBuffer | null | undefined): string => {
    if (typeof imagen === 'string') {
      return imagen;
    }
    return img02; // Imagen por defecto si no es string
  };

  // Función corregida para manejar el cambio de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event?.target?.result;
        if (result) {
          setDatosEditados(prev => ({
            ...prev,
            imagen: result
          }));
        }
      };
      reader.onerror = () => {
        console.error("Error al leer la imagen");
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para activar el input file
  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  // Función para ver detalles
  const handleVer = (transporte: Transporte) => {
    setTransporteSeleccionado(transporte);
    setEditando(false);
    setAgregando(false);
    setMostrarReporte(false);
  };

  // Función para iniciar edición
  const handleIniciarEdicion = (transporte: Transporte) => {
    setTransporteSeleccionado(transporte);
    setDatosEditados({ ...transporte });
    setEditando(true);
    setAgregando(false);
    setMostrarReporte(false);
  };

  // Función para iniciar agregar nuevo transporte
  const handleIniciarAgregar = () => {
    setTransporteSeleccionado(null);
    setDatosEditados({
      imagen: img02,
      nombre: "",
      placa: "",
      conductor: "",
      kilometraje: "0 km",
      adeudos: "$0.00",
      novedades: "Sin novedades"
    });
    setEditando(true);
    setAgregando(true);
    setMostrarReporte(false);
  };

  // Función para generar reporte general
  const generarReporteGeneral = () => {
    setMostrarReporte(true);
    setEditando(false);
    setAgregando(false);
  };

  // Función para guardar cambios
  const handleGuardar = () => {
    if (agregando) {
      // Agregar nuevo transporte
      const nuevoTransporte: Transporte = {
        id: Math.max(0, ...transportes.map(t => t.id)) + 1,
        imagen: datosEditados.imagen || img02,
        nombre: datosEditados.nombre || "",
        placa: datosEditados.placa || "",
        conductor: datosEditados.conductor || "",
        kilometraje: datosEditados.kilometraje || "0 km",
        adeudos: datosEditados.adeudos || "$0.00",
        novedades: datosEditados.novedades || "Sin novedades"
      };
      setTransportes([...transportes, nuevoTransporte]);
    } else if (transporteSeleccionado) {
      // Editar transporte existente
      const transportesActualizados = transportes.map(t => 
        t.id === transporteSeleccionado.id ? { 
          ...t, 
          ...datosEditados,
          imagen: datosEditados.imagen || t.imagen
        } : t
      );
      setTransportes(transportesActualizados);
    }
    
    setEditando(false);
    setAgregando(false);
    setTransporteSeleccionado(null);
  };

  // Función para eliminar transporte
  const handleEliminar = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este transporte?")) {
      const nuevosTransportes = transportes.filter(t => t.id !== id);
      setTransportes(nuevosTransportes);
      
      // Ajustar paginación si es necesario
      if (paginaActual > 1 && nuevosTransportes.length <= (paginaActual - 1) * transportesPorPagina) {
        setPaginaActual(paginaActual - 1);
      }
    }
  };

  // Función para cancelar
  const handleCancelar = () => {
    setEditando(false);
    setAgregando(false);
    setMostrarReporte(false);
    setTransporteSeleccionado(null);
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDatosEditados(prev => ({ ...prev, [name]: value }));
  };

  // Función para cambiar de página
  const cambiarPagina = (numeroPagina: number) => {
    setPaginaActual(numeroPagina);
  };

  // Función para exportar reporte
  const exportarReporte = () => {
    console.log("Exportando reporte...");
    alert("Reporte exportado correctamente");
  };

  return (
    <React.Fragment>
      <div className="col-span-12 card lg:col-span-6 2xl:col-span-3">
        <div className="card-body">
          <div className="flex items-center mb-3">
            <h6 className="grow text-15">Transportes ({transportes.length})</h6>
            <Dropdown className="relative shrink-0">
              <Dropdown.Trigger type="button" className="flex items-center justify-center size-[30px] p-0 bg-white text-slate-500 btn hover:text-slate-500 hover:bg-slate-100 focus:text-slate-500 focus:bg-slate-100 active:text-slate-500 active:bg-slate-100 dark:bg-zink-700 dark:hover:bg-slate-500/10 dark:focus:bg-slate-500/10 dark:active:bg-slate-500/10 dropdown-toggle" id="sellingProductDropdown" data-bs-toggle="dropdown">
                <MoreVertical className="inline-block size-4" />
              </Dropdown.Trigger>
              <Dropdown.Content placement="right-end" className="absolute z-50 py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-md dropdown-menu min-w-[10rem] dark:bg-zink-600" aria-labelledby="sellingProductDropdown">
                <li>
                  <button onClick={handleIniciarAgregar} className="flex items-center w-full px-4 py-1.5 text-base text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200">
                    <Plus className="size-4 mr-2" /> Agregar
                  </button>
                </li>
                <li>
                  <button onClick={generarReporteGeneral} className="flex items-center w-full px-4 py-1.5 text-base text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200">
                    <FileText className="size-4 mr-2" /> Reporte General
                  </button>
                </li>
              </Dropdown.Content>
            </Dropdown>
          </div>
          
          <div>
            <ul className="flex flex-col gap-5">
              {transportesActuales.map((transporte) => (
                <li key={transporte.id} className="flex items-center gap-3 p-3 border rounded-md border-slate-200 dark:border-zink-500">
                  <div className="flex items-center justify-center size-10 rounded-md bg-slate-100 dark:bg-zink-600">
                    <img src={getImageUrl(transporte.imagen)} alt="Vehículo" className="h-6 rounded-md" />
                  </div>
                  <div className="overflow-hidden grow">
                    <h6 className="font-semibold">{transporte.nombre}</h6>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-zink-300">Placa:</span> 
                        <span className="ml-2 font-medium">{transporte.placa}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-zink-300">Conductor:</span> 
                        <span className="ml-2 font-medium">{transporte.conductor}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-zink-300">Kilometraje:</span> 
                        <span className="ml-2 font-medium">{transporte.kilometraje}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-zink-300">Adeudos:</span> 
                        <span className={`ml-2 font-medium ${transporte.adeudos !== "$0.00" ? "text-red-500" : "text-green-500"}`}>
                          {transporte.adeudos}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-slate-500 dark:text-zink-300">Novedades:</span> 
                      <p className="text-sm text-slate-600 dark:text-zink-200 line-clamp-1">{transporte.novedades}</p>
                    </div>
                  </div>
                  <div className="flex flex-col shrink-0 gap-2">
                    <button 
                      onClick={() => handleVer(transporte)}
                      className="flex items-center justify-center p-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                      title="Ver detalles">
                      <Eye className="size-4" />
                    </button>
                    <button 
                      onClick={() => handleIniciarEdicion(transporte)}
                      className="flex items-center justify-center p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                      title="Editar">
                      <Edit className="size-4" />
                    </button>
                    <button 
                      onClick={() => handleEliminar(transporte.id)}
                      className="flex items-center justify-center p-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                      title="Eliminar">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Paginación */}
            {transportes.length > transportesPorPagina && (
              <div className="flex items-center justify-center mt-6 gap-1">
                <button 
                  onClick={() => cambiarPagina(paginaActual - 1)} 
                  disabled={paginaActual === 1}
                  className="flex items-center justify-center size-8 p-0 text-slate-500 btn hover:text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                >
                  <ChevronLeft className="size-4" />
                </button>
                
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                  <button
                    key={numero}
                    onClick={() => cambiarPagina(numero)}
                    className={`flex items-center justify-center size-8 p-0 btn ${paginaActual === numero ? 'bg-blue-500 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    {numero}
                  </button>
                ))}
                
                <button 
                  onClick={() => cambiarPagina(paginaActual + 1)} 
                  disabled={paginaActual === totalPaginas}
                  className="flex items-center justify-center size-8 p-0 text-slate-500 btn hover:text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para Reporte General */}
      {mostrarReporte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg dark:bg-zink-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold">Reporte General de Transportes</h5>
              <button onClick={() => setMostrarReporte(false)} className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-zink-600 dark:text-zink-200">
                  <tr>
                    <th className="px-4 py-3">Vehículo</th>
                    <th className="px-4 py-3">Placa</th>
                    <th className="px-4 py-3">Conductor</th>
                    <th className="px-4 py-3">Kilometraje</th>
                    <th className="px-4 py-3">Adeudos</th>
                    <th className="px-4 py-3">Novedades</th>
                  </tr>
                </thead>
                <tbody>
                  {transportes.map((transporte) => (
                    <tr key={transporte.id} className="border-b dark:border-zink-500">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={getImageUrl(transporte.imagen)} alt="Vehículo" className="size-8 rounded-md" />
                          <span>{transporte.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{transporte.placa}</td>
                      <td className="px-4 py-3">{transporte.conductor}</td>
                      <td className="px-4 py-3">{transporte.kilometraje}</td>
                      <td className={`px-4 py-3 ${transporte.adeudos !== "$0.00" ? "text-red-500" : "text-green-500"}`}>
                        {transporte.adeudos}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">{transporte.novedades}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setMostrarReporte(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600"
              >
                Cerrar
              </button>
              <button
                onClick={exportarReporte}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                <Download className="size-4" /> Exportar Reporte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar/agregar */}
      {(editando || agregando) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg dark:bg-zink-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold">
                {agregando ? "Agregar Nuevo Transporte" : "Editar Transporte"}
              </h5>
              <button 
                onClick={handleCancelar}
                className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Sección para editar la imagen */}
              <div>
                <label className="block mb-1 text-sm font-medium">Imagen del Vehículo</label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={getImageUrl(datosEditados.imagen)} 
                      alt="Vehículo" 
                      className="size-16 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleSelectImage}
                      className="absolute bottom-0 right-0 p-1 text-white bg-blue-500 rounded-full hover:bg-blue-600"
                    >
                      <Edit className="size-3" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <span className="text-sm text-slate-500 dark:text-zink-300">
                    Haz clic en el ícono para cambiar la imagen
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={datosEditados.nombre || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md dark:bg-zink-800 dark:border-zink-600"
                    placeholder="Ej: Camion F350 Diesel Blanco"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Placa</label>
                  <input
                    type="text"
                    name="placa"
                    value={datosEditados.placa || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md dark:bg-zink-800 dark:border-zink-600"
                    placeholder="Ej: ABC-1234"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Conductor</label>
                  <input
                    type="text"
                    name="conductor"
                    value={datosEditados.conductor || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md dark:bg-zink-800 dark:border-zink-600"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Kilometraje</label>
                  <input
                    type="text"
                    name="kilometraje"
                    value={datosEditados.kilometraje || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md dark:bg-zink-800 dark:border-zink-600"
                    placeholder="Ej: 85,250 km"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Adeudos</label>
                  <input
                    type="text"
                    name="adeudos"
                    value={datosEditados.adeudos || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md dark:bg-zink-800 dark:border-zink-600"
                    placeholder="Ej: $2,500.00"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Novedades</label>
                <textarea
                  name="novedades"
                  value={datosEditados.novedades || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border rounded-md dark:bg-zink-800 dark:border-zink-600"
                  placeholder="Ej: Requiere cambio de aceite"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={handleCancelar}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  {agregando ? "Agregar" : "Guardar Cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {transporteSeleccionado && !editando && !mostrarReporte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg dark:bg-zink-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold">Detalles del Transporte</h5>
              <button 
                onClick={handleCancelar}
                className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="size-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center size-16 rounded-md bg-slate-100 dark:bg-zink-600">
                  <img src={getImageUrl(transporteSeleccionado.imagen)} alt="Vehículo" className="h-10 rounded-md" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{transporteSeleccionado.nombre}</h4>
                  <p className="text-slate-500 dark:text-zink-300">Placa: {transporteSeleccionado.placa}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                <div className="p-3 border rounded-md dark:border-zink-500">
                  <h6 className="mb-2 text-sm font-semibold">Información General</h6>
                  <div className="space-y-2">
                    <p><span className="text-slate-500 dark:text-zink-300">Conductor:</span> {transporteSeleccionado.conductor}</p>
                    <p><span className="text-slate-500 dark:text-zink-300">Kilometraje:</span> {transporteSeleccionado.kilometraje}</p>
                    <p>
                      <span className="text-slate-500 dark:text-zink-300">Adeudos:</span> 
                      <span className={`ml-1 ${transporteSeleccionado.adeudos !== "$0.00" ? "text-red-500" : "text-green-500"}`}>
                        {transporteSeleccionado.adeudos}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-3 border rounded-md dark:border-zink-500">
                  <h6 className="mb-2 text-sm font-semibold">Novedades</h6>
                  <p className="text-slate-600 dark:text-zink-200">{transporteSeleccionado.novedades}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelar}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleIniciarEdicion(transporteSeleccionado)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Editar Transporte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default TopSellingProducts;