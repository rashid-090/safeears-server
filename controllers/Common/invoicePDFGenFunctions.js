const PDFDocument = require("pdfkit");
const moment = require("moment");

// Table Row with Bottom Line
function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
  c2 = c2.slice(0, 40);

  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 100, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" })
    .moveTo(50, y + 15)
    .lineTo(560, y + 15)
    .lineWidth(0.5)
    .strokeColor("#ccc")
    .stroke();
}

// Table row without bottom line
function generateTableRowNoLine(doc, y, c1, c2, c3, c4, c5) {
  c2 = c2.slice(0, 40);

  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 100, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
}

// Generating Invoice for customers
const generateInvoicePDF = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });

      const buffers = [];
      doc.on("data", (buffer) => buffers.push(buffer));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (error) => reject(error));

      // Header for the PDF
      doc

        .fillColor("#444444")
        .fontSize(20)
        .text("SafeEars.", 110, 65)
        .fontSize(10)
        .text("GRAND VF PVT.LTD Five Star Arcade Near DISTRICT HOSPITAL", 200, 65, { align: "right" })
        .text("KANNUR -670017 Kerala, India", 200, 80, { align: "right" })
        .moveDown();

      // Invoice details section
      doc
        .fontSize(20)
        .text("Invoice", 50, 150)
        .fontSize(10)
        .moveTo(50, 190)
        .lineTo(550, 190)
        .lineWidth(0.5)
        .strokeColor("#ccc")
        .stroke()
        .text(`Order Id: ${order.orderId ? order.orderId : order._id}`, 50, 200)
        .text(
          `Order Date: ${moment(new Date(order.createdAt)).format(
            "DD/MM/YYYY"
          )}`,
          50,
          215
        )
        .text(`Total Amount: ${order.totalPrice}`, 50, 230)
        .text(order.address.name, 300, 200)
        .text(order.address.phoneNumber, 300, 215)
        .text(order.address.address, 300, 230)
        .text(
          `${order.address.city}, ${order.address.regionState ? order.address.regionState + ", " : ""}  ${order.address.pinCode}`,
          300,
          250
        )
        .moveTo(50, 260)
        .lineTo(550, 260)
        .lineWidth(0.5)
        .strokeColor("#ccc")
        .stroke()
        .moveDown();

      // Products
      let i;
      const invoiceTableTop = 330;

      // Table Header
      generateTableRow(
        doc,
        invoiceTableTop,
        "SL No",
        "Product Name",
        "Size",
        "Price",
        "Quantity",
        "Sub Total"
      );

      // order.products.map((item, index) => {
      for (i = 0; i < order.products.length; i++) {
        const item = order.products[i];
        const position = invoiceTableTop + (i + 1) * 30;

        generateTableRow(
          doc,
          position,
          i + 1,
          item.productId.name,
          item.size ? item.size : "Regular",
          item.salePrice,
          item.quantity,
          item.salePrice
        );
      }

      const subtotalPosition = invoiceTableTop + (i + 1) * 30;
      generateTableRowNoLine(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        order.subTotal
      );

      const paidToDatePosition = subtotalPosition + 30;
      generateTableRowNoLine(
        doc,
        paidToDatePosition,
        "",
        "",
        "Tax",
        "",
        0
      );

      const duePosition = paidToDatePosition + 30;
      generateTableRowNoLine(
        doc,
        duePosition,
        "",
        "",
        "Total",
        "",
        order.totalPrice
      );

      // Footer for the PDF
      doc
        .fontSize(10)
        .text(
          "Payment has been received. Thank you for your business.",
          50,
          700,
          { align: "center", width: 500 }
        );

      // End the document
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePDF,
};
