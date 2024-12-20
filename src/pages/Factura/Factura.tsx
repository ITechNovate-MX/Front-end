import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFacturaByFolio } from "../../services/facturas/getFacturaByFolio";
import { getDetalleByFolio } from "../../services/detallefactura/getDetalleByFolio";
import { getMateriales } from "../../services/facturas/getMateriales";
import { Loader } from "../../components/Loader/Loader";
import { putDetalle } from "../../services/detallefactura/putDetalle";
import { EditButton } from "../../components/EditButton";
import "./Factura.css";

const Factura: React.FC = () => {
  const { folio } = useParams<{ folio: string }>();
  const [factura, setFactura] = useState<any | null>(null);
  const [detalleFactura, setDetalleFactura] = useState<any[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false); // Estado para activar/desactivar edición
  const [editableDetalles, setEditableDetalles] = useState<any[]>([]); // Detalles editables

  useEffect(() => {
    const fetchFacturaData = async () => {
      try {
        if (!folio) return;

        const facturaData = await getFacturaByFolio(parseInt(folio));
        const detalleData = await getDetalleByFolio(parseInt(folio));
        const materialesData = await getMateriales(parseInt(folio));

        setFactura(facturaData);

        const detallesConFechaUTC = detalleData.map((detalle) => ({
          ...detalle,
          fechaEntrega: detalle.fechaEntrega ? new Date(detalle.fechaEntrega) : null,
          fechaVencimiento: detalle.fechaVencimiento
            ? new Date(detalle.fechaVencimiento)
            : null,
          fechaPortal: detalle.fechaPortal ? new Date(detalle.fechaPortal) : null,
        }));

        setDetalleFactura(detallesConFechaUTC);
        setEditableDetalles(detallesConFechaUTC); // Inicia editableDetalles con los datos actuales
        setMateriales(materialesData);
      } catch (error) {
        console.error("Error al cargar los datos de la factura:", error);
      }
    };

    fetchFacturaData();
  }, [folio]);

  const handleEditClick = () => {
    setIsEditing(true); // Activa el modo edición
  };

  const handleCancelEdit = () => {
    setEditableDetalles(detalleFactura); // Restaura los valores originales
    setIsEditing(false); // Desactiva el modo edición
  };

  const handleSaveChanges = async () => {
    try {
      console.log("Detalles editables antes de guardar:", editableDetalles);
      for (const detalle of editableDetalles) {
        console.log("Procesando detalle con Folio:", folio);
        await putDetalle(parseInt(folio || "0"), detalle); // Llama al servicio usando el folio
      }
      setDetalleFactura(editableDetalles); // Actualiza los detalles originales con los cambios
      setIsEditing(false); // Desactiva el modo edición
      alert("Cambios guardados exitosamente.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Error al guardar los cambios.");
    }
  };

  const handleFieldChange = (index: number, field: string, value: any) => {
    const updatedDetalles = [...editableDetalles];
    updatedDetalles[index][field] = value;
    setEditableDetalles(updatedDetalles);
  };

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

      {/* Información de la Factura */}
      <div className="factura-page__section">
        <h2 className="factura-page__sectiontitle">Información de la Factura</h2>
        <div className="factura-page__grid">
          <div className="factura-page__item">
            <p><strong>Fecha de Emisión:</strong> {formatUTCDate(new Date(factura.fechaEmision))}</p>
          </div>
          <div className="factura-page__item">
            <p><strong>Cliente:</strong> {factura.cliente}</p>
          </div>
          <div className="factura-page__item">
            <p><strong>Orden de Compra:</strong> {factura.ordenCompra}</p>
          </div>
          <div className="factura-page__item">
            <p><strong>Método de Pago:</strong> {factura.metodoPago}</p>
          </div>
          <div className="factura-page__item">
            <p><strong>Moneda:</strong> {factura.moneda}</p>
          </div>
          <div className="factura-page__item">
            <p><strong>Total:</strong> ${factura.total.toFixed(2)}</p>
          </div>
          <div className="factura-page__item">
            <p><strong>Subtotal:</strong> ${factura.subtotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Detalle de la Factura */}
      <div className="factura-page__section">
        <div className="factura-page__edit-button-container">
          <EditButton onClick={handleEditClick} />
        </div>
        <h2 className="factura-page__sectiontitle">Detalle de la Factura</h2>
        {detalleFactura.length > 0 ? (
          <ul>
            {editableDetalles.map((detalle, index) => (
              <li key={index} className="factura-page__detalle-item">
                <div className="factura-page__item">
                  <p><strong>Fecha de Entrega:</strong> 
                    {isEditing ? (
                      <input
                        type="date"
                        value={
                          detalle.fechaEntrega
                            ? new Date(detalle.fechaEntrega).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleFieldChange(index, "fechaEntrega", e.target.value)
                        }
                      />
                    ) : (
                      formatUTCDate(detalle.fechaEntrega)
                    )}
                  </p>
                </div>
                <div className="factura-page__item">
                  <p><strong>Fecha Portal:</strong> 
                    {isEditing ? (
                      <input
                        type="date"
                        value={
                          detalle.fechaPortal
                            ? new Date(detalle.fechaPortal).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleFieldChange(index, "fechaPortal", e.target.value)
                        }
                      />
                    ) : (
                      formatUTCDate(detalle.fechaPortal)
                    )}
                  </p>
                </div>
                <div className="factura-page__item">
                  <p><strong>Estatus:</strong> 
                    {isEditing ? (
                      <select
                        value={detalle.estatus}
                        onChange={(e) =>
                          handleFieldChange(index, "estatus", e.target.value)
                        }
                      >
                        <option value="en_progreso">En Progreso</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="vencida">Vencida</option>
                        <option value="pagada">Pagada</option>
                      </select>
                    ) : (
                      detalle.estatus
                    )}
                  </p>
                </div>
                <div className="factura-page__item">
                  <p><strong>Crédito:</strong> {detalle.credito} días</p>
                </div>
                <div className="factura-page__item">
                  <p><strong>Tipo de Cambio:</strong> {detalle.tipoCambio || "N/A"}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay detalles asociados a esta factura.</p>
        )}
        {isEditing && (
          <div className="factura-page__button-group">
            <button
              className="factura-page__save-button"
              onClick={handleSaveChanges}
            >
              Guardar Cambios
            </button>
            <button
              className="factura-page__cancel-button"
              onClick={handleCancelEdit}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Materiales */}
      <div className="factura-page__section">
        <h2 className="factura-page__sectiontitle">Materiales</h2>
        {materiales.length > 0 ? (
          <ul>
            {materiales.map((material) => (
              <li key={material.id} className="factura-page__material-item">
                <div className="factura-page__item">
                  <p><strong>Descripción:</strong> {material.descripcion}</p>
                </div>
                <div className="factura-page__item">
                  <p><strong>Cantidad:</strong> {material.cantidad}</p>
                </div>
                <div className="factura-page__item">
                  <p><strong>Precio Unitario:</strong> ${material.precioUnitario}</p>
                </div>
                <div className="factura-page__item">
                  <p><strong>Importe:</strong> ${material.importe}</p>
                </div>
                <div className="factura-page__item">
                  <p><strong>IVA:</strong> ${material.iva}</p>
                </div>
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

