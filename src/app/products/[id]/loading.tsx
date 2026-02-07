export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div>
            <div className="h-96 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Content skeleton */}
          <div>
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-32 mb-8 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded mb-8 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}