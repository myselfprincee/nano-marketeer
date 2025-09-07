export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        About NanoBanana
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        The future of fashion technology is here
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                We're revolutionizing the fashion industry with cutting-edge AI technology that allows you to virtually try on any clothing item, accessory, or fashion piece instantly.
                            </p>
                            <p className="text-lg text-gray-600 mb-6">
                                Our advanced AI algorithms provide the most realistic virtual try-on experience, helping you make confident fashion choices from the comfort of your home.
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-2xl">🍌</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">NanoBanana Team</h3>
                                    <p className="text-gray-600">AI Fashion Innovators</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-8xl mb-4">🤖</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Powered by AI</h3>
                            <p className="text-gray-600">
                                Advanced machine learning models trained on millions of fashion items to provide you with the most accurate virtual try-on experience.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Precision</h3>
                        <p className="text-gray-600">Accurate virtual fitting with 95%+ accuracy rate</p>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                        <div className="text-4xl mb-4">🚀</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Innovation</h3>
                        <p className="text-gray-600">Cutting-edge technology that's always improving</p>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                        <div className="text-4xl mb-4">🌟</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Excellence</h3>
                        <p className="text-gray-600">Committed to providing the best user experience</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
