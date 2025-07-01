const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
        <div className="mt-4">
          <p className="text-gray-600 text-sm">Loading latest news...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
