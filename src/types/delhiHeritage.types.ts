export type HeritageCategory =
  | 'Mughal Heritage'
  | 'Sultanate Architecture'
  | 'British-era Delhi'
  | 'Ancient/Medieval Sites'
  | 'UNESCO-related heritage'
  | 'Museums'
  | 'Tombs & Mausoleums'
  | 'Forts'
  | 'Stepwells'
  | 'Historic Markets'
  | 'Heritage Villages'
  | 'Religious Heritage'
  | 'Hidden Historical Places';

export interface VisitingInfo {
  entryFee: {
    indianCitizens: string;
    foreignTourists: string;
    saarcBimstec?: string;
    childrenUnder15?: string;
    audioGuide?: string;
    cameraFee?: string;
    onlineBookingDiscount?: string;
  };
  timings: string;
  openDays: string;
  closedOn: string;
  officialBookingPortal?: string;
  photographyRules: string;
  bestLightingTime?: string;
}

export interface AccessibilityInfo {
  wheelchairAccessible: 'Fully Accessible' | 'Partially Accessible' | 'Not Accessible' | 'Challenging Terrain';
  details: string;
  wheelchairRamps: boolean;
  batteryVehiclesAvailable?: boolean;
  brailleOrTactilePathways?: boolean;
  parkingAvailable: boolean;
}

export interface ArchitectureInfo {
  architecturalStyle: string;
  buildingMaterials: string[];
  keyArchitecturalFeatures: string[];
  architectOrDesigner?: string;
  inscriptionsOrArt?: string;
  restorationStatus?: string;
}

export interface HeritageImage {
  url: string;
  caption: string;
  credit?: string;
}

export interface SourceReference {
  organization: string; // e.g. "Archaeological Survey of India (ASI)", "UNESCO World Heritage Centre", "Delhi Tourism (DTTDC)", "INTACH Delhi Chapter", "National Museum"
  documentOrRecord: string;
  url?: string;
  citationNotes?: string;
}

export interface NearbySpot {
  slug: string;
  name: string;
  distance: string;
  category: string;
  shortWhy: string;
}

export interface DelhiHeritagePlace {
  slug: string;
  name: string;
  hindiName?: string;
  urduName?: string;
  tagline: string;
  category: HeritageCategory;
  additionalCategories?: HeritageCategory[];
  historicalPeriod: string;
  dynastyOrEra: string;
  builtInYearOrCentury: string;
  builtBy: string;
  reignOf?: string;
  historicCityAssociation?: 'Qila Rai Pithora' | 'Mehrauli' | 'Siri' | 'Tughlaqabad' | 'Jahanpanah' | 'Ferozabad' | 'Dinpanah / Shergarh' | 'Shahjahanabad' | 'Lutyens New Delhi' | 'Ancient Indraprastha' | 'Independent India';
  location: {
    address: string;
    locality: string;
    zone: 'South Delhi' | 'Central Delhi' | 'Old Delhi / North Delhi' | 'New Delhi' | 'East Delhi' | 'West Delhi' | 'South West Delhi';
    nearestMetro: string;
    metroLine: string;
    distanceFromMetro: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  historicalSignificance: string;
  detailedHistory: string[];
  architecture: ArchitectureInfo;
  whyVisit: string;
  thingsToSee: {
    title: string;
    description: string;
    highlightPill?: string;
  }[];
  nearbyPlaces: NearbySpot[];
  suggestedDuration: string;
  bestTimeToVisit: string;
  accessibility: AccessibilityInfo;
  visitingInfo: VisitingInfo;
  imageGallery: HeritageImage[];
  heroImage: string;
  sourceReferences: SourceReference[];
  tags: string[];
  isTop10?: boolean;
  is15MustVisit?: boolean;
  isUNESCO?: boolean;
  isMughalMasterpiece?: boolean;
  isSultanateHighlight?: boolean;
  isMuseum?: boolean;
  isHiddenGem?: boolean;
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface EditorialHeritageGuide {
  slug: string;
  title: string;
  subtitle: string;
  readTime: string;
  heroImage: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
  };
  intro: string;
  historicalContext: string;
  keyTakeaways: string[];
  featuredPlacesSlugs: string[];
  walkRouteSteps?: {
    stepNumber: number;
    placeSlug: string;
    placeName: string;
    durationAtStop: string;
    walkingDistanceToNext?: string;
    whatToLookFor: string;
    historicalInsight: string;
    curatorTip: string;
  }[];
  sections: {
    heading: string;
    content: string;
    placeSlugRef?: string;
    quote?: string;
    proTip?: string;
  }[];
  recommendedTiming: string;
  startingPoint?: string;
  endingPoint?: string;
  metroConnectivitySummary: string;
  sources: SourceReference[];
  faqs: {
    question: string;
    answer: string;
  }[];
}
