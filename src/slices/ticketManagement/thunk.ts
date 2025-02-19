import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getTicket as getTicketApi,
    addTicket as addTicketApi,
    updateTicket as updateTicketApi,
    deleteTicket as deleteTicketApi,
} from "../../helpers/fakebackend_helper";
import user1 from "assets/images/users/user-1.jpg";
import user2 from "assets/images/users/user-2.jpg";
import user3 from "assets/images/users/user-3.jpg";
import user4 from "assets/images/users/user-4.jpg";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const getTicket = createAsyncThunk("ticketManagement/getTicket", async () => {
    try {
        const response = getTicketApi();
        console.log(response);
        // return (await response).data;
        return [
            {
                id: 1,
                employeeId: "#TWE1001528",
                name: "Willie Torres",
                img: user1,
                designation: "Nuxt JS Developer",
                email: "willie@tailwick.com",
                phone: "070 3715 3689",
                location: "United States",
                experience: "3 Year",
                joinDate: "05 Feb, 2020"
            },
            {
                id: 2,
                employeeId: "#TWE1001524",
                name: "Patricia Garcia",
                img: user2,
                designation: "ASP.Net Developer",
                email: "PatriciaJGarcia@tailwick.com",
                phone: "077 7317 7572",
                location: "Brazil",
                experience: "0.5 Year",
                joinDate: "12 Aug, 2023"
            },
            {
                id: 3,
                employeeId: "#TWE1001506",
                name: "Tonya Johnson",
                img: user3,
                designation: "Project Manager",
                email: "TonyaEJohnson@tailwick.com",
                phone: "079 2383 2340",
                location: "Denmark",
                experience: "0 Year",
                joinDate: "11 Nov, 2023"
            },
            {
                id: 4,
                employeeId: "#TWE1001502",
                name: "Jose White",
                img: user4,
                designation: "React Developer",
                email: "ameida@tailwick.com",
                phone: "03476 56 14 12",
                location: "Philippines",
                experience: "1.5 Year",
                joinDate: "09 Jun, 2022"
            },
            {
                id: 5,
                employeeId: "#TWE1001503",
                name: "Juliette Fecteau",
                img: user1,
                designation: "Sr. Angular Developer",
                email: "JulietteFecteau@tailwick.com",
                phone: "07231 96 25 88",
                location: "Belgium",
                experience: "1.9 Year",
                joinDate: "11 May, 2021"
            },
            {
                id: 6,
                employeeId: "#TWE1001504",
                name: "Jonas Frederiksen",
                img: user2,
                designation: "Team Leader",
                email: "jonas@tailwick.com",
                phone: "61 53 62 05",
                location: "France",
                experience: "2.9 Year",
                joinDate: "18 Jan, 2019"
            },
            {
                id: 7,
                employeeId: "#TWE1001505",
                name: "Kim Broberg",
                img: user4,
                designation: "UI / UX Designer",
                email: "KimBroberg@tailwick.com",
                phone: "040 382 2096",
                location: "Finland",
                experience: "1.2 Year",
                joinDate: "23 April, 2021"
            },
            {
                id: 8,
                employeeId: "#TWE1001507",
                name: "Nancy Reynolds",
                img: user1,
                designation: "Web Designer",
                email: "NancyM@tailwick.com",
                phone: "0391 13 79 21",
                location: "Germany",
                experience: "0.9 Year",
                joinDate: "01 July, 2022"
            },
            {
                id: 9,
                employeeId: "#TWE1001508",
                name: "Thomas Hatfield",
                img: user2,
                designation: "VueJs Developer",
                email: "thomas@tailwick.com",
                phone: "0911 47 65 49",
                location: "Mexico",
                experience: "1.6 Year",
                joinDate: "08 Aug, 2021"
            },
            {
                id: 10,
                employeeId: "#TWE1001509",
                name: "Holly Kavanaugh",
                img: user3,
                designation: "Laravel Developer",
                email: "HollyKavanaugh@tailwick.com",
                phone: "819 947 5846",
                location: "Canada",
                experience: "2.3 Year",
                joinDate: "23 Dec, 2020"
            },
            {
                id: 11,
                employeeId: "#TWE1001510",
                name: "Kim Broberg",
                img: user4,
                designation: "UI / UX Designer",
                email: "KimBroberg@tailwick.com",
                phone: "040 382 2096",
                location: "Finland",
                experience: "1.2 Year",
                joinDate: "23 April, 2021"
            },
            {
                id: 12,
                employeeId: "#TWE1001511",
                name: "Juliette Fecteau",
                img: user1,
                designation: "Sr. Angular Developer",
                email: "JulietteFecteau@tailwick.com",
                phone: "07231 96 25 88",
                location: "Belgium",
                experience: "1.9 Year",
                joinDate: "11 May, 2021"
            }
        ];
    } catch (error) {
        return error;
    }
});
export const addTicket = createAsyncThunk("ticketManagement/addTicket", async (event: any) => {
    try {
        console.log("event", event);
        const response = addTicketApi(event);
        const data = await response;
        console.log("data", data);
        toast.success("Ticket creado con éxito", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Ticket Added Failed", { autoClose: 2000 });
        return error;
    }
});
export const updateTicket = createAsyncThunk("ticketManagement/updateTicket", async (event: any) => {
    try {
        console.log("event", event);
        const response = updateTicketApi(event);
        const data = await response;
        toast.success("Ticket updated Successfully", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Ticket updated Failed", { autoClose: 2000 });
        return error;
    }
});
export const deleteTicket = createAsyncThunk("ticketManagement/deleteTicket", async (event: any) => {
    try {
        console.log("event", event);
        const response = deleteTicketApi(event);
        toast.success("Ticket deleted Successfully", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Ticket deleted Failed", { autoClose: 2000 });
        return error;
    }
});

