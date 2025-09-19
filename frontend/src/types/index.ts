// User Types
export interface User {
  id: string;
  phone_number: string;
  user_type: 'farmer' | 'buyer' | 'retailer' | 'admin';
  name: string;
  email?: string;
  aadhar_number?: string;
  gst_number?: string;
  district: string;
  taluk?: string;
  village?: string;
  address?: string;
  bank_account?: string;
  ifsc_code?: string;
  is_verified: boolean;
  is_active: boolean;
  language: 'tamil' | 'english';
  profile_image?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

// Crop Types
export interface Crop {
  id: string;
  crop_name: string;
  crop_name_tamil: string;
  category: string;
  harvest_season: string;
  typical_districts?: string[];
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Product Types
export interface Product {
  id: string;
  farmer_id: string;
  crop_id: string;
  variety: string;
  grade: 'A' | 'B' | 'C';
  quantity: number;
  unit: 'quintal' | 'kilogram' | 'tonne';
  price_per_unit: number;
  harvest_date: string;
  delivery_window: number;
  description?: string;
  images?: string[];
  is_available: boolean;
  is_organic: boolean;
  certification?: string;
  created_at: string;
  updated_at: string;
  farmer?: User;
  crop?: Crop;
}

// Order Types
export interface Order {
  id: string;
  buyer_id: string;
  farmer_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_address: string;
  delivery_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  buyer?: User;
  farmer?: User;
  product?: Product;
}

// Chat Types
export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  product_id?: string;
  message: string;
  message_type: 'text' | 'image' | 'file' | 'offer';
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: User;
  receiver?: User;
  product?: Product;
}

// Price Types
export interface PriceHistory {
  id: string;
  crop_id: string;
  district: string;
  price_per_kg: number;
  date: string;
  source: string;
  grade: 'A' | 'B' | 'C';
  created_at: string;
  updated_at: string;
  crop?: Crop;
}

export interface PricePrediction {
  id: string;
  crop_id: string;
  district: string;
  predicted_price: number;
  confidence_score: number;
  prediction_date: string;
  model_version?: string;
  created_at: string;
  updated_at: string;
  crop?: Crop;
}

// Contract Types
export interface Contract {
  id: string;
  order_id: string;
  farmer_signature?: string;
  buyer_signature?: string;
  contract_terms: string;
  status: 'draft' | 'signed' | 'executed' | 'terminated';
  created_at: string;
  updated_at: string;
  order?: Order;
}

// API Response Types
export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
  details?: any[];
}

export interface PaginatedResponse<T> {
  message: string;
  data: {
    items: T[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      limit: number;
    };
  };
}

// Filter Types
export interface ProductFilters {
  page?: number;
  limit?: number;
  district?: string;
  crop_type?: string;
  grade?: 'A' | 'B' | 'C';
  min_price?: number;
  max_price?: number;
  sort_by?: 'price' | 'rating' | 'harvest_date' | 'created_at';
  sort_order?: 'asc' | 'desc';
  search?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  payment_status?: string;
  farmer_id?: string;
  buyer_id?: string;
  start_date?: string;
  end_date?: string;
}

// Form Types
export interface LoginForm {
  phone_number: string;
  user_type: 'farmer' | 'buyer' | 'retailer';
}

export interface RegisterForm {
  phone_number: string;
  user_type: 'farmer' | 'buyer' | 'retailer';
  name: string;
  email?: string;
  aadhar_number?: string;
  gst_number?: string;
  district: string;
  taluk?: string;
  village?: string;
  address?: string;
  bank_account?: string;
  ifsc_code?: string;
  language?: 'tamil' | 'english';
}

export interface ProductForm {
  crop_id: string;
  variety: string;
  grade: 'A' | 'B' | 'C';
  quantity: number;
  unit: 'quintal' | 'kilogram' | 'tonne';
  price_per_unit: number;
  harvest_date: string;
  delivery_window: number;
  description?: string;
  images?: string[];
  is_organic?: boolean;
  certification?: string;
}

export interface OrderForm {
  product_id: string;
  quantity: number;
  delivery_address: string;
  delivery_date?: string;
  notes?: string;
}

// Statistics Types
export interface UserStats {
  total_products?: number;
  active_products?: number;
  total_orders?: number;
  total_earnings?: number;
  total_spent?: number;
  pending_orders?: number;
}

export interface DashboardStats {
  total_users: number;
  total_farmers: number;
  total_buyers: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  active_users: number;
  pending_verifications: number;
}

// Language Types
export interface Language {
  code: 'tamil' | 'english';
  name: string;
  native_name: string;
}

export interface Translation {
  [key: string]: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  district?: string;
  taluk?: string;
  village?: string;
}

// ML/AI Types
export interface CropRecommendation {
  crop_id: string;
  crop_name: string;
  crop_name_tamil: string;
  confidence_score: number;
  reasons: string[];
  expected_yield?: number;
  market_demand?: number;
}

export interface PriceAnalytics {
  average_price: number;
  min_price: number;
  max_price: number;
  price_change: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Socket Types
export interface SocketEvents {
  'message:new': (message: ChatMessage) => void;
  'message:read': (messageId: string) => void;
  'order:update': (order: Order) => void;
  'notification:new': (notification: Notification) => void;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}
