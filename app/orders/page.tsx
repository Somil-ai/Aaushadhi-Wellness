import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

type OrderListItem = {
  orderId: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  discountAmount: number;
  createdAt: string;
  orderItem: { productName: string; imageUrl: string; quantity: number }[];
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function getMyOrders(): Promise<OrderListItem[]> {
  const session = await getSession();
  if (!session) return [];

  const query = new URLSearchParams({
    "filters[customerEmail][$eq]": session.email,
    "sort": "createdAt:desc",
    "populate[orderItem]": "true",
    "pagination[pageSize]": "50",
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/orders?${query}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    cache: "no-store",
  });

  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const orders = await getMyOrders();

  return (
    <div className="min-h-screen bg-parchment/30">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1
          className="text-2xl font-bold text-text-dark mb-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          My Orders
        </h1>
        <p className="text-text-muted text-sm mb-8">
          {orders.length} {orders.length === 1 ? "order" : "orders"} placed so far
        </p>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-muted text-sm mb-4">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 rounded-full bg-olive text-white text-sm font-semibold uppercase tracking-wider hover:bg-olive-light transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.orderId}
                href={`/checkout/confirmation?orderId=${order.orderId}`}
                className="block p-5 rounded-2xl bg-white border border-olive/10 hover:border-olive/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-text-dark text-sm">
                      {order.orderId}
                    </p>
                    <p className="text-text-muted text-xs mt-0.5">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block px-3 py-1 rounded-full bg-olive/10 text-olive text-[11px] font-bold uppercase tracking-wider">
                      {STATUS_LABEL[order.orderStatus] || order.orderStatus}
                    </span>
                    <p className="font-bold text-text-dark text-sm mt-1.5">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {(order.orderItem || []).slice(0, 4).map((item, i) => (
                    <span
                      key={i}
                      className="text-xs text-text-muted bg-parchment/50 px-2 py-1 rounded-lg"
                    >
                      {item.productName} × {item.quantity}
                    </span>
                  ))}
                  {(order.orderItem || []).length > 4 && (
                    <span className="text-xs text-text-muted">
                      +{order.orderItem.length - 4} more
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-text-muted mt-3">
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
                  {order.paymentStatus === "paid" && " · Paid"}
                  {order.paymentStatus === "refunded" && " · Refunded"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
