// ─── Shipping Address (matches Strapi order.shipping-address component) ──
export type ShippingAddress = {
  name: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

// ─── Order Item (matches Strapi order.order-item component) ──
export type OrderItemData = {
  product: number; // Strapi product ID (relation)
  productName: string;
  slug: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

// ─── Delivery Estimate (returned by serviceability API) ──
export type DeliveryEstimate = {
  serviceable: boolean;
  city: string;
  state: string;
  country: string;
  shippingCost: number;
  estimatedDays: string; // e.g., "3-5 business days"
  courierName: string;
  courierId: string | number; // iCarry courier identifier for booking
};

// ─── Payment Method ──
export type PaymentMethod = "cod" | "online";

// ─── Order Status (matches Strapi enum) ──
// ─── Order Status (matches Strapi enum) ──
export type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

// ─── Payment Status (matches Strapi enum) ──
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// ─── Checkout Step ──
export type CheckoutStep = 1 | 2 | 3;

// ─── Checkout State (client-side form state) ──
export type CheckoutState = {
  step: CheckoutStep;
  // Step 1: Mobile verification
  phoneNumber: string;
  isPhoneVerified: boolean;
  firebaseIdToken: string | null;
  // Step 2: Address & delivery
  pincode: string;
  deliveryEstimate: DeliveryEstimate | null;
  fullName: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  // Step 3: Payment
  paymentMethod: PaymentMethod;
};

// ─── API Request/Response Types ──

export type ServiceabilityRequest = {
  pincode: string;
  paymentMethod: PaymentMethod;
};

export type ServiceabilityResponse = {
  success: boolean;
  data?: DeliveryEstimate;
  error?: string;
};

export type PlaceOrderRequest = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: ShippingAddress;
  items: OrderItemData[];
  paymentMethod: PaymentMethod;
  courierName: string;
  courierId: string | number;
  shippingCost: number;
  courierEstimate: string;
  notes?: string;
  couponCode?: string;
};

export type PlaceOrderResponse = {
  success: boolean;
  data?: {
    orderId: string;
    orderStatus: OrderStatus;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    discountAmount?: number;
  };
  // Present only when paymentMethod === "online" — needed to open Razorpay Checkout.
  razorpay?: {
    keyId: string;
    razorpayOrderId: string;
    amount: number; // paise
    currency: string;
  };
  error?: string;
};

// ─── Coupons ──

export type ApplyCouponRequest = {
  code: string;
  subtotal: number;
};

export type ApplyCouponResponse = {
  success: boolean;
  data?: {
    code: string;
    discountAmount: number;
    discountType: "percentage" | "flat";
    discountValue: number;
  };
  error?: string;
};

// ─── Payment Verification (Razorpay) ──

export type PaymentVerifyRequest = {
  orderId: string; // our AAU-... orderId
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type PaymentVerifyResponse = {
  success: boolean;
  data?: {
    orderId: string;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    shipmentBooked: boolean;
    alreadyProcessed?: boolean;
  };
  error?: string;
};

// ─── Order (full order from Strapi, for confirmation page) ──
export type StrapiOrder = {
  id: number;
  documentId: string;
  orderId: string;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  couponCode: string | null;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  orderItem: OrderItemData[];
  courierName: string;
  courierEstimate: string;
  icarryShipmentId: string | null;
  trackingId: string | null;
  trackingUrl: string | null;
  labelUrl: string | null;
  paymentGatewayOrderId: string | null;
  paymentGatewayPaymentId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
