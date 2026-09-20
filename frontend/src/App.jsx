import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from './config';
import { 
  Sparkles, Calendar, Users, MapPin, DollarSign, 
  Heart, Building, Award, BookOpen, Music, 
  Palette, Camera, ArrowRight, ShieldCheck, 
  MessageSquare, X, Send, Bot, CheckSquare, PieChart, ArrowLeft,
  Globe, CheckCircle2, Music2, Cake, PartyPopper, GraduationCap, LayoutDashboard
} from 'lucide-react';

const translations = {
  en: {
    start: 'Start Planning', select: 'Select Your Event Type', back: 'Back',
    plan: 'Plan Your', generate: 'Generate Event Plan', generating: 'Generating Plan...',
    eventName: 'Event Name', date: 'Date', location: 'Location', guests: 'Guests', budget: 'Budget (INR)',
    recommendations: 'AI Recommendations', book: 'Book Your Services',
    bookingHint: 'Request quotes from the plan, then confirm after availability is checked.',
    request: 'Request quote', requested: 'Requested', name: 'Your name', phone: 'Phone number',
    confirmBooking: 'Confirm booking request', close: 'Close', bookingSent: 'Booking request sent',
    bookingSuccess: 'Our planning team will contact you shortly.', language: 'Language', admin: 'Admin', adminTitle: 'Booking Requests', adminEmpty: 'No booking requests yet.', status: 'Status', service: 'Service', requester: 'Requester', event: 'Event', time: 'Requested at'
  },
  hi: {
    start: 'योजना शुरू करें', select: 'कार्यक्रम का प्रकार चुनें', back: 'वापस',
    plan: 'योजना बनाएं', generate: 'कार्यक्रम योजना बनाएं', generating: 'योजना बन रही है...',
    eventName: 'कार्यक्रम का नाम', date: 'तारीख', location: 'स्थान', guests: 'मेहमान', budget: 'बजट (INR)',
    recommendations: 'AI सुझाव', book: 'सेवाएं बुक करें',
    bookingHint: 'कोटेशन मांगें और उपलब्धता की पुष्टि करें।', request: 'कोटेशन मांगें', requested: 'अनुरोध भेजा',
    name: 'आपका नाम', phone: 'फोन नंबर', confirmBooking: 'बुकिंग अनुरोध भेजें', close: 'बंद करें',
    bookingSent: 'बुकिंग अनुरोध भेजा गया', bookingSuccess: 'हमारी टीम जल्द संपर्क करेगी।', language: 'भाषा', admin: 'एडमिन', adminTitle: 'बुकिंग अनुरोध', adminEmpty: 'अभी कोई बुकिंग अनुरोध नहीं है।', status: 'स्थिति', service: 'सेवा', requester: 'आवेदक', event: 'कार्यक्रम', time: 'अनुरोध समय'
  },
  te: {
    start: 'ప్రణాళిక ప్రారంభించండి', select: 'ఈవెంట్ రకాన్ని ఎంచుకోండి', back: 'వెనుకకు',
    plan: 'ప్రణాళిక', generate: 'ఈవెంట్ ప్రణాళిక రూపొందించండి', generating: 'ప్రణాళిక రూపొందుతోంది...',
    eventName: 'ఈవెంట్ పేరు', date: 'తేదీ', location: 'స్థలం', guests: 'అతిథులు', budget: 'బడ్జెట్ (INR)',
    recommendations: 'AI సూచనలు', book: 'సేవలను బుక్ చేయండి',
    bookingHint: 'కోటేషన్ కోరండి, ఆపై లభ్యతను నిర్ధారించండి.', request: 'కోటేషన్ కోరండి', requested: 'అభ్యర్థించారు',
    name: 'మీ పేరు', phone: 'ఫోన్ నంబర్', confirmBooking: 'బుకింగ్ అభ్యర్థన పంపండి', close: 'మూసివేయండి',
    bookingSent: 'బుకింగ్ అభ్యర్థన పంపబడింది', bookingSuccess: 'మా బృందం త్వరలో మిమ్మల్ని సంప్రదిస్తుంది.', language: 'భాష', admin: 'అడ్మిన్', adminTitle: 'బుకింగ్ అభ్యర్థనలు', adminEmpty: 'ఇంకా బుకింగ్ అభ్యర్థనలు లేవు.', status: 'స్థితి', service: 'సేవ', requester: 'అభ్యర్థి', event: 'ఈవెంట్', time: 'అభ్యర్థన సమయం'
  }
};

function RecommendationText({ text }) {
  return (
    <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
      {text.split('\n').map((line, index) => {
        const cleaned = line.replace(/\*\*/g, '').replace(/^#{1,6}\s*/, '').trim();
        if (!cleaned || cleaned === '---') return null;
        const isHeading = /^\d+\.\s/.test(cleaned) || /:$/.test(cleaned);
        const isBullet = /^[-*]\s/.test(cleaned);
        const content = cleaned.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
        return (
          <div key={`${index}-${cleaned}`} className={isHeading ? 'font-bold text-slate-900 pt-2' : isBullet ? 'pl-4' : ''}>
            {isBullet && <span className="text-purple-600 mr-2">•</span>}
            {content}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const isAdminQuery = new URLSearchParams(window.location.search).get('view') === 'admin';
  const [currentView, setCurrentView] = useState(isAdminQuery ? 'admin' : 'landing');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [language, setLanguage] = useState('en');
  const [bookingService, setBookingService] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    place: '',
    pincode: '',
    advanceAmount: '',
    whatsapp: '',
    declarationPhoto: '',
    scanImage: ''
  });
  const [bookingConfirmation, setBookingConfirmation] = useState(false);
  const [bookingRequests, setBookingRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('planora-booking-requests') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('planora-booking-requests', JSON.stringify(bookingRequests));
  }, [bookingRequests]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Hello! I am PLANORA AI. Ask me anything about planning your event or budgets!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [checklistState, setChecklistState] = useState({});
  const [bookingStatus, setBookingStatus] = useState({});

  const [eventData, setEventData] = useState({
    eventName: '',
    location: 'Hyderabad',
    eventDate: '',
    guests: 100,
    budget: 200000,
    preference: 'Indoor',
    food: 'Catering with Veg & Non-Veg',
    decoration: 'Floral & Fairy Lights',
    photography: 'Full Day Coverage + Drone',
    specialReqs: ''
  });

  const t = translations[language];
  const eventTypes = [
    { id: 'wedding', name: 'Wedding', icon: Heart, desc: 'Make your special day magical and stress-free.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
    { id: 'birthday', name: 'Birthday', icon: Sparkles, desc: 'Unforgettable birthday parties for all ages.', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80' },
    { id: 'corporate', name: 'Corporate Event', icon: Building, desc: 'Professional galas, product launches & meets.', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80' },
    { id: 'conference', name: 'Conference', icon: Users, desc: 'Large-scale professional summits & keynotes.', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80' },
    { id: 'college', name: 'College Event', icon: GraduationCap, desc: 'Plan engaging college celebrations and programs.', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80' },
    { id: 'exhibition', name: 'Exhibition', icon: LayoutDashboard, desc: 'Present your work, products, and ideas with impact.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80' },
    { id: 'seminar', name: 'Seminar', icon: BookOpen, desc: 'Bring people together to learn and share ideas.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80' },
    { id: 'cultural', name: 'Cultural Program', icon: PartyPopper, desc: 'Celebrate culture, community, and tradition.', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80' }
  ];
  const locations = ['Hyderabad', 'Bengaluru', 'Vijayawada', 'Visakhapatnam'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: selectedEventType,
          location: eventData.location,
          guests: Number(eventData.guests),
          budget: Number(eventData.budget),
          requirements: eventData.specialReqs
        })
      });
      if (!response.ok) {
        throw new Error(`Backend returned HTTP ${response.status}`);
      }
      const data = await response.json();
      setDashboardData({
        ...data,
        event_summary: {
          eventName: eventData.eventName,
          eventType: selectedEventType,
          location: eventData.location,
          budget: eventData.budget
        },
        ai_recommendations: data.ai_plan?.response || 'No AI recommendations were returned.'
      });
      setCurrentView('dashboard');
    } catch (err) {
      const budget = Number(eventData.budget) || 0;
      const guests = Number(eventData.guests) || 0;
      setDashboardData({
        event_summary: {
          eventName: eventData.eventName,
          eventType: selectedEventType,
          location: eventData.location,
          budget: eventData.budget
        },
        ai_recommendations: `PLANORA Event Plan\nLocation: ${eventData.location}\nGuests: ${guests}\nBudget: INR ${budget.toLocaleString()}\n\n1. Budget Allocation:\n- Venue: INR ${(budget * 0.25).toLocaleString()}\n- Catering: INR ${(budget * 0.30).toLocaleString()}\n- Decoration: INR ${(budget * 0.15).toLocaleString()}\n- Photography: INR ${(budget * 0.10).toLocaleString()}\n- Emergency buffer: INR ${(budget * 0.20).toLocaleString()}\n\n2. Planning Checklist:\n- Confirm venue availability and capacity.\n- Finalize the guest list and catering menu.\n- Compare vendor quotations before booking.\n- Confirm decoration and photography schedules.\n\nThe plan was created locally because the planning service is currently unavailable.`
      });
      setCurrentView('dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      if (!response.ok) throw new Error(`Chat request failed with HTTP ${response.status}`);
      const data = await response.json();
      setChatMessages(prev => [...prev, { sender: 'bot', text: data.response || 'I could not create a response. Please try again.' }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'bot', text: `PLANORA could not answer right now. ${err.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const bookingServices = [
    { id: 'venue', name: 'Venue', detail: 'Capacity, availability, and final quote', icon: Building },
    { id: 'catering', name: 'Catering', detail: 'Menu tasting and guest-count quote', icon: Users },
    { id: 'decoration', name: 'Decoration', detail: 'Theme, flowers, and lighting setup', icon: Palette },
    { id: 'photography', name: 'Photography', detail: 'Coverage package and availability', icon: Camera }
  ];

  const adminContact = {
    paymentNumber: '+91 9398883809',
    whatsappNumber: '+91 9398883809',
    upiId: 'planoraadmin@upi',
    upiQr: 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=upi%3A%2F%2Fpay%3Fpa%3Dplanoraadmin%40upi%26pn%3DPLANORA%20Admin%26am%3D0%26cu%3DINR'
  };

  const openWhatsApp = (phoneNumber, name = 'Customer') => {
    const cleaned = String(phoneNumber || '').replace(/\D/g, '');
    if (!cleaned) return;
    const formatted = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
    const message = encodeURIComponent(`Hi ${name}, I want to confirm the booking details.`);
    window.open(`https://wa.me/${formatted}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const sendBookingToPhone = (request) => {
    const text = [
      'PLANORA Booking Details',
      `Name: ${request.name || 'N/A'}`,
      `Phone: ${request.phone || 'N/A'}`,
      `WhatsApp: ${request.whatsapp || 'N/A'}`,
      `Service: ${request.service || 'N/A'}`,
      `Event: ${request.event || 'N/A'}`,
      `Place: ${request.place || 'N/A'}`,
      `Pin code: ${request.pincode || 'N/A'}`,
      `Advance: ₹${request.advanceAmount || '0'}`,
      `Requested at: ${request.time || 'N/A'}`
    ].join('\n');

    const phone = request.phone || request.whatsapp || adminContact.whatsappNumber;
    const cleaned = String(phone || '').replace(/\D/g, '');
    if (!cleaned) return;
    const formatted = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const requestBooking = (service) => {
    setBookingService(service);
    setBookingConfirmation(false);
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();
    setBookingStatus(prev => ({ ...prev, [bookingService.id]: t.requested }));
    setBookingRequests(prev => [...prev, {
      id: `${bookingService.id}-${Date.now()}`,
      service: bookingService.name,
      name: bookingForm.name,
      phone: bookingForm.phone,
      place: bookingForm.place,
      pincode: bookingForm.pincode,
      advanceAmount: bookingForm.advanceAmount,
      whatsapp: bookingForm.whatsapp,
      declarationPhoto: bookingForm.declarationPhoto,
      scanImage: bookingForm.scanImage,
      event: dashboardData?.event_summary?.eventName || selectedEventType,
      time: new Date().toLocaleString()
    }]);
    setBookingForm({
      name: '',
      phone: '',
      place: '',
      pincode: '',
      advanceAmount: '',
      whatsapp: '',
      declarationPhoto: '',
      scanImage: ''
    });
    setBookingConfirmation(true);
  };

  const handleImageUpload = (event, fieldName) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBookingForm(prev => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const goBack = () => {
    if (currentView === 'form') setCurrentView('selection');
    else if (currentView === 'dashboard') setCurrentView('form');
    else if (currentView === 'admin') setCurrentView('landing');
    else setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
      <nav className="bg-purple-900 text-white px-6 py-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <Sparkles className="h-6 w-6 text-purple-300" />
          <span className="text-xl font-bold tracking-wider">PLANORA</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="language-picker" title={t.language}>
            <Globe className="h-4 w-4" />
            <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label={t.language}>
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
            </select>
          </label>
          <button onClick={() => setCurrentView('selection')} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold shadow transition text-sm flex items-center space-x-1">
            <span>{t.start}</span><ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => setCurrentView('admin')} className="admin-nav-button" title={t.admin}>
            <LayoutDashboard className="h-4 w-4" /><span>{t.admin}</span>
          </button>
        </div>
      </nav>

      {currentView === 'landing' && (
        <div className="view-enter">
          <section className="bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white py-20 px-6 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">PLANORA</h1>
              <p className="text-xl md:text-2xl text-purple-200 font-light italic">"Plan Smarter. Celebrate Better."</p>
              <button 
                onClick={() => setCurrentView('selection')}
                className="bg-purple-500 hover:bg-purple-400 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg transition inline-flex items-center space-x-2"
              >
                <span>{t.start}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </section>
        </div>
      )}

      {currentView === 'selection' && (
        <div className="view-enter py-12 px-6 max-w-6xl mx-auto">
          <button type="button" onClick={goBack} className="back-button"><ArrowLeft className="h-4 w-4" /> {t.back}</button>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">{t.select}</h2>
            <p className="text-slate-500 mt-2">Choose a celebration and let PLANORA build the first draft.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {eventTypes.map((event) => {
              const IconComponent = event.icon;
              return (
                <div 
                  key={event.id}
                  onClick={() => {
                    setSelectedEventType(event.name);
                    setCurrentView('form');
                  }}
                  className="event-choice bg-white rounded-2xl border-2 border-purple-100 hover:border-purple-600 cursor-pointer shadow-sm hover:shadow-xl transition overflow-hidden"
                >
                  <div className="h-32 w-full relative">
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 text-center">
                    <span className="font-bold text-slate-900">{event.name}</span>
                    <p className="text-xs text-slate-500 mt-1">{event.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentView === 'form' && (
        <div className="view-enter py-12 px-6 max-w-3xl mx-auto">
          <button type="button" onClick={goBack} className="back-button"><ArrowLeft className="h-4 w-4" /> {t.back}</button>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">{t.plan} {selectedEventType}</h2>
          </div>
          <form onSubmit={handleFormSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">{t.eventName}</label>
              <input type="text" name="eventName" required placeholder="e.g. Birthday Party" value={eventData.eventName} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t.date}</label>
                <input type="date" name="eventDate" required value={eventData.eventDate} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t.location}</label>
                <select name="location" required value={eventData.location} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm">
                  {locations.map((location) => <option key={location} value={location}>{location}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t.guests}</label>
                <input type="number" name="guests" required value={eventData.guests} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t.budget}</label>
                <input type="number" name="budget" required value={eventData.budget} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm" />
              </div>
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition">
              {loading ? t.generating : t.generate}
            </button>
          </form>
        </div>
      )}

      {currentView === 'dashboard' && dashboardData && (
        <div className="view-enter py-10 px-6 max-w-6xl mx-auto space-y-8">
          <button type="button" onClick={goBack} className="back-button"><ArrowLeft className="h-4 w-4" /> {t.back}</button>
          <div className="bg-purple-900 text-white p-8 rounded-3xl">
            <h1 className="text-3xl font-extrabold">{dashboardData.event_summary.eventName}</h1>
            <p className="text-purple-200 mt-1">{dashboardData.event_summary.eventType} · {dashboardData.event_summary.location}</p>
            <p className="text-purple-200 mt-1">Total Budget: ₹{Number(dashboardData.event_summary.budget).toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="font-bold text-lg mb-2">{t.recommendations}</h3>
            <RecommendationText text={dashboardData.ai_recommendations} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{t.book}</h3>
                <p className="text-sm text-slate-500 mt-1">{t.bookingHint}</p>
              </div>
              <ShieldCheck className="text-purple-600 h-6 w-6" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {bookingServices.map((service) => {
                const ServiceIcon = service.icon;
                const status = bookingStatus[service.id];
                return (
                  <div key={service.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <ServiceIcon className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-semibold text-slate-900">{service.name}</h4>
                        <p className="text-xs text-slate-500">{service.detail}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => requestBooking(service)}
                      disabled={Boolean(status)}
                      className="shrink-0 bg-purple-600 text-white px-3 py-2 rounded-lg text-xs font-semibold disabled:bg-emerald-600"
                    >
                      {status || t.request}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {currentView === 'admin' && (
        <div className="view-enter py-10 px-6 max-w-6xl mx-auto">
          <button type="button" onClick={goBack} className="back-button"><ArrowLeft className="h-4 w-4" /> {t.back}</button>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-purple-600 font-bold uppercase tracking-wider">PLANORA</p>
              <h1 className="text-3xl font-extrabold text-slate-900">{t.adminTitle}</h1>
            </div>
            <div className="admin-count">{bookingRequests.length}</div>
          </div>
          <div className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Admin payment & contact details</h2>
            <div className="grid md:grid-cols-3 gap-5 items-center">
              <div>
                <p className="text-sm text-slate-500">Admin payment number</p>
                <a href={`tel:${adminContact.paymentNumber}`} className="text-base font-semibold text-purple-700">{adminContact.paymentNumber}</a>
              </div>
              <div>
                <p className="text-sm text-slate-500">Admin WhatsApp</p>
                <button type="button" onClick={() => openWhatsApp(adminContact.whatsappNumber, 'PLANORA Admin')} className="mt-1 inline-flex items-center justify-center bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 visible">
                  Open WhatsApp chat
                </button>
              </div>
              <div>
                <p className="text-sm text-slate-500">UPI ID</p>
                <p className="text-base font-semibold text-slate-900">{adminContact.upiId}</p>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm text-slate-500 mb-2">UPI payment QR</p>
              <img src={adminContact.upiQr} alt="UPI payment QR" className="h-40 w-40 object-cover rounded-xl border" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wider text-purple-700 font-bold">Total bookings</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">{bookingRequests.length}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wider text-emerald-700 font-bold">Advance collected</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">₹{bookingRequests.reduce((sum, request) => sum + Number(request.advanceAmount || 0), 0).toLocaleString()}</p>
            </div>
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wider text-sky-700 font-bold">Need follow-up</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">{bookingRequests.length}</p>
            </div>
          </div>

          {bookingRequests.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border text-center text-slate-500">{t.adminEmpty}</div>
          ) : (
            <div className="space-y-4">
              {bookingRequests.map((request) => (
                <div className="bg-white rounded-2xl border shadow-sm p-4" key={request.id}>
                  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm text-slate-700">
                    <div>
                      <p className="font-semibold text-slate-900">Requester</p>
                      <p>{request.name}</p>
                      <p>{request.phone}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" onClick={() => openWhatsApp(request.whatsapp || adminContact.whatsappNumber, request.name || 'Customer')} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                          Chat on WhatsApp
                        </button>
                        <button type="button" onClick={() => sendBookingToPhone(request)} className="bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                          Send booking to phone
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Service</p>
                      <p>{request.service}</p>
                      <p>Event: {request.event}</p>
                      <p>Time: {request.time}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Location</p>
                      <p>Place: {request.place || 'N/A'}</p>
                      <p>Pin code: {request.pincode || 'N/A'}</p>
                      <p>Advance: ₹{request.advanceAmount || '0'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Status</p>
                      <span className="status-pill">{t.requested}</span>
                    </div>
                  </div>
                  {(request.declarationPhoto || request.scanImage) && (
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      {request.declarationPhoto && (
                        <div>
                          <p className="font-semibold text-slate-900 mb-2">Declaration photo</p>
                          <img src={request.declarationPhoto} alt="Declaration" className="h-32 w-full object-cover rounded-xl border" />
                        </div>
                      )}
                      {request.scanImage && (
                        <div>
                          <p className="font-semibold text-slate-900 mb-2">Scan / payment proof</p>
                          <img src={request.scanImage} alt="Scan" className="h-32 w-full object-cover rounded-xl border" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500 mt-4">Booking requests are currently stored in this browser session and only visible in admin view.</p>
        </div>
      )}

      {bookingService && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="booking-title">
          <div className="booking-modal">
            <button type="button" onClick={() => setBookingService(null)} className="modal-close" aria-label={t.close}><X className="h-5 w-5" /></button>
            {!bookingConfirmation ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="booking-icon"><Calendar className="h-6 w-6" /></div>
                <h2 id="booking-title" className="text-2xl font-bold text-slate-900">Book {bookingService.name}</h2>
                <p className="text-sm text-slate-500">Tell us where to send your quote request.</p>
                <input required name="name" value={bookingForm.name} onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))} placeholder={t.name} className="w-full px-4 py-3 rounded-xl border border-slate-300" />
                <input required name="phone" type="tel" value={bookingForm.phone} onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))} placeholder={t.phone} className="w-full px-4 py-3 rounded-xl border border-slate-300" />
                <input required name="place" value={bookingForm.place} onChange={(e) => setBookingForm(prev => ({ ...prev, place: e.target.value }))} placeholder="Place / Venue Address" className="w-full px-4 py-3 rounded-xl border border-slate-300" />
                <input required name="pincode" value={bookingForm.pincode} onChange={(e) => setBookingForm(prev => ({ ...prev, pincode: e.target.value }))} placeholder="Pin code" className="w-full px-4 py-3 rounded-xl border border-slate-300" />
                <input required name="advanceAmount" value={bookingForm.advanceAmount} onChange={(e) => setBookingForm(prev => ({ ...prev, advanceAmount: e.target.value }))} placeholder="Advance payment amount" className="w-full px-4 py-3 rounded-xl border border-slate-300" />
                <input required name="whatsapp" type="tel" value={bookingForm.whatsapp} onChange={(e) => setBookingForm(prev => ({ ...prev, whatsapp: e.target.value }))} placeholder="WhatsApp number" className="w-full px-4 py-3 rounded-xl border border-slate-300" />
                <label className="block text-sm font-medium text-slate-700">Declaration photo</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'declarationPhoto')} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white" />
                {bookingForm.declarationPhoto && <img src={bookingForm.declarationPhoto} alt="Declaration preview" className="h-20 w-full object-cover rounded-xl border" />}
                <label className="block text-sm font-medium text-slate-700">Scanned copy / payment proof</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'scanImage')} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white" />
                {bookingForm.scanImage && <img src={bookingForm.scanImage} alt="Scan preview" className="h-20 w-full object-cover rounded-xl border" />}
                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold">{t.confirmBooking}</button>
              </form>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900">{t.bookingSent}</h2>
                <p className="text-slate-500 mt-2">{t.bookingSuccess}</p>
                <button type="button" onClick={() => setBookingService(null)} className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold">{t.close}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <button onClick={() => setIsChatOpen(true)} className="bg-purple-600 text-white p-4 rounded-full shadow-2xl flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <span className="font-semibold text-sm">Ask PLANORA AI</span>
          </button>
        ) : (
          <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-purple-200 flex flex-col h-[400px]">
            <div className="bg-purple-900 text-white px-4 py-3 flex justify-between items-center">
              <span className="font-bold text-sm">PLANORA AI Assistant</span>
              <button onClick={() => setIsChatOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-sm">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-white text-slate-800 border'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex space-x-2">
              <input type="text" placeholder="Ask anything..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border text-sm" />
              <button type="submit" disabled={chatLoading || !chatInput.trim()} className="bg-purple-600 text-white p-2 rounded-xl disabled:opacity-50" aria-label="Send message">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}