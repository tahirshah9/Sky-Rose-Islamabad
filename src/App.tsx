import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate,
  Link
} from 'react-router-dom';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase';
import { handleFirestoreError, OperationType, cn } from './utils';
import { 
  LayoutDashboard, 
  Bed, 
  BookOpen, 
  Image as ImageIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle,
  Menu,
  X,
  Phone,
  MapPin,
  Wifi,
  Coffee,
  Shield,
  Star,
  Zap,
  Car,
  Utensils,
  Award,
  Clock,
  ChevronRight,
  Instagram,
  Facebook,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants ---
const ADMIN_EMAILS = ["hospitalityhub164@gmail.com", "shahtah5572345@gmail.com"];
const WHATSAPP_NUMBER = "923331574046";
const PRE_FILLED_MESSAGE = encodeURIComponent("Hello! I would like to book a room at Sky Rose Guest House.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${PRE_FILLED_MESSAGE}`;
const GOOGLE_MAPS_KEY = "AIzaSyD1-8j7p8zwoW2ncOYyvyxMidMpqaDTVu8";
const ADDRESS = "40, NPF MPCHS, E-11/3, Islamabad";

// --- Components ---

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      try {
        const parsed = JSON.parse(event.error.message);
        setErrorMsg(parsed.error || "An unexpected error occurred.");
      } catch {
        setErrorMsg(event.error.message);
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal p-6">
        <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-2xl max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{errorMsg}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-full font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// --- Landing Page ---

const BookingForm = ({ roomType, onClose }: { roomType: string, onClose: () => void }) => {
  const [formData, setFormData] = useState({ guestName: '', phone: '', checkIn: '', checkOut: '' });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>({ whatsappNumber: WHATSAPP_NUMBER });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) setSettings(doc.data());
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        roomType,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      alert("Booking request sent! We will contact you soon.");
      onClose();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppBooking = () => {
    const message = encodeURIComponent(
      `Hello! I would like to book a room.\n\n` +
      `Room: ${roomType}\n` +
      `Name: ${formData.guestName}\n` +
      `Phone: ${formData.phone}\n` +
      `Check-In: ${formData.checkIn}\n` +
      `Check-Out: ${formData.checkOut}`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-6">
      <div className="bg-charcoal border border-white/10 p-8 rounded-[2rem] w-full max-w-md">
        <h2 className="text-2xl font-serif mb-6 gold-text">Book {roomType}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Your Name" required 
            value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none"
          />
          <input 
            type="tel" placeholder="Phone Number" required 
            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Check-In</label>
              <input 
                type="date" required 
                value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Check-Out</label>
              <input 
                type="date" required 
                value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <button type="submit" disabled={loading} className="w-full py-4 gold-gradient text-charcoal rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "Request Booking"}
            </button>
            <button 
              type="button" 
              onClick={handleWhatsAppBooking}
              className="w-full py-4 bg-green-600 text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <Phone size={16} /> Book via WhatsApp
            </button>
            <button type="button" onClick={onClose} className="w-full py-4 bg-white/5 rounded-full font-bold uppercase tracking-widest text-xs">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [settings, setSettings] = useState<any>({ whatsappNumber: WHATSAPP_NUMBER, bookingRating: '9.7/10' });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const qRooms = query(collection(db, 'rooms'), orderBy('price', 'asc'));
    const unsubscribeRooms = onSnapshot(qRooms, (snapshot) => {
      const roomData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomData);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'rooms'));

    const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribeGallery = onSnapshot(qGallery, (snapshot) => {
      const galleryData = snapshot.docs.map(doc => doc.data().url);
      setGallery(galleryData);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'gallery'));

    const qAmenities = query(collection(db, 'amenities'), orderBy('title', 'asc'));
    const unsubscribeAmenities = onSnapshot(qAmenities, (snapshot) => {
      const amenityData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setAmenities(amenityData.filter(a => a.isActive));
    }, (error) => {
      console.error("Amenities fetch error:", error);
    });

    const qReviews = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribeReviews = onSnapshot(qReviews, (snapshot) => {
      const reviewData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setReviews(reviewData.filter(r => r.isActive));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'reviews'));

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) setSettings(doc.data());
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeRooms();
      unsubscribeGallery();
      unsubscribeAmenities();
      unsubscribeReviews();
      unsubscribeSettings();
    };
  }, []);

  const dynamicWhatsAppLink = `https://wa.me/${settings.whatsappNumber}?text=${PRE_FILLED_MESSAGE}`;

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Rooms", href: "#rooms" },
    { name: "Amenities", href: "#amenities" },
    { name: "Gallery", href: "#gallery" },
    { name: "Location", href: "#location" },
  ];

  const IMAGES = {
    hero: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80",
    lobby: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  };

  const displayGallery = gallery.length > 0 ? gallery : [
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <div className="min-h-screen bg-charcoal selection:bg-gold selection:text-charcoal">
      {/* Navigation */}
      <nav className={cn(
        "fixed w-full z-50 transition-all duration-300",
        scrolled ? 'bg-charcoal/95 backdrop-blur-md py-4 shadow-xl border-b border-gold/20' : 'bg-transparent py-6'
      )}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-2">
            <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center shadow-lg">
              <Star className="text-charcoal w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tighter gold-text">SKY ROSE</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm uppercase tracking-widest hover:text-gold transition-colors font-medium">
                {link.name}
              </a>
            ))}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-charcoal transition-all duration-300 rounded-full text-sm font-bold uppercase tracking-widest">
              Book Now
            </a>
          </div>

          <button className="md:hidden text-gold" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-charcoal flex flex-col items-center justify-center gap-8 pt-20"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif gold-text">
                {link.name}
              </a>
            ))}
            <a href={WHATSAPP_LINK} className="px-10 py-4 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-widest">
              Book via WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={IMAGES.hero} alt="Sky Rose" className="w-full h-full object-cover opacity-40 scale-105" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-gold text-xs uppercase tracking-[0.3em] font-bold">
                {settings.bookingRating} Rating on Booking.com
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight">Premium <br /><span className="gold-text italic text-5xl md:text-7xl">Guest House Experience</span></h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Experience unparalleled luxury and comfort at Sky Rose Guest House. Located in the heart of Islamabad.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href={dynamicWhatsAppLink} className="px-10 py-5 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-widest transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                Book via WhatsApp
              </a>
              <a href="#rooms" className="text-white hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-sm font-bold">
                Explore Rooms <ChevronRight size={18} />
              </a>
            </div>
          </motion.div>
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
            {rooms.map((room) => (
              <motion.div key={room.id} whileHover={{ y: -10 }} className="bg-charcoal rounded-3xl overflow-hidden border border-white/5 group shadow-xl">
                <div className="h-72 overflow-hidden relative">
                  <img src={room.imageUrl || IMAGES.hero} alt={room.type} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-gold font-bold text-sm">{room.price.toLocaleString()} PKR</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-serif mb-4">{room.type}</h3>
                  <p className="text-gray-500 text-sm mb-6 font-light line-clamp-2">{room.description || "A luxurious sanctuary featuring premium linens and sophisticated design."}</p>
                  <button 
                    onClick={() => setSelectedRoom(room)}
                    className="w-full py-4 border border-gold/30 rounded-full text-gold font-bold uppercase tracking-widest text-xs hover:bg-gold hover:text-charcoal transition-all shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 px-6 bg-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-serif">Guest Experiences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.length > 0 ? reviews.map((review) => (
              <div key={review.id} className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] relative group hover:border-gold/30 transition-all duration-500">
                <div className="flex text-gold mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-8 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-charcoal font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{review.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Verified Guest</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="col-span-full text-center text-gray-500">No reviews yet. Be our first guest!</p>
            )}
          </div>
        </div>
      </section>

      {/* Room Detail Modal */}
      <AnimatePresence>
        {selectedRoom && typeof selectedRoom === 'object' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-charcoal border border-white/10 rounded-[3rem] w-full max-w-5xl overflow-hidden my-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-[400px] lg:h-full bg-black/40 relative">
                  <img 
                    src={selectedRoom.imageUrl || IMAGES.hero} 
                    alt={selectedRoom.type} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {selectedRoom.imageUrls && selectedRoom.imageUrls.length > 1 && (
                    <div className="absolute bottom-6 left-6 right-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {selectedRoom.imageUrls.map((url: string, idx: number) => (
                        <button 
                          key={idx} 
                          onClick={() => setSelectedRoom({...selectedRoom, imageUrl: url})}
                          className={cn(
                            "w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0",
                            selectedRoom.imageUrl === url ? "border-gold scale-105" : "border-transparent opacity-60"
                          )}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-10 lg:p-16 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-4xl font-serif mb-2">{selectedRoom.type}</h2>
                      <p className="text-gold font-bold text-xl">{selectedRoom.price.toLocaleString()} PKR <span className="text-xs text-gray-500 uppercase">/ Night</span></p>
                    </div>
                    <button onClick={() => setSelectedRoom(null)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="space-y-6 mb-10">
                    <p className="text-gray-400 leading-relaxed">{selectedRoom.description || "Our suites offer a perfect blend of elegance and functionality, ensuring a restful stay for all our guests."}</p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold"><Bed size={20} /></div>
                        <span className="text-sm font-medium">{selectedRoom.capacity} Guests</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold"><Shield size={20} /></div>
                        <span className="text-sm font-medium">Secure Stay</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-4">
                    <button 
                      onClick={() => {
                        const type = selectedRoom.type;
                        setSelectedRoom(type); // Switch to string to open BookingForm
                      }}
                      className="w-full py-5 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-[0.2em] text-xs shadow-xl shadow-gold/10"
                    >
                      Book This Room
                    </button>
                    <button 
                      onClick={() => {
                        const message = encodeURIComponent(`Hello! I'm interested in booking the ${selectedRoom.type}.`);
                        window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
                      }}
                      className="w-full py-5 border border-white/10 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-white/5 transition-all"
                    >
                      Inquire via WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {selectedRoom && typeof selectedRoom === 'string' && (
          <BookingForm roomType={selectedRoom} onClose={() => setSelectedRoom(null)} />
        )}
      </AnimatePresence>

      {/* Amenities Section */}
      <section id="amenities" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-serif">World-Class Amenities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {amenities.length > 0 ? amenities.map((item, index) => {
              const IconComponent = {
                Zap, Wifi, Car, Utensils, Shield, Coffee, Clock, Award
              }[item.icon] || Star;

              return (
                <div key={item.id} className="p-8 bg-charcoal rounded-3xl border border-white/5 text-center group hover:border-gold/40 hover:bg-black/40 transition-all duration-500 shadow-lg">
                  <div className="text-gold mb-6 flex justify-center group-hover:scale-110 transition-transform duration-500">
                    <div className="w-16 h-16 rounded-2xl bg-gold/5 flex items-center justify-center border border-gold/10 group-hover:border-gold/30 transition-all">
                      <IconComponent size={32} />
                    </div>
                  </div>
                  <h4 className="font-bold mb-2 text-xl">{item.title}</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">{item.desc}</p>
                </div>
              );
            }) : (
              <p className="col-span-full text-center text-gray-500">Loading amenities...</p>
            )}
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
            <a href={dynamicWhatsAppLink} className="px-8 py-3 border border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-all rounded-full text-sm font-bold uppercase tracking-widest">
              View More on WhatsApp
            </a>
          </div>

          <div className="gallery-grid">
            {displayGallery.map((url, index) => (
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

      {/* Map Section */}
      <section id="location" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block">Find Us</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-8">Our Location</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 bg-black/20 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold"><MapPin size={24} /></div>
                  <div><h4 className="font-bold">Address</h4><p className="text-sm text-gray-500">{ADDRESS}</p></div>
                </div>
                <div className="flex items-center gap-4 p-6 bg-black/20 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold"><Phone size={24} /></div>
                  <div><h4 className="font-bold">WhatsApp</h4><p className="text-sm text-gray-500">+{WHATSAPP_NUMBER}</p></div>
                </div>
              </div>
            </div>
            <div className="h-[500px] rounded-[2rem] overflow-hidden border border-gold/20 shadow-2xl">
              <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(ADDRESS)}`}></iframe>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Star className="text-gold w-6 h-6" fill="currentColor" />
            <span className="text-xl font-serif font-bold gold-text">SKY ROSE</span>
          </div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Sky Rose Guest House. <Link to="/admin" className="hover:text-gold">Admin</Link></p>
        </div>
      </footer>
    </div>
  );
};

// --- Admin Dashboard ---

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (!ADMIN_EMAILS.includes(result.user.email || "")) {
        await signOut(auth);
        setError("Access Denied: Unauthorized Email.");
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
        <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <Shield className="text-charcoal w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif mb-2">Admin Portal</h1>
        <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs font-bold">Sky Rose Guest House</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm">{error}</div>}
        
        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-widest flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Shield size={20} /> Login with Google</>}
        </button>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u && ADMIN_EMAILS.includes(u.email || "")) {
        setUser(u);
      } else {
        navigate('/admin');
      }
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-charcoal"><Loader2 className="animate-spin text-gold w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-charcoal flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black/40 border-r border-white/5 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center"><Star size={16} className="text-charcoal" fill="currentColor" /></div>
          <span className="font-serif font-bold text-xl gold-text">ADMIN</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
            { name: 'Rooms', icon: Bed, path: '/admin/rooms' },
            { name: 'Bookings', icon: BookOpen, path: '/admin/bookings' },
            { name: 'Amenities', icon: Award, path: '/admin/amenities' },
            { name: 'Reviews', icon: Star, path: '/admin/reviews' },
            { name: 'Gallery', icon: ImageIcon, path: '/admin/gallery' },
            { name: 'Settings', icon: SettingsIcon, path: '/admin/settings' },
          ].map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-gold"
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <button 
          onClick={() => signOut(auth)}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const DashboardHome = () => {
  const [stats, setStats] = useState({ rooms: 0, bookingsToday: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const roomsSnap = await getDocs(collection(db, 'rooms'));
      const bookingsSnap = await getDocs(collection(db, 'bookings'));
      
      const today = new Date().toISOString().split('T')[0];
      let bookingsTodayCount = 0;
      let totalRev = 0;

      // Create a map of room types to prices for revenue calculation
      const roomPrices: Record<string, number> = {};
      roomsSnap.docs.forEach(d => {
        const data = d.data();
        roomPrices[data.type] = data.price || 0;
      });

      bookingsSnap.docs.forEach(d => {
        const data = d.data();
        // Check if booking was created today
        if (data.createdAt) {
          const createdDate = data.createdAt.toDate().toISOString().split('T')[0];
          if (createdDate === today) bookingsTodayCount++;
        }
        
        // Calculate revenue for confirmed bookings
        if (data.status === 'confirmed') {
          totalRev += roomPrices[data.roomType] || 5000;
        }
      });

      setStats({
        rooms: roomsSnap.size,
        bookingsToday: bookingsTodayCount,
        revenue: totalRev
      });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">Executive Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Rooms', value: stats.rooms, icon: Bed, color: 'text-blue-400' },
          { label: 'Bookings Today', value: stats.bookingsToday, icon: BookOpen, color: 'text-gold' },
          { label: 'Total Revenue', value: `${stats.revenue.toLocaleString()} PKR`, icon: Award, color: 'text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <stat.icon className={cn("w-10 h-10 mb-4", stat.color)} />
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-1">{stat.label}</p>
            <p className="text-3xl font-serif">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RoomsManager = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [formData, setFormData] = useState({ type: '', price: 0, capacity: 1, isAvailable: true, description: '', imageUrls: [] as string[] });
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'rooms'), orderBy('price', 'asc'));
    return onSnapshot(q, (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleUpload = async (roomId: string) => {
    if (!selectedFiles) return [];
    const urls: string[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const storageRef = ref(storage, `rooms/${roomId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let roomId = editingRoom?.id;
      let currentImageUrls = formData.imageUrls || [];

      if (editingRoom) {
        const newUrls = await handleUpload(roomId);
        await updateDoc(doc(db, 'rooms', roomId), {
          ...formData,
          imageUrls: [...currentImageUrls, ...newUrls],
          imageUrl: currentImageUrls[0] || newUrls[0] || ''
        });
      } else {
        const docRef = await addDoc(collection(db, 'rooms'), { ...formData, imageUrls: [] });
        roomId = docRef.id;
        const newUrls = await handleUpload(roomId);
        await updateDoc(doc(db, 'rooms', roomId), {
          imageUrls: newUrls,
          imageUrl: newUrls[0] || ''
        });
      }
      setIsModalOpen(false);
      setEditingRoom(null);
      setFormData({ type: '', price: 0, capacity: 1, isAvailable: true, description: '', imageUrls: [] });
      setSelectedFiles(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'rooms');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this room?")) {
      await deleteDoc(doc(db, 'rooms', id));
    }
  };

  const removeImage = async (index: number) => {
    const newUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, imageUrls: newUrls });
    if (editingRoom) {
      await updateDoc(doc(db, 'rooms', editingRoom.id), { 
        imageUrls: newUrls,
        imageUrl: newUrls[0] || ''
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Rooms Manager</h1>
        <button 
          onClick={() => { setEditingRoom(null); setFormData({ type: '', price: 0, capacity: 1, isAvailable: true, description: '', imageUrls: [] }); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-widest text-sm"
        >
          <Plus size={18} /> Add Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={room.imageUrl || "https://picsum.photos/seed/room/800/600"} 
                alt={room.type} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => { setEditingRoom(room); setFormData(room); setIsModalOpen(true); }} className="p-2 bg-black/60 text-gold rounded-full hover:bg-gold hover:text-charcoal transition-colors"><Edit size={16} /></button>
                <button onClick={() => handleDelete(room.id)} className="p-2 bg-black/60 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif mb-2">{room.type}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Price: <span className="text-gold">{room.price.toLocaleString()} PKR</span></p>
                <p>Capacity: {room.capacity} Guests</p>
                <p>Status: <span className={room.isAvailable ? "text-green-400" : "text-red-400"}>{room.isAvailable ? "Available" : "Booked"}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 overflow-y-auto">
          <div className="bg-charcoal border border-white/10 p-8 rounded-[2rem] w-full max-w-2xl my-8">
            <h2 className="text-2xl font-serif mb-6">{editingRoom ? "Edit Room" : "Add New Room"}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Room Type" required value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none"
                />
                <input 
                  type="number" placeholder="Price (PKR)" required value={formData.price}
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="number" placeholder="Capacity" required value={formData.capacity}
                  onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none"
                />
                <label className="flex items-center gap-3 cursor-pointer bg-white/5 border border-white/10 p-4 rounded-xl">
                  <input type="checkbox" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} className="w-5 h-5 accent-gold" />
                  <span className="text-sm">Available for Booking</span>
                </label>
              </div>
              <textarea 
                placeholder="Description" value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none h-32"
              />
              
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-3 block">Upload Room Pictures</label>
                <input 
                  type="file" multiple accept="image/*"
                  onChange={e => setSelectedFiles(e.target.files)}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gold/10 file:text-gold hover:file:bg-gold/20 cursor-pointer"
                />
                
                {formData.imageUrls && formData.imageUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {formData.imageUrls.map((url, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
                        <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button 
                          type="button" onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white/5 rounded-full font-bold uppercase tracking-widest text-xs">Cancel</button>
                <button type="submit" disabled={uploading} className="flex-1 py-4 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  {uploading ? <Loader2 className="animate-spin" /> : "Save Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const BookingLog = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'bookings', id), { status });
  };

  const sendWhatsApp = (booking: any) => {
    const msg = encodeURIComponent(`Hello ${booking.guestName}, your booking for ${booking.roomType} at Sky Rose Guest House is confirmed!`);
    window.open(`https://wa.me/${booking.phone}?text=${msg}`, '_blank');
  };

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">Booking Log</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 uppercase tracking-widest text-xs font-bold">
              <th className="pb-4 px-4">Guest</th>
              <th className="pb-4 px-4">Room</th>
              <th className="pb-4 px-4">Dates</th>
              <th className="pb-4 px-4">Status</th>
              <th className="pb-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-white/5 transition-colors">
                <td className="py-6 px-4">
                  <p className="font-bold">{b.guestName}</p>
                  <p className="text-xs text-gray-500">{b.phone}</p>
                </td>
                <td className="py-6 px-4 text-sm">{b.roomType}</td>
                <td className="py-6 px-4 text-sm">
                  <p>{b.checkIn} to</p>
                  <p>{b.checkOut}</p>
                </td>
                <td className="py-6 px-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest",
                    b.status === 'confirmed' ? "bg-green-500/10 text-green-500" : 
                    b.status === 'cancelled' ? "bg-red-500/10 text-red-500" : "bg-gold/10 text-gold"
                  )}>
                    {b.status}
                  </span>
                </td>
                <td className="py-6 px-4">
                  <div className="flex gap-2">
                    {b.status === 'pending' && (
                      <button onClick={() => { updateStatus(b.id, 'confirmed'); sendWhatsApp(b); }} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg"><CheckCircle size={18} /></button>
                    )}
                    <button onClick={() => updateStatus(b.id, 'cancelled')} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><XCircle size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GalleryManager = () => {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'gallery'), {
        url,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this image?")) {
      await deleteDoc(doc(db, 'gallery', id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Gallery Manager</h1>
        <label className="cursor-pointer px-6 py-3 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-widest text-sm flex items-center gap-2">
          {uploading ? <Loader2 className="animate-spin" /> : <><Plus size={18} /> Upload Photo</>}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10">
            <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
            <button 
              onClick={() => handleDelete(img.id)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AmenitiesManager = () => {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', desc: '', icon: 'Star', isActive: true });

  useEffect(() => {
    const q = query(collection(db, 'amenities'), orderBy('title', 'asc'));
    return onSnapshot(q, (snapshot) => {
      setAmenities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAmenity) {
        await updateDoc(doc(db, 'amenities', editingAmenity.id), formData);
      } else {
        await addDoc(collection(db, 'amenities'), formData);
      }
      setIsModalOpen(false);
      setEditingAmenity(null);
      setFormData({ title: '', desc: '', icon: 'Star', isActive: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'amenities');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this amenity?")) {
      await deleteDoc(doc(db, 'amenities', id));
    }
  };

  const seedAmenities = async () => {
    const defaultAmenities = [
      { title: "24/7 Electricity back-up", desc: "Full Backup Support", icon: "Zap", isActive: true },
      { title: "Free Wi-Fi", desc: "High-Speed Internet", icon: "Wifi", isActive: true },
      { title: "Secure Parking", desc: "Safe On-site Space", icon: "Car", isActive: true },
      { title: "Restaurant", desc: "Delicious On-site Meals", icon: "Utensils", isActive: true },
      { title: "24/7 Security", desc: "CCTV & Guarded", icon: "Shield", isActive: true },
      { title: "Room Service", desc: "Available at Call", icon: "Coffee", isActive: true },
      { title: "Quick Check-in", desc: "Seamless Experience", icon: "Clock", isActive: true },
      { title: "Top Rated", desc: "9.7 Guest Rating", icon: "Award", isActive: true },
    ];

    try {
      for (const amenity of defaultAmenities) {
        // Check if already exists to avoid duplicates
        const exists = amenities.find(a => a.title === amenity.title);
        if (!exists) {
          await addDoc(collection(db, 'amenities'), amenity);
        }
      }
      alert("Amenities seeded successfully!");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'amenities');
    }
  };

  const icons = ["Zap", "Wifi", "Car", "Utensils", "Shield", "Coffee", "Clock", "Award", "Star"];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-serif">Amenities Manager</h1>
        <div className="flex gap-3">
          <button 
            onClick={seedAmenities}
            className="px-6 py-3 bg-white/5 text-gold border border-gold/30 font-bold rounded-full uppercase tracking-widest text-sm flex items-center gap-2 hover:bg-gold/10 transition-all"
          >
            <Zap size={18} /> Seed Defaults
          </button>
          <button 
            onClick={() => { setEditingAmenity(null); setFormData({ title: '', desc: '', icon: 'Star', isActive: true }); setIsModalOpen(true); }}
            className="px-6 py-3 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-widest text-sm flex items-center gap-2"
          >
            <Plus size={18} /> Add Amenity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-1">{amenity.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{amenity.desc}</p>
              <span className={cn(
                "px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest",
                amenity.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {amenity.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingAmenity(amenity); setFormData(amenity); setIsModalOpen(true); }} className="p-2 text-gold hover:bg-gold/10 rounded-lg"><Edit size={18} /></button>
              <button onClick={() => handleDelete(amenity.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-6">
          <div className="bg-charcoal border border-white/10 p-8 rounded-[2rem] w-full max-w-md">
            <h2 className="text-2xl font-serif mb-6 gold-text">{editingAmenity ? 'Edit' : 'Add'} Amenity</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" placeholder="Title" required 
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none"
              />
              <input 
                type="text" placeholder="Description" required 
                value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none"
              />
              <select 
                value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none"
              >
                {icons.map(icon => <option key={icon} value={icon} className="bg-charcoal">{icon}</option>)}
              </select>
              <label className="flex items-center gap-3 cursor-pointer p-2">
                <input 
                  type="checkbox" checked={formData.isActive} 
                  onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  className="w-5 h-5 accent-gold"
                />
                <span className="text-sm">Active on Website</span>
              </label>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white/5 rounded-full font-bold uppercase tracking-widest text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-4 gold-gradient text-charcoal rounded-full font-bold uppercase tracking-widest text-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewsManager = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', rating: 5, comment: '', isActive: true });

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await updateDoc(doc(db, 'reviews', editingReview.id), formData);
      } else {
        await addDoc(collection(db, 'reviews'), { ...formData, createdAt: serverTimestamp() });
      }
      setIsModalOpen(false);
      setEditingReview(null);
      setFormData({ name: '', rating: 5, comment: '', isActive: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'reviews');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this review?")) {
      await deleteDoc(doc(db, 'reviews', id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Guest Reviews</h1>
        <button 
          onClick={() => { setEditingReview(null); setFormData({ name: '', rating: 5, comment: '', isActive: true }); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-widest text-sm"
        >
          <Plus size={18} /> Add Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{review.name}</h3>
                <div className="flex text-gold mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingReview(review); setFormData(review); setIsModalOpen(true); }} className="p-2 hover:text-gold"><Edit size={18} /></button>
                <button onClick={() => handleDelete(review.id)} className="p-2 hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            </div>
            <p className="text-gray-400 text-sm line-clamp-3 mb-4 italic">"{review.comment}"</p>
            <span className={cn(
              "px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest",
              review.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            )}>
              {review.isActive ? 'Visible' : 'Hidden'}
            </span>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="bg-charcoal border border-white/10 p-8 rounded-[2rem] w-full max-w-md">
            <h2 className="text-2xl font-serif mb-6">{editingReview ? "Edit Review" : "Add Review"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" placeholder="Guest Name" required value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none"
              />
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl">
                <span className="text-sm text-gray-500">Rating:</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button 
                      key={num} type="button" onClick={() => setFormData({...formData, rating: num})}
                      className={cn("p-1 transition-colors", formData.rating >= num ? "text-gold" : "text-gray-600")}
                    >
                      <Star size={20} fill={formData.rating >= num ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea 
                placeholder="Comment" required value={formData.comment}
                onChange={e => setFormData({...formData, comment: e.target.value})}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none h-32"
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-gold" />
                <span className="text-sm">Visible on Website</span>
              </label>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white/5 rounded-full font-bold uppercase tracking-widest text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-4 gold-gradient text-charcoal rounded-full font-bold uppercase tracking-widest text-xs">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsManager = () => {
  const [settings, setSettings] = useState({ whatsappNumber: '', bookingRating: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) setSettings(doc.data() as any);
    });
    return unsubscribe;
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'settings', 'global'), settings);
      alert("Settings updated!");
    } catch (err) {
      // If doc doesn't exist, setDoc
      try {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'settings', 'global'), settings);
        alert("Settings updated!");
      } catch (e2) {
        handleFirestoreError(e2, OperationType.WRITE, 'settings/global');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-serif mb-8">Global Settings</h1>
      <form onSubmit={handleSave} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-[2rem]">
        <div>
          <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Hotel WhatsApp Number</label>
          <input 
            type="text" value={settings.whatsappNumber}
            onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none"
            placeholder="e.g. 923331574046"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Booking.com Rating</label>
          <input 
            type="text" value={settings.bookingRating}
            onChange={e => setSettings({...settings, bookingRating: e.target.value})}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-gold outline-none"
            placeholder="e.g. 9.7/10"
          />
        </div>
        <button 
          type="submit" disabled={loading}
          className="w-full py-4 gold-gradient text-charcoal font-bold rounded-full uppercase tracking-widest text-sm flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Save Settings"}
        </button>
      </form>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout><DashboardHome /></AdminLayout>} />
          <Route path="/admin/rooms" element={<AdminLayout><RoomsManager /></AdminLayout>} />
          <Route path="/admin/bookings" element={<AdminLayout><BookingLog /></AdminLayout>} />
          <Route path="/admin/amenities" element={<AdminLayout><AmenitiesManager /></AdminLayout>} />
          <Route path="/admin/reviews" element={<AdminLayout><ReviewsManager /></AdminLayout>} />
          <Route path="/admin/gallery" element={<AdminLayout><GalleryManager /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><SettingsManager /></AdminLayout>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
