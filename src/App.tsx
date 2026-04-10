import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  Wifi, 
  Coffee, 
  Shield, 
  Menu, 
  X, 
  Instagram, 
  Facebook,
  ChevronRight,
  Star,
  Zap,
  Car,
  Utensils,
  Award,
  Clock
} from 'lucide-react';

// Constants
const WHATSAPP_NUMBER = "923331574046";
const PRE_FILLED_MESSAGE = encodeURIComponent("Hello! I would like to book a room at Sky Rose Guest House.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${PRE_FILLED_MESSAGE}`;
const GOOGLE_MAPS_KEY = "AIzaSyD1-8j7p8zwoW2ncOYyvyxMidMpqaDTVu8";
const ADDRESS = "40, NPF MPCHS, E-11/3, Islamabad";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80",
  lobby: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  executive: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
  triple: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",
  family: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
  ]
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Rooms", href: "#rooms" },
    { name: "Amenities", href: "#amenities" },
    { name: "Gallery", href: "#gallery" },
    { name: "Location", href: "#location" },
  ];

  return (
    <div className="min-h-screen bg-charcoal selection:bg-gold selection:text-charcoal">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-charcoal/95 backdrop-blur-md py-4 shadow-xl border-b border-gold/20' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-2">
            <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center shadow-lg">
              <Star className="text-charcoal w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tighter gold-text">SKY ROSE</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm uppercase tracking-widest hover:text-gold transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-charcoal transition-all duration-300 rounded-full text-sm font-bold uppercase tracking-widest"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-gold" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-charcoal flex flex-col items-center justify-center gap-8 pt-20"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-serif gold-text"
              >
                {link.name}
              </a>
            ))}
            <a 
              href={WHATSAPP_LINK}
              className="px-10 py-4 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-widest"
            >
              Book via WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.hero} 
            alt="Sky Rose Guest House" 
            className="w-full h-full object-cover opacity-40 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-gold text-xs uppercase tracking-[0.3em] font-bold">
                9.7/10 Rating on Booking.com
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight">
              Premium <br />
              <span className="gold-text italic text-5xl md:text-7xl">Guest House Experience</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Experience unparalleled luxury and comfort at Sky Rose Guest House. 
              Located in the heart of Islamabad, we offer a sanctuary for the discerning traveler.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href={WHATSAPP_LINK}
                className="group relative px-10 py-5 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-widest overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              >
                <span className="relative z-10">Book via WhatsApp</span>
              </a>
              <a 
                href="#rooms"
                className="text-white hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-sm font-bold"
              >
                Explore Rooms <ChevronRight size={18} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gold/50">
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold to-transparent"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-gold/30"></div>
            <img 
              src={IMAGES.lobby} 
              alt="Sky Rose Lobby" 
              className="rounded-2xl shadow-2xl relative z-10 w-full aspect-[4/3] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -right-6 bg-gold p-8 rounded-2xl z-20 hidden md:block shadow-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Award className="text-charcoal" size={24} />
                <p className="text-charcoal font-serif text-3xl font-bold">9.7</p>
              </div>
              <p className="text-charcoal/70 text-xs uppercase tracking-widest font-bold">Booking.com Rating</p>
            </div>
          </div>
          <div>
            <span className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block">Our Excellence</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">Sophisticated Living <br />in Islamabad</h2>
            <p className="text-gray-400 mb-8 leading-relaxed text-lg font-light">
              Sky Rose Guest House is more than just a place to stay; it's a destination of refined elegance. 
              Our commitment to exceptional service and attention to detail has earned us a stellar 9.7/10 
              rating from our valued guests. We pride ourselves on providing a home-away-from-home experience 
              with the luxury of a five-star hotel.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="flex items-start gap-4">
                <div className="text-gold mt-1"><Zap size={24} /></div>
                <div>
                  <h4 className="font-bold mb-1">24/7 Power</h4>
                  <p className="text-sm text-gray-500">Full Electricity Backup</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-gold mt-1"><Wifi size={24} /></div>
                <div>
                  <h4 className="font-bold mb-1">Free Wi-Fi</h4>
                  <p className="text-sm text-gray-500">High-speed connectivity</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-gold mt-1"><Car size={24} /></div>
                <div>
                  <h4 className="font-bold mb-1">Secure Parking</h4>
                  <p className="text-sm text-gray-500">On-site safe parking</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-gold mt-1"><Utensils size={24} /></div>
                <div>
                  <h4 className="font-bold mb-1">Restaurant</h4>
                  <p className="text-sm text-gray-500">On-site dining</p>
                </div>
              </div>
            </div>
            <a href={WHATSAPP_LINK} className="text-gold border-b border-gold/30 pb-1 hover:border-gold transition-all uppercase tracking-widest text-sm font-bold">
              Inquire via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-24 bg-black/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block">Accommodations</span>
            <h2 className="text-4xl md:text-5xl font-serif">Our Signature Rooms</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Executive Master Bed */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-charcoal rounded-3xl overflow-hidden border border-white/5 group shadow-xl"
            >
              <div className="h-72 overflow-hidden">
                <img 
                  src={IMAGES.executive} 
                  alt="Executive Master Bed" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif mb-4">Executive Master Bed</h3>
                <p className="text-gray-500 text-sm mb-6 font-light">
                  A luxurious sanctuary featuring a king-sized bed, premium linens, and a sophisticated workspace.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Starting from</span>
                    <span className="gold-text font-serif text-2xl">5,500 PKR</span>
                  </div>
                  <a href={WHATSAPP_LINK} className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all shadow-lg">
                    <ChevronRight size={24} />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Triple Room */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-charcoal rounded-3xl overflow-hidden border border-white/5 group shadow-xl"
            >
              <div className="h-72 overflow-hidden">
                <img 
                  src={IMAGES.triple} 
                  alt="Triple Room" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif mb-4">Triple Room</h3>
                <p className="text-gray-500 text-sm mb-6 font-light">
                  Spacious and versatile, our triple rooms are perfect for small groups or families seeking comfort.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Starting from</span>
                    <span className="gold-text font-serif text-2xl">6,000 PKR</span>
                  </div>
                  <a href={WHATSAPP_LINK} className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all shadow-lg">
                    <ChevronRight size={24} />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Family Room */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-charcoal rounded-3xl overflow-hidden border border-white/5 group shadow-xl"
            >
              <div className="h-72 overflow-hidden">
                <img 
                  src={IMAGES.family} 
                  alt="Family Room" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif mb-4">Family Room</h3>
                <p className="text-gray-500 text-sm mb-6 font-light">
                  The ultimate family retreat with ample space, multiple beds, and all the comforts of home.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Starting from</span>
                    <span className="gold-text font-serif text-2xl">7,000 PKR</span>
                  </div>
                  <a href={WHATSAPP_LINK} className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all shadow-lg">
                    <ChevronRight size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-serif">World-Class Amenities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Zap size={32} />, title: "24/7 Electricity", desc: "Full Backup Support" },
              { icon: <Wifi size={32} />, title: "Free Wi-Fi", desc: "High-Speed Internet" },
              { icon: <Car size={32} />, title: "Secure Parking", desc: "Safe On-site Space" },
              { icon: <Utensils size={32} />, title: "Restaurant", desc: "Delicious On-site Meals" },
              { icon: <Shield size={32} />, title: "24/7 Security", desc: "CCTV & Guarded" },
              { icon: <Coffee size={32} />, title: "Room Service", desc: "Available at Call" },
              { icon: <Clock size={32} />, title: "Quick Check-in", desc: "Seamless Experience" },
              { icon: <Award size={32} />, title: "Top Rated", desc: "9.7/10 Guest Rating" },
            ].map((item, index) => (
              <div key={index} className="p-8 bg-charcoal rounded-3xl border border-white/5 text-center group hover:border-gold/40 hover:bg-black/40 transition-all duration-500 shadow-lg">
                <div className="text-gold mb-6 flex justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-gold/5 flex items-center justify-center border border-gold/10 group-hover:border-gold/30 transition-all">
                    {item.icon}
                  </div>
                </div>
                <h4 className="font-bold mb-2 text-xl">{item.title}</h4>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-6 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block">Visual Journey</span>
              <h2 className="text-4xl md:text-5xl font-serif">Gallery</h2>
            </div>
            <a href={WHATSAPP_LINK} className="px-8 py-3 border border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-all rounded-full text-sm font-bold uppercase tracking-widest">
              View More on WhatsApp
            </a>
          </div>

          <div className="gallery-grid">
            {IMAGES.gallery.map((url, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="gallery-item rounded-2xl shadow-xl"
              >
                <img src={url} alt={`Gallery ${index + 1}`} referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block">Guest Experiences</span>
            <h2 className="text-4xl md:text-5xl font-serif">What Our Guests Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Ahmed Khan", role: "Business Traveler", text: "The Executive Master Bed was incredibly comfortable. The 24/7 power backup is a lifesaver in Islamabad. Highly recommended!" },
              { name: "Sarah Malik", role: "Family Vacation", text: "We stayed in the Family Room and it was perfect. The staff is very professional and the location in E-11 is very convenient." },
              { name: "John Doe", role: "Solo Traveler", text: "Amazing hospitality and the food at the on-site restaurant was delicious. The 9.7 rating is well-deserved!" }
            ].map((testimonial, index) => (
              <div key={index} className="p-10 bg-white/5 rounded-[2rem] border border-white/5 relative">
                <div className="absolute -top-4 left-10 w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
                  <Star size={14} className="text-charcoal" fill="currentColor" />
                </div>
                <p className="text-gray-400 italic mb-8 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-bold text-gold">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="location" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block">Find Us</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-8">Our Location</h2>
              <p className="text-gray-400 mb-10 leading-relaxed font-light">
                Sky Rose Guest House is conveniently located in the prime area of Islamabad, 
                offering easy access to the city's main attractions and business centers.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 bg-black/20 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Address</h4>
                    <p className="text-sm text-gray-500">{ADDRESS}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-6 bg-black/20 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">WhatsApp</h4>
                    <p className="text-sm text-gray-500">+{WHATSAPP_NUMBER}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[500px] rounded-[2rem] overflow-hidden border border-gold/20 shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(ADDRESS)}`}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto gold-gradient p-12 md:p-20 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Star className="absolute top-10 left-10 w-20 h-20" />
            <Star className="absolute bottom-10 right-10 w-32 h-32" />
          </div>
          <h2 className="text-charcoal text-4xl md:text-6xl font-serif mb-8">Ready to Book <br />Your Stay?</h2>
          <p className="text-charcoal/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
            Join our community of satisfied guests. Book your room now via WhatsApp for the best rates.
          </p>
          <a 
            href={WHATSAPP_LINK}
            className="inline-flex items-center gap-3 px-12 py-6 bg-charcoal text-gold font-bold rounded-full uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
          >
            <Phone size={20} /> Book via WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Star className="text-gold w-6 h-6" fill="currentColor" />
            <span className="text-xl font-serif font-bold gold-text">SKY ROSE</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-gray-500 hover:text-gold transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-500 hover:text-gold transition-colors"><Facebook size={20} /></a>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Sky Rose Guest House. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
