import httpInstance from "../httpInstance";

export const postDetalle = async (
    folio: number,
    fechaEntrega: Date,
    fechaVencimiento: Date,
    estatus: string,
    credito: number | null,
    fechaPortal: Date | null, // Permitir que `fechaPortal` sea opcional
    tipoCambio: number | null
): Promise<any> => {
    if (!folio || !fechaEntrega || !fechaVencimiento || !estatus) {
        return Promise.reject(new Error("Faltan datos obligatorios para guardar el detalle de la factura."));
    }

    // Crear el objeto de datos
    const payload = {
        facturaId: folio,
        fechaEntrega: fechaEntrega.toISOString(), // Convertir a ISO-8601
        fechaVencimiento: fechaVencimiento.toISOString(),
        estatus,
        credito,
        fechaPortal: fechaPortal ? fechaPortal.toISOString() : null, // Manejar `fechaPortal` opcionalmente
        tipoCambio,
    };

    console.log('Guardando detalle de factura:', payload);

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