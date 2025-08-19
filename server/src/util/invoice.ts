export type InvoiceItem = {
  description: string;
  unitPrice: number;
  qty: number;
};

export type InvoiceData = {
  name: string;
  address: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  gstAmount: number;  // ✅ add this
  total: number;      // ✅ add this
};

export function generateInvoiceHTML(data: InvoiceData): string {
  const GST_RATE = 0.18;

  const processedItems = data.items.map(item => {
    const basePrice = item.unitPrice / (1 + GST_RATE); // remove GST
    return {
      ...item,
      basePrice,
      totalBase: basePrice * item.qty
    };
  });

  const subtotal = processedItems.reduce((sum, item) => sum + item.totalBase, 0);
  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Invoice</title>
<style>
  body {
    font-family: Arial, sans-serif;
    color: #333;
    background: #fff;
    display: flex;
    justify-content: center;
    padding: 40px;
  }
  .invoice-container {
    max-width: 700px;
    width: 100%;
  }
  h1 {
    text-align: right;
    letter-spacing: 4px;
    font-weight: 300;
  }
  .details {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    font-size: 14px;
  }
  .block strong {
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 40px;
    font-size: 14px;
  }
  th {
    text-align: left;
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-bottom: 1px solid #000;
    padding-bottom: 8px;
  }
  td {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }
  .right {
    text-align: right;
  }
  .totals {
    margin-top: 20px;
    font-size: 14px;
    width: 40%;
    float: right;
  }
  .totals div {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
  }
  .signature {
    margin-top: 80px;
    font-style: italic;
    font-family: 'Brush Script MT', cursive;
    font-size: 18px;
  }
</style>
</head>
<body>
<div class="invoice-container">
    <div style="display: flex; align-items: center; justify-content: space-between;">
        <img src=${'https://storage.googleapis.com/lms-platform12/logo/up_next.png'} alt="LMS Logo" style="width: 100px; height: auto;">
        <h1 style="margin: 0;">INVOICE</h1>
    </div>

<div class="details">
  <div class="block">
    <strong>Issued To:</strong><br>
    ${data.name}<br>
    ${data.address.replace(/\n/g, '<br>')}
  </div>
  <div class="block">
    <strong>Invoice No:</strong> ${data.invoiceNo}<br>
    <strong>Date:</strong> ${data.date}<br>
    <strong>Due Date:</strong> ${data.dueDate}
  </div>
</div>

<div class="details" style="margin-top:20px;">
  <div class="block">
    <strong>Pay To:</strong><br>
    HDFC Bank<br>
    Account Name: Up Next Academy Pvt. Ltd.<br>
    Account No.: 0123 4567 8901<br>
    IFSC: HDFC0001234
  </div>
  <div class="block">
    <strong>GSTIN:</strong> 29ABCDE1234F1Z5
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>Description</th>
      <th>Unit Price (Excl. GST)</th>
      <th>Qty</th>
      <th class="right">Total (Excl. GST)</th>
    </tr>
  </thead>
  <tbody>
    ${processedItems.map(item => `
    <tr>
      <td>${item.description}</td>
      <td>₹${item.basePrice.toFixed(2)}</td>
      <td>${item.qty}</td>
      <td class="right">₹${item.totalBase.toFixed(2)}</td>
    </tr>`).join('')}
  </tbody>
</table>

<div class="totals">
  <div><span>Subtotal (Excl. GST):</span> <span>₹${subtotal.toFixed(2)}</span></div>
  <div><span>GST @ 18%:</span> <span>₹${gst.toFixed(2)}</span></div>
  <div style="font-weight:bold; border-top:1px solid #000; padding-top:5px;">
    <span>Total (Incl. GST):</span> <span>₹${total.toFixed(2)}</span>
  </div>
</div>

<div style="clear:both;"></div>

<div class="signature">
  Up Next Academy Pvt. Ltd.
</div>

</div>
</body>
</html>`;
}
