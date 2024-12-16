export interface IUploadCard{
    /** 
     * Card title
     */
    title: string;
    /** 
     * Function to handle the file upload event
     */
    onFileUpload: (file: File) => void;

    /** 
     * Message to display when the file is uploaded
     */
    uploadedMessage?: string;

    /**
     * Message to display when the file is not uploaded
     */
    uploadErrorMessage?: string;

    /**
     * label for the upload button
     */
    buttonLabel?: string;

}