import httpInstance from "../httpInstance";
import { IFactura } from "./types";

// Servicio para eliminar una factura por su folio
export const deleteFactura = async (folio: number): Promise<void> => {
    try {
        // Realizar la solicitud DELETE
        await httpInstance.delete<void>(`/facturas/${folio}`);
    } catch (error) {
        console.error("Error al eliminar la factura:", error);
        throw error; // Lanzar el error para que el llamador lo maneje
    }
};