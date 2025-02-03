import React, { useState } from "react";
import { IDetalleForm } from "./types";
import './DetalleForm.css';

interface DetalleFormProps {
    facturaId: number; // Se autocompleta con el folio de la factura recién subida
    onSubmit: (detalle: IDetalleForm) => void; // Función para manejar el submit del formulario
}

const DetalleForm: React.FC<DetalleFormProps> = ({ facturaId, onSubmit }) => {
    const [fechaEntrega, setFechaEntrega] = useState<string>('');
    const [credito, setCredito] = useState<number>(0);
    const [fechaPortal, setFechaPortal] = useState<string>('');
    const [tipoCambio, setTipoCambio] = useState<number>(0);

    const calculateFechaVencimiento = (fechaEntrega: string, fechaPortal: string, credito: number): Date => {
        // Tomar la fecha base (portal o entrega)
        const baseDate = fechaPortal ? new Date(fechaPortal) : new Date(fechaEntrega);

        // Calcular el timestamp UTC sumando los días del crédito
        const vencimientoTimestamp = baseDate.getTime() + credito * 24 * 60 * 60 * 1000;

        // Crear una nueva fecha UTC a partir del timestamp
        const vencimiento = new Date(vencimientoTimestamp);

        // Ajustar la fecha a medianoche UTC
        vencimiento.setUTCHours(0, 0, 0, 0);

        return vencimiento;
    };

    const calculateEstatus = (vencimiento: Date): string => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Comparar en UTC
        vencimiento.setUTCHours(0, 0, 0, 0); // Comparar en UTC

        if (today < vencimiento) return 'en_progreso';
        if (today.getTime() === vencimiento.getTime()) return 'pendiente';
        return 'vencida';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!fechaEntrega) {
            alert("Por favor, complete los campos obligatorios.");
            return;
        }

        const vencimiento = calculateFechaVencimiento(fechaEntrega, fechaPortal, credito);
        const estatus = calculateEstatus(vencimiento);

        const detalle: IDetalleForm = {
            facturaId,
            fechaEntrega: new Date(fechaEntrega),
            fechaVencimiento: vencimiento,
            estatus,
            credito,
            fechaPortal: fechaPortal ? new Date(fechaPortal) : null, // Manejar fechaPortal opcionalmente
            tipoCambio,
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
                />
            </div>

            <div className="detalle-form__field">
                <label className="detalle-form__label">Fecha Portal (opcional):</label>
                <input
                    type="date"
                    value={fechaPortal}
                    onChange={(e) => setFechaPortal(e.target.value)}
                    className="detalle-form__input"
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
                />
            </div>

            <button
                type="submit"
                className="detalle-form__button"
                disabled={!fechaEntrega}
            >
                Guardar Detalle
            </button>
        </form>
    );
};

export default DetalleForm;