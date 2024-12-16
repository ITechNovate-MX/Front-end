export interface IDetalleFactura {
    facturaId:        number;
    fechaEntrega:     Date;
    fechaVencimiento: Date;
    estatus:          string;
    credito:          number;
    fechaPortal:      Date;
    tipoCambio:       number;
}
