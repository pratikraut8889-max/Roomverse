export interface StyleOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  palette: string[];
  keyElements: string[];
  vibe: string;
  lighting: string;
}

export interface ShoppableProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Furniture' | 'Lighting' | 'Rug' | 'Decor' | 'Textile' | 'Art';
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  retailerUrl: string;
  dimensions: string;
  material: string;
  matchScore: number;
  description: string;
}

export interface DesignRevisionMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  suggestedChanges?: string[];
  shoppableProducts?: ShoppableProduct[];
  updatedStyleSummary?: {
    colorUpdate?: string;
    lightingUpdate?: string;
    furnitureUpdate?: string;
  };
}

export interface AnnotationPin {
  id: string;
  xPercent: number;
  yPercent: number;
  author: string;
  role: 'Designer' | 'Client' | 'Department Head';
  comment: string;
  timestamp: string;
  resolved: boolean;
  tag?: 'Lighting' | 'Furniture' | 'Color' | 'Flooring' | 'Dimension';
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  progress: number;
  assignedTo: string;
  deliverables: string[];
}

export interface DesignProject {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  roomType: string;
  spaceDimensions: string;
  budgetTotal: number;
  budgetSpent: number;
  status: 'Active' | 'Review' | 'Approved' | 'Procurement';
  currentVersion: string;
  versions: {
    version: string;
    label: string;
    style: string;
    imageUrl: string;
    createdAt: string;
  }[];
  originalImageUrl: string;
  activeImageUrl: string;
  activeStyle: string;
  milestones: ProjectMilestone[];
  annotations: AnnotationPin[];
}

export interface ScannedReceipt {
  id: string;
  projectId: string;
  merchant: string;
  date: string;
  invoiceNumber: string;
  category: 'FF&E' | 'Lighting' | 'Finishes & Paint' | 'Contractor & Labor' | 'Soft Furnishings' | 'Travel & Logistics';
  items: { description: string; qty: number; amount: number }[];
  subtotal: number;
  tax: number;
  total: number;
  receiptImageUrl?: string;
  status: 'Processed' | 'Approved' | 'Flagged';
  department: 'Design Studio' | 'Procurement' | 'Project Management' | 'Executive';
}

export interface SubscriptionPlan {
  id: 'starter' | 'pro' | 'agency';
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  popular?: boolean;
  limits: {
    projects: number | string;
    aiRendersPerMonth: number | string;
    teamSeats: number | string;
    clientPortals: boolean;
    receiptScanner: boolean;
    priorityProcessing: boolean;
  };
}
