import ProductList from '@/components/products/ProductList';

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Handcrafted Haven
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover unique, handmade treasures from talented artisans worldwide
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/products" className="btn btn-primary btn-lg">
              Shop Now
            </a>
            <a href="/register" className="btn btn-outline btn-lg">
              Become a Seller
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <a href="/products" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product cards will go here */}
          <div className="card">
            <div className="card-img bg-gray-200 flex items-center justify-center">
              <span className="text-4xl">🛍️</span>
            </div>
            <div className="card-body">
              <h3 className="card-title">Handmade Ceramic Mug</h3>
              <p className="card-text">Beautiful hand-thrown ceramic mug with unique glaze pattern</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">$35.99</span>
                <button className="btn btn-primary">View Details</button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-img bg-gray-200 flex items-center justify-center">
              <span className="text-4xl">💎</span>
            </div>
            <div className="card-body">
              <h3 className="card-title">Silver Pendant Necklace</h3>
              <p className="card-text">Elegant silver pendant with natural turquoise stone</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">$89.99</span>
                <button className="btn btn-primary">View Details</button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-img bg-gray-200 flex items-center justify-center">
              <span className="text-4xl">🧣</span>
            </div>
            <div className="card-body">
              <h3 className="card-title">Handwoven Wool Scarf</h3>
              <p className="card-text">Warm wool scarf with traditional patterns, perfect for winter</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">$45.50</span>
                <button className="btn btn-primary">View Details</button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-img bg-gray-200 flex items-center justify-center">
              <span className="text-4xl">🎨</span>
            </div>
            <div className="card-body">
              <h3 className="card-title">Watercolor Painting</h3>
              <p className="card-text">Original watercolor painting of mountain landscape</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">$120.00</span>
                <button className="btn btn-primary">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-12">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Jewelry', 'Home Decor', 'Clothing', 'Art'].map((category) => (
              <div key={category} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container text-center">
          <p className="text-gray-400">© 2024 Handcrafted Haven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}