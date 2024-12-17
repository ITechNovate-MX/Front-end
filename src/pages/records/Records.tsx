import React, { useEffect, useState } from 'react';
import FacturaCard from '../../components/FacturaCard/FacturaCard';
import { IFactura } from '../../services/facturas/types';
import { getFacturas } from '../../services/facturas/getFacturas';
import { IDetalleFactura } from '../../services/detallefactura/types';
import { getDetalleByFolio } from '../../services';

const Records: React.FC = () => {
  const [facturas, setFacturas] = useState<IFactura[]>([]);
  const [detalles, setDetalles] = useState<{ [key: number]: IDetalleFactura | null}>({});

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const facturasData = await getFacturas();
        setFacturas(facturasData);

        // Cargar los detalles de cada factura
        const detallesPromises = facturasData.map(async (factura) => {
          const detalle = await getDetalleByFolio(factura.folio);
          return { folio: factura.folio, detalle: detalle[0] || null };
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

  return (
    <div>
      <h1 className="text-4xl font-bold font-sans text-center text-blue-950 mb-8">
        Facturas Ingresadas
      </h1>
      <div className="sm:grid-cols-2 lg:grid-cols-3 gap-y-10 px-8 " >
        {facturas.map((factura) => (
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
    </div>
  );
};

export default Records;
