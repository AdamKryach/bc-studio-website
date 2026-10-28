export type PublicationStatus = 'published' | 'draft';
export type AvailabilityMode = 'download' | 'test_only' | 'download_and_test';

export interface Game {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  coverImageUrl: string;
  screenshots: string[];
  genre: string;
  platforms: string[];
  version: string;
  releaseDate: string;
  systemRequirements: {
    minimum: string;
    recommended: string;
  };
  publicationStatus: PublicationStatus;
  availabilityMode: AvailabilityMode;
  releaseBuildStoragePath: string | null;
  releaseBuildFilename: string | null;
  releaseBuildSizeBytes: number | null;
  testBuildStoragePath: string | null;
  testBuildFilename: string | null;
  testBuildSizeBytes: number | null;
  testInstructions: string;
  testInviteRequired: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  category: 'Announcement' | 'Game Release' | 'Devlog' | 'CTF Report' | 'Cybersecurity Research' | 'Technical';
  tags: string[];
  authorLabel: string;
  publicationStatus: PublicationStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityTool {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  projectUrl: string;
  documentationUrl: string;
  technologies: string[];
  purpose: string;
  intendedAudience: string;
  status: 'Active' | 'Research' | 'Beta' | 'Archived';
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CTFChallenge {
  name: string;
  category: 'Web' | 'Pwn/Binary' | 'Crypto' | 'Reverse' | 'Forensics' | 'Misc';
  points: number;
  solvedBy?: string;
}

export interface CTFEntry {
  id: string;
  title: string;
  slug: string;
  competitionName: string;
  organizer: string;
  eventDate: string;
  teamLabel: string;
  verifiedPlacement: string;
  score: string | number;
  challenges: CTFChallenge[];
  writeup: string;
  lessonsLearned: string;
  disclosureNotes: string;
  references: string[];
  featuredImageUrl: string;
  publicationStatus: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudioSettings {
  studioName: string;
  foundedYear: number;
  tagline: string;
  description: string;
  logoUrl: string;
  contactEmail: string;
  securityEmail: string;
  socialLinks: {
    github?: string;
    twitter?: string;
    discord?: string;
    itch?: string;
    steam?: string;
  };
  footerText: string;
  seoDefaults: {
    metaTitle: string;
    metaDescription: string;
  };
  featuredGameSlugs: string[];
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: 'General' | 'Playtest' | 'Security Disclosure' | 'Partnership';
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  username: string;
  details?: string;
  ip?: string;
}

export interface DownloadToken {
  token: string;
  gameId: string;
  type: 'release' | 'test';
  filename: string;
  filePath: string;
  expiresAt: number; // epoch ms
}

export interface DatabaseSchema {
  games: Game[];
  news: NewsArticle[];
  tools: SecurityTool[];
  ctf: CTFEntry[];
  settings: StudioSettings;
  messages: ContactMessage[];
  auditLogs: AuditLogEntry[];
}
