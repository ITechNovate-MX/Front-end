import httpInstance from "../httpInstance";
import { IMaterial } from "./types";

export const getMateriales = async (folio:number): Promise<IMaterial[]> => {
    try {
        const response = await httpInstance.get<IMaterial[]>(`facturas/${folio}/materiales`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los materiales:", error);
        throw error;
    }
};