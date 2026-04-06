const PDFDocument = require('pdfkit');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const moment = require('moment');

// @desc Generate PDF Invoice for Appointment
const generateInvoicePDF = async (req, res) => {
   try {
      const appointment = await Appointment.findById(req.params.id)
         .populate(['client', { path: 'assignments.service', populate: { path: 'category' } }]);

      if (!appointment) {
         return res.status(404).json({ message: 'Ritual session not found for invoice' });
      }

      console.log(appointment,"appointment");

      const doc = new PDFDocument({
         margin: 50,
         size: 'A4'
      });

      // Handle PDF generation errors
      doc.on('error', (err) => {
         if (!res.headersSent) {
            res.status(500).json({ message: 'Internal PDF Generation Error', error: err.message });
         }
      });

      // Set response headers
      const clientName = appointment.client?.name?.split(' ').join('_') || 'Client';
      const appointmentId = appointment.appointmentId || appointment._id.toString().substring(18).toUpperCase();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Invoice-${clientName}-${appointmentId}.pdf`);

      // Stream the PDF to the response
      doc.pipe(res);

      const colors = {
         brand: '#C9A227',    // Gold
         accent: '#B8860B',   // Darker Gold
         void: '#0F0F0F',     // Deep Black
         neutral: '#666666',  // Grey
         wash: '#FAFAFA',     // Off-white
         stroke: '#E5E5E5',   // Light stroke
         watermark: '#F5F5F5' // Light watermark
      };

      // --- Immersive Background Sentinel ---
      doc.fontSize(120)
         .font('Helvetica-Bold')
         .fillColor(colors.watermark)
         .text('INVOICE', 50, 40, { opacity: 0.5 });

      // --- Header Protocol ---
      doc.fillColor(colors.brand)
         .fontSize(22)
         .font('Helvetica-BoldOblique')
         .text('GLOW & ELEGANCE SALOON', 50, 60, { characterSpacing: -0.5, width: 330 });

      doc.fillColor(colors.neutral)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('LUXURY SALOON & SPA NARRATIVE', 51, 85, { characterSpacing: 2.5 });

      // Tactical Metadata
      doc.fillColor(colors.neutral)
         .fontSize(8)
         .font('Helvetica-Bold')
         .text('REPUTATION VAULT REF:', 400, 65, { characterSpacing: 1 })
         .fillColor(colors.void)
         .fontSize(10)
         .text(`INV-${appointment._id.toString().substring(18).toUpperCase()}`, 400, 78, { characterSpacing: 1 });

      doc.moveDown(5);

      // --- High-Precision Discovery Grid ---
      const metaY = 180; // Shifted grid down from 160 to 180

      // Origin Protocol
      doc.fillColor(colors.brand).fontSize(8).font('Helvetica-Bold').text('RITUAL ORIGIN', 50, metaY, { characterSpacing: 2 });
      doc.fillColor(colors.void).fontSize(10).font('Helvetica-Bold')
         .text('Glow Saloon Luxury Hub', 50, metaY + 15)
         .font('Helvetica').fillColor(colors.neutral)
         .text('123 Luxury Lane, Diamond District', 50, metaY + 30)
         .text('Mumbai, MH 400001', 50, metaY + 43);

      // Masterpiece Recipient
      doc.fillColor(colors.brand).fontSize(8).font('Helvetica-Bold').text('MASTERPIECE RECIPIENT', 350, metaY, { characterSpacing: 2 });
      doc.fillColor(colors.void).fontSize(12).font('Helvetica-BoldOblique')
         .text(appointment.client?.name?.toUpperCase() || 'ANONYMOUS CLIENT', 350, metaY + 15)
         .font('Helvetica').fillColor(colors.neutral).fontSize(9)
         .text(appointment.client?.phone || 'N/A', 350, metaY + 33)
         .text(appointment.client?.email || 'N/A', 350, metaY + 46);

      // --- Metadata Sentinel Banner ---
      const bannerY = 240;
      doc.roundedRect(50, bannerY, 500, 65, 16).fill(colors.wash);
      doc.strokeColor(colors.stroke).roundedRect(50, bannerY, 500, 65, 16).stroke();

      const colWidth = 500 / 3;
      // Col 1: Date
      doc.fillColor(colors.neutral).fontSize(7).font('Helvetica-Bold').text('EXECUTION DATE', 75, bannerY + 18, { characterSpacing: 1 });
      doc.fillColor(colors.void).fontSize(10).font('Helvetica-BoldOblique').text(moment(appointment.appointmentDate).format('MMMM DD, YYYY').toUpperCase(), 75, bannerY + 35);

      // Col 2: Identity
      doc.fillColor(colors.neutral).text('RITUAL IDENTITY', 75 + colWidth, bannerY + 18, { characterSpacing: 1 });
      doc.fillColor(colors.void).text(`#${appointment._id.toString().substring(18).toUpperCase()}`, 75 + colWidth, bannerY + 35);

      // Col 3: Protocol Status
      doc.fillColor(colors.neutral).text('PROTOCOL STATUS', 75 + colWidth * 2, bannerY + 18, { characterSpacing: 1 });
      doc.fillColor(appointment.status === 'Completed' ? '#10b981' : colors.brand)
         .text(appointment.status.toUpperCase(), 75 + colWidth * 2, bannerY + 35);

      // --- Ritual Portfolio Stream ---
      const tableY = 340;
      doc.fillColor(colors.neutral).fontSize(8).font('Helvetica-Bold')
         .text('RITUAL DESCRIPTION', 50, tableY, { characterSpacing: 2 })
         .text('CURRENCY EXTRACTION', 0, tableY, { align: 'right', characterSpacing: 2 });

      // Ritual Entries
      let currentY = tableY + 40;
      appointment.assignments.forEach((asm, idx) => {
         const service = asm.service;
         if (!service) return;

         doc.fillColor(colors.void).fontSize(14).font('Helvetica-BoldOblique')
            .text(service.name.toUpperCase(), 50, currentY);

         doc.fillColor(colors.brand).fontSize(16).font('Helvetica-BoldOblique')
            .text(`$ ${service.price.toLocaleString()}`, 0, currentY, { align: 'right' });

         doc.fillColor(colors.neutral).fontSize(8).font('Helvetica-Bold')
            .text(service.category?.name?.toUpperCase() || 'PREMIUM PROTOCOL', 50, currentY + 18, { characterSpacing: 1 });

         currentY += 60;

         if (idx < appointment.assignments.length - 1) {
            doc.strokeColor(colors.stroke).dash(2, { space: 2 }).moveTo(50, currentY - 20).lineTo(550, currentY - 20).stroke().undash();
         }
      });

      // --- Financial Consolidation Sentinel ---
      const totalY = 650;
      doc.strokeColor(colors.brand).lineWidth(2).moveTo(300, totalY).lineTo(550, totalY).stroke();

      doc.fillColor(colors.neutral).fontSize(9).font('Helvetica-Bold')
         .text('AGGREGATE RITUAL TOTAL', 300, totalY + 15, { characterSpacing: 1 });

      doc.fillColor(colors.brand).fontSize(32).font('Helvetica-BoldOblique')
         .text(`$ ${appointment.totalPrice.toLocaleString()}`, 300, totalY + 30, { align: 'right', width: 250, characterSpacing: -1 });

      // --- Footer Protocol ---
      const footerY = 760;
      doc.fillColor(colors.neutral).fontSize(7).font('Helvetica-Bold')
         .text('VALIDATED FINANCIAL INTELLIGENCE • LUXURY MANAGEMENT', 50, footerY, { align: 'center', characterSpacing: 3 });

      doc.fillColor(colors.brand).fontSize(10).font('Helvetica-BoldOblique')
         .text('GLOW SALOON', 50, footerY + 12, { align: 'center' });

      doc.end();

   } catch (err) {
      console.error('PDF Generation Error:', err);
      if (!res.headersSent) {
         res.status(500).json({ message: 'Financial export protocol failed', error: err.message });
      }
   }
};

// @desc Generate PDF Invoice for Order
const generateOrderInvoicePDF = async (req, res) => {
   try {
      const order = await Order.findById(req.params.id).populate('user', 'name email');

      if (!order) {
         return res.status(404).json({ message: 'Order protocol not found' });
      }

      const doc = new PDFDocument({
         margin: 50,
         size: 'A4'
      });

      // Handle PDF generation errors
      doc.on('error', (err) => {
         if (!res.headersSent) {
            res.status(500).json({ message: 'Internal PDF Generation Error', error: err.message });
         }
      });

      // Set response headers
      const clientName = order.user?.name?.split(' ').join('_') || 'Client';
      const orderId = order.orderId || order._id.toString().substring(18).toUpperCase();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Invoice-Order-${clientName}-${orderId}.pdf`);

      // Stream the PDF to the response
      doc.pipe(res);

      const colors = {
         brand: '#C9A227',    // Gold
         accent: '#B8860B',   // Darker Gold
         void: '#0F0F0F',     // Deep Black
         neutral: '#666666',  // Grey
         wash: '#FAFAFA',     // Off-white
         stroke: '#E5E5E5',   // Light stroke
         watermark: '#F5F5F5' // Light watermark
      };

      // --- Immersive Background Sentinel ---
      doc.fontSize(120)
         .font('Helvetica-Bold')
         .fillColor(colors.watermark)
         .text('INVOICE', 50, 40, { opacity: 0.5 });

      // --- Header Protocol ---
      doc.fillColor(colors.brand)
         .fontSize(22)
         .font('Helvetica-BoldOblique')
         .text('GLOW & ELEGANCE SALOON', 50, 60, { characterSpacing: -0.5, width: 330 });

      doc.fillColor(colors.neutral)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('LUXURY PRODUCT SHIPMENT NARRATIVE', 51, 85, { characterSpacing: 2.5 });

      // Tactical Metadata
      doc.fillColor(colors.neutral)
         .fontSize(8)
         .font('Helvetica-Bold')
         .text('ORDER VAULT REF:', 400, 65, { characterSpacing: 1 })
         .fillColor(colors.void)
         .fontSize(10)
         .text(order.orderId || `ORD-${order._id.toString().substring(18).toUpperCase()}`, 400, 78, { characterSpacing: 1 });

      doc.moveDown(5);

      // --- High-Precision Discovery Grid ---
      const metaY = 180;

      // Origin Protocol
      doc.fillColor(colors.brand).fontSize(8).font('Helvetica-Bold').text('SHIPMENT ORIGIN', 50, metaY, { characterSpacing: 2 });
      doc.fillColor(colors.void).fontSize(10).font('Helvetica-Bold')
         .text('Glow Saloon Distribution Hub', 50, metaY + 15)
         .font('Helvetica').fillColor(colors.neutral)
         .text('123 Luxury Lane, Diamond District', 50, metaY + 30)
         .text('Mumbai, MH 400001', 50, metaY + 43);

      // Masterpiece Recipient
      doc.fillColor(colors.brand).fontSize(8).font('Helvetica-Bold').text('SHIPMENT RECIPIENT', 350, metaY, { characterSpacing: 2 });
      doc.fillColor(colors.void).fontSize(12).font('Helvetica-BoldOblique')
         .text(order.shippingAddress?.fullName?.toUpperCase() || order.user?.name?.toUpperCase() || 'ANONYMOUS CLIENT', 350, metaY + 15)
         .font('Helvetica').fillColor(colors.neutral).fontSize(9)
         .text(order.shippingAddress?.address || 'N/A', 350, metaY + 33)
         .text(`${order.shippingAddress?.city || ''}, ${order.shippingAddress?.zipCode || ''}`, 350, metaY + 46)
         .text(order.shippingAddress?.country || '', 350, metaY + 59);

      // --- Metadata Sentinel Banner ---
      const bannerY = 260;
      doc.roundedRect(50, bannerY, 500, 65, 16).fill(colors.wash);
      doc.strokeColor(colors.stroke).roundedRect(50, bannerY, 500, 65, 16).stroke();

      const colWidth = 500 / 3;
      // Col 1: Date
      doc.fillColor(colors.neutral).fontSize(7).font('Helvetica-Bold').text('ORDER DATE', 75, bannerY + 18, { characterSpacing: 1 });
      doc.fillColor(colors.void).fontSize(10).font('Helvetica-BoldOblique').text(moment(order.createdAt).format('MMMM DD, YYYY').toUpperCase(), 75, bannerY + 35);

      // Col 2: Identity
      doc.fillColor(colors.neutral).text('ORDER IDENTITY', 75 + colWidth, bannerY + 18, { characterSpacing: 1 });
      doc.fillColor(colors.void).text(`#${order.orderId}`, 75 + colWidth, bannerY + 35);

      // Col 3: Protocol Status
      doc.fillColor(colors.neutral).text('SHIPMENT STATUS', 75 + colWidth * 2, bannerY + 18, { characterSpacing: 1 });
      doc.fillColor(order.status === 'Delivered' ? '#10b981' : colors.brand)
         .text(order.status.toUpperCase(), 75 + colWidth * 2, bannerY + 35);

      // --- Item Portfolio Stream ---
      const tableY = 360;
      doc.fillColor(colors.neutral).fontSize(8).font('Helvetica-Bold')
         .text('PRODUCT PORTFOLIO', 50, tableY, { characterSpacing: 2 })
         .text('QTY', 300, tableY, { characterSpacing: 2 })
         .text('PRICE', 380, tableY, { characterSpacing: 2 })
         .text('EXTRACTED TOTAL', 0, tableY, { align: 'right', characterSpacing: 2 });

      // Product Entries
      let currentY = tableY + 40;
      order.items.forEach((item, idx) => {
         doc.fillColor(colors.void).fontSize(12).font('Helvetica-BoldOblique')
            .text(item.name.toUpperCase(), 50, currentY, { width: 240 });

         doc.fillColor(colors.neutral).fontSize(10).font('Helvetica')
            .text(item.qty.toString(), 300, currentY);

         doc.fillColor(colors.neutral).fontSize(10).font('Helvetica')
            .text(`$${item.price.toLocaleString()}`, 380, currentY);

         doc.fillColor(colors.brand).fontSize(12).font('Helvetica-BoldOblique')
            .text(`$${(item.price * item.qty).toLocaleString()}`, 0, currentY, { align: 'right' });

         currentY += 40;

         if (idx < order.items.length - 1) {
            doc.strokeColor(colors.stroke).dash(2, { space: 2 }).moveTo(50, currentY - 15).lineTo(550, currentY - 15).stroke().undash();
         }

         // Check if we need a new page
         if (currentY > 700) {
            doc.addPage();
            currentY = 50;
         }
      });

      // --- Financial Consolidation Sentinel ---
      const totalY = Math.min(currentY + 40, 700);
      doc.strokeColor(colors.brand).lineWidth(2).moveTo(300, totalY).lineTo(550, totalY).stroke();

      doc.fillColor(colors.neutral).fontSize(9).font('Helvetica-Bold')
         .text('AGGREGATE SHIPMENT TOTAL', 300, totalY + 15, { characterSpacing: 1 });

      doc.fillColor(colors.brand).fontSize(32).font('Helvetica-BoldOblique')
         .text(`$ ${order.totalAmount.toLocaleString()}`, 300, totalY + 30, { align: 'right', width: 250, characterSpacing: -1 });

      // --- Footer Protocol ---
      const footerY = 780;
      doc.fillColor(colors.neutral).fontSize(7).font('Helvetica-Bold')
         .text('VALIDATED PRODUCT INTELLIGENCE • LUXURY LOGISTICS', 50, footerY, { align: 'center', characterSpacing: 3 });

      doc.fillColor(colors.brand).fontSize(10).font('Helvetica-BoldOblique')
         .text('GLOW SALOON', 50, footerY + 12, { align: 'center' });

      doc.end();

   } catch (err) {
      console.error('PDF Generation Error:', err);
      if (!res.headersSent) {
         res.status(500).json({ message: 'Financial export protocol failed', error: err.message });
      }
   }
};

module.exports = { generateInvoicePDF, generateOrderInvoicePDF };

