export interface ReceiptImageData {
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


export interface ReceiptArgumentsDataOutputProps {
    company_name: string;
    vat_exempt_sales: string;
    date: string;
    total_amount: string;
    description: string;
}

export const receiptArgumentsData: ReceiptArgumentsDataOutputProps = {
    company_name: "",
    vat_exempt_sales: "",
    date: "",
    total_amount: "",
    description: "",
}

export interface ReceiptEditProps {
    open: boolean;
    type: string;
    onChange: () => void;
    data: any;
}

// export interface ReceiptData {
//   id: string;
//   item: string;
//   price: number;
//   vat: number;
// }