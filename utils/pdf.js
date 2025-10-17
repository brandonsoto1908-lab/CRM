'use client'

import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export async function generateRoutePDF(route) {
  try {
    // Create new document
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.text('Route Details', 14, 20)

    // Route info
    doc.setFontSize(12)
    doc.text(`Route: ${route.name || 'Untitled Route'}`, 14, 30)
    doc.text(`Worker: ${route.workers?.full_name || 'Unassigned'}`, 14, 37)
    if (route.notes) {
      doc.text(`Notes: ${route.notes}`, 14, 44)
    }

    // Table headers and data
    const headers = [['#', 'Client', 'Address', 'Specifications']]
    const data = (route.route_items || []).map((item, idx) => [
      idx + 1,
      item.clients?.name || '',
      item.client_addresses?.address_text || '',
      item.specifications || ''
    ])

    // Generate table
    doc.autoTable({
      head: headers,
      body: data,
      startY: route.notes ? 50 : 44,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 80 },
        3: { cellWidth: 50 }
      },
      headStyles: { fillColor: [66, 66, 66] }
    })

    // Footer
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFontSize(8)
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
    }

    // Generate filename and save
    const filename = `route_${route.name ? route.name.replace(/\s+/g, '_').toLowerCase() : 'untitled'}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}