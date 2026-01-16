
import { columns } from "@/components/columns/category-columns.tsx"

import { DataTable } from "@/components/data-table/DataTable.tsx"
import { useEffect, useState } from "react"

import {
    ButtonGroup,
} from "@/components/ui/button-group"

import {
    Button
} from "@/components/ui/button"
import { categoryData } from "@/types/category"

import CreateCategory from "./CreateCategoryDialog"
// import ReceiptDialog from "./ReceiptDialog"
import { useApi } from "@/hooks/use-category"
import { useCategory } from "@/context/CategoryContext"
import { useUser } from "@/context/UserContext"
import { Input } from "@/components/ui/input"

const Category = () => {
    const api = useApi();
    const { token } = useUser();

    const { categories } = useCategory();
    const [isOpen, setOpen] = useState(false);
    const [dialogType, setDialogType] = useState("Create");
    const [dialogData, setDialogData] = useState(categoryData);
    const [search, setSearch] = useState<string>("")

    const handleChange = () => {
        getCategories();
        setOpen(false)
    }

    const handelDialog = () => {
        setOpen(true)
        setDialogType("Create")
        setDialogData(categoryData)
    }

    const getCategories = async () => {
        const body = {
            sort: [["id", "DESC"]]
        }

        // if (search.trim() != "") {
        //     body.filters = [{ type: "string", field: "arguments", filter: search }]
        // }
        await api.getCategory("category/", body);
    }

    useEffect(() => {
        if (token) {
            getCategories();
        }

    }, [token]);

    const handleEdit = async (data: any) => {
        setOpen(true)
        setDialogType("Edit")
        setDialogData(data)
    }


    const handleView = async (data: any) => {
        setOpen(true)
        setDialogType("View")
        setDialogData(data)
    }


    const handleSearchInput = (e: any) => {
        const target = e.target

        setSearch(target.value)
    }

    const handleSearch = (e: any) => {
        const key = e.key

        if (key === "Enter") {
            getCategories();
        }
    }
    return (
        <div className="container mx-auto pb-10">
            <div className="flex flex-col gap-5">
                <div className="flex flex-row justify-end gap-5">
                    <div className="flex flex-row gap-5">
                        {/* <div className="filter">
                            <Button variant="outline" size="lg" >Filter by: </Button>
                        </div> */}
                        <div className="">
                            <Input
                                id="search"
                                type="text"
                                name="search"
                                value={search}
                                placeholder="Search"
                                onChange={handleSearchInput}
                                style={{ height: "100%" }}
                                onKeyDown={handleSearch}

                            />
                        </div>
                    </div>
                    <ButtonGroup>
                        {/* <Button variant="outline" size="lg" >Export</Button>
                    <ButtonGroupSeparator /> */}
                        <Button onClick={handelDialog} variant="outline" size="lg" >Create Category</Button>
                    </ButtonGroup>
                </div>

                <DataTable columns={columns} data={categories} onView={handleView} onEdit={handleEdit} />
            </div>
            <CreateCategory open={isOpen} onChange={handleChange} data={dialogData} type={dialogType} />
            {/* 
            <ReceiptDialog open={isDialogOpen} type={dialogType} data={dialogData} onChange={handleDialogChange} /> */}

        </div>
    )
}

export default Category;

