import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFacturaByFolio } from "../../services/facturas/getFacturaByFolio";
import { getDetalleByFolio } from "../../services/detallefactura/getDetalleByFolio";
import { getMateriales } from "../../services/facturas/getMateriales";
import { Loader } from "../../components/Loader/Loader";
import "./Factura.css";

const Factura: React.FC = () => {
  const { folio } = useParams<{ folio: string }>();
  const [factura, setFactura] = useState<any | null>(null);
  const [detalleFactura, setDetalleFactura] = useState<any[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);

  useEffect(() => {
    const fetchFacturaData = async () => {
      try {
        if (!folio) return;

        const facturaData = await getFacturaByFolio(parseInt(folio));
        const detalleData = await getDetalleByFolio(parseInt(folio));
        const materialesData = await getMateriales(parseInt(folio));

        setFactura(facturaData);

        // Convertir las fechas en UTC a objetos Date válidos
        const detallesConFechaUTC = detalleData.map((detalle) => ({
          ...detalle,
          fechaEntrega: detalle.fechaEntrega ? new Date(detalle.fechaEntrega) : null,
          fechaVencimiento: detalle.fechaVencimiento
            ? new Date(detalle.fechaVencimiento)
            : null,
          fechaPortal: detalle.fechaPortal ? new Date(detalle.fechaPortal) : null,
        }));

        setDetalleFactura(detallesConFechaUTC);
        setMateriales(materialesData);
      } catch (error) {
        console.error("Error al cargar los datos de la factura:", error);
      }
    };

    fetchFacturaData();
  }, [folio]);

  // Función para formatear las fechas de forma segura
  const formatUTCDate = (date: Date | null): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString("es-MX", { timeZone: "UTC" });
  };

  if (!factura) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="factura-page__container">
      <h1 className="factura-page__title">Factura: {factura.folio}</h1>
      <div className="factura-page__section">
        <h2>Información de la Factura</h2>
        <p>
          <strong>Fecha de Emisión:</strong>{" "}
          {formatUTCDate(new Date(factura.fechaEmision))}
        </p>
        <p>
          <strong>Cliente:</strong> {factura.cliente}
        </p>
        <p>
          <strong>Orden de Compra:</strong> {factura.ordenCompra}
        </p>
        <p>
          <strong>Método de Pago:</strong> {factura.metodoPago}
        </p>
        <p>
          <strong>Moneda:</strong> {factura.moneda}
        </p>
        <p>
          <strong>Total:</strong> ${factura.total.toFixed(2)}
        </p>
        <p>
          <strong>Subtotal:</strong> ${factura.subtotal.toFixed(2)}
        </p>
      </div>

      <div className="factura-page__section">
        <h2>Detalle de la Factura</h2>
        {detalleFactura.length > 0 ? (
          <ul>
            {detalleFactura.map((detalle, index) => (
              <li key={index} className="factura-page__detalle-item">
                <p>
                  <strong>Fecha de Entrega:</strong>{" "}
                  {formatUTCDate(detalle.fechaEntrega)}
                </p>
                <p>
                  <strong>Fecha de Vencimiento:</strong>{" "}
                  {formatUTCDate(detalle.fechaVencimiento)}
                </p>
                <p>
                  <strong>Estatus:</strong> {detalle.estatus}
                </p>
                <p>
                  <strong>Crédito:</strong> {detalle.credito} días
                </p>
                <p>
                  <strong>Fecha Portal:</strong>{" "}
                  {formatUTCDate(detalle.fechaPortal)}
                </p>
                <p>
                  <strong>Tipo de Cambio:</strong> {detalle.tipoCambio || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay detalles asociados a esta factura.</p>
        )}
      </div>

      <div className="factura-page__section">
        <h2>Materiales</h2>
        {materiales.length > 0 ? (
          <ul>
            {materiales.map((material) => (
              <li key={material.id} className="factura-page__material-item">
                <p>
                  <strong>No. Parte:</strong> {material.noParte}
                </p>
                <p>
                  <strong>Descripción:</strong> {material.descripcion}
                </p>
                <p>
                  <strong>Cantidad:</strong> {material.cantidad}
                </p>
                <p>
                  <strong>Precio Unitario:</strong> $
                  {material.precioUnitario.toFixed(2)}
                </p>
                <p>
                  <strong>Importe:</strong> ${material.importe.toFixed(2)}
                </p>
                <p>
                  <strong>IVA:</strong> ${material.iva.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay materiales asociados a esta factura.</p>
        )}
      </div>
    </div>
  );
};

export default Factura;