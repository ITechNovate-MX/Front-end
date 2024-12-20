export interface IDetalleFactura {
    facturaId:        number;
    fechaEntrega:     any;
    fechaVencimiento: any;
    estatus:          string;
    credito:          number;
    fechaPortal:      any;
    tipoCambio:       number | null;
}
