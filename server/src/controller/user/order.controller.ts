import { Context } from "hono";
import { orderConfirmation } from "../../queries/user/order.queries";
import { generateInvoiceHTML, InvoiceData } from "../../util/invoice";
import puppeteer from "puppeteer";
import z from "zod";



const indexSchema = z.object({
  userId:z.string(),
  orderId:z.string()
})
export const orderConfirm = async (c: Context) => {
  try {
    const body = await c.req.json(); // ✅ await here
    const { userId, orderId } = indexSchema.parse(body);

    if (!userId) {
      return c.json({ message: "Could not find user id", success: false });
    }

    const detail = await orderConfirmation(userId, orderId); // ✅ Must return orderDetail & courseDetails

    if (!detail.success || !detail.order ) {
      return c.json({ message: "Failed to fetch ordertyfytdetail", success: false });
    }

    const gstRate = 0.18;
    const items = detail.order.items.map((course) => {
      const gstExclusivePrice = Math.round(course.price / (1 + gstRate));
      return {
        description: course.title,
        unitPrice: gstExclusivePrice,
        qty: 1,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    const gstAmount = Math.round(subtotal * gstRate);
    const total = subtotal + gstAmount;

    const invoiceData: InvoiceData = {
      name: detail.order.name,
      address: `${detail.order.address}, ${detail.order.city}, ${detail.order.state} - ${detail.order.zip_code}`,
      invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      items,
      gstAmount,
      total,
    };

    const invoiceHTML = generateInvoiceHTML(invoiceData);

    const browser = await puppeteer.launch({headless: true,})
    const page = await browser.newPage();
    await page.setContent(invoiceHTML, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    return c.json({
      message: "Course purchased successfully",
      success: true,
      orderId:detail.order.orderId,
      date:detail.order.date,
      total:detail.order.total,
      pdf: Buffer.from(pdfBuffer).toString("base64"),
    });

  } catch (error) {
   
    return c.json({ message: "Failed to fetch order detail", success: false });
  }
};
