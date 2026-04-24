import type { Category } from '../../types'

interface CategoryTableProps {
    categories: Category[]
    onEdit: (category: Category) => void
    onDelete: (id: number) => void
}

export function CategoryTable({
    categories,
    onEdit,
    onDelete,
}: CategoryTableProps) {
    return (
        <section className="md:col-span-2 bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-700">
                    <tr>
                        <th className="p-4 border-b">ID</th>
                        <th className="p-4 border-b">Name</th>
                        <th className="p-4 border-b">Parent</th>
                        <th className="p-4 border-b text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-gray-50">
                            <td className="p-4 border-b">{cat.id}</td>
                            <td className="p-4 border-b font-medium">
                                {cat.name}
                            </td>
                            <td className="p-4 border-b text-gray-500">
                                {cat.parent?.name || '-'}
                            </td>
                            <td className="p-4 border-b text-right gap-2 flex justify-end">
                                <button
                                    onClick={() => onEdit(cat)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(cat.id)}
                                    className="text-red-600 hover:underline ml-2"
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}
