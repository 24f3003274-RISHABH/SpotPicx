import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Ticket,
  Train,
  Sparkles,
  Award,
  ShieldCheck,
  ChevronRight,
  Navigation,
  ExternalLink,
  Calendar,
  Building,
  Eye,
  Camera,
  CheckCircle2,
  AlertCircle,
  Share2,
  Copy,
  Check,
  Compass,
  ArrowLeft,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { getDelhiHeritagePlaceBySlug, ALL_DELHI_HERITAGE_PLACES } from '../../data/delhi/allDelhiHeritagePlaces';
import { HeritageJsonLd } from '../../components/delhi/HeritageJsonLd';
import { HeritageMapModal } from '../../components/delhi/HeritageMapModal';
import { HeritagePlaceCard } from '../../components/delhi/HeritagePlaceCard';

export const DelhiHeritagePlaceDetailPage: React.FC = () => {
  const { placeSlug } = useParams<{ placeSlug: string }>();
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const place = placeSlug ? getDelhiHeritagePlaceBySlug(placeSlug) : undefined;

  if (!place) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Historical Monument Not Found</h2>
          <p className="text-xs text-slate-600 mt-2 mb-6">
            The historical landmark you are searching for might have moved or the slug is incorrect.
          </p>
          <Link
            to="/delhi/heritage"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Delhi Heritage Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  const isFree = place.visitingInfo.entryFee.indianCitizens.toLowerCase().includes('free');
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.location.coordinates.lat},${place.location.coordinates.lng}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${place.name} - Delhi Heritage Guide`,
        text: place.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <HeritageJsonLd type="place" place={place} />

      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white pt-10 pb-16 md:pt-14 md:pb-24 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src={place.heroImage}
            alt={place.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />

        <Container size="xl" className="relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/delhi" className="hover:text-white transition-colors">
              Delhi
            </Link>
            <span>/</span>
            <Link to="/delhi/heritage" className="hover:text-white transition-colors">
              Heritage & History
            </Link>
            <span>/</span>
            <Link
              to={`/delhi/heritage/category/${place.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="hover:text-white transition-colors"
            >
              {place.category}
            </Link>
            <span>/</span>
            <span className="text-indigo-400 font-semibold truncate max-w-[200px]">
              {place.name}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              {/* Category Badges & Era */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {place.category}
                </span>
                {place.isUNESCO && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950 shadow-sm">
                    <Award className="h-3.5 w-3.5" />
                    UNESCO World Heritage Site
                  </span>
                )}
                {isFree && (
                  <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    Free Entry
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  ASI / Official Verified
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                {place.name}
              </h1>

              {(place.hindiName || place.urduName) && (
                <div className="flex items-center gap-3 text-sm text-indigo-300 font-medium mt-1.5">
                  {place.hindiName && <span>{place.hindiName}</span>}
                  {place.hindiName && place.urduName && <span>•</span>}
                  {place.urduName && <span dir="rtl">{place.urduName}</span>}
                </div>
              )}

              <p className="text-base sm:text-lg text-slate-300 mt-3 leading-relaxed">
                {place.tagline}
              </p>

              {/* Historical Dynasty & Builder metadata */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">Era:</span>{' '}
                  <span className="font-semibold text-white">{place.dynastyOrEra}</span>
                </div>
                <div>
                  <span className="text-slate-400">Period:</span>{' '}
                  <span className="font-semibold text-white">{place.historicalPeriod}</span>
                </div>
                <div>
                  <span className="text-slate-400">Built By:</span>{' '}
                  <span className="font-semibold text-white">{place.builtBy}</span>
                </div>
                {place.historicCityAssociation && (
                  <div>
                    <span className="text-slate-400">Historic City:</span>{' '}
                    <span className="font-semibold text-indigo-300">{place.historicCityAssociation}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors"
              >
                <Navigation className="h-4 w-4 text-indigo-400" />
                <span>View Map</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Factual Summary Ribbon */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <Container size="xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-slate-100 py-3 text-xs">
            <div className="px-3 py-1">
              <div className="text-slate-400 font-medium">Timings</div>
              <div className="font-bold text-slate-800 truncate">{place.visitingInfo.timings.split('(')[0]}</div>
            </div>
            <div className="px-3 py-1">
              <div className="text-slate-400 font-medium">Indian Entry</div>
              <div className="font-bold text-emerald-600 truncate">{place.visitingInfo.entryFee.indianCitizens.split('(')[0]}</div>
            </div>
            <div className="px-3 py-1">
              <div className="text-slate-400 font-medium">Nearest Metro</div>
              <div className="font-bold text-indigo-600 truncate">{place.location.nearestMetro.split('(')[0]}</div>
            </div>
            <div className="px-3 py-1">
              <div className="text-slate-400 font-medium">Duration</div>
              <div className="font-bold text-slate-800 truncate">{place.suggestedDuration}</div>
            </div>
            <div className="px-3 py-1">
              <div className="text-slate-400 font-medium">Closed On</div>
              <div className="font-bold text-rose-600 truncate">{place.visitingInfo.closedOn || 'None'}</div>
            </div>
            <div className="px-3 py-1">
              <div className="text-slate-400 font-medium">Accessibility</div>
              <div className="font-bold text-slate-800 truncate">{place.accessibility.wheelchairAccessible}</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Details Body */}
      <Container size="xl" className="mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Historical Significance */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                <Building className="h-4 w-4" />
                <span>Historical Significance & Context</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                The Heritage Story of {place.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {place.historicalSignificance}
              </p>

              {/* Chronological Detailed History */}
              {place.detailedHistory && place.detailedHistory.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Key Historical Milestones
                  </h3>
                  {place.detailedHistory.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Architecture Deep Dive */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                <Compass className="h-4 w-4" />
                <span>Architectural Analysis</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Style, Materials & Engineering
              </h2>

              <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <div className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                  Architectural Style:
                </div>
                <div className="text-sm font-semibold text-indigo-900 mt-0.5">
                  {place.architecture.architecturalStyle}
                </div>
              </div>

              {/* Building Materials Chips */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Building Materials Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {place.architecture.buildingMaterials.map((mat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Architectural Features */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Key Architectural Features
                </h3>
                {place.architecture.keyArchitecturalFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {place.architecture.architectOrDesigner && (
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">Architect / Master Builder:</span>{' '}
                  {place.architecture.architectOrDesigner}
                </div>
              )}
            </section>

            {/* Why Visit Editorial Recommendation */}
            <section className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  Editorial Recommendation
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3">Why You Should Visit</h2>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {place.whyVisit}
                </p>
              </div>
            </section>

            {/* Things to See Interactive Grid */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                <Eye className="h-4 w-4" />
                <span>Highlights Checklist</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Key Things to See Inside
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {place.thingsToSee.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      {item.highlightPill && (
                        <span className="inline-flex items-center text-[10px] font-bold text-indigo-700 bg-indigo-100 rounded-md px-2 py-0.5 mb-2">
                          {item.highlightPill}
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Image Gallery */}
            {place.imageGallery && place.imageGallery.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                  <Camera className="h-4 w-4" />
                  <span>Monument Visual Gallery</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Photographic Gallery
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {place.imageGallery.map((img, idx) => (
                    <div key={idx} className="overflow-hidden rounded-2xl border border-slate-200">
                      <div className="aspect-[16/9] w-full bg-slate-100">
                        <img
                          src={img.url}
                          alt={img.caption}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-3 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
                        <span>{img.caption}</span>
                        {img.credit && <span className="text-slate-400">Credit: {img.credit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Monument Specific FAQs */}
            {place.faqs && place.faqs.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Frequently Asked Questions about {place.name}
                </h2>
                <div className="space-y-4">
                  {place.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 mb-1.5">{faq.question}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Practical Visiting Info Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Ticket className="h-5 w-5 text-indigo-600" />
                <span>Visiting & Ticket Details</span>
              </h3>

              {/* Price breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Indian Citizens:</span>
                  <span className="font-bold text-slate-900">{place.visitingInfo.entryFee.indianCitizens}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Foreign Tourists:</span>
                  <span className="font-bold text-slate-900">{place.visitingInfo.entryFee.foreignTourists}</span>
                </div>
                {place.visitingInfo.entryFee.saarcBimstec && (
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">SAARC / BIMSTEC:</span>
                    <span className="font-semibold text-slate-900">{place.visitingInfo.entryFee.saarcBimstec}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Children under 15:</span>
                  <span className="font-semibold text-emerald-600">{place.visitingInfo.entryFee.childrenUnder15}</span>
                </div>
              </div>

              {/* Timings & Open Days */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block font-medium">Opening Hours:</span>
                  <span className="font-bold text-slate-800">{place.visitingInfo.timings}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Open Days:</span>
                  <span className="font-semibold text-slate-800">{place.visitingInfo.openDays}</span>
                </div>
                {place.visitingInfo.closedOn && place.visitingInfo.closedOn !== 'None' && (
                  <div>
                    <span className="text-rose-500 block font-medium">Closed Days:</span>
                    <span className="font-bold text-rose-700">{place.visitingInfo.closedOn}</span>
                  </div>
                )}
              </div>

              {/* Official Booking CTA */}
              {place.visitingInfo.officialBookingPortal && (
                <a
                  href={place.visitingInfo.officialBookingPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm transition-colors"
                >
                  <span>Official ASI E-Ticket Booking</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {/* Accessibility Verified Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Accessibility Report</span>
              </h3>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-800 block mb-1">
                  Status: {place.accessibility.wheelchairAccessible}
                </span>
                <p className="text-slate-600 leading-relaxed">{place.accessibility.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${place.accessibility.wheelchairRamps ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>Ramps Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${place.accessibility.batteryVehiclesAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>Battery Buggies</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${place.accessibility.brailleOrTactilePathways ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>Tactile Paths</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${place.accessibility.parkingAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>Parking Access</span>
                </div>
              </div>
            </div>

            {/* Transit & Map Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Train className="h-5 w-5 text-indigo-600" />
                <span>Delhi Metro & Location</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Nearest Metro Station:</span>
                  <span className="font-bold text-indigo-900">{place.location.nearestMetro}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Walking Distance:</span>
                  <span className="font-medium text-slate-700">{place.location.distanceFromMetro}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Full Address:</span>
                  <span className="font-medium text-slate-700">{place.location.address}</span>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-sm transition-colors"
              >
                <Navigation className="h-4 w-4" />
                <span>Navigate on Google Maps</span>
              </a>
            </div>

            {/* Authoritative Source Citations */}
            <div className="bg-slate-100/80 rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Authoritative Source References</span>
              </div>
              <ul className="space-y-2">
                {place.sourceReferences.map((ref, idx) => (
                  <li key={idx} className="leading-snug">
                    <span className="font-semibold text-slate-800">{ref.organization}:</span>{' '}
                    <span>{ref.documentOrRecord}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Nearby Places Section */}
        {place.nearbyPlaces && place.nearbyPlaces.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Nearby Historical Places to Combine in Your Visit
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {place.nearbyPlaces.map((near, idx) => {
                const fullPlace = getDelhiHeritagePlaceBySlug(near.slug);
                if (fullPlace) {
                  return <HeritagePlaceCard key={idx} place={fullPlace} />;
                }
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                        {near.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2">{near.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{near.distance}</p>
                      <p className="text-xs text-slate-600 mt-2">{near.shortWhy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </Container>

      {/* Map Modal */}
      {showMapModal && (
        <HeritageMapModal place={place} onClose={() => setShowMapModal(false)} />
      )}
    </div>
  );
};
