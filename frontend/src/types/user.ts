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
    vat_reg_tin: string;
    vatable_sales: string;
    vat_amount: string;
    vat_compliance_notes: string;
    date: Date;
    total_amount: string;
    description: string;
    imageName: string;
}

export const receiptArgumentsData: ReceiptArgumentsDataOutputProps = {
    company_name: "",
    vat_exempt_sales: "",
    vat_reg_tin: "",
    vatable_sales: "",
    vat_amount: "",
    vat_compliance_notes: "",
    date: new Date(),
    total_amount: "",
    description: "",
    imageName: ""
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