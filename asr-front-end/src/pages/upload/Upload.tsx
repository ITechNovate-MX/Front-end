import React, { useState } from 'react';
import { UploadCard } from '../../components/UploadCard';

const Upload: React.FC = () => {

  return (
    <div>
      <h1 className="text-4xl font-bold font-sans text-center text-blue-800 mb-8">Ingreso de Facturas</h1>
      <UploadCard
        title="Sube tu archivo de facturas"
        onFileUpload={(file) => {
          console.log('Archivo subido:', file);
        }}
        uploadedMessage="Archivo subido correctamente"
        uploadErrorMessage="Ocurrió un error al subir el archivo"
        buttonLabel="Buscar archivo"
      />
    </div>
  );
};

export default Upload;