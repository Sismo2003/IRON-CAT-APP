import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  getMaterialsByClient as onGetMaterialsByClient,
  assignMaterialToClient as onAssignMaterialToClient,
  unassignMaterialFromClient as onUnassignMaterialFromClient,
} from "slices/thunk";

interface Material {
  id: number;
  name: string;
  assigned: boolean;
}

interface MaterialState {
  materials: Material[];
  loading: boolean;
  error: string | null;
}

interface RootState {
  AssingMaterial: MaterialState;
}

const OverviewTabs = ({ clientId }: { clientId: number | null }) => {
  const dispatch = useDispatch<any>();
  const [transitioningIds, setTransitioningIds] = useState<number[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const selectDataList = createSelector(
    (state: RootState) => state.AssingMaterial,
    (state) => ({
      materials: state.materials,
      loading: state.loading,
      error: state.error,
    })
  );

  const { materials, loading, error } = useSelector(selectDataList);

  useEffect(() => {
    if (clientId !== null) {
      dispatch(onGetMaterialsByClient({ clientId })).finally(() => {
        setInitialLoad(false);
      });
    }
  }, [dispatch, clientId]);

  const handleMaterialAction = async (material: Material, action: 'assign' | 'unassign') => {
    setTransitioningIds(prev => [...prev, material.id]);
    
    try {
      if (action === 'assign') {
        await dispatch(onAssignMaterialToClient({ material, clientId }));
      } else {
        await dispatch(onUnassignMaterialFromClient({ material, clientId }));
      }
    } finally {
      setTimeout(() => {
        setTransitioningIds(prev => prev.filter(id => id !== material.id));
      }, 300);
    }
  };

  if (clientId === null) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md dark:bg-red-500/20">
        Error: No se proporcionó un ID de cliente.
      </div>
    );
  }

  const assignedMaterials = materials.filter((material) => material.assigned);
  const availableMaterials = materials.filter((material) => !material.assigned);

  return (
    <div className="space-y-6">
      {/* Sección de Materiales Asignados */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-15 font-semibold text-gray-800 dark:text-zink-100">
              Materiales Asignados al Cliente
            </h6>
            {assignedMaterials.length > 0 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200">
                {assignedMaterials.length} asignados
              </span>
            )}
          </div>

          {initialLoad && loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 rounded-full border-slate-200 border-t-custom-500 animate-spin"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 text-red-500 bg-red-50 rounded-md dark:bg-red-500/20">
                  {error}
                </div>
              )}

              {assignedMaterials.length === 0 ? (
                <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md dark:bg-zink-600 dark:text-zink-200">
                  {initialLoad ? 'Cargando...' : 'No hay materiales asignados a este cliente.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {assignedMaterials.map((material) => (
                    <div
                      key={material.id}
                      className={`relative flex items-center justify-between p-3 transition-all duration-300 border rounded-md group
                        ${transitioningIds.includes(material.id) 
                          ? 'opacity-50 scale-95 bg-slate-50 dark:bg-zink-700' 
                          : 'border-slate-200 dark:border-zink-500 hover:shadow-sm hover:border-custom-500 dark:hover:border-custom-500'}
                      `}
                    >
                      {transitioningIds.includes(material.id) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 rounded-full border-slate-300 border-t-custom-500 animate-spin"></div>
                        </div>
                      )}
                      <span className={`font-medium transition-all duration-300 
                        ${transitioningIds.includes(material.id) ? 'text-gray-400 dark:text-zink-400' : 'text-gray-700 dark:text-zink-100 group-hover:text-custom-500'}`}
                      >
                        {material.name}
                      </span>
                      <button
                        onClick={() => handleMaterialAction(material, 'unassign')}
                        className={`p-1 transition-all duration-300 rounded-md 
                          ${transitioningIds.includes(material.id) 
                            ? 'text-slate-300 dark:text-zink-500 cursor-not-allowed' 
                            : 'text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20'}
                          group-hover:opacity-100`}
                        aria-label="Desasignar material"
                        disabled={transitioningIds.includes(material.id)}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sección de Materiales Disponibles */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-15 font-semibold text-gray-800 dark:text-zink-100">
              Materiales Disponibles
            </h6>
            {availableMaterials.length > 0 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200">
                {availableMaterials.length} disponibles
              </span>
            )}
          </div>

          {initialLoad && loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 rounded-full border-slate-200 border-t-custom-500 animate-spin"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 text-red-500 bg-red-50 rounded-md dark:bg-red-500/20">
                  {error}
                </div>
              )}

              {availableMaterials.length === 0 ? (
                <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md dark:bg-zink-600 dark:text-zink-200">
                  {initialLoad ? 'Cargando...' : 'No hay materiales disponibles para asignar.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {availableMaterials.map((material) => (
                    <div
                      key={material.id}
                      className={`relative flex items-center justify-between p-3 transition-all duration-300 border rounded-md group
                        ${transitioningIds.includes(material.id) 
                          ? 'opacity-50 scale-95 bg-slate-50 dark:bg-zink-700' 
                          : 'border-slate-200 dark:border-zink-500 hover:shadow-sm hover:border-custom-500 dark:hover:border-custom-500'}
                      `}
                    >
                      {transitioningIds.includes(material.id) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 rounded-full border-slate-300 border-t-custom-500 animate-spin"></div>
                        </div>
                      )}
                      <span className={`font-medium transition-all duration-300 
                        ${transitioningIds.includes(material.id) ? 'text-gray-400 dark:text-zink-400' : 'text-gray-700 dark:text-zink-100 group-hover:text-custom-500'}`}
                      >
                        {material.name}
                      </span>
                      <button
                        onClick={() => handleMaterialAction(material, 'assign')}
                        className={`p-1 transition-all duration-300 rounded-md 
                          ${transitioningIds.includes(material.id) 
                            ? 'text-slate-300 dark:text-zink-500 cursor-not-allowed' 
                            : 'text-slate-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/20'}
                          group-hover:opacity-100`}
                        aria-label="Asignar material"
                        disabled={transitioningIds.includes(material.id)}
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTabs;