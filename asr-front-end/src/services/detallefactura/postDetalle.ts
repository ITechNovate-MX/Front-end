import httpInstance from "../httpInstance";

export const postDetalle = async (
folio: number, fechaEntrega: Date, fechaVencimiento: Date, estatus: string, credito: number, fechaPortal: Date, tipoCambio: number): Promise<any> => {
    if (!folio) {
        return Promise.reject(new Error("No se seleccionó ningún archivo para subir."));
    }

    // Crear el objeto de datos
    const payload = {
        facturaId: folio,
        fechaEntrega: fechaEntrega.toISOString(), // Convertir a ISO-8601
        fechaVencimiento: fechaVencimiento.toISOString(),
        estatus,
        credito,
        fechaPortal: fechaPortal.toISOString(),
        tipoCambio,
    };

    try {
        // Enviar el POST request
        const response = await httpInstance.post(
            '/detallefactura/save',
            payload, // Enviar como JSON
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error en el servicio:', error);
        throw error;
    }
};
