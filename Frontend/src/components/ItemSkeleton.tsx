interface ItemSkeletonProps {
  count?: number;
}

function ItemSkeleton({ count = 10 }: ItemSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Image skeleton */}
          <div className="h-48 bg-gray-300 w-full" />

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title skeleton */}
            <div className="h-4 bg-gray-300 rounded w-3/4" />

            {/* Price skeleton */}
            <div className="h-5 bg-gray-300 rounded w-1/2" />

            {/* Button skeleton */}
            <div className="h-8 bg-gray-300 rounded w-full mt-2" />
          </div>
        </div>
      ))}
    </>
  );
}

export default ItemSkeleton;
