import httpInstance from "../httpInstance";
import { IFactura } from "./types";

// Servicio para obtener una factura por su folio
export const getFacturaByFolio = async (folio: number): Promise<IFactura> => {
    try {
        // Realizar la solicitud GET
        const response = await httpInstance.get<IFactura>(`/facturas/${folio}`);
        return response.data; // Retornar los datos de la respuesta
    } catch (error) {
        console.error("Error al obtener la factura:", error);
        throw error; // Lanzar el error para que el llamador lo maneje
    }
};