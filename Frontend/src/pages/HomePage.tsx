function HomePage() {
  return (
    <div>
      <div className="flex flex-col items-center bg-gray-100">
        <div className="flex items-center justify-center bg-gray-50 shadow-lg rounded-lg py-4 w-full max-w-full text-center">
          <div className="mr-2 items-start justify-start pr-6">🍔</div>
          <div className="mr-2">Search 🔎</div>
          <input className="h-8 border border-gray-700 rounded min-w-lg"></input>
          <div className="ml-2">Filter</div>
        </div>
        <div className="text-center shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-full h-50">
          sliding images banner
        </div>
        <div className="grid-cols-6 text-center shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-full h-50">
          items view
        </div>
      </div>
    </div>
  );
}

export default HomePage;
