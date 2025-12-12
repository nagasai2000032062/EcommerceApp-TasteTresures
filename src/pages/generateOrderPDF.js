// import html2pdf from "html2pdf.js";
// import moment from "moment";
// import { imageToBase64 } from "./OrderPdf";

// export const generateOrderPDF = async (order) => {
//   if (!order) return;

//   const totalQty = order.items.reduce((acc, it) => acc + it.quantity, 0);
//   const totalPrice = order.items.reduce(
//     (acc, it) => acc + it.quantity * it.price,
//     0
//   );

//   const html = `
//     <div style="font-family: Arial, sans-serif; padding: 25px; width: 100%;">

//       <!-- Header -->
//       <h2 style="text-align: center; margin-bottom: 5px;">ORDER INVOICE</h2>
//       <p style="text-align: center; color: #666; margin-top: 0">
//         Thank you for shopping with us!
//       </p>
//       <hr style="margin: 20px 0;"/>

//       <!-- Order Information -->
//       <h3 style="margin: 0;">Order Information</h3>
//       <p style="margin: 2px 0;"><b>Order ID:</b> ${order.id}</p>
//       <p style="margin: 2px 0;"><b>Status:</b> ${order.status}</p>
//       <p style="margin: 2px 0;"><b>Date:</b> ${moment(order.createdAt).format(
//         "DD-MMM-YYYY"
//       )}</p>

//       <hr style="margin: 20px 0;"/>

//       <!-- Buyer Information -->
//       <h3 style="margin: 0;">Customer Details</h3>
//       <p style="margin: 2px 0;"><b>Name:</b> ${order.buyer?.name}</p>
//       <p style="margin: 2px 0;"><b>Address:</b> ${
//         order.orderAddress || "N/A"
//       }</p>

//       <hr style="margin: 20px 0;"/>

//       <!-- Products Table -->
//       <h3 style="margin-bottom: 5px;">Products</h3>

//       <table style="width: 100%; border-collapse: collapse;">
//         <thead>
//           <tr style="background: #f3f3f3;">
//             <th style="padding: 8px; border: 1px solid #ccc;">Product</th>
//             <th style="padding: 8px; border: 1px solid #ccc;">Variant</th>
//             <th style="padding: 8px; border: 1px solid #ccc;">Price</th>
//             <th style="padding: 8px; border: 1px solid #ccc;">Qty</th>
//             <th style="padding: 8px; border: 1px solid #ccc;">Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${order.items
//             .map(
//               (item) => `
//               <tr>
//                 <td style="padding: 8px; border: 1px solid #ccc;">${
//                   item.productName
//                 }</td>
//                 <td style="padding: 8px; border: 1px solid #ccc;">${
//                   item.variant || "—"
//                 }</td>
//                 <td style="padding: 8px; border: 1px solid #ccc;">₹${
//                   item.price
//                 }</td>
//                 <td style="padding: 8px; border: 1px solid #ccc;">${
//                   item.quantity
//                 }</td>
//                 <td style="padding: 8px; border: 1px solid #ccc;">₹${
//                   item.quantity * item.price
//                 }</td>
//               </tr>
//             `
//             )
//             .join("")}
//         </tbody>
//       </table>

//       <hr style="margin: 20px 0;"/>

//       <!-- Summary -->
//       <h3 style="margin: 0;">Order Summary</h3>
//       <p style="margin: 2px 0;"><b>Total Quantity:</b> ${totalQty}</p>
//       <p style="margin: 2px 0;"><b>Total Amount:</b> ₹${totalPrice.toFixed(
//         2
//       )}</p>

//       <hr style="margin: 20px 0;"/>

//       <!-- Footer -->
//       <p style="text-align: center; font-size: 12px; color: #777;">
//         This is a system-generated invoice and does not require a signature.
//       </p>
//     </div>
//   `;

//   const options = {
//     margin: 0.5,
//     filename: `order-${order.id}.pdf`,
//     image: { type: "jpeg", quality: 1 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//   };

//   html2pdf().set(options).from(html).save();
// };


import html2pdf from "./html2pdf";
import moment from "moment";
import { imageToBase64 } from "./OrderPdf";

export const generateOrderPDF = async (order) => {
  if (!order) return;

  const api="https://tastetresures-backend-production.up.railway.app";
  // Convert all product images to base64
  const itemsWithBase64 = await Promise.all(
    order.items.map(async (item) => {
      const imgUrl = `${api}/api/v1/product/product-photo/${item.productId}/0`;
      const base64 = await imageToBase64(imgUrl);
      return { ...item, base64Image: base64 };
    })
  );

  const totalQty = itemsWithBase64.reduce((acc, it) => acc + it.quantity, 0);
  const totalPrice = itemsWithBase64.reduce(
    (acc, it) => acc + it.quantity * it.price,
    0
  );

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 25px; width: 100%;">

      <!-- Header -->
      <h2 style="text-align: center; margin-bottom: 5px;">ORDER INVOICE</h2>
      <p style="text-align: center; color: #666; margin-top: 0">
        Thank you for shopping with us!
      </p>
      <hr style="margin: 20px 0;"/>

      <!-- Order Information -->
      <h3>Order Information</h3>
      <p><b>Order ID:</b> ${order.id}</p>
      <p><b>Status:</b> ${order.status}</p>
      <p><b>Date:</b> ${moment(order.createdAt).format("DD-MMM-YYYY")}</p>

      <hr style="margin: 20px 0;"/>

      <!-- Buyer Info -->
      <h3>Customer Details</h3>
      <p><b>Name:</b> ${order.buyer?.name}</p>
      <p><b>Address:</b> ${order.orderAddress}</p>

      <hr style="margin: 20px 0;"/>

      <h3>Products</h3>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="padding: 8px; border: 1px solid #ccc;">Image</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Name</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Variant</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Price</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Qty</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsWithBase64
            .map(
              (item) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc; text-align:center;">
                <img src="${item.base64Image}" style="width:70px; height:70px; object-fit:cover; border-radius:5px;" />
              </td>
              <td style="padding: 8px; border: 1px solid #ccc;">${item.productName}</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${item.variant || "-"}</td>
              <td style="padding: 8px; border: 1px solid #ccc;">₹${item.price}</td>
              <td style="padding: 8px; border: 1px solid #ccc;">${item.quantity}</td>
              <td style="padding: 8px; border: 1px solid #ccc;">₹${item.quantity * item.price}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <hr style="margin: 20px 0;"/>

      <h3>Order Summary</h3>
      <p><b>Total Quantity:</b> ${totalQty}</p>
      <p><b>Total Amount:</b> ₹${totalPrice.toFixed(2)}</p>

      <hr style="margin: 20px 0;"/>

      <p style="text-align:center; font-size:12px; color:#777;">
        This invoice is system-generated and does not require signature.
      </p>
    </div>
  `;

  const options = {
    margin: 0.5,
    filename: `order-${order.id}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(options).from(html).save();
};
