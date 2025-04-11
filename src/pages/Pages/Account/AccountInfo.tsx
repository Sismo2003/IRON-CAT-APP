import React, { useEffect, useState } from "react";
import {
  BadgeCheck,
  UserCircle,
  MapPin,
  Mail,
  Phone,
  Clock,
  FileText
} from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getCustomerById } from 'slices/thunk';
import avatar1 from "assets/images/users/avatar-1.png";

const AccountInfo = ({ className, clientId }: { className?: string, clientId?: number }) => {
  const dispatch = useDispatch<any>();

  const selectData = createSelector(
    (state: any) => state.CUSTOMERManagement,
    (CustomerManagement) => ({
      customer: CustomerManagement.customer
    })
  );

  const { customer } = useSelector(selectData);
  const [customerData, setCustomerData] = useState<any>({});

  useEffect(() => {
    if (clientId) {
      dispatch(getCustomerById({ clientId }));
    }
  }, [dispatch, clientId]);

  useEffect(() => {
    if (customer) {
      setCustomerData(customer);
    }
  }, [customer]);

  const InfoBlock = ({ icon: Icon, label, value, colorClass }: any) => (
    <div className="flex items-start gap-3">
      <Icon className={`flex-shrink-0 mt-0.5 ${colorClass}`} />
      <div className="min-w-0">
        <p className="text-sm text-slate-500 dark:text-zink-400 truncate">{label}</p>
        <p className="text-slate-700 dark:text-zink-200 break-words whitespace-pre-wrap">{value}</p>
      </div>
    </div>
  );

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Imagen de perfil */}
        <div className="lg:col-span-3 xl:col-span-2 flex justify-center lg:justify-start">
          <div className="relative w-24 h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-zink-600 border-4 border-white dark:border-zink-700 shadow-sm">
            <img 
              src={customerData.img ?? avatar1} 
              alt="" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Información del cliente */}
        <div className="lg:col-span-9 xl:col-span-10">
          <div className="flex flex-col space-y-4">
            {/* Nombre y verificación */}
            <div className="flex items-center space-x-2">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-zink-100">
                {customerData.fullname || 'Nombre no disponible'}
              </h2>
              <BadgeCheck className="text-sky-500 dark:text-custom-500 fill-sky-100 dark:fill-custom-500/20 w-5 h-5" />
            </div>

            {/* Datos del cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5">
              <InfoBlock
                icon={UserCircle}
                label="ID Cliente"
                value={customerData.customer_id || 'No asignado'}
                colorClass="text-slate-500 dark:text-zink-400"
              />
              <InfoBlock
                icon={MapPin}
                label="Dirección"
                value={customerData.address || 'No registrada'}
                colorClass="text-slate-500 dark:text-zink-400"
              />
              <InfoBlock
                icon={Mail}
                label="Email"
                value={customerData.email || 'No registrado'}
                colorClass="text-slate-500 dark:text-zink-400"
              />
              <InfoBlock
                icon={Phone}
                label="Teléfono"
                value={customerData.phone || 'No registrado'}
                colorClass="text-slate-500 dark:text-zink-400"
              />
              <InfoBlock
                icon={FileText}
                label="RFC"
                value={customerData.rfc || 'No registrado'}
                colorClass={customerData.rfc ? 'text-slate-500 dark:text-zink-400' : 'text-slate-400 dark:text-zink-500'}
              />
              <InfoBlock
                icon={Clock}
                label="Última visita"
                value={customerData.last_visit
                  ? new Date(customerData.last_visit).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                  : 'Sin registro'}
                colorClass={customerData.last_visit ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-zink-500'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;