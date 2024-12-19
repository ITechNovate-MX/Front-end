import React, { useEffect, useState } from 'react';
import FacturaCard from '../../components/FacturaCard/FacturaCard';
import { IFactura } from '../../services/facturas/types';
import { getFacturas } from '../../services/facturas/getFacturas';
import { IDetalleFactura } from '../../services/detallefactura/types';
import { getDetalleByFolio } from '../../services';
import { Loader } from '../../components/Loader';

const Records: React.FC = () => {
  const [facturas, setFacturas] = useState<IFactura[]>([]);
  const [detalles, setDetalles] = useState<{ [key: number]: IDetalleFactura | null }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const facturasPerPage = 15;

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const facturasData = await getFacturas();
        setFacturas(facturasData);

        // Cargar los detalles de cada factura
        const detallesPromises = facturasData.map(async (factura) => {
          try {
            const detalle = await getDetalleByFolio(factura.folio);
            return { folio: factura.folio, detalle: detalle[0] || null };
          } catch (error) {
            console.error(`Error al obtener detalle de la factura con folio ${factura.folio}:`, error);
            return { folio: factura.folio, detalle: null };
          }
        });

        const detallesResults = await Promise.all(detallesPromises);
        const detallesMap = detallesResults.reduce((acc, curr) => {
          acc[curr.folio] = curr.detalle;
          return acc;
        }, {} as { [key: number]: IDetalleFactura | null });

        setDetalles(detallesMap);
      } catch (error) {
        console.error('Error al cargar las facturas:', error);
      }
    };

    fetchFacturas();
  }, []);

  // Manejar el cambio de página
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Filtrar facturas según la página actual
  const indexOfLastFactura = currentPage * facturasPerPage;
  const indexOfFirstFactura = indexOfLastFactura - facturasPerPage;
  const currentFacturas = facturas.slice(indexOfFirstFactura, indexOfLastFactura);

  const totalPages = Math.ceil(facturas.length / facturasPerPage);

  return (
    <div>
      <h1 className="text-4xl font-bold font-sans text-center text-blue-950 mb-8">
        Facturas Ingresadas
      </h1>
      <div className="sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 cursor-pointer">
        {currentFacturas.map((factura) => (
          <FacturaCard
            key={factura.folio}
            cliente={factura.cliente}
            folio={factura.folio}
            total={factura.total}
            factura={factura}
            detalleFactura={detalles[factura.folio] || null}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`flex items-center justify-center text-2xl font-bold w-12 h-12 rounded-full ${
              currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
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
