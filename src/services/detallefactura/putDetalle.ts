import httpInstance from "../httpInstance";
import { IDetalleFactura } from "./types";

export const putDetalle = async (
    folio: number, // Folio de la factura a actualizar
    detalle: IDetalleFactura // Los nuevos datos para actualizar
): Promise<IDetalleFactura> => {
    if (!folio) {
        return Promise.reject(new Error("El folio de la factura es requerido para actualizar."));
    }

    try {
        // Realizar la solicitud PUT con el folio
        const response = await httpInstance.put<IDetalleFactura>(
            `/detallefactura/${folio}`, // URL con el folio de la factura
            detalle, // Objeto con los datos actualizados
            {
                headers: {
                    'Content-Type': 'application/json', // Tipo de contenido
                },
            }
        );
        return response.data; // Retornar los datos actualizados desde la respuesta
    } catch (error) {
        console.error("Error al actualizar el detalle de factura:", error);
        throw error; // Lanzar el error para que sea manejado por el llamador
    }
};
