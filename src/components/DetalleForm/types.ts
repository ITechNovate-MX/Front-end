export interface IDetalleForm {
    facturaId: number;
    fechaEntrega: Date;
    fechaVencimiento: Date;
    estatus: string;
    credito: number;
    fechaPortal: Date | null;
    tipoCambio: number;
}
