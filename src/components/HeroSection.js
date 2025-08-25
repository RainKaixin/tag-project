const HeroSection = () => {
  return (
    <section className='pt-20 pb-16 bg-white'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6'>
          Discover Amazing Student Creative Work
        </h1>

        <p className='text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
          Explore thousands of inspiring projects from talented students across
          the globe. From 3D art to concept design, find your next creative
          inspiration.
        </p>

        <button
          onClick={() => {}}
          className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
        >
          About TAG
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
