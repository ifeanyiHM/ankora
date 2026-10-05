import { ORDER_STATUS_LABELS, type OrderRecord, type OrderStatus } from "@/types";
import { formatNaira } from "@/lib/format";
import { SITE } from "@/config/site";

const shell = (title: string, body: string) => `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#0a0a0a">
  <div style="background:#008751;padding:20px 24px;border-radius:8px 8px 0 0">
    <span style="color:#fff;font-size:20px;font-weight:700">Ankora</span>
  </div>
  <div style="border:1px solid #e4e4e4;border-top:none;border-radius:0 0 8px 8px;padding:24px">
    <h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
    ${body}
  </div>
  <p style="color:#888;font-size:12px;margin-top:16px">Ankora &middot; ${SITE.email}</p>
</div>`;

const itemsTable = (order: OrderRecord) => `
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    ${order.items
      .map(
        (i) => `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}<br><span style="color:#888;font-size:13px">${i.quantity} ${i.quantity === 1 ? i.unitLabel : i.unitLabel}</span></td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${formatNaira(i.price * i.quantity)}</td>
        </tr>`,
      )
      .join("")}
    <tr><td style="padding:8px 0;color:#888">Delivery</td><td style="padding:8px 0;text-align:right;color:#888">${order.delivery ? formatNaira(order.delivery) : "Free"}</td></tr>
    <tr><td style="padding:8px 0;font-weight:700">Total</td><td style="padding:8px 0;text-align:right;font-weight:700">${formatNaira(order.total)}</td></tr>
  </table>`;

const trackLink = (order: OrderRecord) => `${SITE.url}/track-order?order=${encodeURIComponent(order.orderNumber)}`;

export function orderConfirmationEmail(order: OrderRecord) {
  const html = shell(
    "Payment received, thank you!",
    `<p>Hi ${order.fullName.split(" ")[0]}, we've received your payment and your order is being prepared.</p>
     <p><strong>Order number:</strong> ${order.orderNumber}</p>
     ${itemsTable(order)}
     <p>Delivering to: ${order.address}, ${order.city}, ${order.state}</p>
     <p><a href="${trackLink(order)}" style="color:#008751;font-weight:700">Track your order</a></p>`,
  );
  return { subject: `Ankora order ${order.orderNumber}: payment received`, html, text: `Order ${order.orderNumber} paid. Total ${formatNaira(order.total)}. Track: ${trackLink(order)}` };
}

export function orderStatusEmail(order: OrderRecord, status: OrderStatus) {
  const label = ORDER_STATUS_LABELS[status];
  const extra =
    status === "SHIPPED" && order.trackingNumber
      ? `<p>Tracking number: <strong>${order.trackingNumber}</strong>${order.courier ? ` (${order.courier})` : ""}</p>`
      : "";
  const html = shell(
    `Your order is now: ${label}`,
    `<p>Hi ${order.fullName.split(" ")[0]}, here's an update on order <strong>${order.orderNumber}</strong>.</p>
     ${extra}
     <p><a href="${trackLink(order)}" style="color:#008751;font-weight:700">Track your order</a></p>`,
  );
  return { subject: `Ankora order ${order.orderNumber}: ${label}`, html, text: `Order ${order.orderNumber} is now ${label}. Track: ${trackLink(order)}` };
}
