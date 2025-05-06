import {
    UserRound,
    Users,
    ScrollText,
    House,
    ShoppingCart,
    Weight,
    CookingPot
  } from "lucide-react";
  
  const fullMenu = [
    {
      label: 'Administración',
      isTitle: true,
    },
    {
      id: "dashboard",
      label: 'Inicio',
      icon: <House />,
      link: "/dashboard",
      parentId: "1"
    },
    {
      label: 'Modulos',
      isTitle: true,
    },
    {
      id: "sale-point",
      label: 'Punto de venta',
      icon: <ShoppingCart />,
      link: "/#",
      subItems: [
        {
          id: 'materials',
          label: 'Control de materiales',
          parentId: 'sale-point',
          subItems: [
            {
              id: 'listview',
              label: 'Productos registrados',
              link: '/apps-materials-product-list',
              parentId: 'materials'
            },
            {
              id: 'addnew',
              label: 'Nuevo material',
              link: '/apps-materials-product-create',
              parentId: 'materials'
            },
          ]
        },
        {
          id: 'All-tickets',
          label: 'Histórico Tickets',
          link: '/apps-tk-ticket',
          parentId: 'salePoint'
        },
        {
          id: 'All-cash',
          label: 'Caja',
          link: '/CashRegister',
          parentId: 'salePoint'
        }
      ]
    },
    {
      id: "Scales",
      label: 'Basculas',
      link: "/#",
      icon: <Weight />,
      subItems: [
        {
          id: 'sales-scale',
          label: 'Venta',
          link: '/apps-scales-salecart',
          parentId: 'Scales'
        },
        {
          id: 'shopping-scale',
          label: 'Compra',
          link: '/apps-scales-shopcart',
          parentId: 'Scales'
        },
        {
          id: 'client-scale',
          label: 'Clientes especiales',
          link: '/apps-scales-clientcart',
          parentId: 'Scales'
        }
      ]
    },
    {
      id: "employees",
      label: 'Empleados',
      icon: <Users />,
      link: "/#",
      subItems: [
        {
          id: 'employee_list',
          label: 'Lista de empleados',
          link: '/apps-hr-employee',
          parentId: 'employees'
        }
      ],
    },
    {
      id: "customer-management",
      label: 'Clientes',
      icon: <UserRound />,
      parentId: "ctmanagement",
      link: "/#",
      subItems: [
        {
          id: 'ticketlist',
          label: 'Clientes registrados',
          link: '/apps-customer-list',
          parentId: 'customer-management'
        }
      ],
    },
    {
      id: "waste",
      label: 'Merma',
      icon: <CookingPot />,
      link: "/#",
      subItems: [
        {
          id: 'waste_list',
          label: 'Lista de merma',
          link: '/apps-waste',
          parentId: 'waste'
        }
      ],
    },
    {
      id: "discountCodes",
      label: 'Codigos de descuento',
      icon: <CookingPot />,
      link: "/#",
      subItems: [
        {
          id: 'discountCodes_list',
          label: 'Lista de codigos',
          link: '/apps-discount-codes',
          parentId: 'discountCodes'
        }
      ],
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: <ScrollText />,
      link: '/apps-notes',
      parentId: 2
    },
  ];
  
  const scaleOnlyMenu = [
    {
      id: "Scales",
      label: 'Basculas',
      link: "/#",
      icon: <Weight />,
      subItems: [
        {
          id: 'sales-scale',
          label: 'Venta',
          link: '/apps-scales-salecart',
          parentId: 'Scales'
        },
        {
          id: 'shopping-scale',
          label: 'Compra',
          link: '/apps-scales-shopcart',
          parentId: 'Scales'
        },
        {
          id: 'client-scale',
          label: 'Clientes especiales',
          link: '/apps-scales-clientcart',
          parentId: 'Scales'
        }
      ]
    },
		{
      id: 'notes',
      label: 'Notes',
      icon: <ScrollText />,
      link: '/apps-notes',
      parentId: 2
    }
  ];
  
  const getMenuByRole = (role: 'admin' | 'user') => {
    return role === 'admin' ? fullMenu : scaleOnlyMenu;
  };
  
  export { getMenuByRole };
  