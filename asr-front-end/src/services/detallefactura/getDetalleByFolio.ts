import httpInstance from "../httpInstance";
import { IDetalleFactura } from "./types";

// Servicio para obtener los detalles de una factura por su folio
export const getDetalleByFolio = async (folio: number): Promise<IDetalleFactura[]> => {
    try {
        // Realizar la solicitud GET
        const response = await httpInstance.get<IDetalleFactura[]>(`http://52.90.133.45:8080/detallefactura/factura/${folio}`);
        return response.data; // Retornar los datos de la respuesta
    } catch (error) {
        console.error("Error al obtener los detalles de la factura:", error);
        throw error; // Lanzar el error para que el llamador lo maneje
    }
};
