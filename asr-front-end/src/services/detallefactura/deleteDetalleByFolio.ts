import httpInstance from "../httpInstance";
import { IDetalleFactura } from "./types";

// Servicio para eliminar los detalles de una factura por su folio
export const deleteDetalleByFolio = async (facturaId: number): Promise<void> => {
    try {
        // Realizar la solicitud DELETE
        await httpInstance.delete<void>(`/detallefactura/factura/${facturaId}`);
    } catch (error) {
        console.error("Error al eliminar los detalles de la factura:", error);
        throw error; // Lanzar el error para que el llamador lo maneje
    }
};