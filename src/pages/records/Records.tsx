import React, { useEffect, useState } from "react";

import { IFactura } from "../../services/facturas/types";
import { getFacturas } from "../../services/facturas/getFacturas";
import { IDetalleFactura } from "../../services/detallefactura/types";
import { getDetalles } from "../../services/detallefactura/getDetalles";
import { Loader } from "../../components/Loader/Loader";
import FacturaCard from "../../components/FacturaCard/FacturaCard";
import "./Records.css";

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
  const [currentPage, setCurrentPage] = useState<string>("Ene24");
  const [indexPage, setIndexPage] = useState<number>(0); // Página de índices
  const indicesPerPage = 10; // Número de índices por página

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPageIndex = (date: Date): string => {
    const monthAbbreviation = date.toLocaleDateString("es-MX", { month: "short" }).toUpperCase();
    const year = date.getUTCFullYear().toString().slice(-2);
    return `${monthAbbreviation}${year}`;
  };

  const facturasByPage = facturas.reduce((acc, factura) => {
    const pageIndex = getPageIndex(new Date(factura.fechaEmision));
    if (!acc[pageIndex]) {
      acc[pageIndex] = [];
    }
    acc[pageIndex].push(factura);
    return acc;
  }, {} as Record<string, IFactura[]>);

  const pageKeys = Object.keys(facturasByPage).sort(
    (a, b) => new Date(facturasByPage[a][0].fechaEmision).getTime() - new Date(facturasByPage[b][0].fechaEmision).getTime()
  );

  const currentFacturas = facturasByPage[currentPage] || [];

  // Paginación de los índices
  const startIndex = indexPage * indicesPerPage;
  const endIndex = startIndex + indicesPerPage;
  const visiblePageKeys = pageKeys.slice(startIndex, endIndex);

  const handlePrevIndexPage = () => {
    if (indexPage > 0) setIndexPage(indexPage - 1);
  };

  const handleNextIndexPage = () => {
    if (endIndex < pageKeys.length) setIndexPage(indexPage + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h1 className="top-title">Facturas Ingresadas</h1>
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
      <div className="page-bar">
        <button
          onClick={handlePrevIndexPage}
          className="page-bar-elements bg-gray-200 text-black hover:bg-gray-300 mx-1"
          disabled={indexPage === 0}
        >
          Prev
        </button>
        {visiblePageKeys.map((pageKey) => (
          <button
            key={pageKey}
            className={`page-bar-elements ${
              currentPage === pageKey
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            } mx-1`}
            onClick={() => setCurrentPage(pageKey)}
          >
            {pageKey}
          </button>
        ))}
        <button
          onClick={handleNextIndexPage}
          className="page-bar-elements bg-gray-200 text-black hover:bg-gray-300 mx-1"
          disabled={endIndex >= pageKeys.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Records;