import React, { useEffect } from 'react';
import BreadCrumb from 'Common/BreadCrumb';
import OrderStatistics from './OrderStatistics';
import Widgets from './Widgets';
import SalesRevenue from './SalesRevenue';
import TrafficResources from './TrafficResources';
import ProductsOrders from './ProductsOrders';
import CustomerService from './CustomerService';
import Audience from './Audience';
import MonthlyCampaign from './MonthlyCampaign';
import Subscription from './Subscription';


import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getTicket as getTickets } from 'slices/thunk';

const DashboardIronCat = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<any>(); // Usamos any para evitar problemas de tipado
    
    useEffect(() => {
        // Navega al dashboard
        navigate("/dashboard");
    }, [navigate]);
    
    useEffect(() => {
        // Centralizamos la llamada a getTickets aquí, sin necesidad de store.ts
        dispatch(getTickets());
    }, [dispatch]);
    
    return (
      <React.Fragment>
          <BreadCrumb title='Administración' pageTitle='Dashboards' />
          <div className="grid grid-cols-11 gap-x-5">
              {/*Cards*/}
              <Widgets />
              
              {/*Estados de tickets*/}
              <OrderStatistics />
              
              {/*Materiales mas comprados y vendidos*/}
              {/*<TrafficResources />*/}
              
              <MonthlyCampaign/>
              
              <Subscription />
              
              {/*Ingresos por ventas y compras grafica*/}
              {/*<SalesRevenue />*/}
              
              {/*Lista de Tickets*/}
              <ProductsOrders />
              
              {/*Mejores Clientes*/}
              <CustomerService />
              
              {/*Tickets por dia venta y compra*/}
              <Audience />
          </div>
      </React.Fragment>
    );
};

export default DashboardIronCat;