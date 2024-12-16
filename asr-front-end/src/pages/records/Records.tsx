import React, { useEffect, useState } from 'react';
import FacturaCard from '../../components/FacturaCard/FacturaCard';
import { getFacturas } from '../../services/facturas/getFacturas';
import { getDetalleByFolio } from '../../services/detallefactura/getDetalleByFolio';
import { IFactura } from '../../services/facturas/types';
import { IDetalleFactura } from '../../services/detallefactura/types';

const Records: React.FC = () => {
  const [facturas, setFacturas] = useState<IFactura[]>([]);
  const [detalles, setDetalles] = useState<{ [key: number]: IDetalleFactura | null }>({});

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const facturasData = await getFacturas();
        setFacturas(facturasData);

        // Cargar los detalles de cada factura
        const detallesPromises = facturasData.map(async (factura) => {
          const detalle = await getDetalleByFolio(factura.folio);
          return { folio: factura.folio, detalle: detalle[0] || null }; // Tomar el primer detalle relacionado
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
      <h1 className="text-4xl font-bold font-sans text-center text-blue-800 mb-8">
        Facturas Ingresadas
      </h1>
      <div className="sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
        {facturas.map((factura) => (
          <FacturaCard
            key={factura.folio}
            factura={factura}
            detalleFactura={detalles[factura.folio] || null}
          />
        ))}
      </div>
    </div>
  );
};

export default Records;
