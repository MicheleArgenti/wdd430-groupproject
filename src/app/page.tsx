import Header from '@/components/layout/Header';
import ProductList from '@/components/products/ProductList';
import { getProducts } from '@/lib/actions/product.actions';

export default async function HomePage() {
  const products = await getProducts({ limit: 8 });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Handcrafted Haven
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover unique, handmade treasures from talented artisans worldwide
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition">
              Shop Now
            </button>
            <button className="border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition">
              Become a Seller
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <a href="/products" className="text-amber-600 hover:text-amber-700 font-medium">
            View All →
          </a>
        </div>
        
        <ProductList products={products} />
      </section>

      {/* Categories */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Jewelry', 'Home Decor', 'Clothing', 'Art'].map((category) => (
              <div key={category} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">© 2024 Handcrafted Haven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}