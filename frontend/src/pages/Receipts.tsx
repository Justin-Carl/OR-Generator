import Export from "@/components/Export";
import ReceiptIndex from "@/components/Receipt/index.tsx"

const Receipts = () => {

    return (
        <div className="container mx-auto">
            <Export />
            <ReceiptIndex />
        </div>
    )
}

export default Receipts;