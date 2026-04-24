export interface Category {
    id: number
    name: string
    parentId?: number | null
    parent?: Category
    children?: Category[]
}

export interface Product {
    id: number
    name: string
    price: number
    categories: Category[]
}

export interface PaginatedProducts {
    data: Product[]
    meta: {
        total: number
        page: number
        lastPage: number
    }
}
