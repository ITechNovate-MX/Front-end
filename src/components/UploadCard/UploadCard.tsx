import React, { useRef, useState } from 'react';
import './UploadCard.css';
import { IUploadCard } from './types';
import { ReactComponent as FileUploadIcon } from "../../icons/file_upload.svg";

/**
 * UploadCard - Componente para manejar la carga de archivos.
 */
const UploadCard: React.FC<IUploadCard> = ({
  title,
  onFileUpload,
  uploadedMessage,
  uploadErrorMessage,
  buttonLabel = 'Buscar archivo',
}) => {
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Abre el diálogo para seleccionar el archivo
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    processFile(file);
  };

  const processFile = (file?: File) => {
    if (file) {
      try {
        onFileUpload(file);
        setUploadStatus('success');
      } catch {
        setUploadStatus('error');
      }
    }
  };

  return (
    <div className="upload-page_cardcontainer">
      <div
        className={`upload-card__container ${isDragOver ? 'upload-card__container--dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h2 className="upload-card__title">{title}</h2>
        <div className="upload-card__upload-area">
          <div className="upload-card__icon">
            <FileUploadIcon className='upload-card-svg' />
          </div>
          <span className="upload-card__drag-text">
            {isDragOver ? 'Suelta el archivo aquí' : 'Arrastra para subir el archivo o'}
          </span>
          <input
            type="file"
            ref={fileInputRef}
            className="upload-card__input"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button className="upload-card__button" onClick={handleButtonClick}>
            {buttonLabel}
          </button>
        </div>
        {uploadStatus === 'success' && uploadedMessage && (
          <p className="upload-card__message upload-card__message--success">
            {uploadedMessage}
          </p>
        )}
        {uploadStatus === 'error' && uploadErrorMessage && (
          <p className="upload-card__message upload-card__message--error">
            {uploadErrorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadCard;

