export type FabricPattern =
  | "aso-oke"
  | "adire"
  | "akwete"
  | "george"
  | "ankara"
  // | "atiku"
  | "hollandais"
  | "lace"
  | "guinea-brocade"
  | "tribal-ankara"
  | "velvet"
  | "senator"
  | "brocade";
// | "kente";

export interface FabricColor {
  name: string;
  hex: string;
}

/** How a fabric is sold, e.g. by the yard or as a fixed piece/set. */
export interface SellingUnit {
  /** Singular label: "yard", "6-yard piece" */
  name: string;
  plural: string;
  min: number;
  max: number;
  defaultQty: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  origin: string;
  /** Typical uses, shown on category and product pages */
  uses: string[];
  material: string;
  width: string;
  care: string;
  pattern: FabricPattern;
  unit: SellingUnit;
  /** Resolved, ready-to-render image URL, or null to fall back to the generated swatch */
  image: string | null;
}

export type ProductBadge = "Bestseller" | "New" | "Handwoven";

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  pattern: FabricPattern;
  unit: SellingUnit;
  /** Price in Naira (₦) per selling unit */
  price: number;
  colors: FabricColor[];
  description: string;
  badge?: ProductBadge | null;
  featured: boolean;
  stock: number;
  active: boolean;
  /** Resolved, ready-to-render image URLs. Empty means fall back to the generated swatch. */
  images: string[];
}

/** A fully self-contained cart line: everything needed to render and total it lives here,
 *  so the cart never has to look the product up again. The server re-checks price and stock
 *  from the database at checkout time regardless of what the cart says. */
export interface CartItem {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  pattern: FabricPattern;
  colors: string[];
  price: number;
  image: string | null;
  unit: SellingUnit;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
}

export const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAYMENT_CONFIRMED",
  "PROCESSING",
  "READY_FOR_DISPATCH",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pending payment",
  PAYMENT_CONFIRMED: "Payment confirmed",
  PROCESSING: "Processing",
  READY_FOR_DISPATCH: "Ready for dispatch",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

/** The steps shown on the customer tracking timeline, in order. Cancelled is shown separately. */
export const TRACKING_STEPS: OrderStatus[] = [
  "PAYMENT_CONFIRMED",
  "PROCESSING",
  "READY_FOR_DISPATCH",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface OrderItemRecord {
  id: string;
  slug: string;
  name: string;
  unitLabel: string;
  price: number;
  quantity: number;
}

export interface OrderStatusEvent {
  id: string;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  email: string;
  phone: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  notes: string | null;
  subtotal: number;
  delivery: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paystackRef: string | null;
  trackingNumber: string | null;
  courier: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemRecord[];
  statusHistory: OrderStatusEvent[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}
