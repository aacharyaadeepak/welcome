import { useState, type ChangeEvent, type FormEvent } from 'react'
import './App.css'

const basePath = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`
const galleryHref = `${basePath}gallery/`

type GalleryItem = {
  title: string
  category: string
  place: string
  image: string
  description: string
}

const services = [
  {
    name: 'Deity Pujas (Dev Puja)',
    hindi: 'देव पूजा एवं अभिषेक',
    description: 'Mahamrityunjaya Jaap, Rudrabhishek, Navgrah Puja & Satyanarayan Katha.',
    detail:
      'Invoke divine grace, health, and abundance through pure Vedic mantras chanted by experienced Brahmins in holy Rishikesh. Every ritual begins with your personalized family Sankalp.',
    rituals: [
      'Mahamrityunjaya Jaap (For longevity, healing & protection)',
      'Rudrabhishek (Sacred bathing of Lord Shiva with Vedic Rudri Path)',
      'Navgrah Puja (Pacifying the nine cosmic planetary forces)',
      'Satyanarayan Katha (For family harmony, gratitude & prosperity)',
    ],
    pujas: [
      'Ganesh Puja',
      'Durga Puja',
      'Vishnu Puja',
      'Shiv Puja',
      'Diwali Puja',
      'Dhanteras Puja',
      'Mahalaxmi Puja',
      'Navratri Puja',
      'Das Mahavidya Puja',
      'Griha Parvesh Puja',
      'Satyanarayan Katha',
      'Asthi Visarjan Puja',
      'Tripindi Shradh Puja',
      'Pind Daan Puja',
      'Namkaran Puja',
      'Annaprashan Puja',
      'Ganesh Chaturthi Puja',
      'Navagraha Shanti Puja',
      'Office Opening Puja',
      'Rudrabhishek Puja',
      'Marriage Puja',
      'Narayan Bali Puja',
      'Engagement Puja',
      'Upanayan Sanskaar',
      'Sundarkand Path',
      'Akhand Ramayan Path',
      'Birthday Puja',
      'Santaan Gopal Path',
      'Kaal Sarp Dosh Puja',
      'Others',
    ],
  },
  {
    name: 'Pitru Pujas (Ancestral)',
    hindi: 'पितृ दोष शांति एवं पिंड दान',
    description: 'Pitru Dosh Shanti, Annual Shraddh, Tarpan and Pind Daan rituals.',
    detail:
      'Honor your lineage with traditional Shraddh, Tarpan, and Pind Daan ceremonies conducted with care on the sacred banks of Maa Ganga.',
    rituals: [
      'Pind Daan Puja (Ancestral peace and remembrance)',
      'Pitru Dosh Shanti (Prayers for lineage blessings)',
      'Annual Shraddh (Traditional remembrance ceremony)',
      'Til-Tarpan Vidhi (Sacred water offerings)',
    ],
  },
  {
    name: 'Astrology Services',
    hindi: 'जन्म कुंडली एवं ज्योतिष परामर्श',
    description: 'Accurate Kundali analysis, Dosha identification, and simple Vedic remedies.',
    detail:
      'Explore your Janam Kundli with clear, compassionate guidance to understand planetary influences, important life periods, and practical Vedic remedies.',
    rituals: [
      'Janam Kundli (Birth chart) reading',
      'Horoscope and planetary analysis',
      'Dosha identification and guidance',
      'Personalized Vedic remedies',
    ],
  },
  {
    name: 'Vedic Rituals & Sanskars',
    hindi: 'वैदिक संस्कार एवं हवन',
    description: 'Vastu Puja, Griha Pravesh, Vivah Sanskar, and customized Vedic Havans.',
    detail:
      'Mark life’s milestones with traditional Vedic Sanskars, performed with devotion, faith, and proper Vidhi-Vidhan for you and your family.',
    rituals: [
      'Griha Pravesh and Vastu Puja',
      'Vivah Sanskar (Wedding ceremony)',
      'Mundan Sanskaar',
      'Customized Vedic Havan',
    ],
  },
]

const ceremonies = [
  {
    title: 'Wedding Ceremony (Vivah Sanskar)',
    type: 'Vedic Sanskar',
    highlight: 'Including Kanyadaan & Saptapadi',
    summary: 'Complete Vedic marriage rituals with all traditional ceremonies',
    details:
      'Experience a truly sacred Vedic Vivah conducted with pure Sanskrit mantras, explaining the spiritual meaning of Ganesh-Ambika Puja, Kanyadaan, Panigrahana, Agni Parikrama, and the seven sacred vows of Saptapadi.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Griha Pravesh',
    type: 'Vedic Rituals',
    highlight: 'Vastu Shanti & Navagraha Havan Included',
    summary: 'House-warming rituals with Vastu Puja for prosperity',
    details:
      'Invite positive cosmic vibrations, Goddess Lakshmi’s abundance, and Vastu Purusha blessings into your new residence with Dwar Puja, Kalash Sthapana, Vastu Mandal Puja, and sacred Havan.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Rudrabhishek Puja',
    type: 'Deity Pujas',
    highlight: 'Mahamrityunjaya Path Included',
    summary: 'Powerful Shiva rituals for peace and protection',
    details:
      'Sacred Rudrabhishek of Lord Shiva using Panchamrit, Ganga Jal from Rishikesh, Bilva leaves, and Bhasma amidst continuous chanting of Sri Rudram and the life-protecting Mahamrityunjaya Mantra.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Satyanarayan Katha',
    type: 'Deity Pujas',
    highlight: 'Family Prosperity Blessings',
    summary: 'Traditional Vishnu Katha and puja for family blessings',
    details:
      'Performed on Purnima, Ekadashi, or special family occasions to invoke Lord Narayana’s grace for harmony, health, career success, and fulfillment of auspicious family wishes.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Navagraha Puja',
    type: 'Deity & Astrology',
    highlight: 'Removes Planetary Doshas',
    summary: 'Planetary peace and balance rituals for harmony',
    details:
      'Pacify unfavourable planetary transits (Rahu, Ketu, Shani, Mangal) and strengthen benefic planets in your Janam Kundli through Vedic Navagraha Mandal worship, Beej Mantra Jaap, and Samidha Havan.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Mundan Sanskaar',
    type: 'Vedic Sanskar',
    highlight: 'Blessing for Healthy Growth',
    summary: 'Traditional first haircut ceremony for children',
    details:
      'One of the 16 sacred Shodasha Sanskars (Chudakarana) performed to bless the child with strong immunity, sharp intellect (Tejas), longevity, and divine protection.',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Pind Daan Puja',
    type: 'Pitru Pujas',
    highlight: 'Tarpan, Shraddh & Pitru Shanti',
    summary: 'Sacred ancestral peace rituals in Rishikesh',
    details:
      'A sacred bridge of gratitude, love, and prayers that connects us to our ancestors. Conducted with complete Vidhi-Vidhan on the holy banks of Maa Ganga.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Baglamukhi Puja',
    type: 'Deity Pujas',
    highlight: 'Protection & Obstacle Resolution',
    summary: 'A Vedic ritual invoking Goddess Baglamukhi for protection and strength',
    details:
      'Baglamukhi Puja is a powerful Vedic ritual dedicated to Goddess Baglamukhi, who represents the cosmic power of stunning and immobilising negative forces. Performing this puja helps individuals overcome enemies, resolve legal battles, and protect themselves from black magic, evil eyes, and hidden adversaries. It acts as a strong shield against financial losses and brings stability, prosperity, and success in business or career. By invoking the Goddess, devotees can clear administrative obstacles, silence malicious gossip, and gain inner strength, mental clarity, and overall peace of mind.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=85',
  },
]

type SearchResult =
  | { kind: 'section'; title: string; category: string; searchText: string; sectionId: string }
  | { kind: 'service'; title: string; category: string; searchText: string; service: (typeof services)[number] }
  | { kind: 'ritual' | 'puja'; title: string; category: string; searchText: string; service: (typeof services)[number]; puja: string }
  | { kind: 'ceremony'; title: string; category: string; searchText: string; ceremony: (typeof ceremonies)[number] }

const galleryItems: GalleryItem[] = [
  {
    title: 'Sacred Rudrabhishek & Mahamrityunjaya Path',
    category: 'Deity Pujas & Rudrabhishek',
    place: 'Rishikesh Sacred Altar',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=85',
    description: 'Panchamrit & Ganga Jal Abhishek of Shiva Lingam with Vedic Rudri chanting for peace and protection.',
  },
  {
    title: 'Vedic Vivah Sanskar — Kanyadaan & Saptapadi',
    category: 'Weddings & Sanskars',
    place: 'Rishikesh Vedic Mandap',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
    description: 'Traditional Hindu wedding ceremony performed with sacred Agni Sakshi and authentic Vedic mantras.',
  },
  {
    title: 'Live Streamed Havan with Individualized Sankalp',
    category: 'Online Live Sankalp',
    place: 'Rishikesh Live Studio & Yajnashala',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=85',
    description: 'Global devotees join live via HD video stream as Acharya Deepak takes personalized family Sankalp.',
  },
  {
    title: 'Navagraha Shanti Mandal & Satyanarayan Puja',
    category: 'Deity Pujas & Rudrabhishek',
    place: 'Rishikesh Ashram',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=85',
    description: 'Traditional Kalash Sthapana and Navagraha Mandal worship for family prosperity and planetary harmony.',
  },
  {
    title: 'Evening Ganga Aarti & Deepdaan Blessings',
    category: 'Ganga Rituals',
    place: 'Holy Banks of Rishikesh',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=85',
    description: 'Offering sacred ghee lamps to Maa Ganga at dusk during the evening aarti in Rishikesh.',
  },
]

const galleryFilters = [
  'All',
  'Deity Pujas & Rudrabhishek',
  'Ganga Rituals',
  'Weddings & Sanskars',
  'Online Live Sankalp',
]

const articles = [
  {
    category: 'PITRU PUJA & ANCESTRAL PEACE',
    title: 'The Sacred Bridge of Pind Daan: Connecting with Ancestors in Holy Rishikesh',
    image: galleryItems[4].image,
    minutes: '5 min read',
    text: '“Pind Daan is not just a ritual; it is a sacred bridge of gratitude, love, and prayers that connects us to our ancestors and guides their souls toward eternal peace.”',
    body: 'In the Vedic tradition, Pind Daan and Tarpan are profound acts of remembrance and gratitude. Families come to the holy banks of Maa Ganga in Rishikesh to offer prayers for their ancestors. The ceremony begins with a personalized Sankalp, followed by traditional offerings and mantras performed with care. Families joining online can take part through a live stream and share their names, Gotra, and prayers in advance.',
    booking: 'Book Pind Daan Puja',
  },
  {
    category: 'DEITY PUJAS & SHIVA WORSHIP',
    title: 'Power of Rudrabhishek & Mahamrityunjaya Path for Peace and Protection',
    image: galleryItems[0].image,
    minutes: '4 min read',
    text: 'Discover how the sacred bathing of the Shiva Lingam combined with the Mahamrityunjaya Mantra creates a spiritual shield of health, longevity, and inner serenity.',
    body: 'Rudrabhishek is a devotional offering to Lord Shiva, traditionally accompanied by the Sri Rudram. At the altar, the Shiva Lingam is bathed with sacred offerings while the Mahamrityunjaya Mantra is recited for healing, courage, and peace. A family Sankalp helps focus the prayers on the intentions that matter most to you.',
    booking: 'Book Rudrabhishek Puja',
  },
  {
    category: 'ONLINE LIVE RITUALS',
    title: 'How Online Vedic Pujas Work: The Spiritual Power of Sankalp',
    image: galleryItems[3].image,
    minutes: '4 min read',
    text: 'Join a traditional ceremony from anywhere in the world with a personal family Sankalp and live participation.',
    body: 'Online participation makes it possible for families across the world to join a puja conducted in Rishikesh. Share your name, Gotra, and prayer intention before the ceremony. Acharya Deepak performs the Sankalp at the sacred altar, and your family can join through a live video stream, witness the offerings, and receive the blessings together.',
    booking: 'Book an Online Puja',
  },
  {
    category: 'VEDIC SANSKARS & HOME',
    title: 'Vastu Puja & Griha Pravesh: Inviting Prosperity into Your Home',
    image: galleryItems[2].image,
    minutes: '5 min read',
    text: 'Learn how traditional housewarming rituals bless a new home with auspicious beginnings and harmony.',
    body: 'Griha Pravesh marks the beginning of a new chapter. Traditional ceremonies may include Ganesh Puja, Kalash Sthapana, Vastu Puja, and Havan. The exact ritual is guided by the family’s needs, the home, and an auspicious time selected with care.',
    booking: 'Book Griha Pravesh Puja',
  },
]

const bookingServices = [
  '1. Wedding Ceremony (Vivah Sanskar)',
  '2. Griha Pravesh & Vastu Puja',
  '3. Rudrabhishek (Mahamrityunjaya Path)',
  '4. Satyanarayan Katha & Navagraha Puja',
  '5. Mundan Sanskaar & Pind Daan Puja',
  '6. Janam Kundli Analysis',
  '7. Baglamukhi Puja',
  '8. Other Vedic Ritual',
]

function whatsappHref(message: string) {
  return `https://wa.me/919634195464?text=${encodeURIComponent(message)}`
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/poojas?/g, 'puja')
    .replace(/\s+/g, ' ')
    .trim()
}

function App() {
  const isGalleryPage =
    window.location.pathname.replace(/\/+$/, '') === `${basePath.replace(/\/+$/, '')}/gallery`
  const [selectedService, setSelectedService] = useState<(typeof services)[number] | null>(null)
  const [selectedPuja, setSelectedPuja] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [customImages, setCustomImages] = useState<GalleryItem[]>([])
  const [activeArticle, setActiveArticle] = useState<(typeof articles)[number] | null>(null)
  const [notice, setNotice] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const normalizedSearch = normalizeSearchText(searchTerm)
  const filteredServices = normalizedSearch
    ? services.filter((service) => {
        const pujas = 'pujas' in service ? service.pujas ?? [] : []
        return normalizeSearchText([service.name, service.hindi, service.description, service.detail, ...service.rituals, ...pujas].join(' ')).includes(normalizedSearch)
      })
    : services
  const filteredCeremonies = normalizedSearch
    ? ceremonies.filter((ceremony) => normalizeSearchText([ceremony.title, ceremony.type, ceremony.highlight, ceremony.summary, ceremony.details].join(' ')).includes(normalizedSearch))
    : ceremonies

  const searchResults: SearchResult[] = [
    {
      kind: 'section' as const,
      title: 'OUR CORE OFFERINGS',
      category: 'Browse all services',
      searchText: 'our core offerings services pillars puja pooja rituals',
      sectionId: 'services',
    },
    ...services.flatMap((service): SearchResult[] => {
      const pujas = 'pujas' in service ? service.pujas ?? [] : []
      return [
        {
          kind: 'service',
          title: service.name,
          category: 'Core offering',
          searchText: [service.name, service.hindi, service.description, service.detail].join(' '),
          service,
        },
        ...service.rituals.map((ritual) => ({
          kind: 'ritual' as const,
          title: ritual.split(' (')[0],
          category: service.name,
          searchText: [ritual, service.name, service.hindi].join(' '),
          service,
          puja: ritual,
        })),
        ...pujas.map((puja) => ({
          kind: 'puja' as const,
          title: puja,
          category: service.name,
          searchText: [puja, service.name, service.hindi].join(' '),
          service,
          puja,
        })),
      ]
    }),
    ...ceremonies.map((ceremony) => ({
      kind: 'ceremony' as const,
      title: ceremony.title,
      category: ceremony.type,
      searchText: [ceremony.title, ceremony.type, ceremony.highlight, ceremony.summary, ceremony.details].join(' '),
      ceremony,
    })),
  ].filter((result) => !normalizedSearch || normalizeSearchText(result.searchText).includes(normalizedSearch))

  const visibleGallery =
    activeFilter === 'All'
      ? [...customImages, ...galleryItems]
      : [...customImages, ...galleryItems].filter((item) => item.category === activeFilter)
  const latestGallery = [...customImages, ...galleryItems].slice(0, 4)
  function sectionHref(section: string) {
    return isGalleryPage ? `${basePath}#${section}` : `#${section}`
  }

  function selectSearchResult(result: SearchResult) {
    setIsSearchOpen(false)

    if (result.kind === 'section') {
      setSearchTerm('')
      if (isGalleryPage) {
        window.location.assign(sectionHref(result.sectionId))
      } else {
        document.getElementById(result.sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    if (result.kind === 'ceremony') {
      const ceremonyIndex = ceremonies.indexOf(result.ceremony)
      setSearchTerm('')
      if (isGalleryPage) {
        window.location.assign(sectionHref('ceremonies'))
      } else {
        requestAnimationFrame(() => {
          document.getElementById(`ceremony-${ceremonyIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
      }
      return
    }

    setSelectedPuja(result.kind === 'ritual' || result.kind === 'puja' ? result.puja : null)
    if (isGalleryPage) {
      window.location.assign(sectionHref('services'))
      return
    }

    setSelectedService(result.service)
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function renderGalleryCards(items: GalleryItem[]) {
    return items.map((item, index) => (
      <article key={`${item.title}-${index}`} className="gallery-card">
        <button className="gallery-open" type="button" onClick={() => setSelectedImage(item)} aria-label={`View ${item.title}`}>
          <img src={item.image} alt={item.title} />
          <span className="gallery-category">{item.category}</span>
          <span className="gallery-caption"><small>⌖ &nbsp;{item.place}</small><strong>{item.title}</strong></span>
        </button>
        <div className="gallery-description">
          <p>{item.description}</p>
          <div>
            <button type="button" onClick={() => setActiveArticle(articles[index % articles.length])}>▤ Read Related Blog</button>
            <a href={sectionHref('booking')}>Book This Ritual →</a>
          </div>
        </div>
      </article>
    ))
  }

  function addPhoto(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    const added = files
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        title: file.name.replace(/\.[^.]+$/, ''),
        category: 'Online Live Sankalp',
        place: 'Your ritual photo',
        image: URL.createObjectURL(file),
        description: 'A photo added for preview in this browser.',
      }))
    setCustomImages((current) => [...added, ...current])
    event.target.value = ''
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()
    if (!name || !phone) {
      setNotice('Please enter your name and WhatsApp number to prepare your booking request.')
      return
    }
    setNotice(
      'Your request is ready. Add the business WhatsApp number to enable direct booking confirmation.',
    )
  }

  return (
    <>
      <div className="utility-bar">
        <div className="utility-message"><span>ॐ</span> ॐ श्री गणेशाय नमः • Directly from Holy Rishikesh — Live Streamed Pujas with Individualized Sankalp</div>
        <div className="utility-facts">
          <span>♙ &nbsp;200+ Authentic Rituals</span>
          <span>◷ &nbsp;8+ Years Experience</span>
          <span>◎ &nbsp;3 Languages Spoken</span>
        </div>
      </div>

      <header className="site-header">
        <a href={sectionHref('home')} className="brand">
          <span><strong>Acharya Deepak</strong><small>ONLINE VEDIC & RITUALS • RISHIKESH</small></span>
        </a>
        <nav aria-label="Main navigation">
          <a href={sectionHref('home')}>Home</a>
          <a href={sectionHref('about')}>About me</a>
          <a href={sectionHref('services')}>Pillars</a>
          <a href={sectionHref('ceremonies')}>Featured Pujas</a>
          <a href={sectionHref('pitru')}>Pind Daan</a>
          <a href={galleryHref} aria-current={isGalleryPage ? 'page' : undefined}>Sacred Gallery</a>
          <a href={sectionHref('blog')}>Blogs</a>
        </nav>
        <div className="header-tools">
          <button type="button" className="search-toggle" onClick={() => setIsSearchOpen((open) => !open)} aria-expanded={isSearchOpen} aria-label="Search rituals and poojas">
            ⌕ Search
          </button>
          {isSearchOpen && (
            <div className="search-widget">
              <label className="header-search">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search offerings or puja"
                  aria-label="Search offerings and pujas"
                  aria-controls="ritual-search-results"
                  aria-expanded={isSearchOpen}
                  autoFocus
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setIsSearchOpen(false)
                    } else if (event.key === 'Enter' && searchResults[0]) {
                      event.preventDefault()
                      selectSearchResult(searchResults[0])
                    }
                  }}
                />
                {searchTerm && <button type="button" onClick={() => setSearchTerm('')} aria-label="Clear search">×</button>}
              </label>
              <div className="search-results" id="ritual-search-results" role="listbox" aria-label="Search results">
                  <p className="search-results-heading">
                    {normalizedSearch ? `${searchResults.length} matching offerings and pujas` : 'OUR CORE OFFERINGS & PUJAS'}
                  </p>
                  {searchResults.length ? (
                    searchResults.map((result) => (
                      <button
                        type="button"
                        role="option"
                        aria-selected="false"
                        className="search-result"
                        key={`${result.kind}-${result.title}-${result.category}`}
                        onClick={() => selectSearchResult(result)}
                      >
                        <span>{result.title}</span>
                        <small>{result.category}</small>
                      </button>
                    ))
                  ) : (
                    <p className="search-no-results">No matching offerings or pujas. Try a different keyword.</p>
                  )}
              </div>
            </div>
          )}
          <a href={sectionHref('booking')} className="button button-primary header-book">Book Ritual</a>
        </div>
      </header>

      {isGalleryPage ? (
        <main className="gallery-page-main">
          <section className="gallery-section gallery-page section-space">
            <div className="content-width">
              <div className="section-title-row gallery-heading">
                <div>
                  <span className="pill section-pill">▧ &nbsp;SACRED GALLERY • RISHIKESH</span>
                  <h2>Divine Moments & Authentic<br />Rituals</h2>
                  <p>Explore moments from our Deity Pujas, Pind Daan ceremonies, Vedic Sanskars, and live rituals in Rishikesh.</p>
                </div>
                <label className="upload-button">⇧ &nbsp;+ Add / Preview Your Own Ritual Photo<input type="file" accept="image/*" multiple onChange={addPhoto} /></label>
              </div>
              <div className="filter-row">
                {galleryFilters.map((filter) => <button type="button" key={filter} onClick={() => setActiveFilter(filter)} className={activeFilter === filter ? 'filter-chip active' : 'filter-chip'}>{filter}</button>)}
              </div>
              <div className="gallery-grid">{renderGalleryCards(visibleGallery)}</div>
            </div>
          </section>
        </main>
      ) : (
      <main>
        <section id="home" className="hero-section">
          <div className="mandala mandala-right" aria-hidden="true" />
          <div className="mandala mandala-left" aria-hidden="true" />
          <div className="hero-inner content-width">
            <div className="hero-content">
              <span className="pill hero-pill"><span>ॐ</span> Directly from the Holy Land of Rishikesh</span>
              <h1>Welcome to <em>Acharya Deepak</em> Online Vedic & Rituals Rishikesh</h1>
              <p className="hero-description">
                Your trusted destination for traditional Hindu rituals, ancestral peace, and astrological guidance directly from holy Rishikesh. We perform all religious ceremonies with <strong>pure Vedic mantras and complete authenticity.</strong>
              </p>
              <div className="stream-note"><span className="note-icon">▣</span><p><strong>100% Live Streamed with Individualized Sankalp:</strong> All rituals are conducted online with live streaming and personalized Sankalp in your and your family’s name, Gotra, and Nakshatra.</p></div>
              <div className="hero-actions">
                <a href="#booking" className="button button-primary">♨ &nbsp; Book Your Online Puja &nbsp; →</a>
                <a href="#booking" className="button button-outline">☉ &nbsp; Consult for Kundali Analysis</a>
              </div>
              <div className="core-chips"><strong>Core Services:</strong>{services.map((service, index) => <a key={service.name} href="#services">{index + 1}. {service.name.split(' (')[0]}</a>)}</div>
            </div>
            <div className="hero-art">
              <div className="hero-arch">
                <img className="hero-photo" src={`${basePath}media/acharya-deepak-ritual.jpeg`} alt="Acharya Deepak performing a Vedic ritual" />
                <div className="arch-caption"><span>✧ &nbsp;PURE विधि-विधान & VEDIC MANTRAS</span><strong>Every Puja Conducted with<br />Personalized Family Sankalp</strong></div>
              </div>
              <div className="floating-sankalp"><span className="mini-icon">♨</span><span><strong>Individual Sankalp</strong><small>Name, Gotra & Nakshatra</small></span></div>
              <div className="floating-proof"><span className="mini-icon">♙</span><span><strong>200+ Rituals</strong><small>8+ Years Experience</small></span></div>
            </div>
          </div>
        </section>

        <div className="proof-bar content-width">
          <div className="proof-item"><span className="proof-icon">♨</span><div><strong>200+ Rituals</strong><small>Performed with pure Vedic<br />mantras & devotion</small></div></div>
          <div className="proof-item"><span className="proof-icon">♙</span><div><strong>8 Years Experience</strong><small>Authentic Vedic customs &<br />proper विधि-विधान</small></div></div>
          <div className="proof-item"><span className="proof-icon">◎</span><div><strong>3 Languages Spoken</strong><small>Clear guidance in Hindi,<br />Sanskrit & English</small></div></div>
          <div className="proof-item"><span className="proof-icon">▣</span><div><strong>Live Streaming</strong><small>Online rituals with<br />individualized Sankalp</small></div></div>
        </div>

        <section id="about" className="about-section content-width section-space">
          <div className="acharya-photo">
            <img src={`${basePath}media/acharya-deepak-rishikesh.jpeg`} alt="Acharya Deepak by the Ganges in Rishikesh" />
            <div className="acharya-caption"><div><strong>Acharya Deepak</strong><small>Vedic Rituals Specialist & Astrologer • Holy Rishikesh</small></div><span>♧</span><div className="caption-stats"><b>200+<small>Rituals</small></b><b>8+ Yrs<small>Experience</small></b><b>3<small>Languages</small></b></div></div>
          </div>
          <div className="about-copy">
            <span className="pill section-pill">✧ &nbsp;ABOUT ACHARYA DEEPAK</span>
            <h2>Sacred Vedic Traditions Performed with Devotion, Faith & Proper <em>विधि-विधान</em></h2>
            <div className="about-card">
              <p>We offer a wide range of Hindu religious and spiritual services, including all types of <strong>Dev Pujas (Worship of Deities), Pitru Pujas (Ancestral Rituals), Shraddha, Tarpan, Pind Daan</strong>, and other Vedic ceremonies.</p>
              <p>We also provide <strong>Janam Kundli (Birth Chart) Reading, Horoscope Analysis, and Vedic Astrology Guidance</strong> to help you understand planetary influences and important aspects of life.</p>
              <blockquote>All rituals and pujas are performed according to traditional Vedic customs with devotion, faith, and proper विधि-विधान, bringing spiritual peace, positivity, and blessings to you and your family.</blockquote>
            </div>
            <div className="about-points"><div>✓ <span><b>Authentic Vedic Mantras</b><small>Strict adherence to scriptural Vidhi-Vidhan from holy Rishikesh.</small></span></div><div>✓ <span><b>Individualized Sankalp</b><small>Every online ritual is personalized for your family’s Gotra & wishes.</small></span></div></div>
          </div>
        </section>

        <section id="services" className="pillars-section section-space">
          <div className="content-width">
            <div className="center-heading"><span className="pill section-pill">OUR CORE OFFERINGS</span><h2>Four Pillars of Vedic & Spiritual<br />Services</h2><p>We perform all religious ceremonies with pure Vedic mantras and complete authenticity directly from<br /> holy Rishikesh.</p></div>
            <div className="pillar-grid">
              {filteredServices.map((service, index) => <button type="button" key={service.name} onClick={() => { setSelectedPuja(null); setSelectedService(service) }} className="pillar-card"><div className="pillar-top"><span>Pillar 0{index + 1}</span><small>{service.hindi}</small></div><h3>{service.name}</h3><p>{service.description}</p><div className="pillar-link">Explore Details <span>›</span></div></button>)}
            </div>
            {filteredServices.length === 0 && (
              <div className="search-empty-state">No pujas or rituals match “{searchTerm}”. Try a different keyword like Rudrabhishek, Pind Daan, Vastu, or Kundli.</div>
            )}
          </div>
        </section>

        <section id="ceremonies" className="content-width section-space ceremonies-section">
          <div className="section-title-row"><div><span className="pill section-pill">SACRED CEREMONIES WE PROVIDE</span><h2>8 Signature Vedic Pujas & Sanskars</h2><p>Each ritual is performed with pure Vedic mantras, traditional विधि-विधान, and complete<br /> devotion for peace, protection, and family prosperity.</p></div><a href="#booking" className="button button-outline">Need a Custom Havan or Puja? Enquire Here →</a></div>
          {filteredCeremonies.length === 0 ? (
            <div className="search-empty-state">No ceremonies match your search. Try a more specific ritual title like Rudrabhishek, Pind Daan, or Vivah Sanskar.</div>
          ) : (
            <div className="ceremony-grid">{filteredCeremonies.map((ceremony, index) => <article id={`ceremony-${ceremonies.indexOf(ceremony)}`} key={ceremony.title} className="ceremony-card"><div className="ceremony-photo" style={{ backgroundImage: `linear-gradient(0deg, rgba(61, 25, 20, .96), transparent 62%), url("${ceremony.image}")` }}><span className="ceremony-type">#{String(index + 1).padStart(2, '0')} • {ceremony.type}</span><span className="ceremony-highlight">✧ &nbsp;{ceremony.highlight}</span></div><div className="ceremony-copy"><h3>{ceremony.title}</h3><strong>{ceremony.summary}</strong><p>{ceremony.details}</p><a href={whatsappHref(`Namaste, I would like to enquire about ${ceremony.title}. Please share details about the puja, available dates, and booking process.`)} target="_blank" rel="noreferrer">Enquire on WhatsApp &nbsp; →</a></div></article>)}</div>
          )}
        </section>

        <section id="pitru" className="pitru-section">
          <div className="pitru-inner content-width"><div className="pitru-copy"><span className="pill gold-pill">♨ &nbsp;SACRED ANCESTRAL PEACE • HOLY RISHIKESH</span><h2>Pind Daan, Tarpan, Annual Shraddh<br />& Pitru Dosh Shanti</h2><blockquote>“Pind Daan is not just a ritual; it is a sacred bridge of gratitude, love, and prayers that connects us to our ancestors and guides their souls toward eternal peace.”</blockquote><p>Whether performed in-person along the sacred banks of Maa Ganga in Rishikesh or conducted online via live video stream with your individualized family Sankalp, Acharya Deepak performs complete Pitru Pujas with authentic Vedic विधि-विधान.</p><div className="pitru-tags"><span>✦ Pind Daan Puja</span><span>✦ Pitru Dosh Shanti</span><span>✦ Annual Shraddh</span><span>✦ Til-Tarpan Vidhi</span></div></div><div className="pitru-book-card"><span className="lotus">♧</span><div><h3>Book Ancestral Peace Puja</h3><small>Live Streamed or In-Person in Rishikesh</small></div><ul><li>Personalized Gotra & Ancestor Sankalp</li><li>Pure Vedic Pind & Tarpan Offerings</li><li>Live Video Participation for Family</li></ul><a href="#booking" className="button button-primary">Schedule Pind Daan / Pitru Puja &nbsp; →</a></div></div>
        </section>

        <section className="steps-section content-width section-space"><div className="steps-panel"><span className="eyebrow">SEAMLESS GLOBAL PARTICIPATION</span><h2>How Our Online Live-Streamed Rituals Work</h2><div className="steps-grid"><article><b>01</b><h3>Book & Share Family Details</h3><p>Select your required Puja or Kundali consultation and share your Name, Gotra, Nakshatra, and specific prayer intention.</p></article><article><b>02</b><h3>Individualized Vedic Sankalp</h3><p>At the auspicious Muhurat in holy Rishikesh, Acharya Deepak takes a solemn Vedic Sankalp in your name before the sacred altar.</p></article><article><b>03</b><h3>Join Live Stream & Receive Blessings</h3><p>Participate live via video call with your family during the Abhishek, Katha, and Purnahuti Havan from anywhere in the world.</p></article></div></div></section>

        <section id="gallery" className="gallery-section section-space"><div className="content-width"><div className="section-title-row gallery-heading"><div><span className="pill section-pill">▧ &nbsp;SACRED GALLERY • RISHIKESH</span><h2>Latest Divine Moments</h2><p>A glimpse of authentic rituals and sacred ceremonies from Rishikesh.</p></div><a href={galleryHref} className="button button-primary">View Gallery &nbsp; →</a></div><div className="gallery-grid gallery-preview-grid">{renderGalleryCards(latestGallery)}</div></div></section>

        <section id="blog" className="blog-section content-width section-space"><div className="center-heading"><span className="pill section-pill">▤ &nbsp;VEDIC WISDOM & RITUAL GUIDES</span><h2>Spiritual Blog & Sacred Insights from<br />Rishikesh</h2><p>In-depth articles connected to our ritual gallery—explaining the spiritual meaning of Pind Daan,<br /> Rudrabhishek, Vastu Puja, and Online Live Sankalp.</p></div><div className="article-grid">{articles.map((article) => <article key={article.title} className="article-card"><div className="article-image"><img src={article.image} alt="" /><span>{article.minutes}</span></div><div className="article-copy"><span className="eyebrow">{article.category}</span><h3>{article.title}</h3><p>{article.text}</p><div><button type="button" onClick={() => setActiveArticle(article)}>Read Full Article &nbsp; →</button><a href="#booking">{article.booking}</a></div></div></article>)}</div></section>

        <section id="booking" className="booking-section"><div className="booking-inner content-width"><div className="booking-intro"><span className="pill gold-pill">♨ &nbsp;SACRED SANKALP BOOKING</span><h2>Book Your Online Ritual or Astrology Consultation</h2><p>All rituals are conducted online with live streaming and individualized Sankalp, or in-person at Saklani Vihaar, Dhalwala, Rishikesh. Fill in your details below to schedule your ceremony with <strong>Acharya Deepak.</strong></p><div className="booking-benefits"><div><span>⌖</span><p><b>Sacred Location</b><small>Saklani Vihaar, Dhalwala, Rishikesh</small></p></div><div><span>▣</span><p><b>100% Live Streaming & Sankalp</b><small>Join via WhatsApp Video, Zoom, or Google Meet with your family from anywhere in the world.</small></p></div><div><span>◎</span><p><b>3 Languages Spoken</b><small>Ritual explanation & Kundali guidance available in Hindi, Sanskrit & English.</small></p></div></div></div><form className="booking-form" onSubmit={submitBooking}><div className="form-heading"><div><h3>Schedule Your Puja or Kundali Reading</h3><small>Individualized Sankalp • Pure Vedic Mantras • Saklani Vihaar, Dhalwala, Rishikesh</small></div><span>♧</span></div><div className="form-grid"><label>Your Full Name *<input name="name" required placeholder="e.g. Rajesh Sharma & Family" /></label><label>Phone / WhatsApp Number *<input name="phone" required type="tel" placeholder="e.g. +91 98765 43210" /></label><label>Select Sacred Ritual / Service *<select name="service" defaultValue={bookingServices[2]}>{bookingServices.map((service) => <option key={service}>{service}</option>)}</select></label><label>Ritual Mode *<select name="mode" defaultValue="Online Live Stream (Individualized Sankalp)"><option>Online Live Stream (Individualized Sankalp)</option><option>In-Person in Rishikesh</option></select></label><label>Gotra & Nakshatra (Optional)<input name="gotra" placeholder="e.g. Kashyap Gotra" /></label><label>Preferred Date<input name="date" type="date" /></label><label>Preferred Language<select name="language"><option>Hindi & Sanskrit</option><option>English</option><option>Hindi</option></select></label><label className="full-field">Special Prayer / Birth Details (for Kundali or Sankalp)<textarea name="message" rows={3} placeholder="Share your prayer intention, or Date/Time/Place of Birth for Kundali reading..." /></label></div>{notice && <p className="booking-notice" role="status">{notice}</p>}<button type="submit" className="button button-primary submit-booking">♨ &nbsp; Confirm Sacred Sankalp & Booking Request</button></form></div></section>
      </main>
      )}

      <footer className="site-footer"><div className="footer-main content-width"><div className="footer-brand"><a href={sectionHref('home')} className="brand"><span><strong>Acharya Deepak Online Vedic & Rituals Rishikesh</strong></span></a><p>Your trusted destination for traditional Hindu rituals, ancestral peace (Pind Daan, Tarpan, Shraddh), Deity Pujas, and Janam Kundli guidance directly from holy Rishikesh with live streaming and individualized Sankalp.</p></div><div><h4>SACRED PUJAS</h4><a href={sectionHref('ceremonies')}>1. Wedding Ceremony (Vivah Sanskar)</a><a href={sectionHref('ceremonies')}>2. Griha Pravesh & Vastu Puja</a><a href={sectionHref('ceremonies')}>3. Rudrabhishek (Mahamrityunjaya Path)</a><a href={sectionHref('ceremonies')}>4. Satyanarayan Katha & Navagraha Puja</a><a href={sectionHref('ceremonies')}>5. Mundan Sanskaar & Pind Daan Puja</a></div><div><h4>QUICK NAVIGATION</h4><a href={sectionHref('about')}>About Acharya Deepak (8+ Yrs Exp)</a><a href={sectionHref('services')}>4 Core Spiritual Pillars</a><a href={galleryHref}>Sacred Ritual Gallery</a><a href={sectionHref('blog')}>Spiritual Blog & Guides</a><a href={sectionHref('booking')}>Book Online Live Sankalp</a></div></div><div className="footer-bottom content-width"><span>© 2026 Acharya Deepak Online Vedic & Rituals Rishikesh. All Rights Reserved.</span><span>ॐ सर्वे भवन्तु सुखिनः</span></div></footer>

      {selectedImage && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedImage(null)}><div className="lightbox" role="dialog" aria-modal="true" aria-label={selectedImage.title} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setSelectedImage(null)} aria-label="Close image">×</button><img src={selectedImage.image} alt={selectedImage.title} /><div><span>{selectedImage.category}</span><h2>{selectedImage.title}</h2><p>{selectedImage.description}</p></div></div></div>}
      {selectedService && <div className="modal-backdrop" role="presentation" onClick={() => { setSelectedService(null); setSelectedPuja(null) }}><article className="service-modal" role="dialog" aria-modal="true" aria-label={selectedService.name} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => { setSelectedService(null); setSelectedPuja(null) }} aria-label="Close service details">×</button><div className="service-modal-content"><span className="eyebrow">{selectedService.hindi}</span><h2>{selectedService.name}</h2><p>{selectedService.detail}</p>{selectedPuja && <p className="selected-puja-label">Showing results for: <strong>{selectedPuja}</strong></p>}{selectedService.pujas ? <ol className="service-puja-list">{selectedService.pujas.map((puja, index) => <li key={puja} className={selectedPuja === puja ? 'active-search-puja' : undefined}>{index + 1}. {puja}</li>)}</ol> : <div className="ritual-list">{selectedService.rituals.map((ritual) => <div key={ritual} className={selectedPuja === ritual ? 'active-search-puja' : undefined}>✧ &nbsp;{ritual}</div>)}</div>}<a href={sectionHref('booking')} className="button button-primary" onClick={() => { setSelectedService(null); setSelectedPuja(null) }}>Book {selectedService.name.split(' (')[0]} →</a></div></article></div>}
      {activeArticle && <div className="modal-backdrop" role="presentation" onClick={() => setActiveArticle(null)}><article className="article-modal" role="dialog" aria-modal="true" aria-label={activeArticle.title} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setActiveArticle(null)} aria-label="Close article">×</button><span className="eyebrow">{activeArticle.category} • {activeArticle.minutes}</span><h2>{activeArticle.title}</h2><p>{activeArticle.body}</p><a href={sectionHref('booking')} className="button button-primary" onClick={() => setActiveArticle(null)}>{activeArticle.booking} →</a></article></div>}
    </>
  )
}

export default App
