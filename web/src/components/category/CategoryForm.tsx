import { useState, useEffect } from 'react'
import type { Category } from '../../types'

interface CategoryFormProps {
    categories: Category[]
    editingCategory: Category | null
    onSave: (
        name: string,
        parentId: number | null,
        id?: number | null,
    ) => Promise<{ success: boolean; message?: string }>
    onCancel: () => void
}

export function CategoryForm({
    categories,
    editingCategory,
    onSave,
    onCancel,
}: CategoryFormProps) {
    const [name, setName] = useState('')
    const [parentId, setParentId] = useState<number | ''>('')

    useEffect(() => {
        if (editingCategory) {
            setName(editingCategory.name)
            setParentId(editingCategory.parentId || '')
        } else {
            setName('')
            setParentId('')
        }
    }, [editingCategory])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await onSave(
            name,
            parentId ? Number(parentId) : null,
            editingCategory?.id,
        )

        if (result.success) {
            setName('')
            setParentId('')
            onCancel()
        } else if (result.message) {
            alert(result.message)
        }
    }

    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border h-fit">
            <h2 className="text-xl font-bold mb-4">
                {editingCategory ? 'Edit Category' : 'New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        required
                        minLength={3}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Category (Opcional)
                    </label>
                    <select
                        value={parentId}
                        onChange={(e) =>
                            setParentId(
                                e.target.value ? Number(e.target.value) : '',
                            )
                        }
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">None</option>
                        {categories
                            .filter((c) => c.id !== editingCategory?.id)
                            .map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Salvar
                    </button>
                    {editingCategory && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </section>
    )
}
