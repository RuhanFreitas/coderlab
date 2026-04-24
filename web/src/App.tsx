import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Home } from './pages/Home'
import { Category } from './pages/Category'
import { Product } from './pages/Product'
import './index.css'

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <header className="bg-blue-600 text-white">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Catalog</h1>
                        <nav className="flex gap-6">
                            <Link
                                to="/"
                                className="hover:text-blue-200 transition-colors gap-4"
                            >
                                Home
                            </Link>
                            <Link
                                to="/category"
                                className="hover:text-blue-200 transition-colors"
                            >
                                Category
                            </Link>
                            <Link
                                to="/product"
                                className="hover:text-blue-200 transition-colors"
                            >
                                Product
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8 grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/category" element={<Category />} />
                        <Route path="/product" element={<Product />} />
                    </Routes>
                </main>

                <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
                    <p>&copy; 2026 Catalog</p>
                </footer>
            </div>
        </Router>
    )
}
