import { APIClient } from "./api_helper";

import * as url from "./url_helper";




const api = new APIClient();
// Gets the logged in user data from local session

// Gets the logged in user data from local session
export const getLoggedUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedUser() !== null;
};

// Register Method
export const postFakeRegister = (data: any) => api.create(url.POST_FAKE_REGISTER, data);

// Login Method
export const postLogin = (data: any) => api.create(url.POST_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = (data: any) => api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = (data: any) => api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postFakeProfile = (data: any) => api.create(url.POST_EDIT_PROFILE, data);
// export const postFakeProfile = (data: any) => api.update(url.POST_EDIT_PROFILE + '/' + data.idx, data);

// Register Method
export const postJwtRegister = (url: any, data: any) => {
  return api.create(url, data)
    .catch((err: any) => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};
// Login Method
export const postJwtLogin = (data: any) => api.create(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
export const postJwtForgetPwd = (data: any) => api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = (data: any) => api.create(url.SOCIAL_LOGIN, data);


// Discount codes management
export const getDiscountCodes = () => api.get(url.GET_DISCOUNT_CODES, null);
export const addDiscountCode = (data: any) => api.create(url.ADD_DISCOUNT_CODES, data);
export const updateDiscountCode = (data: any) => api.update(url.UPDATE_DISCOUNT_CODES + '/' + data.id, data);
export const deleteDiscountCode = (data: any) => api.delete(url.DELETE_DISCOUNT_CODES + '/' + data, { headers: { data } });
export const incrementUsesDiscountCode = (data: any) => api.update(url.INCREMENT_USES_DISCOUNT_CODES + '/' + data.id, data);

// TICKET Management
export const getAllTickets = () => api.get(url.GET_ALL_TICEKTS, null);
export const addTicket = (data: any) => api.create(url.ADD_TICKET, data);
export const getTicketById = (id: any) => api.get(url.GET_TICKET_BY_ID,  { id });
export const deleteTicket = (id: any) => api.delete(`${url.DELETE_TICKET}/${id}`);
export const updateTicketStatus = (data: any) => api.update(`${url.UPDATE_TICKET_STATUS}/${data.id}`,  data);
// export const productImage = (id: any) => api.get(url.GET_IMG_BY_ID,  { id });
export const productImage = (data: any) => api.get(`${url.GET_IMG_BY_ID}/${data}`,  data);

//NOTA NO EXISTEN ESTOS TICKETS
// export const updateTicket = (data: any) => api.update(url.UPDATE_TICKET + '/' + data.id, data);


// Carts
export const getPendingCarts = () => api.get(url.GET_PENDING_CARTS, null);
export const createCart = (data: any) => api.create(url.CREATE_CART, data);
export const deleteCart = (data: any) => api.delete(url.DELETE_CART + '/' + data, { headers: { data } });
export const getCart = (id: any) => api.get(`${url.GET_CART}/${id}`, { params: { id } });
export const deleteProductInCart = (data: any) => api.delete(url.DELETE_PRODUCT + '/' + data.cart_product_id, { headers: { data } });
export const insertProductInCart = (data: any) => api.create(url.INSERT_PRODUCT, data);
export const updateWasteInCart = (data: any) => api.update(url.UPDATE_WASTE_IN_CART + '/' + data.cartProductId, data);

// Waste
export const getWaste = () => api.get(url.GET_WASTE, null);
export const getActiveWaste = () => api.get(url.GET_ACTIVE_WASTE, null);
export const addWaste = (data: any) => api.create(url.ADD_WASTE, data);
export const updateWaste = (data: any) => api.update(url.UPDATE_WASTE + '/' + data.id, data);
export const deleteWaste = (data: any) => api.delete(url.DELETE_WASTE + '/' + data, { headers: { data } });

// Assing Material
export const assignMaterialToClient = (data: any) => api.create(url.ASSIGN_MATERIAL, data);
export const unassignMaterialFromClient = (data: any) => api.delete(url.UNASSIGN_MATERIAL + "/" + data.clientId + "/" + data.material.id, { headers: { data } });
export const getMaterialsByClient = (data: any) => api.get(url.GET_MATERIALS_BY_CLIENT,  { clientId: data });
export const getAssignedMaterials = (data: any) => api.get(url.GET_ASSIGNED_MATERIALS, { clientId: data });

// Chat
export const getChat = (roomId: any) => api.get(`${url.GET_CHAT}/${roomId}`, { params: { roomId } });
export const addChat = (data: any) => api.create(url.ADD_CHAT, data);
export const deleteChat = (data: any) => api.delete(url.DELETE_CHAT, { headers: { data } });
export const bookmarkChat = (data: any) => api.delete(url.BOOKMARK_CHAT, { headers: { data } });

// Mailbox
export const getMail = () => api.get(url.GET_MAIL, null);
export const deleteMail = (data: any) => api.delete(url.DELETE_MAIL, { headers: { data } });
export const unreadMail = (data: any) => api.delete(url.UNREAD_MAIL, { headers: { data } });
export const staredMail = (data: any) => api.delete(url.STARED_MAIL, { headers: { data } });
export const trashMail = (data: any) => api.delete(url.TRASH_MAIL, { headers: { data } });

// Calendar
export const getEvents = () => api.get(url.GET_EVENT, null);
export const addEvents = (data: any) => api.create(url.ADD_EVENT, data);
export const updateEvents = (data: any) => api.update(url.UPDATE_EVENT, data);
export const deleteEvents = (data: any) => api.delete(url.DELETE_EVENT, { headers: { data } });

// Category
export const getCategory = () => api.get(url.GET_CATEGORY, null);
export const deleteCategory = (data: any) => api.delete(url.DELETE_CATEGORY, { headers: { data } });

// Ecommerce
// Orders
export const getOrders = () => api.get(url.GET_ORDERS, null);
export const addOrders = (data: any) => api.create(url.ADD_ORDERS, data);
export const updateOrders = (data: any) => api.update(url.UPDATE_ORDERS, data);
export const deleteOrders = (data: any) => api.delete(url.DELETE_ORDERS, { headers: { data } });

// Sellers
export const getSellers = () => api.get(url.GET_SELLERS, null);
export const addSellers = (data: any) => api.create(url.ADD_SELLERS, data);
export const updateSellers = (data: any) => api.update(url.UPDATE_SELLERS, data);
export const deleteSellers = (data: any) => api.delete(url.DELETE_SELLERS, { headers: { data } });

// Shop Products
// List View
export const getShopProductList = () => api.get(url.GET_SHOP_PRODUCT_LIST, null);
export const addShopProductList = (data: any) => api.create(url.ADD_SHOP_PRODUCT_LIST, data);
export const updateShopProductList = (data: any) => api.update(url.UPDATE_SHOP_PRODUCT_LIST + '/' + data.id, data);
export const deleteShopProductList = (data: any) => api.delete(url.DELETE_SHOP_PRODUCT_LIST + '/' + data, { headers: { data } });

// Grid View
export const getProductGrid = () => api.get(url.GET_PRODUCT_GRID, null);
export const addProductGrid = (data: any) => api.create(url.ADD_PRODUCT_GRID, data);
export const updateProductGrid = (data: any) => api.update(url.UPDATE_PRODUCT_GRID, data);
export const deleteProductGrid = (data: any) => api.delete(url.DELETE_PRODUCT_GRID, { headers: { data } });

// Overview
export const getReview = () => api.get(url.GET_REVIEW, null);
export const addReview = (data: any) => api.create(url.ADD_REVIEW, data);
export const updateReview = (data: any) => api.update(url.UPDATE_REVIEW, data);
export const deleteReview = (data: any) => api.delete(url.DELETE_REVIEW, { headers: { data } });

// Sale Products
// List View
export const getSaleProductList = () => api.get(url.GET_SALE_PRODUCT_LIST, null);
export const addSaleProductList = (data: any) => api.create(url.ADD_SALE_PRODUCT_LIST, data);
export const updateSaleProductList = (data: any) => api.update(url.UPDATE_SALE_PRODUCT_LIST + '/' + data.id, data);
export const deleteSaleProductList = (data: any) => api.delete(url.DELETE_SALE_PRODUCT_LIST + '/' + data, { headers: { data } });

// CUSTOMER Management
// CUSTOMER List
export const getCustomer = () => api.get(url.GET_CUSTOMER, null);
export const getCustomerById = (data: any) => api.get(url.GET_CUSTOMER_BY_ID, { id: data.clientId });
export const addCustomer = (data: any) => api.create(url.ADD_CUSTOMER, data);
export const updateCustomer = (data: any) => api.put(url.UPDATE_CUSTOMER + '/' + data.id, data);
export const deleteCustomer = (data: any) => api.delete(url.DELETE_CUSTOMER + '/' + data, { headers: { data } });

// HR Management
// Employee List
export const getEmployee = () => api.get(url.GET_EMPLOYEE, null);
export const addEmployee = (data: any) => api.create(url.ADD_EMPLOYEE, data);
export const updateEmployee = (data: any) => api.update(url.UPDATE_EMPLOYEE + '/' + data.id, data);
export const deleteEmployee = (data: any) => api.delete(url.DELETE_EMPLOYEE + '/' + data, { headers: { data } });

// Holidays
export const getHolidays = () => api.get(url.GET_HOLIDAYS, null);
export const addHolidays = (data: any) => api.create(url.ADD_HOLIDAYS, data);
export const updateHolidays = (data: any) => api.update(url.UPDATE_HOLIDAYS, data);
export const deleteHolidays = (data: any) => api.delete(url.DELETE_HOLIDAYS, { headers: { data } });

// Leaves Manage

// Leave Manage (Employee)
export const getLeaveManageEmployee = () => api.get(url.GET_LEAVE_MANAGE_EMPLOYEE, null);

// Leave Manage (HR)
export const getLeaveManageHR = () => api.get(url.GET_LEAVE_MANAGE_HR, null);
export const addLeaveManageHR = (data: any) => api.create(url.ADD_LEAVE_MANAGE_HR, data);
export const updateLeaveManageHR = (data: any) => api.update(url.UPDATE_LEAVE_MANAGE_HR, data);
export const deleteLeaveManageHR = (data: any) => api.delete(url.DELETE_LEAVE_MANAGE_HR, { headers: { data } });

// Attendance
// Attendance (HR)
export const getAttendance = () => api.get(url.GET_ATTENDANCE, null);

// Main Attendance
export const getMainAttendance = () => api.get(url.GET_MAIN_ATTENDANCE, null);

// Departments
export const getDepartments = () => api.get(url.GET_DEPARTMENTS, null);
export const addDepartments = (data: any) => api.create(url.ADD_DEPARTMENTS, data);
export const updateDepartments = (data: any) => api.update(url.UPDATE_DEPARTMENTS, data);
export const deleteDepartments = (data: any) => api.delete(url.DELETE_DEPARTMENTS, { headers: { data } });

// Sales
// Estimates
export const getEstimates = () => api.get(url.GET_ESTIMATES, null);
export const addEstimates = (data: any) => api.create(url.ADD_ESTIMATES, data);
export const updateEstimates = (data: any) => api.update(url.UPDATE_ESTIMATES, data);
export const deleteEstimates = (data: any) => api.delete(url.DELETE_ESTIMATES, { headers: { data } });

// Payments
export const getPayments = () => api.get(url.GET_PAYMENTS, null);

// Expenses
export const getExpenses = () => api.get(url.GET_EXPENSES, null);
export const addExpenses = (data: any) => api.create(url.ADD_EXPENSES, data);
export const updateExpenses = (data: any) => api.update(url.UPDATE_EXPENSES, data);
export const deleteExpenses = (data: any) => api.delete(url.DELETE_EXPENSES, { headers: { data } });

// Payroll
// Employee Salary
export const getEmployeeSalary = () => api.get(url.GET_EMPLOYEE_SALARY, null);
export const addEmployeeSalary = (data: any) => api.create(url.ADD_EMPLOYEE_SALARY, data);
export const updateEmployeeSalary = (data: any) => api.update(url.UPDATE_EMPLOYEE_SALARY, data);
export const deleteEmployeeSalary = (data: any) => api.delete(url.DELETE_EMPLOYEE_SALARY, { headers: { data } });

// Notes
export const getNotes = () => api.get(url.GET_NOTES, null);
export const addNotes = (data: any) => api.create(url.ADD_NOTES, data);
export const updateNotes = (data: any) => api.put(url.UPDATE_NOTES + '/' + data.id, data);
export const deleteNotes = (data: any) => api.delete(url.DELETE_NOTES + '/' + data, { headers: { data } });
export const noteFlagUpdate = (data : {id : number ,flag : number}) => api.put(url.ADD_FAVORITE_NOTES + '/' + data.id, data);
// Social
// Friends
export const getSocialFriends = () => api.get(url.GET_SOCIAL_FRIENDS, null);

// Events
export const getSocialEvent = () => api.get(url.GET_SOCIAL_EVENTS, null);
export const addSocialEvent = (data: any) => api.create(url.ADD_SOCIAL_EVENTS, data);
export const updateSocialEvent = (data: any) => api.update(url.UPDATE_SOCIAL_EVENTS, data);
export const deleteSocialEvent = (data: any) => api.delete(url.DELETE_SOCIAL_EVENTS, { headers: { data } });

// Invoices
export const getInvoiceList = () => api.get(url.GET_INVOICE_LIST, null);

// Users
// List View
export const getUserList = () => api.get(url.GET_USER_LIST, null);
export const addUserList = (data: any) => api.create(url.ADD_USER_LIST, data);
export const updateUserList = (data: any) => api.update(url.UPDATE_USER_LIST, data);
export const deleteUserList = (user: any) => api.delete(url.DELETE_USER_LIST, { headers: { user } });

// Grid View
export const getUserGrid = () => api.get(url.GET_USER_GRID, null);
export const addUserGrid = (data: any) => api.create(url.ADD_USER_GRID, data);
export const updateUserGrid = (data: any) => api.update(url.UPDATE_USER_GRID, data);
export const deleteUserGrid = (user: any) => api.delete(url.DELETE_USER_GRID, { headers: { user } });