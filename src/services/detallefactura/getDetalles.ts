import httpInstance from "../httpInstance";
import { IDetalleFactura } from "./types";

// Servicio para obtener los detalles de todas las facturas
export const getDetalles = async (folio: number): Promise<IDetalleFactura[]> => {
    try {
        // Realizar la solicitud GET
        const response = await httpInstance.get<IDetalleFactura[]>(`/detallefactura`);
        return response.data; // Retornar los datos de la respuesta
    } catch (error) {
        console.error("Error al obtener los detalles de la factura:", error);
        throw error; // Lanzar el error para que el llamador lo maneje
    }
};
