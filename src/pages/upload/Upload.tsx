import React, { useState } from 'react';
import { UploadCard } from '../../components/UploadCard';
import { postFactura } from '../../services';
import { postDetalle } from '../../services';
import { IDetalleForm } from '../../components/DetalleForm/types';
import { DetalleForm } from '../../components/DetalleForm';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import './Upload.css';


const Upload: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFactura, setUploadedFactura] = useState<any | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setStatusMessage(null);

    try {
      const result = await postFactura(file);
      console.log('Factura subida con éxito:', result);
      setUploadedFactura(result);
      setStatusMessage('Archivo subido correctamente');
      setShowSuccessMessage(true); // Mostrar mensaje de éxito
    } catch (error: any) {
      console.error('Error al subir el archivo:', error);
      setStatusMessage(error.message || 'Ocurrió un error al subir el archivo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDetalleSubmit = async (detalle: IDetalleForm) => {
    setIsUploading(true);

    try {
      const result = await postDetalle(
        detalle.facturaId,
        detalle.fechaEntrega,
        detalle.fechaVencimiento,
        detalle.estatus,
        detalle.credito,
        detalle.fechaPortal,
        detalle.tipoCambio
      );
      console.log('Detalle de factura guardado con éxito:', result);
      setStatusMessage('Detalle guardado correctamente.');
      navigate('/records');
    } catch (error: any) {
      console.error('Error al guardar el detalle de factura:', error);
      setStatusMessage(error.message || 'Error al guardar el detalle.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Facturas</h1>
      <UploadCard
        title="Carga el archivo xml de tu factura"
        onFileUpload={handleFileUpload}
        uploadedMessage={showSuccessMessage ? 'Archivo subido correctamente' : ''}
        uploadErrorMessage={
          !showSuccessMessage ? statusMessage || undefined : ''
        }
        buttonLabel={isUploading ? 'Subiendo...' : 'Buscar archivo'}
      />

      {showSuccessMessage && (
        <div className="mt-4 text-center text-green-600 font-bold">
          Archivo subido correctamente
        </div>
      )}

      {uploadedFactura && (
        <div className="mt-8">
          <DetalleForm
            facturaId={uploadedFactura.folio}
            onSubmit={handleDetalleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default Upload;