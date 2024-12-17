import React from "react";
import { IDetalleForm } from "./types";
import './DetalleForm.css';
import { useState } from "react";

interface DetalleFormProps {
    facturaId: number; // Se autocompleta con el folio de la factura recién subida
    onSubmit: (detalle: IDetalleForm) => void; // Función para manejar el submit del formulario
}

const DetalleForm: React.FC<DetalleFormProps> = ({ facturaId, onSubmit }) => {
    const [fechaEntrega, setFechaEntrega] = useState<string>('');
    const [credito, setCredito] = useState<number>(0);
    const [fechaPortal, setFechaPortal] = useState<string>('');
    const [tipoCambio, setTipoCambio] = useState<number>(0);
  
    const calculateFechaVencimiento = (fecha: string, credito: number): Date => {
      const entregaDate = new Date(fecha);
      entregaDate.setDate(entregaDate.getDate() + credito);
      return entregaDate;
    };
  
    const calculateEstatus = (vencimiento: Date): string => {
      const today = new Date();
      if (today < vencimiento) return 'en_prpgreso';
      if (today.toDateString() === vencimiento.toDateString()) return 'pendiente';
      return 'vencida';
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const vencimiento = calculateFechaVencimiento(fechaEntrega, credito);
      const estatus = calculateEstatus(vencimiento);
  
      const detalle: IDetalleForm = {
        facturaId,
        fechaEntrega: new Date(fechaEntrega),
        fechaVencimiento: vencimiento,
        estatus,
        credito,
        fechaPortal: new Date(fechaPortal),
        tipoCambio: tipoCambio,
      };
  
      onSubmit(detalle);
    };
  
    return (
      <form className="detalle-form__container" onSubmit={handleSubmit}>
        <h3 className="detalle-form__header">Agregar Detalle de Factura</h3>
        <p className="detalle-form__summary">
          <strong>Factura ID:</strong> {facturaId}
        </p>
  
        <div className="detalle-form__field">
          <label className="detalle-form__label">Fecha de Entrega:</label>
          <input
            type="date"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
            className="detalle-form__input"
            required
          />
        </div>
  
        <div className="detalle-form__field">
          <label className="detalle-form__label">Crédito (en días):</label>
          <input
            type="number"
            value={credito}
            onChange={(e) => setCredito(parseInt(e.target.value, 10))}
            className="detalle-form__input"
            required
          />
        </div>
  
        <div className="detalle-form__field">
          <label className="detalle-form__label">Fecha Portal:</label>
          <input
            type="date"
            value={fechaPortal}
            onChange={(e) => setFechaPortal(e.target.value)}
            className="detalle-form__input"
            required
          />
        </div>
  
        <div className="detalle-form__field">
          <label className="detalle-form__label">Tipo de Cambio:</label>
          <input
            type="number"
            value={tipoCambio}
            onChange={(e) => setTipoCambio(parseFloat(e.target.value))}
            className="detalle-form__input"
            step="0.01"
            required
          />
        </div>
  
        <button
          type="submit"
          className="detalle-form__button"
          disabled={!fechaEntrega || !credito || !fechaPortal || !tipoCambio}
        >
          Guardar Detalle
        </button>
      </form>
    );
  };
  
  export default DetalleForm;
  
