import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';

function Article() {
  const { slug } = useParams();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // We will just render the static content from the screenshot for now,
  // matching their requested layout exactly.
  
  return (
    <div className="min-h-screen bg-[#181818] text-gray-300 font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* Article Header */}
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-medium text-white mb-10 leading-tight">
          Why Thrift Shopping on Non Vintage Nepal Matters
        </h1>
        <p className="text-base md:text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
          Every purchase on Non Vintage Nepal is a vote for sustainable fashion and a healthier planet.
        </p>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
          Discover how shopping secondhand on our platform reduces waste, saves money, and supports local fashion in Nepal.
        </p>
      </div>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">
        
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">The Environmental Impact</h2>
          <p className="text-gray-400 leading-relaxed">
            The fashion industry is one of the world's largest polluters. By shopping on Non Vintage Nepal, you're giving clothes a second life instead of contributing to landfills. Each thrifted item saves water, reduces carbon emissions, and decreases demand for new production. Our marketplace connects you with quality pre-loved fashion right here in Nepal.
          </p>
        </section>

        {/* Quote Block */}
        <div className="py-8 text-center px-4 md:px-12">
          <p className="text-xl md:text-2xl italic text-gray-200 font-light">
            "Shopping on Non Vintage Nepal changed how I think about fashion. I'm saving money AND helping the environment. Win-win!"
          </p>
        </div>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Supporting Local Community</h2>
          <p className="text-gray-400 leading-relaxed">
            When you shop on Non Vintage Nepal, you're supporting real people in Nepal. Our community is made up of students, professionals, and fashion enthusiasts who curate their collections with care. Your purchase promotes sustainable fashion and helps build a circular economy in our community.
          </p>
        </section>

      </div>

      {/* Bottom CTA Card */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-[#222222] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
          <div className="md:w-1/2">
            <img 
              src="https://i.pinimg.com/originals/12/7b/41/127b41ae854386752953e466f23b4de4.jpg" 
              alt="Shop Local" 
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>
          <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              NON VINTAGE NEPAL
            </span>
            <h3 className="text-3xl text-white font-medium leading-tight mb-6">
              Shop Sustainable,<br/>Shop Local
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              Browse completely unique pre-loved items. Quality fashion, affordable prices, and completely sustainable condition verification on every purchase.
            </p>
            <Link 
              to="/products"
              className="bg-[#00a8a8] hover:bg-[#008c8c] text-white text-center font-bold text-sm tracking-wider uppercase py-4 px-8 rounded transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Article;
