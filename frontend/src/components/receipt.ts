export interface ReceiptFileData {
    file: File[];
}

export interface ReceiptDataOutput {
    arguments: string;
    imageName: string;
    id: number;

}

export interface ReceiptData {
    list: ReceiptDataOutput[];
    
}

export interface UploadProps {
    open: boolean;
    onChange: () => void;
}