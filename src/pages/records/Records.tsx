import React, { useEffect, useState } from "react";
import FacturaCard from "../../components/FacturaCard/FacturaCard";
import { IFactura } from "../../services/facturas/types";
import { getFacturas } from "../../services/facturas/getFacturas";
import { IDetalleFactura } from "../../services/detallefactura/types";
import { getDetalles } from "../../services/detallefactura/getDetalles";
import { Loader } from "../../components/Loader/Loader";

const safeDate = (value: string | number | Date): Date => {
  const parsedDate = new Date(value);
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }
  return new Date(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate());
};

const formatUTCDate = (date: Date | null): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "N/A";
  }
  return date.toLocaleDateString("es-MX", { timeZone: "UTC" });
};

const Records: React.FC = () => {
  const [facturas, setFacturas] = useState<IFactura[]>([]);
  const [detallesMap, setDetallesMap] = useState<{ [key: number]: IDetalleFactura | null }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const facturasPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Activar el estado de carga
      try {
        const [facturasData, detallesData] = await Promise.all([getFacturas(), getDetalles(0)]);

        const facturasFormatted = facturasData.map((factura) => ({
          ...factura,
          fechaEmision: safeDate(factura.fechaEmision),
        }));

        setFacturas(facturasFormatted);

        const detallesFormattedMap = detallesData.reduce((acc, detalle) => {
          acc[detalle.facturaId] = {
            ...detalle,
            fechaEntrega: detalle.fechaEntrega ? new Date(detalle.fechaEntrega) : null,
            fechaVencimiento: detalle.fechaVencimiento
              ? new Date(detalle.fechaVencimiento)
              : null,
            fechaPortal: detalle.fechaPortal ? new Date(detalle.fechaPortal) : null,
          };
          return acc;
        }, {} as { [key: number]: IDetalleFactura | null });

        setDetallesMap(detallesFormattedMap);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false); // Desactivar el estado de carga
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastFactura = currentPage * facturasPerPage;
  const indexOfFirstFactura = indexOfLastFactura - facturasPerPage;
  const currentFacturas = facturas.slice(indexOfFirstFactura, indexOfLastFactura);

  const totalPages = Math.ceil(facturas.length / facturasPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold font-sans text-center text-blue-950 mb-8">
        Facturas Ingresadas
      </h1>
      <div className="sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
        {currentFacturas.map((factura) => (
          <FacturaCard
            key={factura.folio}
            cliente={factura.cliente}
            folio={factura.folio}
            total={factura.total}
            factura={{
              ...factura,
              fechaEmision: formatUTCDate(new Date(factura.fechaEmision)),
            }}
            detalleFactura={
              detallesMap[factura.folio]
                ? {
                    ...detallesMap[factura.folio]!,
                    fechaEntrega: formatUTCDate(detallesMap[factura.folio]!.fechaEntrega),
                    fechaVencimiento: formatUTCDate(
                      detallesMap[factura.folio]!.fechaVencimiento
                    ),
                    fechaPortal: detallesMap[factura.folio]?.fechaPortal
                      ? formatUTCDate(detallesMap[factura.folio]!.fechaPortal)
                      : "N/A",
                  }
                : null
            }
          />
        ))}
      </div>
      <div className="flex justify-center">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`flex items-center justify-center text-2xl font-bold w-12 h-12 rounded-full ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            } mx-1`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Records;