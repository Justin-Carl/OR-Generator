
export interface CategoryData {
    title: string;
    description: string;
    status: boolean;
    id: number;

}

export interface CategoryDialogProps {
    open: boolean;
    type: string;
    onChange: () => void;
    data: any;
}

export const categoryData: CategoryData = {
    title: "",
    description: "",
    status: true,
    id: 0
}

export const categoryList: CategoryData[] = [{
    title: "",
    description: "",
    status: true,
    id: 0
}]