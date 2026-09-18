import { StyleOption, ShoppableProduct, DesignProject, ScannedReceipt, SubscriptionPlan } from '../types';

export const SAMPLE_ROOMS = [
  {
    id: 'living-room-builder',
    name: 'Builder-Grade Living Room',
    subtitle: 'Dated beige walls, generic furniture, and dull overhead lighting',
    roomType: 'Living Room',
    originalImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
    styles: {
      'scandinavian': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=80',
      'mid-century': 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80',
      'japandi': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
      'industrial': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
      'biophilic': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80',
      'art-deco': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
    }
  },
  {
    id: 'bedroom-cluttered',
    name: 'Tribeca Master Bedroom',
    subtitle: 'Underutilized alcoves, mismatching nightstands, and heavy drapes',
    roomType: 'Master Bedroom',
    originalImage: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1400&q=80',
    styles: {
      'scandinavian': 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=1400&q=80',
      'mid-century': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=80',
      'japandi': 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=1400&q=80',
      'industrial': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1400&q=80',
      'biophilic': 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1400&q=80',
      'art-deco': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=80',
    }
  },
  {
    id: 'dining-empty',
    name: 'Modernist Dining & Open Kitchen',
    subtitle: 'Stark white walls with lack of warmth, acoustic resonance, and cold lighting',
    roomType: 'Dining Room',
    originalImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
    styles: {
      'scandinavian': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
      'mid-century': 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1400&q=80',
      'japandi': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      'industrial': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=80',
      'biophilic': 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=80',
      'art-deco': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
    }
  }
];

export const STYLE_CATALOG: StyleOption[] = [
  {
    id: 'mid-century',
    name: 'Mid-Century Modern',
    subtitle: 'Organic forms, warm walnut woods, and iconic retro silhouettes',
    description: 'Emphasizes clean lines, gentle organic curves, a mix of contrasting materials like teak, brass, and textured boucle, paired with iconic sculptural lighting.',
    thumbnail: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=400&q=80',
    palette: ['#C48B58', '#4A5B4C', '#D4A373', '#E9EDC9', '#2B2D42'],
    keyElements: ['Tapered Walnut Legs', 'Brass Sputnik Pendant', 'Olive Wool Rug', 'Curved Accent Chair'],
    vibe: 'Warm, timeless, cultured',
    lighting: 'Warm 2700K layered ambient & brass fixtures'
  },
  {
    id: 'scandinavian',
    name: 'Nordic Scandinavian',
    subtitle: 'Hygge serenity, airy blonde wood, and tactile cozy textures',
    description: 'Rooted in functionality, natural daylight, light oak finishes, layered shearling and linen textiles, creating a calm and restorative sanctuary.',
    thumbnail: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=400&q=80',
    palette: ['#F7F5F0', '#D3D6DB', '#8C9A8E', '#D9C5B2', '#333533'],
    keyElements: ['White Ash Joinery', 'Bouclé Cloud Sofa', 'Woven Paper Cord Lighting', 'Neutral Flatweave Rug'],
    vibe: 'Serene, illuminated, cozy',
    lighting: 'Soft diffused natural daylight with 3000K dimmable lamps'
  },
  {
    id: 'japandi',
    name: 'Japandi Sanctuary',
    subtitle: 'Wabi-sabi simplicity blending Scandinavian calm with Japanese Zen',
    description: 'Minimalism imbued with craftsmanship. Low-slung silhouettes, raw earthenware, slatted oak screens, and subtle muted earthen tones.',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80',
    palette: ['#EAE4D9', '#9C8E7D', '#54504A', '#2D2B28', '#D7A87A'],
    keyElements: ['Low-profile Platform Seating', 'Slatted Wood Partitions', 'Handmade Stoneware', 'Linen Roller Blinds'],
    vibe: 'Mindful, meditative, sculptural',
    lighting: 'Wasabi paper lanterns & indirect floor uplighting'
  },
  {
    id: 'industrial',
    name: 'Industrial Loft',
    subtitle: 'Architectural iron, aged cognac leather, and raw exposed materials',
    description: 'A balance of raw structural materials like black steel, aged brickwork, reclaimed timber, and plush distressed leather upholstery.',
    thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
    palette: ['#2B2D2F', '#8C5E34', '#A89F91', '#4A4E69', '#C06C54'],
    keyElements: ['Cognac Leather Chesterfield', 'Matte Black Steel Shelving', 'Exposed Edison Filament Chandeliers', 'Cement Cast Planters'],
    vibe: 'Edgy, architectural, bold',
    lighting: 'Directional track spotlights & exposed filament amber glow'
  },
  {
    id: 'biophilic',
    name: 'Biophilic Luxe',
    subtitle: 'Living greenery, organic fluid stone, and sun-drenched natural fibers',
    description: 'Connects indoor architecture with nature. Abundant botanical elements, travertine stone, raw linen drapery, and flowing curved geometry.',
    thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
    palette: ['#3A5A40', '#A3B18A', '#DAD7CD', '#588157', '#344E41'],
    keyElements: ['Fluted Travertine Coffee Table', 'Fiddle Leaf Fig & Bird of Paradise', 'Jute & Wool Mixed Rug', 'Curved Linen Sectional'],
    vibe: 'Fresh, organic, revitalizing',
    lighting: 'Full spectrum circadian lighting and skylight simulation'
  },
  {
    id: 'art-deco',
    name: 'Modern Art Deco',
    subtitle: 'Gilded elegance, rich jewel tones, and opulent geometric flair',
    description: 'Dramatic sophistication featuring fluted marble, polished gold and bronze details, deep sapphire or emerald velvet, and geometric statement mirrors.',
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80',
    palette: ['#1B3B4B', '#C9A24C', '#FAF8F5', '#3E2723', '#2C3E50'],
    keyElements: ['Fluted Marble Sideboard', 'Brushed Brass Wall Sconces', 'Navy Velvet Swivel Chair', 'Gilded Geometric Mirror'],
    vibe: 'Glamorous, elevated, tailored',
    lighting: 'Crystal prism reflection & accent cove downlights'
  }
];

export const INITIAL_SHOPPABLE_PRODUCTS: ShoppableProduct[] = [
  {
    id: 'p-1',
    name: 'Kobenhavn Bouclé 3-Seat Sofa',
    brand: 'Muuto & Hay Studio',
    category: 'Furniture',
    price: 1840,
    originalPrice: 2199,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 84,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    retailerUrl: 'https://roomrevise.design/shop/kobenhavn-sofa',
    dimensions: '88" W x 38" D x 31" H',
    material: 'Textured Wool Bouclé, FSC Oak Frame',
    matchScore: 98,
    description: 'Curved architectural frame in tactile textured off-white bouclé fabric with concealed low-profile ash base.'
  },
  {
    id: 'p-2',
    name: 'Gropius Fluted Walnut Coffee Table',
    brand: 'Article Studio',
    category: 'Furniture',
    price: 680,
    originalPrice: 790,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 112,
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
    retailerUrl: 'https://roomrevise.design/shop/gropius-coffee-table',
    dimensions: '44" Dia x 15.5" H',
    material: 'American Solid Walnut & Satin Finish',
    matchScore: 95,
    description: 'Circular architectural table with tambour fluted apron and recessed negative reveal shadowline.'
  },
  {
    id: 'p-3',
    name: 'Atlas Moroccan Indigo Hand-Knotted Rug',
    brand: 'West Elm Workspace',
    category: 'Rug',
    price: 890,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 67,
    imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80',
    retailerUrl: 'https://roomrevise.design/shop/atlas-indigo-rug',
    dimensions: '8\' x 10\' (Custom sizes available)',
    material: '100% Hand-Spun New Zealand Wool',
    matchScore: 96,
    description: 'High-pile plush hand-knotted wool rug dyed in rich mineral indigo with subtle linear ivory motifs.'
  },
  {
    id: 'p-4',
    name: 'Solis Brushed Brass Articulated Chandelier',
    brand: 'Cedar & Moss',
    category: 'Lighting',
    price: 940,
    currency: 'USD',
    rating: 5.0,
    reviewCount: 39,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
    retailerUrl: 'https://roomrevise.design/shop/solis-brass-chandelier',
    dimensions: '48" Span x 22" Drop',
    material: 'Solid Spun Brass & Frosted Opal Glass',
    matchScore: 94,
    description: 'Minimalist multi-arm brass lighting fixture providing soft ambient 2700K glare-free illumination.'
  },
  {
    id: 'p-5',
    name: 'Vase No. 4 Terracotta & Glazed Ceramic',
    brand: 'Ferm Living Collective',
    category: 'Decor',
    price: 145,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
    retailerUrl: 'https://roomrevise.design/shop/ferm-vase-4',
    dimensions: '9" W x 14" H',
    material: 'Handcrafted Unglazed Stoneware',
    matchScore: 91,
    description: 'Sculptural organic vessel finished in raw earthen matte clay with subtle tactile ribbing.'
  }
];

export const INITIAL_PROJECTS: DesignProject[] = [
  {
    id: 'proj-1',
    title: 'The Mercer Penthouse Living Room',
    clientName: 'Julian & Evelyn Vance',
    clientEmail: 'evelyn.vance@sohoinvestments.com',
    roomType: 'Penthouse Living Room & Terrace',
    spaceDimensions: '24ft x 18ft (432 sq ft, 11ft ceiling)',
    budgetTotal: 45000,
    budgetSpent: 28450,
    status: 'Review',
    currentVersion: 'v2.2',
    versions: [
      {
        version: 'v1.0',
        label: 'Initial Spatial Concept',
        style: 'Mid-Century Modern',
        imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80',
        createdAt: '2026-08-28'
      },
      {
        version: 'v2.0',
        label: 'Client Colorway Revision (Navy & Brass)',
        style: 'Mid-Century Modern',
        imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
        createdAt: '2026-09-08'
      },
      {
        version: 'v2.2',
        label: 'Procurement Sourced Model',
        style: 'Mid-Century Modern',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80',
        createdAt: '2026-09-15'
      }
    ],
    originalImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
    activeImageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80',
    activeStyle: 'Mid-Century Modern',
    milestones: [
      {
        id: 'm-1',
        title: 'Photogrammetry & Spatial Upload',
        description: 'Complete high-resolution space capture and accurate dimensional floor-plan mapping.',
        dueDate: '2026-08-25',
        status: 'completed',
        progress: 100,
        assignedTo: 'Marcus Reed (Lead Spatialist)',
        deliverables: ['Original 4K Panoramas', 'Laser Measure DXF', 'Client Style Brief']
      },
      {
        id: 'm-2',
        title: 'AI Style Iteration & 3D Reimagining',
        description: 'Generate 5 distinct architectural styles with compare sliders and client feedback review.',
        dueDate: '2026-09-05',
        status: 'completed',
        progress: 100,
        assignedTo: 'Elena Rostova (Senior Designer)',
        deliverables: ['Scandinavian v1', 'Mid-Century Modern v2.2', 'Japandi Concept']
      },
      {
        id: 'm-3',
        title: 'Client Interactive Revision & Approval',
        description: 'Collaborative pin review on fabric swatches, custom rug dimensions, and ceiling chandelier drop.',
        dueDate: '2026-09-22',
        status: 'in-progress',
        progress: 75,
        assignedTo: 'Elena Rostova & Client',
        deliverables: ['Live Annotation Review', 'Fabric Sample Approval', 'Final Specification Sign-off']
      },
      {
        id: 'm-4',
        title: 'FF&E Procurement & Vendor Invoicing',
        description: 'Ordering custom sofa, Italian brass lighting, and automated expense reconciliation.',
        dueDate: '2026-10-10',
        status: 'upcoming',
        progress: 20,
        assignedTo: 'Tanya Chen (Procurement Head)',
        deliverables: ['Vendor Purchase Orders', 'Scanned Receipts Package', 'Budget Audit Report']
      },
      {
        id: 'm-5',
        title: 'Site Delivery & Final Art Styling',
        description: 'White-glove delivery, millwork install, hanging art, and client handover champagne walk.',
        dueDate: '2026-10-25',
        status: 'upcoming',
        progress: 0,
        assignedTo: 'Full Studio Team',
        deliverables: ['Installation Verification', 'Care & Warranty Dossier']
      }
    ],
    annotations: [
      {
        id: 'pin-1',
        xPercent: 42,
        yPercent: 68,
        author: 'Evelyn Vance',
        role: 'Client',
        comment: 'We adore this low walnut coffee table, but can we confirm it has softened rounded edges for toddlers?',
        timestamp: '2 hours ago',
        resolved: true,
        tag: 'Furniture'
      },
      {
        id: 'pin-2',
        xPercent: 62,
        yPercent: 32,
        author: 'Elena Rostova',
        role: 'Designer',
        comment: 'Specified cedar brass chandelier wired on a Lutron Caséta dimmer with 2700K warm dim profile.',
        timestamp: 'Yesterday',
        resolved: false,
        tag: 'Lighting'
      },
      {
        id: 'pin-3',
        xPercent: 50,
        yPercent: 82,
        author: 'Evelyn Vance',
        role: 'Client',
        comment: 'Please refine rug: keep this geometric motif but tint towards deep sapphire navy rather than mustard.',
        timestamp: '1 day ago',
        resolved: false,
        tag: 'Color'
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'Tribeca Loft Master Suite',
    clientName: 'Harrison Cole',
    clientEmail: 'h.cole@tribecacapital.com',
    roomType: 'Master Suite & Dressing Room',
    spaceDimensions: '20ft x 16ft (320 sq ft)',
    budgetTotal: 32000,
    budgetSpent: 16200,
    status: 'Active',
    currentVersion: 'v1.4',
    versions: [
      {
        version: 'v1.0',
        label: 'Initial Loft Concept',
        style: 'Japandi Sanctuary',
        imageUrl: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=1400&q=80',
        createdAt: '2026-09-02'
      }
    ],
    originalImageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1400&q=80',
    activeImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
    activeStyle: 'Japandi Sanctuary',
    milestones: [],
    annotations: []
  }
];

export const INITIAL_RECEIPTS: ScannedReceipt[] = [
  {
    id: 'rec-001',
    projectId: 'proj-1',
    merchant: 'Cedar & Moss Lighting Studio',
    date: '2026-09-12',
    invoiceNumber: 'INV-88291',
    category: 'Lighting',
    items: [
      { description: 'Solis Brushed Brass Articulated Chandelier', qty: 1, amount: 940.00 },
      { description: 'Solid Brass Wall Sconces - Dim to Warm', qty: 2, amount: 560.00 },
      { description: 'White-glove insured freight shipping', qty: 1, amount: 85.00 }
    ],
    subtotal: 1585.00,
    tax: 139.48,
    total: 1724.48,
    status: 'Approved',
    department: 'Procurement',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554415707-9e49fe83083f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rec-002',
    projectId: 'proj-1',
    merchant: 'Design Within Reach / Article',
    date: '2026-09-14',
    invoiceNumber: 'DWR-901844',
    category: 'FF&E',
    items: [
      { description: 'Kobenhavn 3-Seat Wool Bouclé Sofa', qty: 1, amount: 1840.00 },
      { description: 'Walnut Tambour Drum End Table', qty: 2, amount: 720.00 },
      { description: 'Fabric Protection Coating & Warranty (5yr)', qty: 1, amount: 160.00 }
    ],
    subtotal: 2720.00,
    tax: 239.36,
    total: 2959.36,
    status: 'Approved',
    department: 'Design Studio',
    receiptImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rec-003',
    projectId: 'proj-1',
    merchant: 'Sherwin-Williams Architectural Pro',
    date: '2026-09-16',
    invoiceNumber: 'SW-672109',
    category: 'Finishes & Paint',
    items: [
      { description: 'Emerald Interior Matte - Alabaster 7008 (5 Gal)', qty: 2, amount: 395.00 },
      { description: 'Primer Pre-Wall Conditioner', qty: 1, amount: 75.00 },
      { description: 'Purdy Pro Roller & Dropcloth Package', qty: 1, amount: 84.50 }
    ],
    subtotal: 554.50,
    tax: 48.79,
    total: 603.29,
    status: 'Processed',
    department: 'Project Management',
    receiptImageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rec-004',
    projectId: 'proj-1',
    merchant: 'Apex Precision Millwork & Electric',
    date: '2026-09-17',
    invoiceNumber: 'APEX-3041',
    category: 'Contractor & Labor',
    items: [
      { description: 'Drywall backing & ceiling chandelier structural box', qty: 1, amount: 1250.00 },
      { description: 'Lutron Caséta Smart Dimmer Line Installation', qty: 4, amount: 680.00 }
    ],
    subtotal: 1930.00,
    tax: 0.00,
    total: 1930.00,
    status: 'Processed',
    department: 'Executive',
    receiptImageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80'
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Solo Designer',
    tagline: 'Ideal for independent interior designers & boutique consultants',
    monthlyPrice: 49,
    annualPrice: 39,
    features: [
      'Up to 5 Active Client Projects',
      '75 High-Resolution AI Renders / mo',
      'Interactive Compare Slider for Clients',
      'Automated Shoppable Product Sourcing',
      'Basic Receipt Upload & OCR Scanner',
      'Email Support within 24 hours'
    ],
    limits: {
      projects: 5,
      aiRendersPerMonth: 75,
      teamSeats: 1,
      clientPortals: true,
      receiptScanner: true,
      priorityProcessing: false
    }
  },
  {
    id: 'pro',
    name: 'Studio Pro',
    tagline: 'Engineered for scaling interior design firms & remote studios',
    monthlyPrice: 149,
    annualPrice: 119,
    popular: true,
    features: [
      '25 Active Client Projects',
      'Unlimited High-Resolution AI Renders',
      'Real-Time Collaborative Pin Annotations',
      'Client Revision Approval Workflow',
      'Mobile Receipt Scanning & Expense Reports',
      'Project Milestones & Deliverable Tracking',
      'Department Financial Health & Margin Monitor',
      'Priority AI Render Pipeline'
    ],
    limits: {
      projects: 25,
      aiRendersPerMonth: 'Unlimited',
      teamSeats: 5,
      clientPortals: true,
      receiptScanner: true,
      priorityProcessing: true
    }
  },
  {
    id: 'agency',
    name: 'Enterprise Agency',
    tagline: 'Full enterprise control for multi-office architectural firms',
    monthlyPrice: 399,
    annualPrice: 319,
    features: [
      'Unlimited Client Projects & Team Seats',
      'Custom White-Label Client Portal & Branding',
      'Multi-Entity Billing & Department Budget Controls',
      'Direct ERP / QuickBooks & Accounting Sync',
      'Dedicated Design Tech Account Manager',
      '99.9% Uptime SLA & Custom AI Model Tuning'
    ],
    limits: {
      projects: 'Unlimited',
      aiRendersPerMonth: 'Unlimited',
      teamSeats: 'Unlimited',
      clientPortals: true,
      receiptScanner: true,
      priorityProcessing: true
    }
  }
];
