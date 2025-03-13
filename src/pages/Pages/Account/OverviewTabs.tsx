import React, { useEffect} from "react";
import { X, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  getMaterialsByClient as onGetMaterialsByClient,
  assignMaterialToClient as onAssignMaterialToClient,
  unassignMaterialFromClient as onUnassignMaterialFromClient,
} from "slices/thunk";

// Definir el tipo de un material
interface Material {
  id: number;
  name: string;
  assigned: boolean;
}

// Definir el tipo del estado de Redux
interface MaterialState {
  materials: Material[];
  loading: boolean;
  error: string | null;
}

// Definir el tipo del estado global de la aplicación
interface RootState {
  AssingMaterial: MaterialState;
}

const OverviewTabs = ({ clientId }: { clientId: number | null }) => {
  // Llamar a los Hooks en el cuerpo principal del componente
  const dispatch = useDispatch<any>();

  // Selector para obtener los datos del estado
  const selectDataList = createSelector(
    (state: RootState) => state.AssingMaterial,
    (state) => ({
      materials: state.materials,
      loading: state.loading,
      error: state.error,
    })
  );

  const { materials, loading, error } = useSelector(selectDataList);

  // Obtener datos de la base de datos
  useEffect(() => {
    if (clientId !== null) {
      dispatch(onGetMaterialsByClient({ clientId }));
    }
  }, [dispatch, clientId]); // Agrega clientId al arreglo de dependencias

  // Si no hay clientId, mostrar un mensaje de error
  if (clientId === null) {
    return <p>Error: No se proporcionó un ID de cliente.</p>;
  }



  // Función para asignar un material al cliente
  const handleAssignMaterial = (material: Material) => {
    dispatch(onAssignMaterialToClient({ material, clientId }));
  };

  // Función para desasignar un material del cliente
  const handleUnassignMaterial = (material: Material) => {
    dispatch(onUnassignMaterialFromClient({ material, clientId }));
  };

  // Materiales asignados al cliente
  const assignedMaterials = materials.filter((material) => material.assigned);

  // Materiales disponibles para asignar
  const availableMaterials = materials.filter((material) => !material.assigned);

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 gap-x-5 2xl:grid-cols-12">
        <div className="2xl:col-span-9">
          <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
            <div className="xl:col-span-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="mb-3 text-15">Materiales Asignados al Cliente</h6>
                  {loading && <p>Cargando...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {assignedMaterials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-4 border rounded-md border-slate-200 dark:border-zink-500"
                      >
                        <span>{material.name}</span>
                        <button
                          onClick={() => handleUnassignMaterial(material)}
                          className="p-1 text-red-500 transition-all duration-200 ease-linear rounded-md hover:bg-red-100 dark:hover:bg-red-500/20"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-5 2xl:grid-cols-12">
        <div className="2xl:col-span-9">
          <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
            <div className="xl:col-span-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="mb-3 text-15">Materiales Disponibles</h6>
                  {loading && <p>Cargando...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {availableMaterials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-4 border rounded-md border-slate-200 dark:border-zink-500"
                      >
                        <span>{material.name}</span>
                        <button
                          onClick={() => handleAssignMaterial(material)}
                          className="p-1 text-green-500 transition-all duration-200 ease-linear rounded-md hover:bg-green-100 dark:hover:bg-green-500/20"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OverviewTabs;