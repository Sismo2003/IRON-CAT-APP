import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// login
import LoginReducer from "./auth/login/reducer";

// register
import RegisterReducer from "./auth/register/reducer";

// userProfile
import ProfileReducer from "./auth/profile/reducer";

// Chat
import ChatReducer from "./chat/reducer";

// MailBox
import MailboxReducer from "./mailbox/reducer";

// Calendar
import CalendarReducer from "./calendar/reducer";

// Ecommerce SHOP
import EcommerceShopReducer from "./ecommerce-shop/reducer";

// Ecommerce SALE
import EcommerceSaleReducer from "./ecommerce-sale/reducer";

// HR Managment
import HRManagmentReducer from "./hrManagement/reducer";

// TICKET Managment
import TICKETManagmentReducer from "./ticketManagement/reducer";

// TICKET Managment
import CUSTOMERManagmentReducer from "./customerManagement/reducer";

// Notes
import NotesReducer from "./notes/reducer";

// Social
import SocialReducer from "./social/reducer";

// Invoice
import InvoiceReducer from "./invoice/reducer"

// Users
import UsersReducer from "./users/reducer";

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Login: LoginReducer,
    Register: RegisterReducer,
    Profile: ProfileReducer,
    Chat: ChatReducer,
    Mailbox: MailboxReducer,
    Calendar: CalendarReducer,
    EcommerceShop: EcommerceShopReducer,
    EcommerceSale: EcommerceSaleReducer,
    HRManagment: HRManagmentReducer,
    TICKETManagment: TICKETManagmentReducer,
    CUSTOMERManagement: CUSTOMERManagmentReducer,
    Notes: NotesReducer,
    Social: SocialReducer,
    Invoice: InvoiceReducer,
    Users: UsersReducer,
});


export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;