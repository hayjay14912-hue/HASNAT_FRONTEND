const medicalDeviceData = [
  // IDS
  {
    id: 1,
    brandId: "ids",
    slug: "ids-aurora-pro",
    name: "IDS Aurora Pro",
    manufacturer: "Ids",
    qualityBadge: "Industry Leading",
    headline: "Multi-application clinic platform for laser-driven protocols",
    shortDescription:
      "A flexible energy-based system designed for high-throughput clinics delivering laser-driven treatment programs.",
    heroImage: "/assets/img/product/gadget/gadget-banner-1.jpg",
    overview:
      "IDS Aurora Pro is positioned as a clinic workhorse: configurable protocols, repeatable outputs, and specialist-led consultation workflows for procurement.",
    clinicalBenefits: [
      "Supports clinic workflows with repeatable protocol settings",
      "Built for high-throughput scheduling and utilization",
      "Enables multi-indication offerings from one platform",
      "Designed for professional clinic environments"
    ],
    technicalSpecifications: [
      { label: "Platform Type", value: "Energy-based system" },
      { label: "Use Environment", value: "Dermatology and aesthetic clinics" },
      { label: "Controls", value: "Configurable clinical presets" },
      { label: "Service Model", value: "Specialist onboarding recommended" }
    ],
    roiHighlights: [
      "Supports premium service mix via one capital purchase",
      "Improves clinic utilization through repeatable workflows",
      "Enables package-based programs to drive repeat visits"
    ],
    certifications: ["CE Marked", "ISO 13485 Manufacturer Standards"],
    useCases: ["Hair Removal", "Pigmentation", "Vascular Support"]
  },
  {
    id: 2,
    brandId: "ids",
    slug: "ids-crystal-ipl",
    name: "IDS Crystal IPL",
    manufacturer: "Ids",
    qualityBadge: "New Gen",
    headline: "IPL system for tone, pigment, and rejuvenation services",
    shortDescription:
      "IPL-focused device for clinics offering skin tone and texture programs with professional consultation and onboarding.",
    heroImage: "/assets/img/product/gadget/gadget-banner-2.jpg",
    overview:
      "IDS Crystal IPL is a demo entry used to illustrate brand filtering and navigation. Replace with the official model and technical specs.",
    clinicalBenefits: [
      "Designed for tone and pigment workflows",
      "Supports bundled rejuvenation programs",
      "Simple service positioning for aesthetic clinics"
    ],
    technicalSpecifications: [
      { label: "Treatment Type", value: "IPL" },
      { label: "Clinical Workflow", value: "Protocol presets (demo)" },
      { label: "Patient Positioning", value: "Low-to-moderate downtime" }
    ],
    roiHighlights: [
      "Fits recurring treatment schedules and packages",
      "Complements broader clinic service offerings"
    ],
    certifications: ["CE Marked"],
    useCases: ["Rejuvenation", "Pigmentation", "Tone"]
  },
  {
    id: 3,
    brandId: "ids",
    slug: "ids-neo-rf",
    name: "IDS NEO RF",
    manufacturer: "Ids",
    qualityBadge: "Clinically Proven",
    headline: "RF platform for tightening and textural improvement services",
    shortDescription:
      "An RF-based device concept for clinics targeting tightening and texture-focused programs.",
    heroImage: "/assets/img/product/gadget/gadget-banner-1.jpg",
    overview:
      "IDS NEO RF is a demo entry. Replace with official RF model names, indications, and certifications.",
    clinicalBenefits: [
      "Supports tightening-focused treatment plans",
      "Pairs well with rejuvenation offerings",
      "Ideal for package-based programs"
    ],
    technicalSpecifications: [
      { label: "Technology", value: "RF (demo)" },
      { label: "Use Environment", value: "Aesthetic clinics" }
    ],
    roiHighlights: ["High-demand non-surgical category with repeat sessions"],
    certifications: ["CE Marked"],
    useCases: ["Tightening", "Texture", "Pores"]
  },

  // Eunsung
  {
    id: 4,
    brandId: "eunsung",
    slug: "eunsung-derma-lux",
    name: "Eunsung Derma Lux",
    manufacturer: "Eunsung",
    qualityBadge: "New Gen",
    headline: "Clinic platform for rejuvenation-focused protocols",
    shortDescription:
      "Energy-based system positioned for rejuvenation services and clinic program workflows.",
    heroImage: "/assets/img/product/gadget/gadget-banner-2.jpg",
    overview:
      "Eunsung Derma Lux is a demo entry used to demonstrate brand selection on the machines page.",
    clinicalBenefits: [
      "Supports repeatable rejuvenation workflows",
      "Fits professional clinic procurement pathways"
    ],
    technicalSpecifications: [
      { label: "Platform Type", value: "Energy-based system (demo)" },
      { label: "Use Environment", value: "Aesthetic clinics" }
    ],
    roiHighlights: ["Strong fit for recurring programs"],
    certifications: ["CE Marked"],
    useCases: ["Rejuvenation", "Glow", "Texture"]
  },
  {
    id: 5,
    brandId: "eunsung",
    slug: "eunsung-pico-spark",
    name: "Eunsung Pico Spark",
    manufacturer: "Eunsung",
    qualityBadge: "Industry Leading",
    headline: "Pico category platform for pigment and tattoo workflows",
    shortDescription:
      "Concept pico-category device supporting pigment and tattoo workflows for derm clinics.",
    heroImage: "/assets/img/product/gadget/gadget-banner-1.jpg",
    overview:
      "Eunsung Pico Spark is a demo entry. Replace with the official pico model and protocol guidance.",
    clinicalBenefits: [
      "Supports pigment and tattoo service mix",
      "Positions the clinic for premium derm indications"
    ],
    technicalSpecifications: [
      { label: "Technology", value: "Pico (demo)" },
      { label: "Clinical Focus", value: "Pigment / tattoo" }
    ],
    roiHighlights: ["Premium indication category supports higher price points"],
    certifications: ["CE Marked"],
    useCases: ["Pigmentation", "Tattoo", "Tone"]
  },

  // Daeyang
  {
    id: 6,
    brandId: "daeyang",
    slug: "daeyang-ipl-advance",
    name: "Daeyang IPL Advance",
    manufacturer: "Daeyang",
    qualityBadge: "Clinically Proven",
    headline: "IPL system for tone and pigment clinic programs",
    shortDescription:
      "IPL-focused concept device for clinics building structured tone and pigment programs.",
    heroImage: "/assets/img/product/gadget/gadget-banner-2.jpg",
    overview:
      "Daeyang IPL Advance is a demo entry. Add official handpieces, pulse profiles, and safety guidance.",
    clinicalBenefits: ["Supports clinic rejuvenation program design"],
    technicalSpecifications: [{ label: "Treatment Type", value: "IPL (demo)" }],
    roiHighlights: ["Recurring programs support predictable utilization"],
    certifications: ["CE Marked"],
    useCases: ["Rejuvenation", "Pigmentation", "Tone"]
  },
  {
    id: 7,
    brandId: "daeyang",
    slug: "daeyang-fractional-pro",
    name: "Daeyang Fractional Pro",
    manufacturer: "Daeyang",
    qualityBadge: "Trusted Choice",
    headline: "Fractional category platform for resurfacing and scar protocols",
    shortDescription:
      "Fractional concept device for clinics offering resurfacing and scar-focused protocols.",
    heroImage: "/assets/img/product/gadget/gadget-banner-1.jpg",
    overview:
      "Daeyang Fractional Pro is a demo entry used for navigation and filtering.",
    clinicalBenefits: ["Supports texture and scar protocol positioning"],
    technicalSpecifications: [{ label: "Treatment Type", value: "Fractional (demo)" }],
    roiHighlights: ["Bundled resurfacing programs support repeat sessions"],
    certifications: ["CE Marked"],
    useCases: ["Resurfacing", "Scars", "Texture"]
  },

  // Hironic
  {
    id: 8,
    brandId: "hironic",
    slug: "hironic-doublo-gold",
    name: "Hironic Doublo Gold",
    manufacturer: "Hironic",
    qualityBadge: "Trusted Choice",
    headline: "HIFU category system for lifting and tightening services",
    shortDescription:
      "HIFU concept device supporting lifting and tightening programs in aesthetic clinics.",
    heroImage: "/assets/img/product/gadget/gadget-banner-2.jpg",
    overview:
      "Hironic Doublo Gold is a demo entry. Replace with official cartridge specs and protocol guidance.",
    clinicalBenefits: ["Supports non-surgical lifting positioning"],
    technicalSpecifications: [{ label: "Technology", value: "HIFU (demo)" }],
    roiHighlights: ["High-demand category with package-based programs"],
    certifications: ["CE Marked"],
    useCases: ["Lifting", "Tightening", "Face"]
  },
  {
    id: 9,
    brandId: "hironic",
    slug: "hironic-new-shape",
    name: "Hironic New Shape",
    manufacturer: "Hironic",
    qualityBadge: "New Gen",
    headline: "Body contour category system for clinic body programs",
    shortDescription:
      "Energy-based concept device supporting body contour and clinic body program workflows.",
    heroImage: "/assets/img/product/gadget/gadget-banner-1.jpg",
    overview:
      "Hironic New Shape is a demo entry for filtering and navigation.",
    clinicalBenefits: ["Supports body contour service bundles"],
    technicalSpecifications: [{ label: "Category", value: "Body contour (demo)" }],
    roiHighlights: ["Supports upsell pathways via clinic programs"],
    certifications: ["CE Marked"],
    useCases: ["Body", "Contour", "Tightening"]
  },

  // DermaCool
  {
    id: 10,
    brandId: "dermacool",
    slug: "dermacool-cryo-air",
    name: "DermaCool Cryo Air",
    manufacturer: "DermaCool",
    qualityBadge: "Clinic Essential",
    headline: "Cooling support unit for comfort-focused clinic workflows",
    shortDescription:
      "Cooling unit concept used alongside energy-based treatments to support comfort and workflow efficiency.",
    heroImage: "/assets/img/product/gadget/gadget-banner-2.jpg",
    overview:
      "DermaCool Cryo Air is a demo entry. Replace with official cooling capacity and operational specs.",
    clinicalBenefits: ["Supports patient comfort and operator workflow"],
    technicalSpecifications: [{ label: "Category", value: "Cooling support (demo)" }],
    roiHighlights: ["Improves patient comfort for repeat programs"],
    certifications: ["CE Marked"],
    useCases: ["Cooling", "Comfort", "Support"]
  },
  {
    id: 11,
    brandId: "dermacool",
    slug: "dermacool-cold-skin",
    name: "DermaCool Cold Skin",
    manufacturer: "DermaCool",
    qualityBadge: "Clinically Proven",
    headline: "Cooling support for pre and post treatment routines",
    shortDescription:
      "Clinic cooling support device concept for redness and comfort routines around procedures.",
    heroImage: "/assets/img/product/gadget/gadget-banner-1.jpg",
    overview:
      "DermaCool Cold Skin is a demo entry used for routing and filtering.",
    clinicalBenefits: ["Supports comfort routines around procedures"],
    technicalSpecifications: [{ label: "Category", value: "Cooling support (demo)" }],
    roiHighlights: ["Enables better patient experience and retention"],
    certifications: ["CE Marked"],
    useCases: ["Cooling", "Comfort", "Aesthetics"]
  }
];

export const getMedicalDeviceBySlug = (slug) => {
  return medicalDeviceData.find((device) => device.slug === slug);
};

export default medicalDeviceData;
