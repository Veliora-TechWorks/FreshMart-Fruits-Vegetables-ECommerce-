import Header from '@/components/Header'
import About from '@/components/About'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="section-padding bg-accent/30">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-heading mb-4">
            About FreshMart
          </h1>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Learn about our mission to bring fresh, organic produce from local farms to your table
          </p>
        </div>
      </section>

      <About />
      
      {/* Additional About Content */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-heading mb-4">Our Mission</h3>
              <p className="text-body leading-relaxed">
                To make fresh, organic produce accessible to everyone while supporting local farmers 
                and promoting sustainable agriculture practices.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-heading mb-4">Our Vision</h3>
              <p className="text-body leading-relaxed">
                A world where healthy, fresh food is available to all families, creating stronger 
                communities and a healthier planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}