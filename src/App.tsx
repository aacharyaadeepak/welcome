import { useRef, useState } from 'react'
import './App.css'

const basePath = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`
const galleryHref = `${basePath}gallery/`
const pujasHref = `${basePath}pujas/`

type GalleryItem = {
  title: string
  category: string
  image: string
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
    title: 'Mahalaxmi Puja',
    type: 'Deity Puja',
    highlight: 'Prayers for Prosperity & Abundance',
    summary: 'A devotional puja honoring Goddess Mahalaxmi',
    details:
      'Invite prosperity, harmony, and well-being through traditional Vedic mantras and a personalized family Sankalp.',
    image: `${basePath}media/gallery-deity-puja.jpeg`,
  },
  {
    title: 'Wedding Ceremony (Vivah Sanskar)',
    type: 'Vedic Sanskar',
    highlight: 'Including Kanyadaan & Saptapadi',
    summary: 'Complete Vedic marriage rituals with all traditional ceremonies',
    details:
      'Celebrate your wedding with Sanskrit mantras and traditional rituals, including Kanyadaan, Panigrahana, Agni Parikrama, and the seven vows of Saptapadi.',
    image: `${basePath}media/wedding-ceremony.png`,
  },
  {
    title: 'Griha Pravesh',
    type: 'Vedic Rituals',
    highlight: 'Vastu Shanti & Navagraha Havan Included',
    summary: 'House-warming rituals with Vastu Puja for prosperity',
    details:
      'Welcome prosperity into your new home with Dwar Puja, Kalash Sthapana, Vastu worship, and a sacred Havan.',
    image: `${basePath}media/griha-pravesh.png`,
  },
  {
    title: 'Rudrabhishek Puja',
    type: 'Deity Pujas',
    highlight: 'Mahamrityunjaya Path Included',
    summary: 'Powerful Shiva rituals for peace and protection',
    details:
      'Worship Lord Shiva with sacred offerings, Ganga Jal, Bilva leaves, and chants from Sri Rudram and the Mahamrityunjaya Mantra.',
    image: `${basePath}media/rudrabhishek-puja.png`,
  },
  {
    title: 'Satyanarayan Katha',
    type: 'Deity Pujas',
    highlight: 'Family Prosperity Blessings',
    summary: 'Traditional Vishnu Katha and puja for family blessings',
    details:
      'Gather with family for the traditional Katha and puja, seeking Lord Narayana’s blessings for harmony, health, and prosperity.',
    image: `${basePath}media/satyanarayan-puja.png`,
  },
  {
    title: 'Navagraha Puja',
    type: 'Deity & Astrology',
    highlight: 'Removes Planetary Doshas',
    summary: 'Planetary peace and balance rituals for harmony',
    details:
      'Seek balance and planetary peace through Navagraha worship, Beej Mantra Jaap, and Samidha Havan.',
    image: `${basePath}media/navagraha-puja.png`,
  },
  {
    title: 'Mundan Sanskaar',
    type: 'Vedic Sanskar',
    highlight: 'Blessing for Healthy Growth',
    summary: 'Traditional first haircut ceremony for children',
    details:
      'Mark your child’s first haircut with this sacred sanskaar, seeking blessings for health, wisdom, longevity, and protection.',
    image: `${basePath}media/mundan-sanskaar.png`,
  },
  {
    title: 'Pind Daan Puja',
    type: 'Pitru Pujas',
    highlight: 'Tarpan, Shraddh & Pitru Shanti',
    summary: 'Sacred ancestral peace rituals in Rishikesh',
    details:
      'Honor your ancestors with traditional Pind Daan, Tarpan, and prayers performed with care on the sacred banks of Maa Ganga.',
    image: `${basePath}media/pind-daan-puja.jpeg`,
  },
  {
    title: 'Baglamukhi Puja',
    type: 'Deity Pujas',
    highlight: 'Protection & Obstacle Resolution',
    summary: 'A Vedic ritual invoking Goddess Baglamukhi for protection and strength',
    details:
      'Invoke Goddess Baglamukhi’s protection, overcome obstacles, and cultivate strength and clarity. This Vedic puja seeks blessings for stability, success, and peace while helping devotees face difficult circumstances with confidence.',
    image: `${basePath}media/baglamukhi-puja.jpeg`,
  },
]

type SearchResult =
  | { kind: 'section'; title: string; category: string; searchText: string; sectionId: string }
  | { kind: 'service'; title: string; category: string; searchText: string; service: (typeof services)[number] }
  | { kind: 'ritual' | 'puja'; title: string; category: string; searchText: string; service: (typeof services)[number]; puja: string }
  | { kind: 'ceremony'; title: string; category: string; searchText: string; ceremony: (typeof ceremonies)[number] }

const galleryItems: GalleryItem[] = [
  {
    title: 'Sacred Deity Puja',
    category: 'Deity Pujas & Rudrabhishek',
    image: `${basePath}media/gallery-deity-puja.jpeg`,
  },
  {
    title: 'Acharya Deepak in Rishikesh',
    category: 'Rishikesh',
    image: `${basePath}media/gallery-acharya-rishikesh.jpeg`,
  },
  {
    title: 'Vedic Ceremony',
    category: 'Weddings & Sanskars',
    image: `${basePath}media/gallery-vedic-ceremony.jpeg`,
  },
  {
    title: 'Sacred Havan',
    category: 'Havan & Vedic Rituals',
    image: `${basePath}media/gallery-havan.jpeg`,
  },
  {
    title: 'Vedic Priests Chanting Mantras',
    category: 'Weddings & Sanskars',
    image: `${basePath}media/gallery-priests-chanting.jpeg`,
  },
  {
    title: 'Acharya Deepak Performing Puja',
    category: 'Deity Pujas & Rudrabhishek',
    image: `${basePath}media/gallery-puja-ritual.jpeg`,
  },
  {
    title: 'Acharya Deepak',
    category: 'Rishikesh',
    image: `${basePath}media/gallery-acharya-portrait.jpeg`,
  },
  {
    title: 'Vedic Puja Altar',
    category: 'Deity Pujas & Rudrabhishek',
    image: `${basePath}media/gallery-puja-altar.jpeg`,
  },
]

const articles = [
  {
    category: 'PITRU PUJA & ANCESTRAL PEACE',
    title: 'The Sacred Bridge of Pind Daan: Connecting with Ancestors in Holy Rishikesh',
    image: galleryItems[4].image,
    minutes: '5 min read',
    text: '“Pind Daan is not just a ritual; it is a sacred bridge of gratitude, love, and prayers that connects us to our ancestors and guides their souls toward eternal peace.”',
    body: 'In the Vedic tradition, Pind Daan and Tarpan are profound acts of remembrance and gratitude. Families come to the holy banks of Maa Ganga in Rishikesh to offer prayers for their ancestors. The ceremony begins with a personalized Sankalp, followed by traditional offerings and mantras performed with care. Families joining online can take part through a live stream and share their names, Gotra, and prayers in advance.',
    booking: 'Enquire about Pind Daan Puja',
  },
  {
    category: 'DEITY PUJAS & SHIVA WORSHIP',
    title: 'Power of Rudrabhishek & Mahamrityunjaya Path for Peace and Protection',
    image: galleryItems[0].image,
    minutes: '4 min read',
    text: 'Discover how the sacred bathing of the Shiva Lingam combined with the Mahamrityunjaya Mantra creates a spiritual shield of health, longevity, and inner serenity.',
    body: 'Rudrabhishek is a devotional offering to Lord Shiva, traditionally accompanied by the Sri Rudram. At the altar, the Shiva Lingam is bathed with sacred offerings while the Mahamrityunjaya Mantra is recited for healing, courage, and peace. A family Sankalp helps focus the prayers on the intentions that matter most to you.',
    booking: 'Enquire about Rudrabhishek Puja',
  },
  {
    category: 'ONLINE LIVE RITUALS',
    title: 'How Online Vedic Pujas Work: The Spiritual Power of Sankalp',
    image: galleryItems[3].image,
    minutes: '4 min read',
    text: 'Join a traditional ceremony from anywhere in the world with a personal family Sankalp and live participation.',
    body: 'Online participation makes it possible for families across the world to join a puja conducted in Rishikesh. Share your name, Gotra, and prayer intention before the ceremony. Acharya Deepak performs the Sankalp at the sacred altar, and your family can join through a live video stream, witness the offerings, and receive the blessings together.',
    booking: 'Enquire about an Online Puja',
  },
  {
    category: 'VEDIC SANSKARS & HOME',
    title: 'Vastu Puja & Griha Pravesh: Inviting Prosperity into Your Home',
    image: galleryItems[2].image,
    minutes: '5 min read',
    text: 'Learn how traditional housewarming rituals bless a new home with auspicious beginnings and harmony.',
    body: 'Griha Pravesh marks the beginning of a new chapter. Traditional ceremonies may include Ganesh Puja, Kalash Sthapana, Vastu Puja, and Havan. The exact ritual is guided by the family’s needs, the home, and an auspicious time selected with care.',
    booking: 'Enquire about Griha Pravesh Puja',
  },
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
  const isPujasPage =
    window.location.pathname.replace(/\/+$/, '') === `${basePath.replace(/\/+$/, '')}/pujas`
  const isContentPage = isGalleryPage || isPujasPage
  const ceremonyCarouselRef = useRef<HTMLDivElement>(null)
  const [selectedService, setSelectedService] = useState<(typeof services)[number] | null>(null)
  const [selectedPuja, setSelectedPuja] = useState<string | null>(null)
  const [activeArticle, setActiveArticle] = useState<(typeof articles)[number] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  const latestGallery = galleryItems.slice(0, 4)
  function sectionHref(section: string) {
    return isContentPage ? `${basePath}#${section}` : `#${section}`
  }

  function scrollCeremonyCarousel(direction: -1 | 1) {
    const carousel = ceremonyCarouselRef.current
    if (!carousel) return

    const maxScroll = carousel.scrollWidth - carousel.clientWidth
    const edgeTolerance = 4
    const atStart = carousel.scrollLeft <= edgeTolerance
    const atEnd = carousel.scrollLeft >= maxScroll - edgeTolerance
    const left =
      direction > 0
        ? atEnd ? 0 : Math.min(carousel.scrollLeft + carousel.clientWidth, maxScroll)
        : atStart ? maxScroll : Math.max(carousel.scrollLeft - carousel.clientWidth, 0)

    carousel.scrollTo({ left, behavior: 'smooth' })
  }

  function renderCeremonyCard(ceremony: (typeof ceremonies)[number], index: number) {
    return (
      <article id={`ceremony-${ceremonies.indexOf(ceremony)}`} key={ceremony.title} className="ceremony-card">
        <div className="ceremony-photo" style={{ backgroundImage: `linear-gradient(0deg, rgba(61, 25, 20, .96), transparent 62%), url("${ceremony.image}")` }}>
          <span className="ceremony-type">#{String(index + 1).padStart(2, '0')} • {ceremony.type}</span>
          <span className="ceremony-highlight">✧ &nbsp;{ceremony.highlight}</span>
        </div>
        <div className="ceremony-copy">
          <h3>{ceremony.title}</h3>
          <strong>{ceremony.summary}</strong>
          <p>{ceremony.details}</p>
          <a href={whatsappHref(`Namaste, I would like to enquire about ${ceremony.title}. Please share details about the puja, available dates, and booking process.`)}>
            <svg className="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.8.8-2.7-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.4-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8.9-.3.2-.5.1a6.6 6.6 0 0 1-2-1.2 7.3 7.3 0 0 1-1.4-1.7c-.1-.2 0-.3.1-.4l.4-.5.3-.4c.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.1 1.6.1.5-.1 1.4-.6 1.6-1.2s.2-1.1.2-1.2-.2-.3-.4-.4Z" />
            </svg>
            <span>Enquire</span>
          </a>
        </div>
      </article>
    )
  }

  function selectSearchResult(result: SearchResult) {
    setIsSearchOpen(false)

    if (result.kind === 'section') {
      setSearchTerm('')
      if (isContentPage && !(isPujasPage && result.sectionId === 'ceremonies')) {
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
    if (isContentPage) {
      window.location.assign(sectionHref('services'))
      return
    }

    setSelectedService(result.service)
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function renderGalleryCards(items: GalleryItem[]) {
    return items.map((item) => (
      <article key={item.title} className="gallery-card">
        <img src={item.image} alt={item.title} />
        <span className="gallery-category">{item.category}</span>
      </article>
    ))
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

      <header className={isMenuOpen ? 'site-header nav-open' : 'site-header'}>
        <a href={sectionHref('home')} className="brand">
          <span><strong>Acharya Deepak</strong><small>ONLINE VEDIC & RITUALS • RISHIKESH</small></span>
        </a>
        <nav id="primary-navigation" aria-label="Main navigation">
          <a href={sectionHref('home')} onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href={sectionHref('about')} onClick={() => setIsMenuOpen(false)}>About me</a>
          <a href={sectionHref('services')} onClick={() => setIsMenuOpen(false)}>Pillars</a>
          <a href={sectionHref('pitru')} onClick={() => setIsMenuOpen(false)}>Pind Daan</a>
          <a href={pujasHref} aria-current={isPujasPage ? 'page' : undefined} onClick={() => setIsMenuOpen(false)}>Featured Pujas</a>
          <a href={galleryHref} aria-current={isGalleryPage ? 'page' : undefined} onClick={() => setIsMenuOpen(false)}>Sacred Gallery</a>
          <a href={sectionHref('blog')} onClick={() => setIsMenuOpen(false)}>Blogs</a>
          <a href={sectionHref('contact')} onClick={() => setIsMenuOpen(false)}>Contact</a>
        </nav>
        <div className="header-tools">
          <button type="button" className="search-toggle" onClick={() => setIsSearchOpen((open) => !open)} aria-expanded={isSearchOpen} aria-label="Search rituals and poojas">
            ⌕ <span className="search-label">Search</span>
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
          <a href={whatsappHref('Namaste, I would like to enquire about booking a Vedic ritual. Please share available services and details.')} className="button button-primary header-book">Enquire</a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
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
              </div>
              <div className="gallery-grid">{renderGalleryCards(galleryItems)}</div>
            </div>
          </section>
        </main>
      ) : isPujasPage ? (
        <main className="pujas-page-main">
          <section id="ceremonies" className="content-width section-space ceremonies-section pujas-page">
            <div className="section-title-row">
              <div>
                <span className="pill section-pill">SACRED CEREMONIES WE PROVIDE</span>
                <h2>Vedic Pujas &amp; Sanskars</h2>
                <p>Explore our signature Vedic ceremonies, pujas, and sacred family sanskars performed with care in Rishikesh.</p>
              </div>
            </div>
            <div className="ceremony-grid">
              {ceremonies.map((ceremony, index) => renderCeremonyCard(ceremony, index))}
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
                <a href={whatsappHref('Namaste, I would like to enquire about booking an online puja. Please share details.')} className="button button-primary">♨ &nbsp; Book Your Online Puja &nbsp; →</a>
                <a href={whatsappHref('Namaste, I would like to enquire about Kundali analysis. Please share details.')} className="button button-outline">☉ &nbsp; Consult for Kundali Analysis</a>
              </div>
              <div className="core-chips"><strong>Core Services:</strong>{services.map((service, index) => <a key={service.name} href="#services">{index + 1}. {service.name.split(' (')[0]}</a>)}</div>
            </div>
            <div className="hero-art">
              <div className="hero-arch">
                <img className="hero-photo" src={`${basePath}media/welcome-hero.png`} alt="Acharya Deepak seated at a decorated puja altar" />
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
          <div className="section-title-row"><div><span className="pill section-pill">SACRED CEREMONIES WE PROVIDE</span><h2>Signature Vedic Pujas &amp; Sanskars</h2><p>Explore our featured rituals, performed with pure Vedic mantras and traditional विधि-विधान.</p></div><a href={pujasHref} className="button button-outline">View All Pujas &amp; Sanskars →</a></div>
          {filteredCeremonies.length === 0 ? (
            <div className="search-empty-state">No ceremonies match your search. Try a more specific ritual title like Rudrabhishek, Pind Daan, or Vivah Sanskar.</div>
          ) : (
            <>
              <div className="ceremony-carousel-controls" aria-label="Featured puja carousel controls">
                <button type="button" aria-label="Previous featured pujas" onClick={() => scrollCeremonyCarousel(-1)}>‹</button>
                <button type="button" aria-label="Next featured pujas" onClick={() => scrollCeremonyCarousel(1)}>›</button>
              </div>
              <div
                className="ceremony-carousel-track"
                ref={ceremonyCarouselRef}
                role="region"
                aria-roledescription="carousel"
                aria-label="Featured pujas and sanskars"
                tabIndex={0}
              >
                {filteredCeremonies.map((ceremony) => renderCeremonyCard(ceremony, ceremonies.indexOf(ceremony)))}
              </div>
            </>
          )}
        </section>

        <section id="pitru" className="pitru-section">
          <div className="pitru-inner content-width"><div className="pitru-copy"><span className="pill gold-pill">♨ &nbsp;SACRED ANCESTRAL PEACE • HOLY RISHIKESH</span><h2>Pind Daan, Tarpan, Annual Shraddh<br />& Pitru Dosh Shanti</h2><blockquote>“Pind Daan is not just a ritual; it is a sacred bridge of gratitude, love, and prayers that connects us to our ancestors and guides their souls toward eternal peace.”</blockquote><p>Whether performed in-person along the sacred banks of Maa Ganga in Rishikesh or conducted online via live video stream with your individualized family Sankalp, Acharya Deepak performs complete Pitru Pujas with authentic Vedic विधि-विधान.</p><div className="pitru-tags"><span>✦ Pind Daan Puja</span><span>✦ Pitru Dosh Shanti</span><span>✦ Annual Shraddh</span><span>✦ Til-Tarpan Vidhi</span></div></div><div className="pitru-book-card"><span className="lotus">♧</span><div><h3>Book Ancestral Peace Puja</h3><small>Live Streamed or In-Person in Rishikesh</small></div><ul><li>Personalized Gotra & Ancestor Sankalp</li><li>Pure Vedic Pind & Tarpan Offerings</li><li>Live Video Participation for Family</li></ul><a href={whatsappHref('Namaste, I would like to enquire about scheduling a Pind Daan or Pitru Puja. Please share details.')} className="button button-primary">Schedule Pind Daan / Pitru Puja &nbsp; →</a></div></div>
        </section>

        <section className="steps-section content-width section-space"><div className="steps-panel"><span className="eyebrow">SEAMLESS GLOBAL PARTICIPATION</span><h2>How Our Online Live-Streamed Rituals Work</h2><div className="steps-grid"><article><b>01</b><h3>Book & Share Family Details</h3><p>Select your required Puja or Kundali consultation and share your Name, Gotra, Nakshatra, and specific prayer intention.</p></article><article><b>02</b><h3>Individualized Vedic Sankalp</h3><p>At the auspicious Muhurat in holy Rishikesh, Acharya Deepak takes a solemn Vedic Sankalp in your name before the sacred altar.</p></article><article><b>03</b><h3>Join Live Stream & Receive Blessings</h3><p>Participate live via video call with your family during the Abhishek, Katha, and Purnahuti Havan from anywhere in the world.</p></article></div></div></section>

        <section id="gallery" className="gallery-section section-space"><div className="content-width"><div className="section-title-row gallery-heading"><div><span className="pill section-pill">▧ &nbsp;SACRED GALLERY • RISHIKESH</span><h2>Latest Divine Moments</h2><p>A glimpse of authentic rituals and sacred ceremonies from Rishikesh.</p></div></div><div className="gallery-grid gallery-preview-grid">{renderGalleryCards(latestGallery)}</div></div></section>

        <section id="blog" className="blog-section content-width section-space"><div className="center-heading"><span className="pill section-pill">▤ &nbsp;VEDIC WISDOM & RITUAL GUIDES</span><h2>Spiritual Blog & Sacred Insights from<br />Rishikesh</h2><p>In-depth articles connected to our ritual gallery—explaining the spiritual meaning of Pind Daan,<br /> Rudrabhishek, Vastu Puja, and Online Live Sankalp.</p></div><div className="article-grid">{articles.map((article) => <article key={article.title} className="article-card"><div className="article-image"><img src={article.image} alt="" /><span>{article.minutes}</span></div><div className="article-copy"><span className="eyebrow">{article.category}</span><h3>{article.title}</h3><p>{article.text}</p><div><button type="button" onClick={() => setActiveArticle(article)}>Read Full Article &nbsp; →</button><a href={whatsappHref(`Namaste, I would like to ${article.booking.toLowerCase()}. Please share details.`)}>{article.booking}</a></div></div></article>)}</div></section>
      </main>
      )}

      <section id="contact" className="contact-section" aria-labelledby="contact-title">
        <div className="contact-inner content-width">
          <div className="contact-heading">
            <span className="eyebrow">GET IN TOUCH</span>
            <h2 id="contact-title">Contact Acharya Deepak</h2>
          </div>
          <div className="contact-links">
            <a href="tel:+919634195464">
              <span aria-hidden="true">☎</span>
              <span><small>Call</small><strong>+91 96341 95464</strong></span>
            </a>
            <a href="mailto:uniyaldeepak831@gmail.com">
              <span aria-hidden="true">✉</span>
              <span><small>Email</small><strong>uniyaldeepak831@gmail.com</strong></span>
            </a>
            <a href={whatsappHref('Namaste, I would like to enquire about a Vedic ritual. Please share details.')}>
              <span aria-hidden="true">◉</span>
              <span><small>WhatsApp</small><strong>Message us</strong></span>
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer"><div className="footer-main content-width"><div className="footer-brand"><a href={sectionHref('home')} className="brand"><span><strong>Acharya Deepak Online Vedic & Rituals Rishikesh</strong></span></a><p>Your trusted destination for traditional Hindu rituals, ancestral peace (Pind Daan, Tarpan, Shraddh), Deity Pujas, and Janam Kundli guidance directly from holy Rishikesh with live streaming and individualized Sankalp.</p></div><div><h4>SACRED PUJAS</h4><a href={pujasHref}>Mahalaxmi Puja &amp; signature ceremonies</a><a href={pujasHref}>View all Pujas &amp; Sanskars</a></div><div><h4>QUICK NAVIGATION</h4><a href={sectionHref('about')}>About Acharya Deepak (8+ Yrs Exp)</a><a href={sectionHref('services')}>4 Core Spiritual Pillars</a><a href={galleryHref}>Sacred Ritual Gallery</a><a href={sectionHref('blog')}>Spiritual Blog & Guides</a><a href={whatsappHref('Namaste, I would like to enquire about an online Vedic ritual. Please share details.')}>Enquire about a ritual</a></div></div><div className="footer-bottom content-width"><span>© 2026 Acharya Deepak Online Vedic & Rituals Rishikesh. All Rights Reserved.</span><span>ॐ सर्वे भवन्तु सुखिनः</span></div></footer>

      {selectedService && <div className="modal-backdrop" role="presentation" onClick={() => { setSelectedService(null); setSelectedPuja(null) }}><article className="service-modal" role="dialog" aria-modal="true" aria-label={selectedService.name} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => { setSelectedService(null); setSelectedPuja(null) }} aria-label="Close service details">×</button><div className="service-modal-content"><span className="eyebrow">{selectedService.hindi}</span><h2>{selectedService.name}</h2><p>{selectedService.detail}</p>{selectedPuja && <p className="selected-puja-label">Showing results for: <strong>{selectedPuja}</strong></p>}{selectedService.pujas ? <ol className="service-puja-list">{selectedService.pujas.map((puja, index) => <li key={puja} className={selectedPuja === puja ? 'active-search-puja' : undefined}>{index + 1}. {puja}</li>)}</ol> : <div className="ritual-list">{selectedService.rituals.map((ritual) => <div key={ritual} className={selectedPuja === ritual ? 'active-search-puja' : undefined}>✧ &nbsp;{ritual}</div>)}</div>}<a href={whatsappHref(`Namaste, I would like to enquire about ${selectedService.name.split(' (')[0]}. Please share details.`)} className="button button-primary" onClick={() => { setSelectedService(null); setSelectedPuja(null) }}>Enquire about {selectedService.name.split(' (')[0]} →</a></div></article></div>}
      {activeArticle && <div className="modal-backdrop" role="presentation" onClick={() => setActiveArticle(null)}><article className="article-modal" role="dialog" aria-modal="true" aria-label={activeArticle.title} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setActiveArticle(null)} aria-label="Close article">×</button><span className="eyebrow">{activeArticle.category} • {activeArticle.minutes}</span><h2>{activeArticle.title}</h2><p>{activeArticle.body}</p><a href={whatsappHref(`Namaste, I would like to ${activeArticle.booking.toLowerCase()}. Please share details.`)} className="button button-primary" onClick={() => setActiveArticle(null)}>{activeArticle.booking} →</a></article></div>}
    </>
  )
}

export default App
