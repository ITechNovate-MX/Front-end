import httpInstance from "../httpInstance";
import { IFactura } from "./types";

export const getFacturas = async (): Promise<IFactura[]> => {
    try {
        const response = await httpInstance.get<IFactura[]>('http://52.90.133.45:8080/facturas');
        return response.data; // Retornar los datos directamente
    } catch (error) {
        console.error("Error al obtener las facturas:", error);
        throw error;
    }
};
