import { useEffect, useState } from "react";
import { getMateriales } from "../services"; // Servicio para obtener materiales

const useFetchMateriales = (folio: number | undefined) => {
  const [materiales, setMateriales] = useState<any[]>([]);

  useEffect(() => {
    const fetchMaterialesData = async () => {
      try {
        if (!folio) return; // Verifica si se proporcionó un folio válido

        const materialesData = await getMateriales(folio);
        setMateriales(materialesData); // Guarda los materiales en el estado
      } catch (error) {
        console.error("Error al cargar los materiales:", error);
      }
    };

    fetchMaterialesData();
  }, [folio]);

  return materiales; // Devuelve los materiales para que puedan ser utilizados
};

export default useFetchMateriales;
