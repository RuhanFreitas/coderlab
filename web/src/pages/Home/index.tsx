import { useState, useEffect } from 'react'
import { useProducts } from '../../hooks/useProducts'
import { SearchForm } from '../../components/home/SearchForm'
import { ProductCard } from '../../components/home/ProductCard'
import { Pagination } from '../../components/home/Pagination'

export function Home() {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const { data, loading, fetchProducts } = useProducts()

    // Sincroniza busca inicial e mudanças de página
    useEffect(() => {
        fetchProducts(page, search)
    }, [page, search, fetchProducts])

    const handleSearch = (term: string) => {
        setSearch(term)
        setPage(1) // Reseta para primeira página na busca
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Catalog
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Explore our range of products
                    </p>
                </div>

                <SearchForm onSearch={handleSearch} initialValue={search} />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 opacity-50 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-64 bg-gray-100 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {data?.data.length ? (
                            data.data.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-400 text-lg">
                                    No products found for "{search}"
                                </p>
                                <button
                                    onClick={() => handleSearch('')}
                                    className="mt-4 text-blue-600 hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>

                    {data && (
                        <Pagination
                            page={page}
                            lastPage={data.meta.lastPage}
                            total={data.meta.total}
                            onPageChange={setPage}
                            disabled={loading}
                        />
                    )}
                </>
            )}
        </section>
    )
}
