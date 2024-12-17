import path from "path";

export const ROUTES = {
    LOGIN: {
        path: '/login',
        name: 'Login'
    },
    HOME: {
        path: '/home',
        name: 'Home'
    },
    RECORDS: {
        path: '/records',
        name: 'Records'
    },
    REGISTER: {
        path: '/register',
        name: 'Register'
    },
    UPLOAD: {
        path: '/upload',
        name: 'Upload'
    },
    FACTURA: {
        path: '/factura/:folio',
        name: 'Factura'
    }
};