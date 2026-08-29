import { TraditionOverview } from '../../types/spiritual.types';

export const SPIRITUAL_TRADITIONS: TraditionOverview[] = [
  {
    tradition: 'Hindu',
    title: 'Sanatana Dharma & Hindu Heritage',
    overview:
      'Spanning millennia of documented philosophy, temple architecture, and sacred riverbanks, Hindu heritage across India encompasses ancient pilgrimage routes (Tirthas), cosmic mandir architectures, Jyotirlingas, Shaktipeeths, and monastic orders established by Adi Shankaracharya and devotional saint-poets.',
    coreHeritagePoints: [
      'Char Dham circuits in four geographical corners of India (Badrinath, Dwarka, Puri, Rameswaram)',
      '12 Jyotirlinga shrines representing sacred manifestations of Lord Shiva',
      '51 Shaktipeethas across the subcontinent celebrating divine feminine energy',
      'Sacred river confluences (Sangams) and historic ghats of the Ganga, Yamuna, Godavari, and Kaveri',
    ],
    architecturalHallmarks: [
      'Nagara style in North India (curvilinear shikhara, sanctum garbhagriha)',
      'Dravidian style in South India (pyramidal vimanam, monumental towering gopurams, pillared mandapams)',
      'Vesara and Kalinga styles blending geometric symmetry, intricate stone friezes, and stepped roofs',
    ],
    keySitesInIndia: [
      'Kashi Vishwanath (Varanasi)',
      'Tirupati Balaji (Tirumala)',
      'Meenakshi Amman (Madurai)',
      'Jagannath Temple (Puri)',
      'Badrinath & Kedarnath (Uttarakhand)',
      'Somnath & Dwarka (Gujarat)',
      'Mahakaleshwar (Ujjain)',
    ],
    etiquetteTips: [
      'Remove footwear at designated shoe stands before entering sanctum areas.',
      'Wear modest attire covering shoulders and knees; specific shrines may require traditional dhotis or sarees for sanctum entry.',
      'Photography is strictly prohibited inside inner sanctums (garbhagrihas) of most active temples.',
      'Always circumambulate (pradakshina) in a clockwise direction.',
    ],
    colorTheme: {
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
      badgeText: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800/60',
      gradient: 'from-amber-600 to-orange-600',
    },
  },
  {
    tradition: 'Buddhist',
    title: 'Buddhist Heritage & Sacred Trails',
    overview:
      'India is the birthplace of Buddhism, where Siddhartha Gautama attained enlightenment, delivered his first discourse, established the Sangha, and attained Mahaparinirvana. Ancient stupas, cave monasteries, and international monastic complexes span the Gangetic plains and Himalayan valleys.',
    coreHeritagePoints: [
      'The Four Primary Sacred Pilgrimage Sites: Lumbini (birthplace across Indo-Nepal border), Bodh Gaya (Enlightenment), Sarnath (First Discourse), and Kushinagar (Mahaparinirvana)',
      'Ancient monastic universities such as Nalanda, Vikramshila, and Odantapuri',
      'Trans-Himalayan Tibetan Buddhist gompas preserving living Vajrayana traditions in Ladakh, Spiti, Sikkim, and Arunachal Pradesh',
    ],
    architecturalHallmarks: [
      'Hemispherical Stupas with toranas (ornate gateways) and pradakshina pathas (e.g. Sanchi, Dhamek)',
      'Rock-cut Chaitya halls (prayer halls) and Viharas (monasteries) with vaulted ceilings (e.g. Ajanta, Ellora, Karle)',
      'Himalayan Gompa fortresses adorned with thangkas, prayer wheels, and intricate timber frescoes',
    ],
    keySitesInIndia: [
      'Mahabodhi Temple Complex (Bodh Gaya, Bihar)',
      'Dhamek Stupa & Deer Park (Sarnath, Uttar Pradesh)',
      'Mahaparinirvana Temple (Kushinagar, Uttar Pradesh)',
      'Great Stupa at Sanchi (Madhya Pradesh)',
      'Hemis & Thiksey Monasteries (Ladakh)',
      'Namdroling Monastery (Bylakuppe, Karnataka)',
      'Tawang Monastery (Arunachal Pradesh)',
    ],
    etiquetteTips: [
      'Circumambulate stupas, chortens, and shrines clockwise (keeping the monument on your right).',
      'Turn prayer wheels in a clockwise direction only.',
      'Remove hats and shoes when entering monastery prayer halls (Dukhang).',
      'Maintain quiet mindfulness and do not touch religious thangkas or sacred statues.',
    ],
    colorTheme: {
      badgeBg: 'bg-yellow-50 dark:bg-yellow-950/40',
      badgeText: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800/60',
      gradient: 'from-yellow-600 to-amber-600',
    },
  },
  {
    tradition: 'Jain',
    title: 'Jain Tirthas & Sacred Mountain Shrines',
    overview:
      'Jainism in India represents an ancient spiritual lineage centered upon Ahimsa (non-violence), Anekantavada (multiplicity of viewpoints), and Aparigraha (non-attachment). Its sacred pilgrimage sites (Tirthas) are renowned for pristine white marble architecture, mountain-top temple cities, and monumental monolithic statues.',
    coreHeritagePoints: [
      'Siddha Kshetras: Mountain peaks where Tirthankaras attained Nirvana (e.g. Shikharji, Girnar, Pavapuri)',
      'Atishaya Kshetras: Sites noted for historical or architectural miracles and spiritual energy (e.g. Shravanabelagola, Ranakpur, Dilwara)',
      'Both Digambara and Svetambara sacred traditions preserved across Rajasthan, Gujarat, Karnataka, Madhya Pradesh, and Jharkhand',
    ],
    architecturalHallmarks: [
      'Intricately carved translucent Makrana marble with lace-like ceilings and pendants (Dilwara, Ranakpur)',
      'Mountain temple-cities clustered with hundreds of fortified marble shrines (Shatrunjaya Hill, Palitana)',
      'Monolithic free-standing statues carved directly from granite mountains (Gommateshwara at Shravanabelagola)',
    ],
    keySitesInIndia: [
      'Palitana Temples on Shatrunjaya (Gujarat)',
      'Dilwara Temples (Mount Abu, Rajasthan)',
      'Ranakpur Jain Temple (Pali, Rajasthan)',
      'Shikharji / Parasnath (Jharkhand)',
      'Gommateshwara Monolith (Shravanabelagola, Karnataka)',
      'Pavapuri Jal Mandir (Bihar)',
      'Sonagiri Temples (Madhya Pradesh)',
    ],
    etiquetteTips: [
      'Leather items (belts, wallets, bags, shoes) are strictly forbidden inside Jain temple precincts.',
      'Wear clean, modest attire; white or light-colored garments are preferred.',
      'Do not consume food, snacks, or chew anything within the holy temple complexes.',
      'Photography may require official permission and is often prohibited inside the mool nayak sanctum.',
    ],
    colorTheme: {
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      gradient: 'from-emerald-600 to-teal-600',
    },
  },
  {
    tradition: 'Sikh',
    title: 'Sikh Heritage, Takhts & Gurudwaras',
    overview:
      'Sikhism, founded by Guru Nanak Dev Ji in the 15th century and consolidated by the ten Sikh Gurus, emphasizes the oneness of the Divine (Ik Onkar), equality of all human beings, selfless community service (Seva), and the universal free community kitchen (Langar). Historic Gurudwaras commemorate events in the lives of the Gurus.',
    coreHeritagePoints: [
      'The Five Takhts (Seats of Temporal Authority): Akal Takht (Amritsar), Takht Sri Damdama Sahib (Talwandi Sabo), Takht Sri Keshgarh Sahib (Anandpur Sahib), Takht Sri Patna Sahib (Bihar), and Takht Sachkhand Sri Hazur Sahib (Nanded, Maharashtra)',
      'Open-door policy welcoming people of all faiths, castes, and backgrounds without distinction',
      'The sanctum houses the eternal Guru, the Guru Granth Sahib, with continuous recitation of Gurbani Kirtan',
    ],
    architecturalHallmarks: [
      'Gilded domes (gold leafing), fluted cupolas, and white marble structures',
      'Large central holy water reservoirs (Sarovars) for sacred bathing',
      'Four entrances symbolizing openness to all four cardinal directions and all strata of society',
    ],
    keySitesInIndia: [
      'Sri Harmandir Sahib / Golden Temple (Amritsar, Punjab)',
      'Gurudwara Bangla Sahib (New Delhi)',
      'Gurudwara Sis Ganj Sahib (Chandni Chowk, Delhi)',
      'Takht Sri Patna Sahib (Patna, Bihar)',
      'Takht Hazur Sahib (Nanded, Maharashtra)',
      'Gurudwara Hemkund Sahib (Chamoli, Uttarakhand)',
      'Takht Sri Keshgarh Sahib (Anandpur Sahib, Punjab)',
    ],
    etiquetteTips: [
      'Always cover your head with a scarf, rumaal, or turban before entering the Gurudwara complex.',
      'Remove footwear and wash feet at the running water channel at the entrance.',
      'Tobacco, alcohol, and intoxicating substances are strictly prohibited on the entire premises.',
      'Partake respectfully in Langar (the free community meal), seated equally on the floor carpet.',
    ],
    colorTheme: {
      badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
      badgeText: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800/60',
      gradient: 'from-blue-600 to-indigo-600',
    },
  },
  {
    tradition: 'Muslim',
    title: 'Islamic Architecture, Dargahs & Sufi Shrines',
    overview:
      'India’s Islamic heritage spans more than a millennium, reflecting synthesis between indigenous building methods and Islamic architectural aesthetics. Sufi Dargahs across India serve as universal cultural sanctuaries visited by millions of pilgrims of all backgrounds seeking spiritual solace, music (Qawwali), and harmony.',
    coreHeritagePoints: [
      'Major Sufi Chishti, Suhrawardi, Qadiri, and Naqshbandi silsilas (lineages) promoting syncretic devotion and compassion',
      'Grand congregational Friday mosques (Jama Masjids) established across regional sultanates and Mughal capitals',
      'Annual Urs festivals commemorating the union of Sufi saints with the Divine',
    ],
    architecturalHallmarks: [
      'Expansive courtyards (sahn) with central ablution pools (wudu hauz)',
      'Monumental cusped arched gateways (iwans), bulbous or ribbed domes, and towering minarets',
      'Intricate jaali (perforated stone latticework), arabesques, and calligraphic Quranic inscriptions in sandstone and marble',
    ],
    keySitesInIndia: [
      'Ajmer Sharif Dargah of Khwaja Moinuddin Chishti (Rajasthan)',
      'Dargah Hazrat Nizamuddin Aulia (New Delhi)',
      'Jama Masjid (Old Delhi)',
      'Haji Ali Dargah (Mumbai, Maharashtra)',
      'Hazratbal Shrine (Srinagar, Jammu & Kashmir)',
      'Makkah Masjid & Charminar (Hyderabad, Telangana)',
      'Sheikh Salim Chishti Dargah (Fatehpur Sikri, Uttar Pradesh)',
    ],
    etiquetteTips: [
      'Dress modestly; arms and legs must be covered. Head coverings are customary and often required in Dargahs and prayer halls.',
      'Remove footwear before stepping onto carpeted or marble prayer areas.',
      'Non-Muslim visitors should avoid walking directly in front of worshippers performing Namaz (prayers).',
      'Check local timings for prayer hours, when entry for general sightseeing may be paused.',
    ],
    colorTheme: {
      badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
      badgeText: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-800/60',
      gradient: 'from-teal-600 to-emerald-600',
    },
  },
  {
    tradition: 'Christian',
    title: 'Christian Heritage, Cathedrals & Historic Basilicas',
    overview:
      'Christianity has a 2,000-year documented history in India, tracing back to the arrival of St. Thomas the Apostle on the Malabar Coast in 52 CE. From ancient Syrian Christian heritage in Kerala to Portuguese Baroque basilicas in Goa, colonial Gothic cathedrals, and vibrant shrines in Tamil Nadu and the Northeast, Indian Christian heritage is rich and diverse.',
    coreHeritagePoints: [
      'St. Thomas Christian (Nasrani) heritage of Kerala, among the oldest Christian communities in the world',
      'UNESCO-listed churches and convents of Old Goa showcasing Portuguese Baroque, Manueline, and Mannerist architecture',
      'Major pilgrimage shrines dedicated to Our Lady of Good Health (Vailankanni) and Our Lady of the Mount (Bandra)',
    ],
    architecturalHallmarks: [
      'Portuguese Baroque and Manueline façades with laterite stone and white plaster (Goa)',
      'French Neo-Gothic spires and ribbed vaults (Puducherry, Kolkata, Shimla)',
      'Kerala church architecture blending indigenous wooden gabled roofs with bell towers',
    ],
    keySitesInIndia: [
      'Basilica of Bom Jesus (Old Goa)',
      'San Thome Basilica (Chennai, Tamil Nadu)',
      'Basilica of Our Lady of Good Health (Vailankanni, Tamil Nadu)',
      'St. Paul’s Cathedral (Kolkata, West Bengal)',
      'St. Francis Church (Kochi, Kerala)',
      'Mount Mary Church (Bandra, Mumbai)',
      'Medak Cathedral (Telangana)',
    ],
    etiquetteTips: [
      'Maintain reverent silence inside cathedrals and sanctuaries.',
      'Wear respectful attire covering shoulders and knees.',
      'Avoid walking around during active liturgical services or Holy Mass unless participating.',
      'Refrain from flash photography inside church sanctuaries.',
    ],
    colorTheme: {
      badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
      badgeText: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800/60',
      gradient: 'from-rose-600 to-pink-600',
    },
  },
  {
    tradition: 'Zoroastrian',
    title: 'Zoroastrian (Parsi & Irani) Heritage',
    overview:
      'Zoroastrianism is one of the world’s oldest monotheistic faiths. Following migrations from ancient Persia starting in the 8th century CE, the Parsi community found refuge on the shores of Gujarat, contributing profoundly to India’s cultural, philanthropic, and industrial fabric while consecrating sacred Atash Behrams (Fire Temples).',
    coreHeritagePoints: [
      'The sacred Iranshah Fire at Udvada, continuously burning for over 1,280 years since its initial consecration in Sanjan',
      'Eight Atash Behrams in India (four in Mumbai, two in Surat, one in Navsari, one in Udvada)',
      'Deep historical reverence for natural elements—fire (Atash), water (Avan), and earth—symbolizing divine truth (Asha)',
    ],
    architecturalHallmarks: [
      'Distinctive Indo-Persian façades with stylized Faravahar motifs and bull-headed column capitals',
      'Central Afarganyu (sacred urn) chambers where sandalwood embers are perpetually tended by Dasturs (priests)',
      'Heritage Parsi colonies (Baugs) with wide verandas, louvred wooden shutters, and pitched tiled roofs',
    ],
    keySitesInIndia: [
      'Udvada Atash Behram (Valsad District, Gujarat)',
      'Sanjan Stambh Memorial (Sanjan, Gujarat)',
      'Wadiaji & Anjuman Atash Behrams (Mumbai, Maharashtra)',
      'Heritage Agiyaris of Navsari & Surat (Gujarat)',
    ],
    etiquetteTips: [
      'The inner sanctums of consecrated Zoroastrian Fire Temples (Atash Behrams and Agiyaris) are strictly reserved for community members as per historic religious custom.',
      'Visitors of all backgrounds can appreciate the architecture, visit heritage museums in Udvada and Sanjan, and enjoy traditional Parsi hospitality.',
      'Respectful photography from public streets and outer heritage precincts is welcomed; do not attempt unauthorized entry into sanctums.',
    ],
    colorTheme: {
      badgeBg: 'bg-purple-50 dark:bg-purple-950/40',
      badgeText: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800/60',
      gradient: 'from-purple-600 to-indigo-600',
    },
  },
  {
    tradition: 'Bahá\'í',
    title: 'Bahá\'í Faith & Lotus Temple Heritage',
    overview:
      'The Bahá\'í Faith emphasizes the spiritual unity of all humankind, the essential harmony of all religions, and universal peace. The Lotus Temple in New Delhi serves as the Mother Temple of the Indian Subcontinent, open unconditionally to all human beings for silent meditation and prayer.',
    coreHeritagePoints: [
      'Open to people of all religions, races, nationalities, and backgrounds without ritual or dogma',
      'Pure silent prayer: No sermons, rituals, icons, or clerical leaders',
      'Recipient of numerous international architectural and engineering awards for acoustic excellence and symbolic design',
    ],
    architecturalHallmarks: [
      '27 free-standing white Greek marble-clad petals arranged in clusters of three, forming nine doors',
      'Surrounded by nine reflective ponds symbolizing petals floating on water',
      'Central prayer hall rising over 34 meters with natural skylight illumination',
    ],
    keySitesInIndia: [
      'Lotus Temple / Bahá\'í House of Worship (Kalkaji, New Delhi)',
      'Bahá\'í House of Worship (Bihar Sharif, Bihar - regional temple)',
    ],
    etiquetteTips: [
      'Maintain complete silence inside the inner auditorium to facilitate peaceful meditation.',
      'Remove shoes before ascending the podium steps (free shoe collection counters provided).',
      'Photography is strictly prohibited inside the main auditorium hall; permitted in the outer gardens.',
      'No literature or ritual items other than holy scriptures of world religions are read or distributed.',
    ],
    colorTheme: {
      badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40',
      badgeText: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-200 dark:border-cyan-800/60',
      gradient: 'from-cyan-600 to-blue-600',
    },
  },
  {
    tradition: 'Jewish',
    title: 'Historic Jewish Heritage of India',
    overview:
      'India has been home to peaceful Jewish communities for millennia—including the Cochin Jews of Kerala, the Bene Israel of Maharashtra and Konkan, and the Baghdadi Jews of Kolkata and Mumbai—living without anti-Semitism and contributing richly to trade, medicine, and arts.',
    coreHeritagePoints: [
      'Paradesi Synagogue in Mattancherry, Kochi, built in 1568 CE',
      'Historic synagogues of Mumbai, Alibaug, and Pune built by the Bene Israel community',
      'Kolkata’s magnificent 19th-century Baghdadi synagogues (Magen David and Beth El)',
    ],
    architecturalHallmarks: [
      'Hand-painted blue-and-white Cantonese porcelain floor tiles (Paradesi Synagogue)',
      'Belgian crystal chandeliers and brass pulpits (Tevah)',
      'Victorian-Renaissance and Italianate styles with tall clock towers in Kolkata and Mumbai',
    ],
    keySitesInIndia: [
      'Paradesi Synagogue (Jew Town, Kochi, Kerala)',
      'Magen David Synagogue (Byculla, Mumbai)',
      'Magen David & Beth El Synagogues (Kolkata, West Bengal)',
      'Judah Hyam Hall (New Delhi)',
      'Keneseth Eliyahoo Synagogue (Kala Ghoda, Mumbai)',
    ],
    etiquetteTips: [
      'Remove footwear at designated points where required (e.g. Paradesi Synagogue).',
      'Dress modestly covering shoulders and legs.',
      'Security protocols may require government photo identification for entry into active synagogues.',
      'Observe Shabbat schedules (closed Friday evening through Saturday afternoon).',
    ],
    colorTheme: {
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
      badgeText: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800/60',
      gradient: 'from-indigo-600 to-sky-600',
    },
  },
];

export const traditionToSlug = (tradition: string): string => {
  return tradition.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const getTraditionBySlug = (slug: string): TraditionOverview | undefined => {
  const normalized = slug.toLowerCase();
  return SPIRITUAL_TRADITIONS.find((t) => traditionToSlug(t.tradition) === normalized);
};

