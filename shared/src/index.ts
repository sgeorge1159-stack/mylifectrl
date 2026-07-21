// Shared types for LifeCTRL

// ── User ──
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  name: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

// ── Action Plans ──
export type PlanStatus = 'active' | 'completed' | 'archived';

export interface Plan {
  id: number;
  user_id: number;
  title: string;
  description: string;
  situation: string;
  status: PlanStatus;
  disclaimer?: string;
  created_at: string;
  updated_at: string;
}

export interface PlanCreate {
  title: string;
  description?: string;
  situation: string;
}

export interface PlanGenerateRequest {
  title?: string;
  situation: string;
}

// ── Tasks ──
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: number;
  plan_id: number;
  title: string;
  description: string;
  priority: number;
  status: TaskStatus;
  category: string;
  resources: string;
  estimated_time: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  plan_id: number;
  title: string;
  description?: string;
  priority?: number;
  category?: string;
  resources?: string;
  estimated_time?: string;
  due_date?: string;
}

export interface TaskUpdate {
  completed?: boolean;
  status?: TaskStatus;
  priority?: number;
  title?: string;
  description?: string;
  due_date?: string;
}

// ── AI Generated Plan ──
export interface GeneratedTask {
  title: string;
  description: string;
  priority: number; // 1-5
  estimated_time: string;
  category: string;
  resources: string[];
}

export interface GeneratedPlan {
  title: string;
  description: string;
  tasks: GeneratedTask[];
  disclaimer: string;
}

// ── Documents ──
export type DocCategory = 'financial' | 'employment' | 'housing' | 'legal' | 'healthcare' | 'identification' | 'tax' | 'insurance' | 'education' | 'correspondence' | 'other';

export interface KeyDetail {
  label: string;
  value: string;
}

export interface Document {
  id: number;
  user_id: number;
  filename: string;
  original_name: string;
  category: string;
  summary: string | null;
  file_type: string;
  file_size: number;
  key_details: string;
  ai_processed: number;
  created_at: string;
}

export interface DocumentAnalysis {
  category: DocCategory;
  summary: string;
  key_details: KeyDetail[];
  suggested_tags: string[];
}

// ── Vault Items ──
export interface VaultItem {
  id: number;
  user_id: number;
  document_id: number | null;
  title: string;
  description: string;
  tags: string;
  created_at: string;
}

// ── Life Kits ──
export interface Kit {
  id: number;
  title: string;
  description: string;
  category: string;
  price_cents: number;
  content: string;
  created_at: string;
}

export interface Purchase {
  id: number;
  user_id: number;
  kit_id: number;
  purchased_at: string;
}

// ── Concierge Bookings ──
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ConciergeBooking {
  id: number;
  user_id: number;
  topic: string;
  description: string;
  preferred_time: string;
  status: BookingStatus;
  created_at: string;
}

export interface ConciergeBookingCreate {
  topic: string;
  description: string;
  preferred_time: string;
}

// ── API Responses ──
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  ok: boolean;
  token?: string;
  user?: User;
  error?: string;
}
