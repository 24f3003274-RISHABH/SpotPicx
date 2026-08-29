import { SpiritualStateInfo } from '../../types/spiritual.types';

export const SPIRITUAL_STATES_DATA: Record<string, SpiritualStateInfo> = {
  delhi: {
    stateSlug: 'delhi',
    stateName: 'Delhi (National Capital Territory)',
    tagline: 'A Millennium of Inter-Faith Living, Grand Mosques, Historic Gurudwaras & Modern Marvels',
    overview:
      'Delhi is one of the world’s most religiously diverse capitals. From the 17th-century sandstone splendor of Jama Masjid and the historic Sufi hospice of Hazrat Nizamuddin to the tranquil waters of Gurudwara Bangla Sahib, the marble lotus petals of the Bahá\'í Temple, and modern marvels like Swaminarayan Akshardham, Delhi showcases deep multi-faith coexistence spanning eight centuries.',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Hindu', 'Sikh', 'Muslim', 'Bahá\'í', 'Christian', 'Jain', 'Jewish'],
    topSpiritualTowns: [
      {
        name: 'Old Delhi (Shahjahanabad)',
        description: 'Home to Jama Masjid, Gurudwara Sis Ganj Sahib, Digambar Jain Lal Mandir, and Fatehpuri Masjid along Chandni Chowk.',
        keyPlaces: ['jama-masjid-delhi', 'gurudwara-sis-ganj-sahib', 'digambar-jain-lal-mandir'],
      },
      {
        name: 'Nizamuddin Basti',
        description: 'Historic 14th-century Sufi pilgrimage quarter centered around the Dargah of Hazrat Nizamuddin Aulia and Amir Khusrau.',
        keyPlaces: ['dargah-nizamuddin-aulia'],
      },
      {
        name: 'Connaught Place & Central Delhi',
        description: 'Houses Gurudwara Bangla Sahib, Sacred Heart Cathedral, and Hanuman Mandir.',
        keyPlaces: ['gurudwara-bangla-sahib-delhi', 'sacred-heart-cathedral-delhi'],
      },
      {
        name: 'South Delhi Spiritual Corridor',
        description: 'Features the Lotus Temple, Kalkaji Mandir, ISKCON Temple, Chattarpur Mandir, and Swaminarayan Akshardham across the Yamuna.',
        keyPlaces: ['lotus-temple-delhi', 'akshardham-temple-delhi', 'chhatarpur-temple-delhi', 'iskcon-temple-delhi'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: 'Inter-Faith Heritage Circuit',
        description: 'Explore iconic monuments of 6 distinct world faiths across Central, Old, and South Delhi in a 2-day itinerary.',
        destinations: ['Bangla Sahib', 'Jama Masjid', 'Lotus Temple', 'Akshardham', 'Sacred Heart Cathedral', 'Digambar Jain Lal Mandir'],
        idealDays: '2 Days',
      },
      {
        name: 'Delhi Sufi Trail',
        description: 'Walk through historic dargahs of Nizamuddin Basti, Chirag Dilli, and Mehrauli (Bakhtiyar Kaki).',
        destinations: ['Hazrat Nizamuddin Dargah', 'Qutbuddin Bakhtiyar Kaki Dargah', 'Chirag Dilli Dargah'],
        idealDays: '1 Day',
      },
    ],
    keyFestivals: [
      { name: 'Phool Walon Ki Sair', period: 'September / October', significance: 'Historic syncretic floral festival uniting Hindu and Muslim traditions in Mehrauli.' },
      { name: 'Prakash Parv / Gurpurab', period: 'November / January', significance: 'Grand processions and massive 24/7 langar at Bangla Sahib and Sis Ganj.' },
      { name: 'Eid-ul-Fitr & Eid-ul-Adha', period: 'Islamic Lunar Calendar', significance: 'Massive congregational prayers at Jama Masjid and Fatehpuri Masjid.' },
      { name: 'Janmashtami & Diwali', period: 'August / October', significance: 'Vibrant illuminations across Akshardham, Birla Mandir, and ISKCON.' },
    ],
    travelAdvisory:
      'Delhi’s major religious sites welcome respectful visitors of all faiths. Head coverings are required at all Gurudwaras and Dargahs. Please verify current visiting hours, photography guidelines, and prayer schedules with official trust authorities.',
    suggestedStateDuration: '2 to 3 Days',
  },

  'uttar-pradesh': {
    stateSlug: 'uttar-pradesh',
    stateName: 'Uttar Pradesh',
    tagline: 'Heartland of Indian Spirituality, Sacred Rivers & Timeless Pilgrimages',
    overview:
      'Uttar Pradesh is India’s spiritual epicenter, cradling sacred rivers, the birthplace of Lord Rama (Ayodhya), the playground of Lord Krishna (Mathura & Vrindavan), the eternal city of Lord Shiva (Kashi / Varanasi), and the core Buddhist circuit where Gautama Buddha taught and passed into Mahaparinirvana (Sarnath, Kushinagar, Shravasti). It also features renowned Sufi centers like Deva Sharif and Salim Chishti at Fatehpur Sikri.',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Hindu', 'Buddhist', 'Muslim', 'Jain', 'Sikh'],
    topSpiritualTowns: [
      {
        name: 'Varanasi (Kashi)',
        description: 'One of the oldest continuously inhabited cities on Earth; home to 84 historic ghats, Kashi Vishwanath Jyotirlinga, and the sublime evening Ganga Aarti.',
        keyPlaces: ['kashi-vishwanath-varanasi', 'sankat-mochan-varanasi', 'dashashwamedh-ghat-varanasi'],
      },
      {
        name: 'Mathura & Vrindavan',
        description: 'The Braj Bhoomi region celebrating Lord Krishna with hundreds of historic temples, Banke Bihari, Prem Mandir, and Govardhan Parikrama.',
        keyPlaces: ['banke-bihari-vrindavan', 'shri-krishna-janmabhoomi-mathura', 'prem-mandir-vrindavan'],
      },
      {
        name: 'Ayodhya',
        description: 'Ancient city on the banks of the Sarayu River, revered as the birthplace of Lord Rama, featuring the grand Ram Mandir and Hanuman Garhi.',
        keyPlaces: ['shri-ram-janmabhoomi-ayodhya', 'hanuman-garhi-ayodhya'],
      },
      {
        name: 'Prayagraj (Allahabad)',
        description: 'The sacred Triveni Sangam confluence of Ganga, Yamuna, and mythical Saraswati; host to the world-renowned Kumbh and Magh Melas.',
        keyPlaces: ['triveni-sangam-prayagraj', 'alopi-devi-mandir-prayagraj'],
      },
      {
        name: 'Sarnath & Kushinagar',
        description: 'Key nodes of the Buddhist circuit where Buddha preached his First Discourse (Dharmachakrapravartana) and attained Mahaparinirvana.',
        keyPlaces: ['dhamek-stupa-sarnath', 'mahaparinirvana-temple-kushinagar'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: 'Braj Bhoomi 84 Kos Parikrama',
        description: 'Traditional circuit covering Mathura, Vrindavan, Govardhan, Barsana, Nandgaon, and Gokul.',
        destinations: ['Mathura', 'Vrindavan', 'Govardhan', 'Barsana', 'Nandgaon'],
        idealDays: '3 to 5 Days',
      },
      {
        name: 'Holy Gangetic Sacred Corridor',
        description: 'Varanasi - Prayagraj - Ayodhya spiritual triangle connecting the most sacred riverbanks and tirthas.',
        destinations: ['Varanasi', 'Prayagraj', 'Ayodhya'],
        idealDays: '4 to 6 Days',
      },
      {
        name: 'The Great Buddhist Pilgrimage Circuit',
        description: 'Connecting Sarnath, Shravasti, Kaushambi, Sankisa, and Kushinagar.',
        destinations: ['Sarnath', 'Kushinagar', 'Shravasti'],
        idealDays: '4 to 5 Days',
      },
    ],
    keyFestivals: [
      { name: 'Kumbh & Magh Mela (Prayagraj)', period: 'January – February', significance: 'The largest gathering of humanity taking ritual dips at Triveni Sangam.' },
      { name: 'Dev Deepawali (Varanasi)', period: 'Kartik Purnima (Nov)', significance: 'All 84 ghats of Varanasi illuminated with over one million clay lamps.' },
      { name: 'Lathmar Holi (Barsana & Nandgaon)', period: 'Phalguna (March)', significance: 'World-famous traditional Holi celebrations of Braj.' },
      { name: 'Buddha Purnima (Sarnath & Kushinagar)', period: 'Vaisakha (May)', significance: 'International congregation celebrating Buddha’s birth, enlightenment, and parinirvana.' },
    ],
    travelAdvisory:
      'Major temple towns experience high footfalls during auspicious festivals, Ekadashis, and lunar eclipses. Respect photography bans inside sanctums and verify special darshan timings and river safety protocols with official district administrations.',
    suggestedStateDuration: '5 to 7 Days',
  },

  uttarakhand: {
    stateSlug: 'uttarakhand',
    stateName: 'Uttarakhand (Devbhoomi)',
    tagline: 'The Land of the Gods, Himalayan Glaciers, High-Altitude Tirthas & River Origins',
    overview:
      'Uttarakhand, known as Devbhoomi (Land of the Gods), cradles the sacred origins of the Ganga and Yamuna rivers. Nestled among high Garhwal and Kumaon Himalayan peaks are the venerated Char Dham (Yamunotri, Gangotri, Kedarnath, Badrinath), the Panch Prayag confluences, the sacred twin towns of Haridwar and Rishikesh, and the revered high-altitude Sikh shrine of Gurudwara Hemkund Sahib.',
    heroImage: 'https://images.unsplash.com/photo-1600100397608-f010e421d017?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Hindu', 'Sikh', 'Buddhist'],
    topSpiritualTowns: [
      {
        name: 'Haridwar',
        description: 'Gateway to the Gods where the sacred Ganga enters the plains; famous for Har Ki Pauri and the evening Ganga Aarti.',
        keyPlaces: ['har-ki-pauri-haridwar', 'mansa-devi-haridwar', 'chandi-devi-haridwar'],
      },
      {
        name: 'Rishikesh',
        description: 'World Yoga Capital on the emerald banks of the upper Ganga, dotted with ancient ashrams, Parmarth Niketan, and Beatles Ashram.',
        keyPlaces: ['parmarth-niketan-rishikesh', 'triveni-ghat-rishikesh', 'neelkanth-mahadev-rishikesh'],
      },
      {
        name: 'Badrinath & Kedarnath',
        description: 'High Himalayan tirthas: Badrinath (revered Vishnu shrine established by Adi Shankaracharya) and Kedarnath (high-altitude Shiva Jyotirlinga).',
        keyPlaces: ['badrinath-temple', 'kedarnath-temple'],
      },
      {
        name: 'Gangotri & Yamunotri',
        description: 'Glacial origins of India’s most sacred rivers with high mountain shrines opening annually in spring.',
        keyPlaces: ['gangotri-temple', 'yamunotri-temple'],
      },
      {
        name: 'Hemkund Sahib',
        description: 'Revered high-altitude Sikh pilgrimage site situated at 4,632 meters beside a glacial lake and alpine meadows.',
        keyPlaces: ['gurudwara-hemkund-sahib'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: 'Chota Char Dham Yatra',
        description: 'Sacred Garhwal circuit: Yamunotri -> Gangotri -> Kedarnath -> Badrinath.',
        destinations: ['Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath'],
        idealDays: '10 to 12 Days',
      },
      {
        name: 'Panch Kedar Trail',
        description: 'Five sacred high-altitude Shiva temples: Kedarnath, Tungnath, Rudranath, Madhyamaheshwar, Kalpeshwar.',
        destinations: ['Kedarnath', 'Tungnath', 'Rudranath', 'Madhyamaheshwar', 'Kalpeshwar'],
        idealDays: '12 to 14 Days',
      },
      {
        name: 'Haridwar-Rishikesh Spiritual Rejuvenation',
        description: 'Ganga aartis, meditation ashrams, yoga workshops, and ancient shaktipeeth shrines.',
        destinations: ['Har Ki Pauri', 'Triveni Ghat', 'Parmarth Niketan', 'Neelkanth Mahadev'],
        idealDays: '3 to 4 Days',
      },
    ],
    keyFestivals: [
      { name: 'Kumbh Mela (Haridwar)', period: 'Every 12 Years (Next: 2033)', significance: 'Millions of pilgrims gather for sacred dips at Brahmakund, Har Ki Pauri.' },
      { name: 'Char Dham Kapat Opening & Closing', period: 'Akshaya Tritiya (May) to Bhai Dooj (Nov)', significance: 'Annual ceremonial opening and winter closure of Himalayan sanctums.' },
      { name: 'International Yoga Festival (Rishikesh)', period: 'March 1–7', significance: 'Global gathering of yogis, spiritual masters, and seekers on the Ganga banks.' },
      { name: 'Ganga Dussehra', period: 'May / June', significance: 'Celebrates the descent of Mother Ganga to Earth with grand aartis.' },
    ],
    travelAdvisory:
      'High-altitude Himalayan shrines (Char Dham & Hemkund Sahib) operate seasonally (May to November) and require mandatory biometrics/yatra registration with the Uttarakhand Tourism Board. Carry warm clothing and check mountain weather forecasts.',
    suggestedStateDuration: '7 to 12 Days',
  },

  rajasthan: {
    stateSlug: 'rajasthan',
    stateName: 'Rajasthan',
    tagline: 'Desert Temples, Dargah of Ajmer, Marble Jain Tirthas & Sacred Sarovars',
    overview:
      'Rajasthan’s spiritual landscape is as rich and multifaceted as its royal history. The state houses the world-renowned Sufi Dargah of Khwaja Moinuddin Chishti in Ajmer, the sacred Brahma Temple and Sarovar in Pushkar, peerless translucent marble Jain temples at Dilwara (Mount Abu) and Ranakpur, and iconic devotional centers like Shrinathji in Nathdwara and Karni Mata in Deshnoke.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Hindu', 'Muslim', 'Jain', 'Sikh'],
    topSpiritualTowns: [
      {
        name: 'Ajmer',
        description: 'One of the most important Sufi pilgrimage destinations in the world, home to the Dargah of Khwaja Gharib Nawaz.',
        keyPlaces: ['ajmer-sharif-dargah', 'adhai-din-ka-jhonpra'],
      },
      {
        name: 'Pushkar',
        description: 'Ancient sacred lake town ringed by 52 bathing ghats and home to one of the very few dedicated temples to Lord Brahma.',
        keyPlaces: ['brahma-temple-pushkar', 'pushkar-lake-ghats', 'savitri-temple-pushkar'],
      },
      {
        name: 'Mount Abu & Ranakpur',
        description: 'Masterpieces of Svetambara Jain architecture featuring 1,444 uniquely carved marble pillars and delicate ceilings.',
        keyPlaces: ['dilwara-jain-temples-mount-abu', 'ranakpur-jain-temple'],
      },
      {
        name: 'Nathdwara & Kankroli',
        description: 'Major Vaishnava Pushtimarg pilgrimage centers near Udaipur dedicated to Shrinathji.',
        keyPlaces: ['shrinathji-temple-nathdwara', 'eklingji-temple-udaipur'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: 'Ajmer-Pushkar Spiritual Duo',
        description: 'A deeply syncretic weekend pilgrimage just 14 km apart, uniting Sufi and Vedic heritage.',
        destinations: ['Ajmer Sharif Dargah', 'Brahma Temple Pushkar', 'Pushkar Lake Ghats'],
        idealDays: '2 Days',
      },
      {
        name: 'Mewar & Marwar Jain Architectural Trail',
        description: 'Connecting Dilwara, Ranakpur, Osian, and Nakoda.',
        destinations: ['Dilwara', 'Ranakpur', 'Osian', 'Nakoda'],
        idealDays: '3 to 4 Days',
      },
    ],
    keyFestivals: [
      { name: 'Urs of Khwaja Moinuddin Chishti (Ajmer)', period: 'Rajab (Islamic Lunar Calendar)', significance: 'Commemorates the saint with hundreds of thousands of pilgrims, night qawwalis, and offerings.' },
      { name: 'Pushkar Camel Fair & Kartik Purnima', period: 'October / November', significance: 'Sacred full-moon bath in Pushkar Lake combined with colorful cultural festivities.' },
      { name: 'Mahavir Jayanti', period: 'March / April', significance: 'Elaborate rath yatras and marble temple illuminations across Dilwara and Ranakpur.' },
    ],
    travelAdvisory:
      'Ajmer and Pushkar are easily accessible by train and road from Delhi (6–7 hours). At Ajmer Dargah, please carry a head covering. Leather items must be deposited outside Jain temples in Mount Abu and Ranakpur.',
    suggestedStateDuration: '4 to 6 Days',
  },

  punjab: {
    stateSlug: 'punjab',
    stateName: 'Punjab',
    tagline: 'Heart of Sikh Heritage, Sri Harmandir Sahib & The Historic Takhts',
    overview:
      'Punjab is the spiritual and historical homeland of Sikhism, bathed in the divine words of the Guru Granth Sahib and the ethos of equality and langar. Amritsar’s Golden Temple (Sri Harmandir Sahib) is the spiritual fountainhead of the faith, alongside the historic Takhts at Anandpur Sahib and Talwandi Sabo, and ancient Sufi shrines like Rauza Sharif in Sirhind.',
    heroImage: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Sikh', 'Hindu', 'Muslim'],
    topSpiritualTowns: [
      {
        name: 'Amritsar',
        description: 'The Golden City housing Sri Harmandir Sahib, Akal Takht, Durgiana Temple, and Ram Tirth Ashram.',
        keyPlaces: ['golden-temple-amritsar', 'akal-takht-amritsar', 'durgiana-temple-amritsar'],
      },
      {
        name: 'Anandpur Sahib',
        description: 'The City of Bliss where the Khalsa Panth was founded by Guru Gobind Singh Ji in 1699, home to Takht Sri Keshgarh Sahib.',
        keyPlaces: ['takht-sri-keshgarh-sahib', 'virasat-e-khalsa'],
      },
      {
        name: 'Fatehgarh Sahib & Sirhind',
        description: 'Sacred Gurudwaras commemorating the supreme sacrifice of the Sahibzadas, alongside historic Rauza Sharif.',
        keyPlaces: ['gurudwara-fatehgarh-sahib'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: 'The Sacred Panj Takht Yatra (Punjab Leg)',
        description: 'Covers Akal Takht (Amritsar), Takht Sri Keshgarh Sahib (Anandpur Sahib), and Takht Sri Damdama Sahib (Bathinda).',
        destinations: ['Akal Takht', 'Keshgarh Sahib', 'Damdama Sahib'],
        idealDays: '3 to 4 Days',
      },
      {
        name: 'Amritsar Deep Heritage Immersion',
        description: 'Golden Temple darshan, Amrit Sarovar parikrama, 24/7 Guru Ram Das Langar, Durgiana Mandir, and Ram Tirth.',
        destinations: ['Harmandir Sahib', 'Durgiana Temple', 'Gurudwara Baba Deep Singh'],
        idealDays: '2 Days',
      },
    ],
    keyFestivals: [
      { name: 'Hola Mohalla (Anandpur Sahib)', period: 'March (Following Holi)', significance: 'Grand martial arts exhibitions (Gatka), horse riding, and devotional kirtans.' },
      { name: 'Baisakhi (Amritsar & Anandpur)', period: 'April 13 / 14', significance: 'Celebrates the founding of the Khalsa and the spring harvest with joyous devotion.' },
      { name: 'Gurpurab / Prakash Utsavs', period: 'Throughout Year', significance: 'Illumination of the Golden Temple with fireworks and special Jalau exhibitions.' },
    ],
    travelAdvisory:
      'Visitors to all Gurudwaras must cover their heads and remove shoes. Head scarves are available free of charge at entrances. All visitors are welcome to dine in the Langar hall regardless of faith, background, or nationality.',
    suggestedStateDuration: '3 to 5 Days',
  },

  maharashtra: {
    stateSlug: 'maharashtra',
    stateName: 'Maharashtra',
    tagline: 'Jyotirlingas, Saint-Poets, Shirdi Sai Baba & Rock-Cut Cave Sanctuaries',
    overview:
      'Maharashtra’s spiritual tapestry blends five revered Jyotirlinga temples (Trimbakeshwar, Bhimashankar, Grishneshwar, Aundha Nagnath, Parli Vaijnath), the global pilgrimage town of Shirdi, the Bhakti tradition of Lord Vitthal in Pandharpur, Takht Sachkhand Sri Hazur Sahib in Nanded, the sea-girt Haji Ali Dargah in Mumbai, Mount Mary Church in Bandra, and UNESCO-listed Buddhist rock-cut caves at Ajanta, Ellora, and Kanheri.',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Hindu', 'Buddhist', 'Jain', 'Sikh', 'Muslim', 'Christian', 'Zoroastrian', 'Jewish'],
    topSpiritualTowns: [
      {
        name: 'Shirdi',
        description: 'World-famous pilgrimage town centered upon the Samadhi Mandir, Dwarkamai, and Chavadi of revered saint Sai Baba.',
        keyPlaces: ['shirdi-sai-baba-samadhi-mandir', 'dwarkamai-shirdi'],
      },
      {
        name: 'Nashik & Trimbak',
        description: 'Ancient holy city on the Godavari River, venue of the Kumbh Mela, Panchavati (Ramayana site), and Trimbakeshwar Jyotirlinga.',
        keyPlaces: ['trimbakeshwar-jyotirlinga', 'panchavati-nashik', 'kalaram-mandir-nashik'],
      },
      {
        name: 'Pandharpur',
        description: 'The devotional heart of the Varkari tradition, home to the ancient Vithoba (Vitthal-Rukmini) Temple on the Bhima River.',
        keyPlaces: ['vithoba-temple-pandharpur'],
      },
      {
        name: 'Mumbai Spiritual Quarters',
        description: 'Home to Siddhivinayak Temple, Mahalaxmi Temple, Haji Ali Dargah, Mount Mary Basilica, Keneseth Eliyahoo Synagogue, and Wadiaji Atash Behram.',
        keyPlaces: ['siddhivinayak-temple-mumbai', 'haji-ali-dargah-mumbai', 'mount-mary-church-bandra'],
      },
      {
        name: 'Nanded',
        description: 'Location of Takht Sachkhand Sri Hazur Abchalnagar Sahib where Guru Gobind Singh Ji spent his final days.',
        keyPlaces: ['takht-hazur-sahib-nanded'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: '5 Jyotirlingas of Maharashtra Circuit',
        description: 'Trimbakeshwar, Bhimashankar, Grishneshwar, Aundha Nagnath, and Parli Vaijnath.',
        destinations: ['Trimbakeshwar', 'Bhimashankar', 'Grishneshwar', 'Aundha Nagnath', 'Parli Vaijnath'],
        idealDays: '5 to 6 Days',
      },
      {
        name: 'Ashtavinayak Yatra',
        description: 'Eight sacred Ganesha temples situated around Pune and Raigad districts.',
        destinations: ['Mayureshwar', 'Siddhivinayak', 'Ballaleshwar', 'Varadavinayak', 'Chintamani', 'Girijatmaj', 'Vighnahar', 'Mahaganapati'],
        idealDays: '2 to 3 Days',
      },
    ],
    keyFestivals: [
      { name: 'Ganesh Chaturthi (Mumbai & Pune)', period: 'Bhadrapada (Aug/Sept)', significance: 'Grand public festival with magnificent clay idols, aartis, and ocean immersions.' },
      { name: 'Pandharpur Wari (Palkhi Procession)', period: 'Ashadha (June/July)', significance: 'Millions of Varkari pilgrims walk barefoot for hundreds of kilometers singing abhangas.' },
      { name: 'Mount Mary Bandra Fair', period: 'September (Sunday following Sept 8)', significance: 'Historic century-old feast celebrating the Nativity of the Blessed Virgin Mary.' },
    ],
    travelAdvisory:
      'Shirdi and major Jyotirlingas offer online VIP darshan and pass systems through their respective temple trust portals. Plan travel well in advance during Shravan month and festive weeks.',
    suggestedStateDuration: '5 to 8 Days',
  },

  'tamil-nadu': {
    stateSlug: 'tamil-nadu',
    stateName: 'Tamil Nadu',
    tagline: 'Land of Majestic Gopurams, Great Living Chola Temples & Ancient Coastal Shrines',
    overview:
      'Tamil Nadu is the crowning jewel of Dravidian temple architecture. Its landscape is defined by towering polychrome gopurams, thousand-pillared mandapams, and living devotional traditions continuing unbroken for over two millennia. Highlights include the UNESCO-listed Great Living Chola Temples, Meenakshi Amman in Madurai, Ramanathaswamy in Rameswaram, Ranganathaswamy in Srirangam, and holy coastal shrines like Vailankanni and San Thome Basilica.',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Hindu', 'Christian', 'Muslim', 'Jain'],
    topSpiritualTowns: [
      {
        name: 'Madurai',
        description: 'The Athens of the East, structured in concentric lotus squares around the legendary Meenakshi Sundareswarar Temple.',
        keyPlaces: ['meenakshi-amman-temple-madurai', 'koodal-azhagar-temple'],
      },
      {
        name: 'Rameswaram',
        description: 'One of the four all-India Char Dhams and a Jyotirlinga, featuring the world’s longest pillared temple corridors and 22 sacred theerthams.',
        keyPlaces: ['ramanathaswamy-temple-rameswaram', 'dhanushkodi-sangam'],
      },
      {
        name: 'Thanjavur & Kumbakonam',
        description: 'Imperial Chola heartland: Brihadeeswarar Temple (Big Temple) and temple-dense Kumbakonam (Navagraha temples).',
        keyPlaces: ['brihadeeswarar-temple-thanjavur', 'airavatesvara-temple-darasuram'],
      },
      {
        name: 'Tiruvannamalai',
        description: 'Sacred Arunachala Hill (Agni Tattvam), Annamalaiyar Temple, and the world-renowned Sri Ramana Maharshi Ashram.',
        keyPlaces: ['annamalaiyar-temple-tiruvannamalai', 'sri-ramana-ashram-tiruvannamalai'],
      },
      {
        name: 'Vailankanni & Nagore',
        description: 'Renowned coastal pilgrimage sites: Basilica of Our Lady of Good Health and Nagore Dargah of Saint Shahul Hamid.',
        keyPlaces: ['basilica-of-our-lady-of-good-health-vailankanni', 'nagore-dargah'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: 'Great Living Chola & Dravidian Marvels',
        description: 'Madurai -> Thanjavur -> Srirangam -> Chidambaram -> Kanchipuram.',
        destinations: ['Meenakshi Amman', 'Brihadeeswarar', 'Ranganathaswamy', 'Nataraja Chidambaram', 'Ekambareswarar'],
        idealDays: '5 to 7 Days',
      },
      {
        name: 'Southern Char Dham & Theertham Trail',
        description: 'Madurai -> Rameswaram -> Dhanushkodi -> Kanyakumari.',
        destinations: ['Ramanathaswamy', 'Kanyakumari Amman', 'Vivekananda Rock'],
        idealDays: '4 to 5 Days',
      },
      {
        name: 'Navagraha (Nine Planets) Circuit',
        description: 'Nine ancient Chola temples dedicated to the planetary deities clustered around Kumbakonam.',
        destinations: ['Suryanar', 'Thingalur', 'Vaitheeswaran Koil', 'Thirunageswaram', 'Alangudi', 'Kanchanur', 'Thirunallar', 'Thiruvenkadu', 'Keezhperumpallam'],
        idealDays: '2 to 3 Days',
      },
    ],
    keyFestivals: [
      { name: 'Chithirai Festival (Madurai)', period: 'Chithirai (April/May)', significance: 'Re-enactment of the celestial wedding of Goddess Meenakshi and Lord Sundareswarar.' },
      { name: 'Karthigai Deepam (Tiruvannamalai)', period: 'Karthigai (Nov/Dec)', significance: 'A colossal flame lit atop Arunachala holy mountain visible for miles.' },
      { name: 'Vailankanni Annual Feast', period: 'August 29 – September 8', significance: 'Millions of pilgrims attend flag hoisting and litany processions.' },
      { name: 'Mahamaham (Kumbakonam)', period: 'Every 12 Years', significance: 'Sacred festival tank immersion equivalent to South India’s Kumbh Mela.' },
    ],
    travelAdvisory:
      'Strict traditional dress code applies in most Tamil Nadu Hindu temples (Dhoti/Kurta for men, Saree/Salwar for women; jeans and shorts prohibited inside sanctums). Mobile phones are banned inside several major sanctums like Madurai and Tiruvannamalai.',
    suggestedStateDuration: '6 to 10 Days',
  },

  kerala: {
    stateSlug: 'kerala',
    stateName: 'Kerala',
    tagline: 'God’s Own Country, Ancient Wooden Temple Sanctuaries & Syrian Christian Shrines',
    overview:
      'Kerala’s spiritual heritage is shaped by tropical backwaters, lush western ghats, and distinct sloped wooden gabled architecture. The state cradles ancient St. Thomas Christian churches tracing back to 52 CE, the historic Sabarimala Ayyappa hill shrine, Guruvayur Sri Krishna Temple, Padmanabhaswamy Temple in Thiruvananthapuram, Cheraman Juma Mosque (India’s oldest mosque), and the 1568 Paradesi Synagogue in Kochi.',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Hindu', 'Christian', 'Muslim', 'Jewish', 'Jain'],
    topSpiritualTowns: [
      {
        name: 'Thiruvananthapuram',
        description: 'Home to the magnificent Sree Padmanabhaswamy Temple, showcasing an architectural blend of Kerala and Dravidian stone artistry.',
        keyPlaces: ['padmanabhaswamy-temple-trivandrum', 'attukal-bhagavathy-temple'],
      },
      {
        name: 'Guruvayur & Thrissur',
        description: 'Revered as Bhuloka Vaikunta (Earthly Abode of Vishnu) and Thrissur Vadakkunnathan Temple, venue of the world-famous Thrissur Pooram.',
        keyPlaces: ['guruvayur-sri-krishna-temple', 'vadakkunnathan-temple-thrissur'],
      },
      {
        name: 'Sabarimala (Periyar Tiger Reserve)',
        description: 'World-renowned forest hill shrine of Lord Ayyappa, known for the 41-day Mandala Vrutham austerity pilgrimage.',
        keyPlaces: ['sabarimala-ayyappa-temple'],
      },
      {
        name: 'Kochi & Mattancherry',
        description: 'Multi-faith coastal heritage featuring St. Francis Church, Santa Cruz Basilica, Paradesi Synagogue, and ancient Jain temples.',
        keyPlaces: ['st-francis-church-kochi', 'paradesi-synagogue-kochi', 'santa-cruz-cathedral-basilica-kochi'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: 'Kerala Temple & Backwater Pilgrimage',
        description: 'Padmanabhaswamy -> Attukal -> Sabarimala -> Guruvayur -> Thrissur.',
        destinations: ['Padmanabhaswamy', 'Sabarimala', 'Guruvayur', 'Vadakkunnathan'],
        idealDays: '5 to 6 Days',
      },
      {
        name: 'St. Thomas Apostolic & Colonial Church Trail',
        description: 'Tracing 1st-century Christian roots and colonial basilicas across Kodungallur, Malayattoor, Kochi, and Kottayam.',
        destinations: ['Malayattoor Kurisumudy', 'St. Francis Church', 'Santa Cruz Basilica', 'Pala & Kottayam Churches'],
        idealDays: '3 to 4 Days',
      },
    ],
    keyFestivals: [
      { name: 'Thrissur Pooram', period: 'Meda (April/May)', significance: 'Spectacular kudamattom (umbrella exchange) pageant, Panchavadyam drumming, and temple elephants.' },
      { name: 'Attukal Pongala (Thiruvananthapuram)', period: 'Kumbham (Feb/March)', significance: 'Guinness World Record for the largest annual gathering of women cooking sweet rice offerings.' },
      { name: 'Makaravilakku (Sabarimala)', period: 'January 14 (Makara Sankranti)', significance: 'Sacred procession of Thiruvabharanam (sacred jewels) and sighting of the celestial flame.' },
      { name: 'Maramon Convention', period: 'February', significance: 'One of Asia’s largest Christian gatherings on the Pamba river sandbanks.' },
    ],
    travelAdvisory:
      'Traditional dress code is mandatory at Kerala Hindu temples (men must wear mundu and remain bare-chested; women must wear sarees or traditional set mundu/salwar). Check seasonal Sabarimala online booking queue passes (Virtual Q) before traveling.',
    suggestedStateDuration: '5 to 7 Days',
  },

  bihar: {
    stateSlug: 'bihar',
    stateName: 'Bihar',
    tagline: 'Cradle of Buddhism & Jainism, Mahabodhi Tree & Takht Sri Patna Sahib',
    overview:
      'Bihar derives its name from "Vihara" (monastery). It is the sacred soil where Prince Siddhartha attained supreme Enlightenment under the Bodhi Tree in Bodh Gaya, where Lord Mahavira was born (Vaishali) and attained Nirvana (Pavapuri), and where Guru Gobind Singh Ji, the 10th Sikh Guru, was born (Takht Sri Patna Sahib). It also preserves ancient international monastic universities like Nalanda and Vikramshila.',
    heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Buddhist', 'Jain', 'Sikh', 'Hindu', 'Muslim'],
    topSpiritualTowns: [
      {
        name: 'Bodh Gaya',
        description: 'The holiest site in Buddhism, home to the UNESCO World Heritage Mahabodhi Temple Complex, the sacred Bodhi Tree, and Vajrasana.',
        keyPlaces: ['mahabodhi-temple-bodhgaya', 'great-buddha-statue-bodhgaya'],
      },
      {
        name: 'Rajgir & Nalanda',
        description: 'Vulture Peak (Gridhrakuta) where Buddha delivered pivotal Mahayana sutras, ancient hot springs, and the ruins of Nalanda Mahavihara.',
        keyPlaces: ['vishwa-shanti-stupa-rajgir', 'nalanda-mahavihara-ruins'],
      },
      {
        name: 'Pavapuri & Vaishali',
        description: 'Sacred Jain pilgrimage: Jal Mandir in Pavapuri where Lord Mahavira attained Nirvana; Vaishali (birthplace of Mahavira and site of Buddha’s Last Sermon).',
        keyPlaces: ['jal-mandir-pavapuri', 'ashokan-pillar-vaishali'],
      },
      {
        name: 'Patna (Pataliputra)',
        description: 'Takht Sri Patna Sahib, the birthplace of the tenth Sikh Guru, Guru Gobind Singh Ji, and historic Patan Devi temple.',
        keyPlaces: ['takht-sri-patna-sahib', 'patan-devi-mandir'],
      },
      {
        name: 'Gaya',
        description: 'Ancient Hindu pilgrimage site on the Falgu River famous for the Vishnupad Temple and Pinda Daan ancestral rites.',
        keyPlaces: ['vishnupad-temple-gaya', 'mangla-gauri-temple-gaya'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: 'Enlightened Buddhist Sacred Circuit',
        description: 'Bodh Gaya -> Rajgir -> Nalanda -> Vaishali -> Kesariya Stupa.',
        destinations: ['Mahabodhi Temple', 'Gridhrakuta Peak', 'Nalanda', 'Vaishali', 'Kesariya'],
        idealDays: '4 to 5 Days',
      },
      {
        name: 'Jain Tirthankar Sacred Trail',
        description: 'Champapuri -> Mandar Hill -> Gunawan -> Pavapuri -> Kundalpur (Nalanda).',
        destinations: ['Pavapuri Jal Mandir', 'Kundalpur', 'Champapuri'],
        idealDays: '3 to 4 Days',
      },
    ],
    keyFestivals: [
      { name: 'Buddha Jayanti / Bodh Gaya Mahotsav', period: 'Vaisakha Purnima (May)', significance: 'Worldwide gathering of Buddhist monks, chantings, and peace prayers.' },
      { name: 'Chhath Puja (All Bihar Ghats)', period: 'Kartik (Oct/Nov)', significance: 'Ancient, deeply austere Vedic solar thanksgiving festival on riverbanks.' },
      { name: 'Prakash Parv of Guru Gobind Singh Ji', period: 'December / January', significance: 'Splendid Nagar Kirtans and langars at Takht Sri Patna Sahib.' },
      { name: 'Pitru Paksha Mela (Gaya)', period: 'Bhadrapada (Sept/Oct)', significance: 'Lakhs of pilgrims perform Pinda Daan rites for ancestors at Vishnupad Temple.' },
    ],
    travelAdvisory:
      'Bodh Gaya has direct air connectivity (Gaya Airport) and is 2 hours by road from Patna. Monasteries of various international nations (Japan, Thailand, Bhutan, Tibet, Sri Lanka, Myanmar) offer tranquil meditation spaces.',
    suggestedStateDuration: '4 to 6 Days',
  },

  odisha: {
    stateSlug: 'odisha',
    stateName: 'Odisha',
    tagline: 'Abode of Lord Jagannath, Kalinga Temple Architecture & Ancient Buddhist Diamond Triangle',
    overview:
      'Odisha’s spiritual tradition is anchored by Puri, one of the four cardinal Char Dhams of India and home to the sacred 12th-century Jagannath Temple. Along the Golden Triangle of Odisha, explore the 1,000-year-old Lingaraj Temple in Bhubaneswar (City of Temples), the Sun Temple at Konark, and the ancient Buddhist Diamond Triangle of Ratnagiri, Lalitgiri, and Udayagiri.',
    heroImage: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Hindu', 'Buddhist', 'Jain'],
    topSpiritualTowns: [
      {
        name: 'Puri',
        description: 'One of the four Char Dhams of India, home to the monumental Jagannath Temple, Mahaprasad culinary tradition, and the sacred Golden Beach.',
        keyPlaces: ['jagannath-temple-puri', 'gundicha-temple-puri'],
      },
      {
        name: 'Bhubaneswar',
        description: 'Known as the Temple City of India, featuring over 500 preserved Kalinga-style stone temples including Lingaraj, Mukteshwar, and Rajarani.',
        keyPlaces: ['lingaraj-temple-bhubaneswar', 'mukteshwar-temple-bhubaneswar', 'rajarani-temple-bhubaneswar'],
      },
      {
        name: 'Konark',
        description: 'Home to the UNESCO World Heritage Sun Temple, sculpted as a colossal 24-wheeled chariot of Surya with erotic and cosmic carvings.',
        keyPlaces: ['konark-sun-temple', 'chandrabhaga-beach'],
      },
      {
        name: 'Diamond Triangle (Jajpur)',
        description: 'Ratnagiri, Lalitgiri, and Udayagiri: prominent Vajrayana and Mahayana Buddhist monastic universities with intact stupas and sculptured portals.',
        keyPlaces: ['ratnagiri-buddhist-complex', 'lalitgiri-monastery'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: 'Odisha Golden Triangle Pilgrimage',
        description: 'Bhubaneswar (Temples) -> Puri (Char Dham & Jagannath) -> Konark (Sun Temple).',
        destinations: ['Lingaraj', 'Mukteshwar', 'Jagannath Puri', 'Konark Sun Temple'],
        idealDays: '3 to 4 Days',
      },
      {
        name: 'Buddhist Diamond Triangle Circuit',
        description: 'Lalitgiri, Ratnagiri, and Udayagiri monastic heritage.',
        destinations: ['Ratnagiri', 'Lalitgiri', 'Udayagiri'],
        idealDays: '2 Days',
      },
    ],
    keyFestivals: [
      { name: 'Puri Rath Yatra (Car Festival)', period: 'Ashadha (June/July)', significance: 'Lord Jagannath, Balabhadra, and Subhadra emerge on gigantic wooden chariots pulled by millions.' },
      { name: 'Konark Dance Festival', period: 'December 1–5', significance: 'Classical Indian dance recitals against the backdrop of the illuminated Sun Temple.' },
      { name: 'Maha Shivratri (Lingaraj Temple)', period: 'Phalguna (Feb/March)', significance: 'Night-long vigil culminating in the lifting of the Mahadipa lamp atop the 55-meter spire.' },
    ],
    travelAdvisory:
      'Entry inside the inner sanctum of Puri Jagannath Temple is traditionally reserved for followers of Sanatana Dharma. Visitors of all backgrounds can view the magnificent temple exterior from the Raghunandan Library roof, visit the Ananda Bazar (Mahaprasad dining), and attend the grand Rath Yatra.',
    suggestedStateDuration: '4 to 6 Days',
  },

  gujarat: {
    stateSlug: 'gujarat',
    stateName: 'Gujarat',
    tagline: 'Somnath First Jyotirlinga, Dwarka Char Dham, Palitana Jain Mountain & Udvada Zoroastrian Fire',
    overview:
      'Gujarat boasts an extraordinary inter-faith heritage: from the coastal Jyotirlinga of Somnath and Lord Krishna’s western kingdom of Dwarka (Char Dham) to the world’s greatest Svetambara Jain mountain temple-city of Palitana on Shatrunjaya Hill, the sacred Iranshah Zoroastrian Fire Temple at Udvada, and the historic Jama Masjid and Sarkhej Roza of Ahmedabad.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Hindu', 'Jain', 'Zoroastrian', 'Muslim', 'Sikh'],
    topSpiritualTowns: [
      {
        name: 'Dwarka & Bet Dwarka',
        description: 'Ancient kingdom of Lord Krishna, one of the four all-India Char Dhams and home to the Dwarkadhish (Jagat Mandir) Temple and Nageshwar Jyotirlinga.',
        keyPlaces: ['dwarkadhish-temple-dwarka', 'nageshwar-jyotirlinga', 'bet-dwarka'],
      },
      {
        name: 'Somnath & Prabhas Patan',
        description: 'The first of the 12 Jyotirlinga shrines of Lord Shiva situated on the dramatic Arabian Sea shore.',
        keyPlaces: ['somnath-temple', 'triveni-sangam-somnath', 'bhalka-tirth'],
      },
      {
        name: 'Palitana & Shatrunjaya Hill',
        description: 'The holiest Svetambara Jain pilgrimage featuring over 860 white marble temples perched atop the sacred Shatrunjaya hill.',
        keyPlaces: ['palitana-jain-temples', 'adishwar-temple-palitana'],
      },
      {
        name: 'Udvada & Sanjan',
        description: 'The cultural and religious heart of India’s Parsi community, home to the sacred Iranshah Atash Behram and Parsi Heritage Museum.',
        keyPlaces: ['udvada-atash-behram', 'sanjan-stambh'],
      },
      {
        name: 'Ahmedabad Heritage Quarter',
        description: 'UNESCO World Heritage city featuring the Hutheesing Jain Temple, Jama Masjid, Sidi Saiyyed Mosque, and Gandhi’s Sabarmati Ashram.',
        keyPlaces: ['hutheesing-jain-temple-ahmedabad', 'sidi-saiyyed-mosque-ahmedabad'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: 'Saurashtra Sacred Circuit',
        description: 'Dwarka -> Bet Dwarka -> Nageshwar -> Porbandar -> Somnath -> Girnar.',
        destinations: ['Dwarkadhish', 'Nageshwar', 'Somnath', 'Girnar Jain Temples'],
        idealDays: '4 to 6 Days',
      },
      {
        name: 'Jain Maha Tirtha Yatra',
        description: 'Palitana (Shatrunjaya) -> Girnar -> Taranga -> Shankheshwar -> Kumbhariya.',
        destinations: ['Palitana', 'Girnar', 'Taranga', 'Shankheshwar'],
        idealDays: '4 to 5 Days',
      },
    ],
    keyFestivals: [
      { name: 'Navratri Garba (Statewide)', period: 'Ashwin (Sept/Oct)', significance: 'World’s longest continuous dance festival celebrating Goddess Shakti with vibrant Garba and Dandiya.' },
      { name: 'Janmashtami (Dwarka)', period: 'Bhadrapada (August)', significance: 'Spectacular midnight aartis, temple illuminations, and devotional celebrations at Dwarkadhish.' },
      { name: 'Kartik Purnima Fair (Somnath & Palitana)', period: 'Kartik (November)', significance: 'Traditional pilgrimage fair and commencement of the winter parikramas.' },
    ],
    travelAdvisory:
      'Palitana climb involves ascending approximately 3,500 stone steps; doli (palanquin) services are available for elderly pilgrims. Climbs should begin early in the morning before noon heat. No food or leather is permitted on the sacred hill.',
    suggestedStateDuration: '5 to 7 Days',
  },

  'madhya-pradesh': {
    stateSlug: 'madhya-pradesh',
    stateName: 'Madhya Pradesh',
    tagline: 'Heart of India, Two Jyotirlingas, Great Stupa at Sanchi & Holy Narmada River',
    overview:
      'Madhya Pradesh boasts two revered Jyotirlingas—Mahakaleshwar in Ujjain (famed for its Bhasma Aarti) and Omkareshwar on the island of Mandhata in the sacred Narmada River. It also holds the UNESCO World Heritage Buddhist Great Stupa at Sanchi (dating back to Emperor Ashoka), the temple sculptures of Khajuraho, the historic Jain hill shrines of Sonagiri, and the tranquil river ghats of Maheshwar and Amarkantak.',
    heroImage: 'https://images.unsplash.com/photo-1600100397608-f010e421d017?auto=format&fit=crop&w=1200&q=80',
    prominentTraditions: ['Hindu', 'Buddhist', 'Jain', 'Muslim'],
    topSpiritualTowns: [
      {
        name: 'Ujjain (Avantika)',
        description: 'One of the seven sacred Moksha puris and Kumbh Mela host city on the Shipra River; home to Mahakaleshwar Jyotirlinga and Kal Bhairav Temple.',
        keyPlaces: ['mahakaleshwar-temple-ujjain', 'kal-bhairav-temple-ujjain', 'ram-ghat-ujjain'],
      },
      {
        name: 'Omkareshwar & Maheshwar',
        description: 'Sacred island in the Narmada shaped like the Om symbol, home to Omkareshwar & Mamleshwar Jyotirlingas, alongside Ahilya Fort ghats.',
        keyPlaces: ['omkareshwar-jyotirlinga', 'maheshwar-narmada-ghats'],
      },
      {
        name: 'Sanchi',
        description: 'UNESCO World Heritage Site housing the Great Stupa commissioned by Emperor Ashoka in the 3rd century BCE, with ornate Torana gateways.',
        keyPlaces: ['sanchi-stupa-complex'],
      },
      {
        name: 'Khajuraho',
        description: 'UNESCO World Heritage complex of Hindu and Jain temples dating from 950–1050 CE, renowned for Nagara architecture and expressive stone sculptures.',
        keyPlaces: ['kandariya-mahadeva-khajuraho', 'parshvanatha-jain-temple-khajuraho'],
      },
      {
        name: 'Sonagiri & Kundalpur',
        description: 'Sacred Digambara Jain pilgrimage sites with clusters of white spire temples dotting hillsides.',
        keyPlaces: ['sonagiri-jain-temples', 'kundalpur-bade-baba-temple'],
      },
    ],
    majorPilgrimageCircuits: [
      {
        name: 'Twin Jyotirlinga & Narmada Corridor',
        description: 'Indore -> Ujjain (Mahakaleshwar) -> Omkareshwar -> Maheshwar.',
        destinations: ['Mahakaleshwar', 'Omkareshwar', 'Maheshwar Ghats'],
        idealDays: '3 to 4 Days',
      },
      {
        name: 'Heritage, Stupas & Temples Circuit',
        description: 'Bhopal -> Sanchi -> Khajuraho -> Orchha.',
        destinations: ['Sanchi Stupa', 'Khajuraho Temples', 'Chaturbhuj Temple Orchha'],
        idealDays: '4 to 5 Days',
      },
    ],
    keyFestivals: [
      { name: 'Simhastha Kumbh Mela (Ujjain)', period: 'Every 12 Years (Next: 2028)', significance: 'Massive holy gathering and ritual bathing in the sacred Shipra River.' },
      { name: 'Mahashivratri (Ujjain & Omkareshwar)', period: 'Phalguna (Feb/March)', significance: 'Spectacular floral decorations, continuous chants, and special Bhasma aartis.' },
      { name: 'Khajuraho Dance Festival', period: 'February', significance: 'Classical dance week against the illuminated Western Group of Temples.' },
    ],
    travelAdvisory:
      'For Mahakaleshwar Bhasma Aarti (held at 4:00 AM), advance online registration via the official Shri Mahakaleshwar Temple Management Committee portal is mandatory.',
    suggestedStateDuration: '4 to 6 Days',
  },
};

export const SPIRITUAL_STATES: SpiritualStateInfo[] = Object.values(SPIRITUAL_STATES_DATA);

export const getSpiritualStateBySlug = (slug: string): SpiritualStateInfo | undefined => {
  return SPIRITUAL_STATES_DATA[slug] || SPIRITUAL_STATES.find((s) => s.stateSlug === slug);
};

