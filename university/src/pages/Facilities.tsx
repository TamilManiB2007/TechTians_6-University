import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import {
  ChevronLeft,
  ChevronRight,
  Bus,
  UtensilsCrossed,
  Home,
  Dumbbell,
  BookOpen,
  Wifi,
  Car,
  Shield,
  GraduationCap,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import facilityBus from "@/assets/facility-bus.jpg";
import facilityCanteen from "@/assets/facility-canteen.jpg";
import facilityHostelRoom from "@/assets/facility-hostel-room.jpg";
import facilityIndoorSports from "@/assets/facility-indoor-sports.jpg";
import campusLibrary from "@/assets/campus-library.jpg";
import campusSports from "@/assets/campus-sports.jpg";

// --- removed compile-time panorama imports ---

const facilities = [
  {
    id: 1,
    title: "Bus Facilities",
    icon: Bus,
    description:
      "Comprehensive transportation network covering major routes across the city",
    images: [facilityBus, facilityBus, facilityBus],
    features: [
      "GPS-enabled buses for real-time tracking",
      "Air-conditioned comfortable seating",
      "Safe and secure transportation",
      "Multiple routes covering 50+ locations",
      "Professional trained drivers",
      "Student ID based boarding system",
    ],
    details: {
      fleet: "45 Buses",
      routes: "12 Major Routes",
      capacity: "50 Students per bus",
      timing: "6:00 AM - 10:00 PM",
    },
  },
  {
    id: 2,
    title: "AC Canteen",
    icon: UtensilsCrossed,
    description:
      "Modern food court offering hygienic, nutritious meals in air-conditioned comfort",
    images: [facilityCanteen, facilityCanteen, facilityCanteen],
    features: [
      "Multi-cuisine food options",
      "Hygienic food preparation",
      "Nutritionist-approved menu",
      "Affordable pricing for students",
      "24/7 food service availability",
      "Special dietary requirements catered",
    ],
    details: {
      capacity: "800 Students",
      cuisines: "Indian, Chinese, Continental",
      outlets: "8 Food Counters",
      timing: "24/7 Service",
    },
  },
  {
    id: 3,
    title: "Hostel Accommodation",
    icon: Home,
    description:
      "Comfortable living spaces designed for academic success and personal growth",
    images: [facilityHostelRoom, facilityHostelRoom, facilityHostelRoom],
    features: [
      "AC and Non-AC room options",
      "High-speed Wi-Fi connectivity",
      "24/7 security and surveillance",
      "Common recreation areas",
      "Laundry and housekeeping services",
      "Mess facility with quality food",
    ],
    details: {
      capacity: "2000 Students",
      blocks: "Boys: 4, Girls: 3",
      rooms: "Single, Double, Triple sharing",
      facilities: "Gym, Library, Common Room",
    },
  },
  {
    id: 4,
    title: "Sports Facilities",
    icon: Dumbbell,
    description:
      "World-class sports infrastructure for physical fitness and competitive sports",
    images: [facilityIndoorSports, campusSports, facilityIndoorSports],
    features: [
      "Indoor courts for badminton, basketball",
      "Olympic-size swimming pool",
      "Football and cricket grounds",
      "Modern gymnasium with latest equipment",
      "Yoga and aerobics studio",
      "Professional coaching available",
    ],
    details: {
      indoor: "Basketball, Badminton, Table Tennis",
      outdoor: "Football, Cricket, Athletics",
      equipment: "Latest fitness machines",
      coaching: "Professional trainers",
    },
  },
  {
    id: 5,
    title: "Library Services",
    icon: BookOpen,
    description:
      "Modern library with extensive collections and digital resources",
    images: [campusLibrary, campusLibrary, campusLibrary],
    features: [
      "2 lakh books and journals",
      "Digital library with e-resources",
      "24/7 reading room access",
      "Research databases and archives",
      "Individual and group study spaces",
      "Printing and scanning facilities",
    ],
    details: {
      books: "2,00,000 Books",
      ejournals: "5000+ E-Journals",
      seating: "1000 Reading seats",
      timing: "24/7 Access",
    },
  },
];

const additionalAmenities = [
  {
    icon: Wifi,
    title: "Campus-wide Wi-Fi",
    description: "High-speed internet connectivity across the entire campus",
  },
  {
    icon: Car,
    title: "Parking Facilities",
    description: "Ample parking space for students, faculty, and visitors",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description: "Round-the-clock security with CCTV surveillance",
  },
];

const topUniversityFeatures = [
  {
    icon: GraduationCap,
    title: "Research & Innovation Labs",
    description:
      "Multi-disciplinary labs with industry-grade equipment and funded research projects.",
  },
  {
    icon: Globe,
    title: "Global Exchange & Partnerships",
    description:
      "Active bilateral exchange programs with top universities and industry partnerships.",
  },
  {
    icon: BookOpen,
    title: "Digital Scholarship & Archives",
    description:
      "Extensive digital repositories, research databases and open-access publications.",
  },
  {
    icon: Shield,
    title: "Comprehensive Student Support",
    description:
      "Strong alumni mentorship, career services, counseling and scholarship programs.",
  },
];

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:4000";

const Facilities = () => {
  const [selectedFacility, setSelectedFacility] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showTour, setShowTour] = useState(false);
  const pannellumViewerRef = useRef<any | null>(null);
  const pannellumContainerRef = useRef<HTMLDivElement | null>(null);

  const [selectedPanoramaIndex, setSelectedPanoramaIndex] = useState(0);

  // --- STEP 2: Discover panorama assets at build time via Vite glob ---
  // This finds files like src/assets/pano-*.jpg|jpeg|png|webp that you uploaded.
  const [panoramas, setPanoramas] = useState<
    { id: string; title: string; url: string }[]
  >([]);

  useEffect(() => {
    try {
      // static glob pattern (must be a literal). Eager import gives us built URLs.
      const modules = import.meta.glob("../assets/*.{jpg,jpeg,png,webp}", { eager: true }) as Record<string, any>;
      const entries = Object.entries(modules).map(([p, mod]) => {
        const url = (mod && (mod as any).default) || mod;
        const filename = p.split("/").pop() || p;
        return { path: p, filename, url };
      });

      // Prefer images with pano/360/campus/facility keywords; fallback to all images
      const prioritized = entries.filter((e) =>
        /pano|panorama|360|campus|facility/i.test(e.filename)
      );
      const finalList = (prioritized.length ? prioritized : entries)
        .map((e) => {
          const title = e.filename
            .replace(/^pano-?/i, "")
            .replace(/\.(jpg|jpeg|png|webp)$/i, "")
            .replace(/[-_]+/g, " ")
            .replace(/\b\w/g, (m) => m.toUpperCase());
          return { id: e.filename, title: title || e.filename, url: e.url };
        })
        .sort((a, b) => a.title.localeCompare(b.title));

      console.debug("[Facilities] panoramas resolved:", finalList.map((f) => f.id));
      if (finalList.length) {
        setPanoramas(finalList);
        setSelectedPanoramaIndex(0);
      } else {
        console.warn("No images found in ../assets via glob. Ensure images are placed in src/assets.");
      }
    } catch (err) {
      console.warn("Panorama discovery failed. Ensure images exist in src/assets and Vite supports import.meta.globEager.", err);
    }
  }, []);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [visitGuests, setVisitGuests] = useState<number>(1);
  const [scheduledTours, setScheduledTours] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("tt6_scheduled_tours") || "[]");
    } catch {
      return [];
    }
  });

  const saveScheduledTours = (list: any[]) => {
    try {
      localStorage.setItem("tt6_scheduled_tours", JSON.stringify(list));
    } catch {}
    setScheduledTours(list);
  };

  const scheduleTour = () => {
    if (!visitorName || !visitorEmail || !visitDate || !visitTime) {
      return alert("Please fill name, email, date and time");
    }
    const entry = {
      id: `tour_${Date.now()}`,
      name: visitorName,
      email: visitorEmail,
      date: visitDate,
      time: visitTime,
      guests: visitGuests,
      createdAt: new Date().toISOString(),
    };
    const updated = [entry, ...scheduledTours];
    saveScheduledTours(updated);
    setShowScheduleModal(false);
    setVisitorName("");
    setVisitorEmail("");
    setVisitDate("");
    setVisitTime("");
    setVisitGuests(1);
    alert("Tour scheduled — you will receive confirmation (demo).");
  };

  const currentFacility = facilities[selectedFacility];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === currentFacility.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentFacility.images.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showTour) return; // Don't navigate images when tour is open
      if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedFacility, currentImageIndex, showTour]);

  const ensurePannellumLoaded = async () => {
    if (!document.querySelector('link[data-tt="pannellum-css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      link.setAttribute("data-tt", "pannellum-css");
      document.head.appendChild(link);
      await new Promise((r) => setTimeout(r, 50));
    }
    if (!(window as any).pannellum) {
      await new Promise<void>((resolve, reject) => {
        if (document.querySelector('script[data-tt="pannellum-js"]')) {
          const check = () =>
            (window as any).pannellum ? resolve() : setTimeout(check, 50);
          check();
          return;
        }
        const s = document.createElement("script");
        s.src =
          "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
        s.async = true;
        s.setAttribute("data-tt", "pannellum-js");
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load pannellum"));
        document.body.appendChild(s);
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!showTour || !pannellumContainerRef.current) return;
      try {
        await ensurePannellumLoaded();
        if (!mounted) return;
        if (pannellumViewerRef.current && pannellumViewerRef.current.destroy) {
          try {
            pannellumViewerRef.current.destroy();
          } catch {}
          pannellumViewerRef.current = null;
        }
        const panoUrl = panoramas[selectedPanoramaIndex]?.url;
        if (!panoUrl) {
          // show helpful message inside container when no panorama available
          if (pannellumContainerRef.current) {
            pannellumContainerRef.current.innerHTML = "<div style='color:#fff;padding:20px;text-align:center;'>No panorama available. Upload 360 images to src/assets named like pano-main-entrance.jpg and reload.</div>";
          }
          return;
        }
         pannellumViewerRef.current = (window as any).pannellum.viewer(
           pannellumContainerRef.current,
           {
             type: "equirectangular",
             panorama: panoUrl,
             autoLoad: true,
             showZoomCtrl: true,
             showFullscreenCtrl: true,
           }
         );
       } catch (err) {
         console.error("Pannellum init error:", err);
       }
     };
     init();
     return () => {
       mounted = false;
     };
   }, [showTour, selectedPanoramaIndex, panoramas]);

  useEffect(() => {
    return () => {
      if (pannellumViewerRef.current && pannellumViewerRef.current.destroy) {
        try {
          pannellumViewerRef.current.destroy();
        } catch {}
        pannellumViewerRef.current = null;
      }
    };
  }, []);

  return (
    <Layout>
      <div className="min-h-screen py-20">
        <section className="bg-gradient-to-r from-primary/10 to-primary-light/10 py-16 mb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              World-Class <span className="text-gradient">Facilities</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experience excellence with our state-of-the-art infrastructure and
              student-centric amenities
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {facilities.map((facility, index) => (
                <button
                  key={facility.id}
                  onClick={() => {
                    setSelectedFacility(index);
                    setCurrentImageIndex(0);
                  }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                    selectedFacility === index
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-accent hover:bg-accent/80"
                  }`}
                >
                  <facility.icon className="h-5 w-5" />
                  <span className="font-medium">{facility.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={currentFacility.images[currentImageIndex]}
                  alt={currentFacility.title}
                  className="univ-img w-full cursor-pointer"
                  onClick={() => nextImage()}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    prevImage();
                  }}
                />

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex justify-center mt-4 space-x-2">
                {currentFacility.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-primary scale-125"
                        : "bg-muted-foreground/50 hover:bg-muted-foreground/75"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <currentFacility.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">
                    {currentFacility.title}
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground">
                  {currentFacility.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(currentFacility.details).map(([key, value]) => (
                  <div key={key} className="bg-accent/30 rounded-lg p-4">
                    <div className="font-semibold text-primary capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="text-sm text-muted-foreground">{value}</div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <div className="space-y-3">
                  {currentFacility.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Additional <span className="text-gradient">Amenities</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Supporting facilities that enhance your campus experience
              </p>
            </div>

            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {topUniversityFeatures.map((f, i) => (
                  <div key={i} className="card-feature p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <f.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{f.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {f.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {additionalAmenities.map((amenity, index) => (
                <div key={index} className="card-feature text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <amenity.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {amenity.title}
                  </h3>
                  <p className="text-muted-foreground">{amenity.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center">
            <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Experience Our Campus
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a visit to explore our world-class facilities and see
                why TechTitans_6 is the perfect choice for your education.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="btn-university"
                  onClick={() => setShowScheduleModal(true)}
                >
                  Schedule Campus Tour
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="btn-university-outline"
                  onClick={() => setShowTour(true)}
                >
                  Virtual Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="font-semibold">Virtual 360° Tour — Campus</div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedPanoramaIndex}
                  onChange={(e) =>
                    setSelectedPanoramaIndex(Number(e.target.value))
                  }
                  className="px-3 py-1 border rounded"
                >
                  {panoramas.length === 0 ? (
                    <option value={0} disabled>
                      No panoramas found
                    </option>
                  ) : (
                    panoramas.map((p, i) => (
                      <option key={p.id} value={i}>
                        {p.title}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowTour(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
            <div
              style={{ height: "70vh" }}
              ref={pannellumContainerRef}
              id="tt-panorama"
            />
            <div className="p-3 text-sm text-muted-foreground">
              Use mouse / touch to look around. Use zoom/fullscreen controls on
              top-right.
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-background rounded-lg w-full max-w-md shadow-lg overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">Schedule Campus Tour</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowScheduleModal(false)}
              >
                Close
              </Button>
            </div>
            <div className="p-4 space-y-3">
              <Input
                placeholder="Your Name"
                value={visitorName}
                onChange={(e: any) => setVisitorName(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={visitorEmail}
                onChange={(e: any) => setVisitorEmail(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={visitDate}
                  onChange={(e: any) => setVisitDate(e.target.value)}
                />
                <Input
                  type="time"
                  value={visitTime}
                  onChange={(e: any) => setVisitTime(e.target.value)}
                />
              </div>
              <Input
                type="number"
                min={1}
                value={String(visitGuests)}
                onChange={(e: any) => {
                  const v = Number(e.target.value || 1);
                  setVisitGuests(
                    Number.isNaN(v) ? 1 : Math.max(1, Math.floor(v))
                  );
                }}
                placeholder="Guests"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={scheduleTour}>Confirm Booking</Button>
              </div>
            </div>
            <div className="p-4 border-t text-sm text-muted-foreground">
              Booking is demo-only and saved locally. You will see your
              scheduled tours below.
            </div>
          </div>
        </div>
      )}

      {scheduledTours.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40 w-80">
          <div className="bg-background rounded-lg shadow p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Your Scheduled Tours</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  saveScheduledTours([]);
                }}
              >
                Clear
              </Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-auto">
              {scheduledTours.map((t) => (
                <div key={t.id} className="p-2 bg-accent/10 rounded">
                  <div className="font-medium">
                    {t.name} — {t.date} {t.time}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.guests} guest(s)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Facilities;