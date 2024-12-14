import httpInstance from "../httpInstance";
import { IDetalleFactura } from "./types";

export const putDetalle = async (
    id: number, // ID del detalleFactura a actualizar
    detalle: IDetalleFactura // Los nuevos datos para actualizar
): Promise<IDetalleFactura> => {
    if (!id) {
        return Promise.reject(new Error("El ID del detalle es requerido para actualizar."));
    }

    try {
        // Realizar la solicitud PUT
        const response = await httpInstance.put<IDetalleFactura>(
            `/detallefactura/${id}`, // URL del endpoint
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
