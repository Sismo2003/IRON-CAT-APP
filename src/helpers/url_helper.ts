// REGISTER
export const POST_FAKE_REGISTER = "/auth/signup";

// Carts
export const GET_PENDING_CARTS = "/cart/all-carts";
export const GET_CLIENT_CART = "/cart/get-cart-by-client";
export const GET_CART = "/cart/get-cart";
export const INSERT_PRODUCT = "/cart/insert-product";
export const DELETE_PRODUCT = "/cart/delete-product";
export const CREATE_CART = "/cart/new-cart";
export const DELETE_CART = "/cart/delete-cart";
export const UPDATE_WASTE_IN_CART = "/cart/update-waste";
export const UPDATE_VEHICLE = "/cart/update-vehicle"

// Discount Codes
export const GET_DISCOUNT_CODES = "/discount-codes/get-discount-codes";
export const ADD_DISCOUNT_CODES = "/discount-codes/add-discount-codes";
export const UPDATE_DISCOUNT_CODES = "/discount-codes/edit-discount-codes";
export const DELETE_DISCOUNT_CODES = "/discount-codes/delete-discount-codes";
export const INCREMENT_USES_DISCOUNT_CODES = "/discount-codes/increment-uses";

// Waste
export const GET_WASTE = "/waste/get-waste";
export const GET_ACTIVE_WASTE = "/waste/get-active-waste";
export const ADD_WASTE = "/waste/add-waste";
export const UPDATE_WASTE = "/waste/edit-waste";
export const DELETE_WASTE = "/waste/delete-waste";

// Tickets Management
export const GET_ALL_TICEKTS = "/tickets/get-all-tickets";
export const GET_TICKET_BY_ID = "/tickets/get-ticket";
export const ADD_TICKET = "/tickets/add-ticket";
export const DELETE_TICKET = "/tickets/delete-ticket";
export const UPDATE_TICKET_STATUS = "/tickets/update-ticket-status";
export const GET_IMG_BY_ID = "/tickets/product-img";


// Notes
export const GET_NOTES = "/notes/get-all-notes";
export const ADD_NOTES =  "/notes/add-note";
export const UPDATE_NOTES = "/notes/edit-note";
export const DELETE_NOTES = "/notes/delete-notes";
export const ADD_FAVORITE_NOTES = "/notes/update-note-flag";

// Products
// List View
export const GET_SALE_PRODUCT_LIST =  "/ecommerce/get-product-list";
export const ADD_SALE_PRODUCT_LIST =  "/ecommerce/add-product-list";
export const UPDATE_SALE_PRODUCT_LIST =  "/ecommerce/edit-product-list";
export const DELETE_SALE_PRODUCT_LIST =  "/ecommerce/delete-product-list";

// HR Management
// Employee List
export const GET_EMPLOYEE =  "/hr/get-employee";
export const ADD_EMPLOYEE =  "/hr/add-employee";
export const UPDATE_EMPLOYEE = "/hr/edit-employee";
export const DELETE_EMPLOYEE =  "/hr/delete-employee";

// TICKET Management
// Ticket List
// export const GET_TICKET =  "/hr/get-ticket";
// export const ADD_TICKET =  "/hr/add-ticket";
// export const UPDATE_TICKET =  "/hr/edit-ticket";
// export const DELETE_TICKET =  "/hr/delete-ticket";

// CUSTOMER Management
// CUSTOMER List
export const GET_CUSTOMER =  "/customer/get-customer";
export const GET_CUSTOMER_BY_ID =  "/customer/get-customer-by-id";
export const ADD_CUSTOMER =  "/customer/add-customer";
export const UPDATE_CUSTOMER =  "/customer/edit-customer";
export const DELETE_CUSTOMER =  "/customer/delete-customer";

// Products
// List View
export const GET_SHOP_PRODUCT_LIST =  "/ecommerce/get-product-list";
export const ADD_SHOP_PRODUCT_LIST =  "/ecommerce/add-product-list";
export const UPDATE_SHOP_PRODUCT_LIST =  "/ecommerce/edit-product-list";
export const DELETE_SHOP_PRODUCT_LIST =  "/ecommerce/delete-product-list";


// ASSING MATERIAL
export const ASSIGN_MATERIAL = "/assign-material-to-client/add-material";
export const UNASSIGN_MATERIAL = "/assign-material-to-client/delete-material";
export const GET_MATERIALS_BY_CLIENT = "/assign-material-to-client/get-material";
export const GET_ASSIGNED_MATERIALS = "/assign-material-to-client/get-material-by-client-id";



// LOGIN
export const POST_LOGIN = "/auth/signin";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/auth/forgot-password";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

// PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/user";


// Chat
export const GET_CHAT = "/get-chat";
export const ADD_CHAT = "/add-chat";
export const DELETE_CHAT = "/delete-chat";
export const BOOKMARK_CHAT = "/delete-chat";

// MailBox
export const GET_MAIL = "/get-mail";
export const DELETE_MAIL = "/delete-mail";
export const UNREAD_MAIL = "/unread-mail";
export const STARED_MAIL = "/stared-mail";
export const TRASH_MAIL = "/trash-mail";

// Calendar
export const GET_EVENT = "/get-event";
export const ADD_EVENT = "/add-event";
export const UPDATE_EVENT = "/edit-event";
export const DELETE_EVENT = "/delete-event";

// Category
export const GET_CATEGORY = "/get-category";
export const DELETE_CATEGORY = "/delete-category";

// Ecommerce
// Orders
export const GET_ORDERS = "/get-orders";
export const ADD_ORDERS = "/add-orders";
export const UPDATE_ORDERS = "/edit-orders";
export const DELETE_ORDERS = "/delete-orders";

// Sellers
export const GET_SELLERS = "/get-sellers";
export const ADD_SELLERS = "/add-sellers";
export const UPDATE_SELLERS = "/edit-sellers";
export const DELETE_SELLERS = "/delete-sellers";


// Grid View
export const GET_PRODUCT_GRID = "/get-product-grid";
export const ADD_PRODUCT_GRID = "/add-product-grid";
export const UPDATE_PRODUCT_GRID = "/edit-product-grid";
export const DELETE_PRODUCT_GRID = "/delete-product-grid";

// Overview
export const GET_REVIEW = "/get-review";
export const ADD_REVIEW = "/add-review";
export const UPDATE_REVIEW = "/edit-review";
export const DELETE_REVIEW = "/delete-review";



// Holidays
export const GET_HOLIDAYS = "/get-holidays";
export const ADD_HOLIDAYS = "/add-holidays";
export const UPDATE_HOLIDAYS = "/edit-holidays";
export const DELETE_HOLIDAYS = "/delete-holidays";

// Leaves Manage Employee
export const GET_LEAVE_MANAGE_EMPLOYEE = "/get-leave-manage-employee";

// Leave Manage (HR)
export const GET_LEAVE_MANAGE_HR = "/get-leave-manage-hr";
export const ADD_LEAVE_MANAGE_HR = "/add-leave-manage-hr";
export const UPDATE_LEAVE_MANAGE_HR = "/edit-leave-manage-hr";
export const DELETE_LEAVE_MANAGE_HR = "/delete-leave-manage-hr";

// Attendance
// Attendance (HR)
export const GET_ATTENDANCE = "/get-attendance";

// Main Attendance
export const GET_MAIN_ATTENDANCE = "/get-main-attendance";

// Departments
export const GET_DEPARTMENTS = "/get-departments";
export const ADD_DEPARTMENTS = "/add-departments";
export const UPDATE_DEPARTMENTS = "/edit-departments";
export const DELETE_DEPARTMENTS = "/delete-departments";

// Sales
// Estimates
export const GET_ESTIMATES = "/get-estimates";
export const ADD_ESTIMATES = "/add-estimates";
export const UPDATE_ESTIMATES = "/edit-estimates";
export const DELETE_ESTIMATES = "/delete-estimates";

// Payments
export const GET_PAYMENTS = "/get-payments";

// Expenses
export const GET_EXPENSES = "/get-expenses";
export const ADD_EXPENSES = "/add-expenses";
export const UPDATE_EXPENSES = "/edit-expenses";
export const DELETE_EXPENSES = "/delete-expenses";

// Payroll
// Employee Salary
export const GET_EMPLOYEE_SALARY = "/get-employee-salary";
export const ADD_EMPLOYEE_SALARY = "/add-employee-salary";
export const UPDATE_EMPLOYEE_SALARY = "/edit-employee-salary";
export const DELETE_EMPLOYEE_SALARY = "/delete-employee-salary";


// Social
// Friends
export const GET_SOCIAL_FRIENDS = "/get-social-friends";

// Events
export const GET_SOCIAL_EVENTS = "/get-social-event";
export const ADD_SOCIAL_EVENTS = "/add-social-event";
export const UPDATE_SOCIAL_EVENTS = "/edit-social-event";
export const DELETE_SOCIAL_EVENTS = "/delete-social-event";

// invoice
export const GET_INVOICE_LIST = "/get-invoice-list"

// Users
// List View
export const GET_USER_LIST = "/get-userlist";
export const ADD_USER_LIST = "/add-userlist";
export const UPDATE_USER_LIST = "/edit-userlist";
export const DELETE_USER_LIST = "/delete-userlist";

// Grid View
export const GET_USER_GRID = "/get-usergrid";
export const ADD_USER_GRID = "/add-usergrid";
export const UPDATE_USER_GRID = "/edit-usergrid";
export const DELETE_USER_GRID = "/delete-usergrid";







