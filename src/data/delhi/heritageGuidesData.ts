import { EditorialHeritageGuide } from '../../types/delhiHeritage.types';

export const DELHI_HERITAGE_GUIDES: EditorialHeritageGuide[] = [
  {
    slug: 'top-10-heritage-places-in-delhi',
    title: 'Top 10 Heritage Places in Delhi: The Definitive Historical Guide',
    subtitle: 'From UNESCO World Heritage Masterpieces to Ancient Citadels & Sacred Sufi Shrines',
    readTime: '8 Min Read',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    publishedDate: 'Updated for 2026',
    author: {
      name: 'SpotPicks Heritage Editorial Team',
      role: 'Curated with ASI, UNESCO & INTACH Documentation',
    },
    intro:
      'Delhi is one of the oldest continuously inhabited capital cities on Earth, bearing the monumental imprints of at least eight historic cities, spanning ancient Indraprastha of 1000 BCE to the imperial grandeur of Shahjahanabad and Lutyens’ New Delhi. This curated guide features the absolute top 10 heritage landmarks that every resident and visitor must experience.',
    historicalContext:
      'Unlike cities constructed on a single uniform grid, Delhi is an archaeological palimpsest. Successive dynasties—Tomar Rajputs, Mamluks, Khaljis, Tughlaqs, Sayyids, Lodis, Mughals, and British colonial administrators—each established fortified capitals slightly shifted across the landscape between the rocky Aravalli Ridge and the Yamuna River. This geographic oscillation has left Delhi with over 1,200 listed historical monuments, the highest concentration of any metropolis in South Asia.',
    keyTakeaways: [
      'Cover all 3 UNESCO World Heritage Sites: Qutb Minar Complex, Humayun’s Tomb, and Red Fort.',
      'Experience live 700-year-old Sufi qawwali music at Dargah Hazrat Nizamuddin Auliya.',
      'Explore 1,000 years of unbroken history across Mehrauli Archaeological Park and Rajon ki Baoli.',
      'Pair monument exploration with Delhi’s historic culinary heritage in Chandni Chowk and Matia Mahal.',
    ],
    featuredPlacesSlugs: [
      'qutub-minar-complex',
      'humayuns-tomb',
      'red-fort',
      'purana-qila',
      'lodhi-gardens',
      'chandni-chowk',
      'national-museum-delhi',
      'hazrat-nizamuddin-dargah',
      'sundar-nursery',
      'mehrauli-archaeological-park',
    ],
    sections: [
      {
        heading: '1. The UNESCO World Heritage Crown: Qutb Minar, Humayun’s Tomb & Red Fort',
        content:
          'No historical journey through Delhi is complete without the three designated UNESCO World Heritage monuments. Start with the Qutb Minar complex in South Delhi to see the 1199 CE foundation of the Delhi Sultanate and the 1,600-year-old rustless Iron Pillar. Move to Nizamuddin East for Humayun’s Tomb—the 1570 CE Charbagh garden tomb that served as the architectural prototype for Agra’s Taj Mahal. Finally, cross into Old Delhi for the Red Fort (Lal Qila), the red sandstone citadel from which Emperor Shah Jahan governed his empire and where India celebrates Independence Day each August 15.',
        placeSlugRef: 'qutub-minar-complex',
        proTip: 'Book tickets online via the official ASI portal (asi.nic.in) to skip long lines at ticket windows and save ₹15 on Indian tickets and ₹50 on foreign tickets.',
      },
      {
        heading: '2. Ancient Roots: Purana Qila & 3,000 Years of Indraprastha History',
        content:
          'Excavations at Purana Qila on Mathura Road have verified continuous human habitation back to 1000 BCE through Painted Grey Ware (PGW) strata, providing archaeological confirmation for the ancient Mahabharata capital of Indraprastha. Above ground, explore Sher Shah Suri’s 1541 CE Qila-i-Kuhna Mosque and the octagonal Sher Mandal observatory where Emperor Humayun fell to his death in 1556.',
        placeSlugRef: 'purana-qila',
      },
      {
        heading: '3. Serene Necropolises & Garden Sanctuaries: Lodhi Gardens & Sundar Nursery',
        content:
          'For a quiet morning surrounded by heritage, Lodhi Gardens offers 90 acres of blooming landscapes framing the 15th-century tombs of the Sayyid and Lodi sultans (Bara Gumbad, Shish Gumbad, and Sikandar Lodi’s garden tomb). Right next to Humayun’s Tomb, the newly conserved 90-acre Sundar Nursery features 15 conserved 16th-century Mughal monuments along a 550-meter flowing paradise watercourse.',
        placeSlugRef: 'lodhi-gardens',
      },
      {
        heading: '4. Living Heritage & Sufi Traditions: Chandni Chowk & Nizamuddin Dargah',
        content:
          'Delhi’s heritage is not merely stone ruins—it is a living, breathing sensory continuum. Stroll through the pedestrianized 1.3 km boulevard of Chandni Chowk, laid out in 1650 by Princess Jahanara Begum, and browse Asia’s largest spice market at Khari Baoli. On Thursday evenings, gather in the marble courtyards of Dargah Hazrat Nizamuddin Auliya to hear hereditary Qawwals sing the poetry of Amir Khusrau.',
        placeSlugRef: 'chandni-chowk',
      },
    ],
    recommendedTiming: '3 Full Days (Optimal: November through February when daytime temperatures range from 18°C to 24°C)',
    startingPoint: 'Central Secretariat Metro Interchange / Yellow Line',
    metroConnectivitySummary:
      'All 10 locations are located within 150m to 1.5km of Delhi Metro stations (primarily Yellow, Violet, and Pink lines).',
    sources: [
      {
        organization: 'Archaeological Survey of India (ASI)',
        documentOrRecord: 'Inventory of Centrally Protected Monuments in Delhi Circle',
        url: 'https://asi.nic.in',
      },
      {
        organization: 'UNESCO World Heritage Centre',
        documentOrRecord: 'World Heritage Inscriptions: Qutb Minar (233), Humayun’s Tomb (477), Red Fort (1054)',
        url: 'https://whc.unesco.org',
      },
    ],
    faqs: [
      {
        question: 'Which heritage places in Delhi have free entry?',
        answer:
          'Lodhi Gardens, Mehrauli Archaeological Park, Agrasen ki Baoli, Dargah Hazrat Nizamuddin Auliya, Chandni Chowk, Ghalib ki Haveli, and Jahaz Mahal all have 100% free public entry.',
      },
      {
        question: 'Can I cover the top 10 heritage places in a single weekend?',
        answer:
          'To fully appreciate these sites without rushing, we recommend a 3-day itinerary: Day 1 (Old Delhi: Red Fort, Jama Masjid, Chandni Chowk), Day 2 (Central Delhi: Purana Qila, National Museum, Rashtrapati Bhavan, Lodhi Gardens), Day 3 (South Delhi: Humayun’s Tomb, Sundar Nursery, Qutb Minar, Mehrauli Archaeological Park).',
      },
    ],
  },
  {
    slug: '15-historical-places-in-delhi',
    title: '15 Historical Places in Delhi You Should Visit (Complete Guide)',
    subtitle: 'From 2,300-Year-Old Ashokan Edicts to 14th-Century Fortress Battlements and Colonial Palaces',
    readTime: '11 Min Read',
    heroImage: 'https://images.unsplash.com/photo-1598598795009-f80c5072e661?auto=format&fit=crop&w=1200&q=80',
    publishedDate: 'Updated for 2026',
    author: {
      name: 'SpotPicks Heritage Editorial Team',
      role: 'Curated with ASI & Ministry of Culture Data',
    },
    intro:
      'Expanding beyond the most famous postcard landmarks, this comprehensive guide documents 15 essential historical monuments across Delhi. It combines imperial Mughal palaces with rugged Tughlaq cyclopean fortresses, ancient stepwells, Mauryan rock pillars, and world-class modern democratic repositories.',
    historicalContext:
      'Delhi has served as the political nerve center of northern India for over a millennium. By visiting these 15 sites, travelers witness the complete architectural timeline: from Mauryan Buddhist inscriptions (3rd c. BCE) and Rajput citadels (11th c. CE) to the Delhi Sultanate (1192–1526), the Mughal zenith (1526–1857), British New Delhi (1911–1947), and modern democratic India.',
    keyTakeaways: [
      'Understand the progression of Indian architecture across 15 distinct monuments.',
      'Explore hidden stepwells (Agrasen ki Baoli and Rajon ki Baoli) engineered for arid climates.',
      'Witness the monolithic 2,300-year-old Ashokan Pillar atop the Feroz Shah Kotla pyramid.',
      'Combine ancient ruins with high-tech democratic storytelling at Pradhanmantri Sangrahalaya.',
    ],
    featuredPlacesSlugs: [
      'qutub-minar-complex',
      'humayuns-tomb',
      'red-fort',
      'purana-qila',
      'tughlaqabad-fort',
      'agrasen-ki-baoli',
      'safdarjung-tomb',
      'hauz-khas-complex',
      'national-museum-delhi',
      'lodhi-gardens',
      'chandni-chowk',
      'rashtrapati-bhavan-central-vista',
      'hazrat-nizamuddin-dargah',
      'sundar-nursery',
      'mehrauli-archaeological-park',
    ],
    sections: [
      {
        heading: 'The 15 Must-Visit Historic Landmarks of Delhi',
        content:
          '1. Qutb Minar Complex (1199 CE, Mehrauli)\n2. Humayun’s Tomb & Charbagh (1570 CE, Nizamuddin East)\n3. Red Fort / Lal Qila (1648 CE, Chandni Chowk)\n4. Purana Qila & Indraprastha (1000 BCE / 1541 CE, Mathura Road)\n5. Tughlaqabad Fort (1321 CE, Southern Ridge)\n6. Agrasen ki Baoli (14th Century, Hailey Road/CP)\n7. Safdarjung’s Tomb (1754 CE, Jor Bagh)\n8. Hauz Khas Complex & Madrasa (1352 CE, Hauz Khas Village)\n9. National Museum of India (1949, Janpath)\n10. Lodhi Gardens & Royal Tombs (1444–1517 CE, Lodhi Road)\n11. Chandni Chowk & Khari Baoli (1650 CE, Old Delhi)\n12. Rashtrapati Bhavan & India Gate (1931 CE, Central Vista)\n13. Dargah Hazrat Nizamuddin Auliya (1325 CE, Nizamuddin West)\n14. Sundar Nursery Heritage Park (16th c. / 2018, Nizamuddin)\n15. Mehrauli Archaeological Park (1060–1850s CE, Mehrauli)',
      },
    ],
    recommendedTiming: '4 to 5 Days for the comprehensive circuit',
    metroConnectivitySummary: 'All 15 monuments are accessible via the Delhi Metro network.',
    sources: [
      {
        organization: 'Archaeological Survey of India (ASI)',
        documentOrRecord: 'Monuments of Delhi: 100 Centrally Protected Heritage Sites',
        url: 'https://asi.nic.in',
      },
    ],
    faqs: [
      {
        question: 'Which of these 15 places are best for photography?',
        answer:
          'Humayun’s Tomb, Sundar Nursery, Qutb Minar, Agrasen ki Baoli, and Lodhi Gardens offer the most stunning architectural symmetry and golden hour lighting.',
      },
    ],
  },
  {
    slug: 'best-mughal-architecture-in-delhi',
    title: 'Best Mughal Architecture in Delhi: Charbaghs, Domes & Sandstone Palaces',
    subtitle: 'Tracing the Evolution of the Imperial Mughal Style from Babur and Akbar to Shah Jahan and Late Awadh',
    readTime: '9 Min Read',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    publishedDate: 'Updated for 2026',
    author: {
      name: 'SpotPicks Heritage Editorial Team',
      role: 'Curated with Mughal Architectural History Sources',
    },
    intro:
      'Between 1526 and 1857, the Mughal dynasty transformed the visual and spatial identity of northern India. Delhi preserves the full trajectory of this architectural evolution: from early Persian-influenced Charbaghs under Akbar to the high classical marble symmetry of Shah Jahan and the late baroque garden palaces of Safdarjung.',
    historicalContext:
      'Mughal architecture synthesized indigenous Indian building traditions (such as post-and-beam construction, chhatri kiosks, jharokha balconies, and brackets) with Persian geometric harmony, four-fold Charbagh gardens, bulbous double domes, and pietra dura stone inlays. Delhi was the imperial capital during three distinct peaks: Humayun’s reign, Shah Jahan’s construction of Shahjahanabad, and the late 18th-century twilight.',
    keyTakeaways: [
      'Understand how Humayun’s Tomb set the stage for the Taj Mahal with the first Charbagh double dome.',
      'Explore Shahjahanabad: Lal Qila, Jama Masjid, and Chandni Chowk as an integrated urban masterpiece.',
      'Discover late Mughal baroque style at Safdarjung’s Tomb and restored garden pavilions at Sundar Nursery.',
    ],
    featuredPlacesSlugs: [
      'humayuns-tomb',
      'red-fort',
      'jama-masjid',
      'safdarjung-tomb',
      'sundar-nursery',
      'chandni-chowk',
      'purana-qila',
    ],
    sections: [
      {
        heading: 'Phase 1: The Persian-Indian Synthesis (Akbar & Humayun, 1565–1572 CE)',
        content:
          'Humayun’s Tomb introduced the Persian Charbagh (four-fold garden symbolizing the four rivers of paradise) and the bulbous double dome to India. Built under the direction of Persian architect Mirak Mirza Ghiyas and Empress Bega Begum, it demonstrated how red sandstone trimmed with white marble could create structural harmony on an unprecedented scale.',
        placeSlugRef: 'humayuns-tomb',
      },
      {
        heading: 'Phase 2: High Imperial Zenith (Shah Jahan, 1638–1656 CE)',
        content:
          'When Shah Jahan moved the capital from Agra to Delhi in 1638, he created Shahjahanabad. Lal Qila’s Diwan-i-Khas featured white Makrana marble inlaid with precious lapis, onyx, and jasper. Jama Masjid rose on a rocky hillock with black-and-white striped domes, and Princess Jahanara laid out the tree-lined boulevard of Chandni Chowk.',
        placeSlugRef: 'red-fort',
      },
      {
        heading: 'Phase 3: Late Baroque Splendor (Safdarjung’s Tomb, 1754 CE)',
        content:
          'Safdarjung’s Tomb represents the final grand monument of Mughal architecture. With its elevated podium, four integrated corner towers, high marble dome, and painted plaster ceilings, it adapted imperial forms into the late Awadhi regional style.',
        placeSlugRef: 'safdarjung-tomb',
      },
    ],
    recommendedTiming: '2 Full Days',
    metroConnectivitySummary: 'Violet and Yellow Lines provide direct access to all Mughal heritage sites.',
    sources: [
      {
        organization: 'Ebba Koch',
        documentOrRecord: 'Mughal Architecture: An Outline of Its History and Development',
      },
      {
        organization: 'Catherine B. Asher',
        documentOrRecord: 'Architecture of Mughal India (The New Cambridge History of India)',
      },
    ],
    faqs: [
      {
        question: 'What defines a Charbagh garden in Mughal architecture?',
        answer:
          'A Charbagh is a quadripartite garden layout based on the four gardens of Paradise described in the Quran. It is divided symmetrically by four intersecting water channels representing the four rivers of water, milk, wine, and honey.',
      },
    ],
  },
  {
    slug: 'delhi-sultanate-heritage-places',
    title: 'Delhi Sultanate Heritage Places: 300 Years of Medieval Architecture',
    subtitle: 'Exploring the Forts, Tombs, Mosques & Stepwells of Mamluk, Khalji, Tughlaq, Sayyid & Lodi Dynasties',
    readTime: '10 Min Read',
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    publishedDate: 'Updated for 2026',
    author: {
      name: 'SpotPicks Heritage Editorial Team',
      role: 'Curated with Sultanate Historical Records',
    },
    intro:
      'Before the Mughals arrived in 1526, Delhi was ruled for over three centuries (1192–1526 CE) by five successive dynasties collectively known as the Delhi Sultanate: the Mamluks (Slave Dynasty), Khaljis, Tughlaqs, Sayyids, and Lodis. This era introduced true arches, domes, corbelled squinches, and rugged fortress masonry across Mehrauli, Hauz Khas, Tughlaqabad, and Lodhi Gardens.',
    historicalContext:
      'The Delhi Sultanate era was a dynamic period of experimental engineering. Indian masons accustomed to trabeate (beam-and-lintel) construction gradually mastered the arcuate (true arch and vault) technique, creating monumental victory towers, madrasas, fortress citadels, and multi-tier subterranean stepwells.',
    keyTakeaways: [
      'Trace the 5 dynasties of the Delhi Sultanate across Mehrauli, Siri, Tughlaqabad, Ferozabad, and Lodhi Gardens.',
      'See India’s first true arch at Balban’s Tomb and first true horseshoe arch at Alai Darwaza.',
      'Explore Tughlaqabad’s cyclopean rubble battlements and Hauz Khas’s two-tier madrasa.',
      'Walk through 15th-century octagonal Lodi tombs in Lodhi Gardens.',
    ],
    featuredPlacesSlugs: [
      'qutub-minar-complex',
      'mehrauli-archaeological-park',
      'tughlaqabad-fort',
      'hauz-khas-complex',
      'feroz-shah-kotla',
      'lodhi-gardens',
      'agrasen-ki-baoli',
    ],
    sections: [
      {
        heading: '1. The Mamluk Foundation: Qutb Complex & Balban’s Tomb (1192–1290 CE)',
        content:
          'The Slave Dynasty established the first sultanate capital in Mehrauli. Qutb-ud-din Aibak began the Qutb Minar, and Shamsuddin Iltutmish expanded it alongside his own intricately carved square tomb. In the adjacent Mehrauli Archaeological Park, Balban’s 1287 CE tomb displays the first true masonry arch in India.',
        placeSlugRef: 'qutub-minar-complex',
      },
      {
        heading: '2. The Khalji Innovation: Alai Darwaza & Siri Fort (1290–1320 CE)',
        content:
          'Alauddin Khalji built the second city of Delhi at Siri to repel Mongol invasions, excavating the royal tank of Hauz Khas. At the Qutb complex, his 1311 CE Alai Darwaza is celebrated as India’s first true horseshoe arch with pierced stone jali screens.',
        placeSlugRef: 'hauz-khas-complex',
      },
      {
        heading: '3. The Tughlaq Builders: Tughlaqabad, Hauz Khas & Feroz Shah Kotla (1320–1414 CE)',
        content:
          'The Tughlaq sultans were prolific builders. Ghiyas-ud-din constructed the massive stone fortress of Tughlaqabad. Muhammad bin Tughlaq enclosed Jahanpanah. Firoz Shah Tughlaq built the madrasa at Hauz Khas, founded Ferozabad with its Ashokan Pillar, and repaired the upper storeys of Qutb Minar.',
        placeSlugRef: 'tughlaqabad-fort',
      },
      {
        heading: '4. Sayyid & Lodi Elegance: Lodhi Gardens & Rajon ki Baoli (1414–1526 CE)',
        content:
          'The final two dynasties perfected octagonal and square tomb architecture. Lodhi Gardens contains the prototype octagonal tomb of Muhammad Shah, the massive Bara Gumbad, and Sikandar Lodi’s walled garden tomb. In Mehrauli, Daulat Khan built the four-tier stepwell of Rajon ki Baoli.',
        placeSlugRef: 'lodhi-gardens',
      },
    ],
    recommendedTiming: '2 Full Days',
    metroConnectivitySummary: 'Yellow Line (Qutab Minar, Hauz Khas, Jor Bagh) connects most Sultanate sites.',
    sources: [
      {
        organization: 'Percy Brown',
        documentOrRecord: 'Indian Architecture (Islamic Period) - Delhi Sultanate Chapters',
      },
    ],
    faqs: [
      {
        question: 'Which is the oldest surviving monument of the Delhi Sultanate?',
        answer:
          'Quwwat-ul-Islam Mosque and the base storey of Qutb Minar, commissioned in 1199 CE by Qutb-ud-din Aibak, are the oldest surviving Sultanate structures in Delhi.',
      },
    ],
  },
  {
    slug: 'best-museums-in-delhi',
    title: 'Best Museums in Delhi: From Ancient Antiquities to Modern Democracy',
    subtitle: 'The Top Curated Museums, Art Galleries & Experiential Heritage Repositories',
    readTime: '7 Min Read',
    heroImage: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80',
    publishedDate: 'Updated for 2026',
    author: {
      name: 'SpotPicks Heritage Editorial Team',
      role: 'Curated with Museum Official Guidelines',
    },
    intro:
      'Delhi is home to India’s most prestigious cultural repositories. Whether you are fascinated by 5,000-year-old Indus Valley seals, sacred Buddhist relics, royal steam trains, or interactive holographic exhibits on Indian Prime Ministers, Delhi’s museum landscape offers unforgettable learning experiences.',
    historicalContext:
      'Following Independence in 1947, Delhi established premier national institutions along the Central Vista and Janpath to safeguard India’s civilizational heritage. In recent years, dynamic modern storytelling and VR technologies have transformed these spaces into state-of-the-art experiential hubs.',
    keyTakeaways: [
      'Explore 200,000+ artifacts at the National Museum on Janpath, including the Harappan Dancing Girl.',
      'Experience the futuristic holographic and AR galleries at Pradhanmantri Sangrahalaya.',
      'Visit the National Gallery of Modern Art (NGMA) housed inside the historic palace of the Maharaja of Jaipur.',
      'Check closed days: Most government museums in Delhi are closed on Mondays.',
    ],
    featuredPlacesSlugs: [
      'national-museum-delhi',
      'pradhanmantri-sangrahalaya',
      'purana-qila',
      'red-fort',
    ],
    sections: [
      {
        heading: '1. National Museum of India (Janpath)',
        content:
          'The flagship repository of Indian history. Must-see exhibits include the 2500 BCE Bronze Dancing Girl of Mohenjo-daro, the consecrated Kapilavastu Buddha bone relics, Gandhara stone sculptures, and Emperor Akbar’s steel armor.',
        placeSlugRef: 'national-museum-delhi',
      },
      {
        heading: '2. Pradhanmantri Sangrahalaya (Teen Murti Estate)',
        content:
          'A modern marvel utilizing virtual reality, holograms, and immersive audiovisual environments to tell the story of India’s 15 Prime Ministers and the building of the Republic.',
        placeSlugRef: 'pradhanmantri-sangrahalaya',
      },
      {
        heading: '3. Kranti Mandir Museums Complex at Red Fort',
        content:
          'Housed within restored 19th-century British barracks inside the Red Fort, these four cutting-edge museums document the 1857 War of Independence, Netaji Subhash Chandra Bose & the INA, and the Jallianwala Bagh massacre.',
        placeSlugRef: 'red-fort',
      },
    ],
    recommendedTiming: '2 Days (Allow 3–4 hours per major museum)',
    metroConnectivitySummary: 'Udyog Bhawan, Central Secretariat, and Lal Quila Metro stations.',
    sources: [
      {
        organization: 'Ministry of Culture, Government of India',
        documentOrRecord: 'Museums of National Importance Directory',
        url: 'https://museumsofindia.gov.in',
      },
    ],
    faqs: [
      {
        question: 'Are Delhi museums open on Mondays?',
        answer:
          'No. Almost all major museums in Delhi (including the National Museum, Pradhanmantri Sangrahalaya, NGMA, and Rail Museum) are strictly closed on Mondays.',
      },
    ],
  },
  {
    slug: 'hidden-historical-places-in-delhi',
    title: 'Hidden Historical Places in Delhi: Secret Ruins Off the Tourist Trail',
    subtitle: 'Subterranean Stepwells, Forest Palaces, Poet Courtyards & Overlooked Citadels',
    readTime: '8 Min Read',
    heroImage: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=1200&q=80',
    publishedDate: 'Updated for 2026',
    author: {
      name: 'SpotPicks Heritage Editorial Team',
      role: 'Curated with INTACH Delhi Chapter Heritage Listings',
    },
    intro:
      'Beyond the crowded ticket counters of major monuments lie dozens of serene, atmospheric ruins nestled in quiet urban villages and forested ridges. This guide unlocks Delhi’s best-kept historical secrets.',
    historicalContext:
      'As Delhi modernized and expanded outward in the 20th century, modern suburbs grew around medieval settlements. Many 14th- to 16th-century structures were enveloped by urban villages or protected within green ridge sanctuaries, remaining surprisingly quiet and free of tourist crowds.',
    keyTakeaways: [
      'Visit Jahaz Mahal ("Ship Palace") and the sacred Hauz-i-Shamsi lake in Mehrauli.',
      'Step into the restored 19th-century courtyard home of Urdu poet Mirza Ghalib in Ballimaran.',
      'Explore the four-tier 1506 CE stepwell Rajon ki Baoli in Mehrauli Archaeological Park.',
      'Experience the 14th-century Djinn petition traditions at Feroz Shah Kotla.',
    ],
    featuredPlacesSlugs: [
      'jahaz-mahal',
      'mirza-ghalib-haveli',
      'mehrauli-archaeological-park',
      'agrasen-ki-baoli',
      'feroz-shah-kotla',
    ],
    sections: [
      {
        heading: '1. Jahaz Mahal & Hauz-i-Shamsi (Mehrauli Village)',
        content:
          'A 15th-century Lodi pleasure palace on the banks of Sultan Iltutmish’s sacred 1229 CE reservoir. Its turquoise ceramic tile chhatris and arched balconies reflect peacefully in the water.',
        placeSlugRef: 'jahaz-mahal',
      },
      {
        heading: '2. Ghalib ki Haveli (Gali Qasim Jan, Ballimaran)',
        content:
          'Tucked inside the narrow alleys of Old Delhi, this humble Lakhori brick courtyard home is where Mirza Ghalib composed his greatest ghazals during the turbulent final years of the Mughal Empire.',
        placeSlugRef: 'mirza-ghalib-haveli',
      },
      {
        heading: '3. Rajon ki Baoli (Mehrauli Archaeological Park)',
        content:
          'A four-tiered 16th-century stepwell hidden within keekar woods, featuring 66 stone steps, symmetrical arched galleries, and an ornate 12-pillared mosque pavilion.',
        placeSlugRef: 'mehrauli-archaeological-park',
      },
    ],
    recommendedTiming: '1 to 2 Days',
    metroConnectivitySummary: 'Yellow Line (Qutab Minar, Chawri Bazar) and Violet Line (Delhi Gate).',
    sources: [
      {
        organization: 'INTACH Delhi Chapter',
        documentOrRecord: 'Delhi: 100 Lesser-Known Monuments (Heritage Inventory)',
      },
    ],
    faqs: [
      {
        question: 'Are hidden heritage places safe for solo travelers?',
        answer:
          'Yes, during daylight hours (9:00 AM to 5:00 PM). Visiting in the morning or early afternoon is ideal, and wearing comfortable walking shoes is recommended.',
      },
    ],
  },
  {
    slug: 'delhi-heritage-walk-guide',
    title: 'The Ultimate Delhi Heritage Walk Guide: 3 Step-by-Step Walking Trails',
    subtitle: 'Self-Guided Heritage Trails Through Mehrauli, Shahjahanabad & Central Vista',
    readTime: '10 Min Read',
    heroImage: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
    publishedDate: 'Updated for 2026',
    author: {
      name: 'SpotPicks Heritage Editorial Team',
      role: 'Curated by Licensed Heritage Walk Leaders',
    },
    intro:
      'The best way to truly experience Delhi’s layers of history is on foot. These three meticulously designed, step-by-step walking trails cover Mehrauli’s medieval monuments, Shahjahanabad’s Mughal bazaars, and Central Vista’s imperial boulevards with walking times, transit directions, and curated historical insights.',
    historicalContext:
      'Walking connects individual monuments into a continuous historical narrative. These three trails represent the ancient/medieval foundation (Mehrauli, 11th–16th c.), the Mughal imperial capital (Old Delhi, 17th–19th c.), and the 20th-century capital (New Delhi).',
    keyTakeaways: [
      'Trail 1: Mehrauli 1,000-Year Heritage Trail (2.5 km, 3.5 hours).',
      'Trail 2: Shahjahanabad Mughal Heritage & Street Food Trail (2 km, 3 hours).',
      'Trail 3: Central Vista Imperial & Democratic Walk (3 km, 2.5 hours).',
      'Practical tips on metro connections, morning timings, footwear, and photo spots.',
    ],
    featuredPlacesSlugs: [
      'qutub-minar-complex',
      'mehrauli-archaeological-park',
      'red-fort',
      'chandni-chowk',
      'jama-masjid',
      'rashtrapati-bhavan-central-vista',
    ],
    walkRouteSteps: [
      {
        stepNumber: 1,
        placeSlug: 'qutub-minar-complex',
        placeName: 'Qutb Minar Complex (Starting Point)',
        durationAtStop: '1.5 Hours',
        walkingDistanceToNext: '400 meters (5 min walk across Anuvrat Marg)',
        whatToLookFor: 'Intricate Arabic epigraphy on the minaret, the 4th-century rustless Iron Pillar, and Alai Darwaza’s true horseshoe arch.',
        historicalInsight: 'Marks the 1199 CE birth of the Delhi Sultanate.',
        curatorTip: 'Enter at 7:30 AM right when gates open for pristine morning light with zero crowds.',
      },
      {
        stepNumber: 2,
        placeSlug: 'mehrauli-archaeological-park',
        placeName: 'Jamali Kamali Mosque & Tomb',
        durationAtStop: '45 Minutes',
        walkingDistanceToNext: '350 meters (4 min stroll along paved park path)',
        whatToLookFor: 'Glazed cobalt blue and turquoise tiles on the flat-roofed tomb ceiling.',
        historicalInsight: 'Sufi saint Jamali was court poet to Sikandar Lodi, Babur, and Humayun.',
        curatorTip: 'Ask the ASI caretaker to open the inner grill to photograph the ceiling tilework.',
      },
      {
        stepNumber: 3,
        placeSlug: 'mehrauli-archaeological-park',
        placeName: 'Rajon ki Baoli Stepwell',
        durationAtStop: '45 Minutes',
        walkingDistanceToNext: '500 meters back to Qutab Minar Metro',
        whatToLookFor: 'Four descending tiers of symmetrical stone arches and the 12-pillared mosque on the upper terrace.',
        historicalInsight: 'Built in 1506 CE by Daulat Khan during Sikandar Lodi’s reign.',
        curatorTip: 'Walk down to the second tier for dramatic symmetrical photography.',
      },
    ],
    sections: [
      {
        heading: 'Trail 1: Mehrauli Medieval Trail (Ancient Citadels & Stepwells)',
        content:
          'Distance: 2.5 km | Time: 3.5 hours | Metro: Qutab Minar (Yellow Line)\nRoute: Qutb Minar Complex → Jamali Kamali Tomb & Mosque → Tomb of Balban → Rajon ki Baoli → Gandhak ki Baoli → Mehrauli Village.',
      },
      {
        heading: 'Trail 2: Shahjahanabad Mughal & Culinary Trail (Bazaars & Grand Mosques)',
        content:
          'Distance: 2 km | Time: 3 hours | Metro: Lal Quila or Chandni Chowk\nRoute: Red Fort Lahori Gate → Gauri Shankar Temple & Sis Ganj Sahib → Dariba Kalan (Silver Street) → Kinari Bazaar → Paranthe Wali Gali → Jama Masjid → Matia Mahal Food Street.',
      },
      {
        heading: 'Trail 3: Central Vista Imperial & Democratic Boulevard',
        content:
          'Distance: 3 km | Time: 2.5 hours | Metro: Central Secretariat\nRoute: Rashtrapati Bhavan Forecourt → North & South Blocks → Kartavya Path → National War Memorial → India Gate.',
      },
    ],
    recommendedTiming: 'Early mornings (7:00 AM – 10:30 AM) or late afternoons (3:30 PM – 6:30 PM)',
    startingPoint: 'Qutab Minar Metro Station (Trail 1) / Lal Quila Metro (Trail 2) / Central Secretariat (Trail 3)',
    metroConnectivitySummary: 'Directly linked to Yellow and Violet lines.',
    sources: [
      {
        organization: 'INTACH Delhi Chapter',
        documentOrRecord: 'Delhi Heritage Walks Handbook',
        url: 'https://intach.org',
      },
    ],
    faqs: [
      {
        question: 'What should I wear for a heritage walk in Delhi?',
        answer:
          'Wear breathable cotton clothing, comfortable walking shoes or sneakers with good grip, a sun hat/sunglasses, and carry a scarf to cover your head when entering active religious shrines.',
      },
    ],
  },
];

export const getEditorialGuideBySlug = (slug: string): EditorialHeritageGuide | undefined => {
  return DELHI_HERITAGE_GUIDES.find((g) => g.slug === slug);
};
