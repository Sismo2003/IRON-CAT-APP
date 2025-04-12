import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createSelector } from 'reselect';
import BreadCrumb from "Common/BreadCrumb";
import withRouter from "Common/withRouter";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import "intl"; // Polyfill para internacionalización
import "intl/locale-data/jsonp/es"; // Datos de localización para español

DateTime.local().setLocale('es');

interface AppUser {
  email: string;
  username: string;
  uid: string;
  id: number;
  img: string;
  last_login: string;
  created_at: string;
  role: 'admin' | 'user';
}

interface ProfileState {
  user: AppUser | null;
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const UserIcon: React.FC<IconProps> = (props) => (
  <svg 
    className={`w-5 h-5 text-red-500 dark:text-red-400 ${props.className || ''}`} 
    fill="currentColor" 
    viewBox="0 0 20 20" 
    {...props}
  >
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
  </svg>
);

const EmailIcon: React.FC<IconProps> = (props) => (
  <svg 
    className={`w-5 h-5 text-red-500 dark:text-red-400 ${props.className || ''}`} 
    fill="currentColor" 
    viewBox="0 0 20 20" 
    {...props}
  >
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
  </svg>
);

const IdIcon: React.FC<IconProps> = (props) => (
  <svg 
    className={`w-5 h-5 text-red-500 dark:text-red-400 ${props.className || ''}`} 
    fill="currentColor" 
    viewBox="0 0 20 20" 
    {...props}
  >
    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a1 1 0 110 2h-1v9a2 2 0 01-2 2H7a2 2 0 01-2-2V6H4a1 1 0 010-2z" clipRule="evenodd"></path>
  </svg>
);

const CalendarIcon: React.FC<IconProps> = (props) => (
  <svg 
    className={`w-5 h-5 text-red-500 dark:text-red-400 ${props.className || ''}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    strokeWidth="1.5"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" 
    />
  </svg>
);

const ClockIcon: React.FC<IconProps> = (props) => (
  <svg 
    className={`w-5 h-5 text-red-500 dark:text-red-400 ${props.className || ''}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    strokeWidth="1.5"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>
);

const UserProfileCard = ({ userData }: { userData: AppUser | null }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="card overflow-hidden bg-white dark:bg-zink-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-zink-600"
  >
    <div className="relative h-32 md:h-40 bg-gradient-to-r from-red-500/20 to-red-600/20 dark:from-red-500/10 dark:to-red-600/10">
      <div className="absolute -bottom-12 md:-bottom-16 left-4 md:left-6">
        <div className="relative group">
          <img
            src={userData?.img || '/assets/images/users/avatar-1.jpg'}
            alt="Perfil de usuario"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-zink-600 shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-red-400/30 transition-all duration-300"></div>
        </div>
      </div>
    </div>
    <div className="pt-16 md:pt-20 pb-4 md:pb-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="mb-3 md:mb-0">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-zink-100 mb-1">
            {userData?.username || 'Usuario'}
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-zink-300">{userData?.email || 'correo@ejemplo.com'}</p>
        </div>
        <span className="self-start md:self-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-600 dark:text-red-400">
          {userData?.role === 'admin' ? 'Administrador' : 'Usuario'}
        </span>
      </div>
    </div>
  </motion.div>
);

const InfoItem = ({ label, value, icon }: { label: string; value: string | number, icon: React.ReactNode }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="flex items-start p-4 rounded-xl bg-white dark:bg-zink-700 shadow-md hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-zink-600"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center text-red-500 dark:text-red-400 mr-3">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-slate-600 dark:text-zink-300 mb-1 truncate">{label}</h4>
      <p className="text-lg font-semibold text-slate-700 dark:text-zink-100 truncate">{value}</p>
    </div>
  </motion.div>
);

const UserProfile = () => {
  document.title = "Perfil | Iron Cat Recicladora";

  const selectProfileState = createSelector(
    (state: any) => state.Profile,
    (profile): ProfileState => ({
      user: profile.user
    })
  );

  const { user: reduxUser } = useSelector(selectProfileState);
  const [localUser, setLocalUser] = useState<AppUser | null>(null);

  const isUserEmpty = (user: any): boolean => {
    return !user || (typeof user === 'object' && Object.keys(user).length === 0);
  };

  const parseUserFromStorage = (storedUser: string): AppUser | null => {
    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.email && !parsedUser.username && !parsedUser.uid) {
        return null;
      }
      return {
        email: parsedUser.email || '',
        username: parsedUser.username || parsedUser.email?.split('@')[0] || 'Usuario',
        uid: parsedUser.uid || '#IRON-USER-00000000',
        id: parsedUser.id || 0,
        img: parsedUser.img || '/assets/images/users/avatar-1.jpg',
        last_login: parsedUser.last_login || '',
        created_at: parsedUser.created_at || '',
        role: parsedUser.role || 'user'
      };
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (isUserEmpty(reduxUser)) {
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        const parsedUser = parseUserFromStorage(storedUser);
        if (parsedUser) setLocalUser(parsedUser);
      }
    }
  }, [reduxUser]);

  const userData = isUserEmpty(reduxUser) ? localUser : reduxUser;

  console.log('User Data:', userData);

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'No disponible';
    
    try {
      return DateTime.fromISO(dateString)
        .setLocale('es')
        .toLocaleString({
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
    } catch (e) {
      console.error("Error formateando fecha:", e);
      return 'Fecha inválida';
    }
  };
  
  const formatLastLogin = (dateString: string): string => {
    if (!dateString) return 'No disponible';
    
    // Traducciones mejoradas con manejo de género y plurales
    const translations = {
      years: (n: number) => n === 1 ? 'hace 1 año' : `hace ${n} años`,
      months: (n: number) => n === 1 ? 'hace 1 mes' : `hace ${n} meses`,
      days: (n: number) => n === 1 ? 'hace 1 día' : `hace ${n} días`,
      hours: (n: number) => n === 1 ? 'hace 1 hora' : `hace ${n} horas`,
      minutes: (n: number) => n === 1 ? 'hace 1 minuto' : `hace ${n} minutos`,
      seconds: (n: number) => n < 5 ? 'hace unos segundos' : `hace ${n} segundos`
    };
  
    try {
      const date = DateTime.fromISO(dateString);
      const now = DateTime.now();
      const diff = now.diff(date, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);
  
      // Convertir a números enteros
      const years = Math.floor(diff.years);
      const months = Math.floor(diff.months);
      const days = Math.floor(diff.days);
      const hours = Math.floor(diff.hours);
      const minutes = Math.floor(diff.minutes);
      const seconds = Math.floor(diff.seconds);
  
      if (years > 0) return translations.years(years);
      if (months > 0) return translations.months(months);
      if (days > 0) return translations.days(days);
      if (hours > 0) return translations.hours(hours);
      if (minutes > 0) return translations.minutes(minutes);
      return translations.seconds(seconds);
      
    } catch (e) {
      console.error("Error formateando última conexión:", e);
      return 'Fecha inválida';
    }
  };

  return (
    <div className="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto px-4 sm:px-6">
      <BreadCrumb title="Perfil de Usuario" pageTitle="Usuario" />

      <div className="grid grid-cols-1 gap-5 sm:gap-6">
        <UserProfileCard userData={userData} />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <InfoItem 
            label="Nombre de usuario" 
            value={userData?.username || 'No disponible'} 
            icon={<UserIcon />}
          />
          <InfoItem 
            label="Correo electrónico" 
            value={userData?.email || 'No disponible'} 
            icon={<EmailIcon />}
          />
          <InfoItem 
            label="ID de usuario" 
            value={userData?.uid || 'No disponible'} 
            icon={<IdIcon />}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="card border border-slate-200 dark:border-zink-600"
        >
          <div className="card-body p-5">
            <h4 className="text-lg font-semibold text-slate-700 dark:text-zink-100 mb-4">Detalles adicionales</h4>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-slate-200 dark:border-zink-500 hover:bg-slate-50 dark:hover:bg-zink-600 transition-colors duration-200 rounded-lg">
                <span className="text-sm sm:text-base text-slate-600 dark:text-zink-300 mb-1 sm:mb-0 flex items-center">
                  <span className="p-2 mr-3 rounded-full bg-red-500/10 dark:bg-red-500/20">
                    <CalendarIcon />
                  </span>
                  Miembro desde
                </span>
                <span className="font-medium text-slate-700 dark:text-zink-100">
                  {formatDate(userData?.created_at || '')}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-slate-200 dark:border-zink-500 hover:bg-slate-50 dark:hover:bg-zink-600 transition-colors duration-200 rounded-lg">
                <span className="text-sm sm:text-base text-slate-600 dark:text-zink-300 mb-1 sm:mb-0 flex items-center">
                  <span className="p-2 mr-3 rounded-full bg-red-500/10 dark:bg-red-500/20">
                    <ClockIcon />
                  </span>
                  Último acceso
                </span>
                <span className="font-medium text-slate-700 dark:text-zink-100">
                  {formatLastLogin(userData?.last_login || '')}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-slate-50 dark:hover:bg-zink-600 transition-colors duration-200 rounded-lg">
                <span className="text-sm sm:text-base text-slate-600 dark:text-zink-300 mb-1 sm:mb-0 flex items-center">
                  <span className="p-2 mr-3 rounded-full bg-red-500/10 dark:bg-red-500/20">
                    <UserIcon />
                  </span>
                  Rol
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-600 dark:text-red-400">
                  {userData?.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default withRouter(UserProfile);