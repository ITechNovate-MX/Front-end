import httpInstance from "../httpInstance";

export const postFactura = async (file: File): Promise<any> => {
    if (!file) {
        return Promise.reject(new Error("No se seleccionó ningún archivo para subir."));
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await httpInstance.post('http://localhost:8080/facturas/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data; // Retornar solo los datos de la respuesta
    } catch (error) {
        console.error('Error en el servicio:', error);
        throw error;
    }
};
