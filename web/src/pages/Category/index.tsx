import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'
import { CategoryForm } from '../../components/category/CategoryForm'
import { CategoryTable } from '../../components/category/CategoryTable'
import type { Category } from '../../types'

export function Category() {
    const { categories, saveCategory, deleteCategory } = useCategories()
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    )

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <CategoryForm
                categories={categories}
                editingCategory={editingCategory}
                onSave={saveCategory}
                onCancel={() => setEditingCategory(null)}
            />

            <CategoryTable
                categories={categories}
                onEdit={setEditingCategory}
                onDelete={deleteCategory}
            />
        </div>
    )
}
