# IRON CAT RECICLADORA 

## GESTIÓN DE USUARIOS (EMPLEADOS); 
Donde el usuario administrador podrá crear usuarios de tipo empleado con los permisos requeridos únicamente por el usuario.
- Alta de nuevos usuarios.
- Baja de usuarios existentes.
- Modificación de usuarios existentes.
- Ver todos los usuarios existentes.
## WEBSOCKET
Consistente en la conexión directa de la báscula hacia el servidor local para la recolección de datos envíos por las 4 basculas.
### - CONTROLADOR PERSONALIZADO
  - Convertidor de la información enviada del hardware (basculas) al websocket, información que podamos manejar en tiempo real.
### - CONTROL DE BASCÚLAS
- Este módulo será visible por el administrador y empleado, tendrá la información de las 4 basculas. los usuarios podrán agregar al carrito cada medición deseable y con el material que se seleccione. este módulo será la conexión directa del websocket para obtener la información en tiempo real.
## CARRITO
- Una vez cargado el carrito con los pesos y productos en el control de basculas, el carrito será capaz de generar tickets de compra, el carrito tendrá la opción de eliminar productos o editar el tipo de producto, no se podrá manipular el peso del producto o nada relacionado con el producto.
## TICKETS
Control especial para los tickets generados, consistente en lo siguiente;
- Borrar
- Editar (únicamente el tipo de material)
- Marcar como pagado.
##   PUNTO DE VENTA
En este módulo se controlaran todos los productos que pueden ser comprados o vendidos, consistente en lo siguiente:
- Alta de productos;
- Baja de productos;
- Edición de productos;
- Mostrar todos los productos activos e inactivos;
- Cobro para finalizar un ticket;
- Códigos de descuentos.
## GENERADOR DE REPORTES
El usuario podrá generar el reporte en un Excel (.XLSX) seria únicamente para los módulos que a continuación se describen;
- Punto de venta;
- productos registrados;
- Productos inactivos.
- tickets
- tickets activos;
- tickets registrados;
- tickets inactivos; 
- tickets en un rango de fechas.
- clientes
- clientes / proveedores activos;
- historial de compra de un único cliente / proveedor.
## CONTROL DE CLIENTES / PROVEDORES
Consistente en el registro, administración e información de clientes o proveedores con el propósito de mantener un historial de transacciones (ventas y compras) asociadas a cada uno. consistentes en lo siguiente;
- Alta de cliente;
- Modificación de cliente / proveedor;
- Baja de cliente / proveedor; y
- Historial de compra o venta del cliente / proveedor.
## Modulo de notas
### CONTROL DE REGISTROS VEHICULARES (GENERAL)  
El administrador podrá acceder a un módulo el cual es capaz de registrar, placas vehiculares, número de serie, modelo, año, pólizas de seguro, mantenimientos, registro de kilometraje, registro de último uso de operador por día.
