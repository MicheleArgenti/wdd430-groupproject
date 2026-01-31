import React from 'react';

export default function CartPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
            Shopping Cart
          </h1>
        </div>
      </header>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.5rem'
        }}>
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4b5563', marginBottom: '1rem' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Add some handmade products to your cart to see them here!
            </p>
            <a 
              href="/products" 
              style={{
                display: 'inline-block',
                backgroundColor: '#d97706',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}