import { useState } from 'react'
import { useProductsManager } from '../../hooks/useProductsManager'
import { ProductForm } from '../../components/product/ProductForm'
import { ProductTable } from '../../components/product/ProductTable'
import type { Product } from '../../types'

export function Product() {
    const { products, categories, loading, saveProduct, deleteProduct } =
        useProductsManager()
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    const handleStartEdit = (product: Product) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setEditingProduct(product)
    }

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <ProductForm
                categories={categories}
                editingProduct={editingProduct}
                onSave={saveProduct}
                onCancel={() => setEditingProduct(null)}
            />

            <ProductTable
                products={products}
                loading={loading}
                onEdit={handleStartEdit}
                onDelete={deleteProduct}
            />
        </div>
    )
}
