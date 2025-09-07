export default function CollectionsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Fashion Collections
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Browse our curated collections of the latest fashion trends
                    </p>
                </div>

                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🏗️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h2>
                    <p className="text-gray-600">We're working on bringing you the best fashion collections!</p>
                </div>
            </div>
        </div>
    );
}
