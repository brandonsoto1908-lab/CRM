import { supabaseServer as supabase } from '@/lib/supabaseServerClient'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { id } = req.query
    
    // Fetch invoice data
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *, 
        clients (name, email),
        invoice_items (
          description, quantity, price, amount,
          services (name)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' })

    // Create PDF document
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width

    // Header
    doc.setFontSize(20)
    doc.text('STONE BY RIC', pageWidth / 2, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.text('FACTURA', pageWidth / 2, 30, { align: 'center' })

    // Company info
    doc.setFontSize(8)
    doc.text('STONE BY RIC LLC', 20, 40)
    doc.text('123 Stone Avenue, Suite 456', 20, 44)
    doc.text('Miami, FL 33101', 20, 48)
    doc.text('Tel: +1 (305) 555-0123', 20, 52)
    doc.text('Email: info@stonebyric.com', 20, 56)

    // Client info
    doc.setFontSize(10)
    doc.text(`Cliente: ${invoice.clients.name}`, 20, 70)
    doc.text(`Email: ${invoice.clients.email}`, 20, 77)
    doc.text(`Fecha: ${new Date(invoice.created_at).toLocaleDateString()}`, pageWidth - 60, 70)
    doc.text(`Factura #: ${invoice.invoice_number || invoice.id}`, pageWidth - 60, 77)

    // Items table
    doc.autoTable({
      startY: 85,
      head: [['Servicio', 'Descripción', 'Cantidad', 'Precio', 'Total']],
      body: invoice.invoice_items.map(item => [
        item.services?.name || '',
        item.description,
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        `$${item.amount.toFixed(2)}`
      ]),
      foot: [
        ['', '', '', 'Total:', `$${invoice.total.toFixed(2)}`]
      ],
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    })

    // Notes and Payment Information
    const finalY = doc.lastAutoTable.finalY + 10
    
    // Payment Information
    doc.setFontSize(10)
    doc.text('INFORMACIÓN DE PAGO', 20, finalY)
    doc.setFontSize(8)
    doc.text('Por favor incluya el número de factura en la referencia del pago', 20, finalY + 7)
    
    // Bank Information
    doc.text('DATOS BANCARIOS:', 20, finalY + 15)
    doc.text('Bank of America', 20, finalY + 22)
    doc.text('Account Name: STONE BY RIC LLC', 20, finalY + 29)
    doc.text('Account Number: 1234567890', 20, finalY + 36)
    doc.text('Routing Number (ACH): 063000047', 20, finalY + 43)
    doc.text('Swift Code (International): BOFAUS3N', 20, finalY + 50)
    
    // Wire Transfer Information
    doc.text('Para transferencias internacionales:', 20, finalY + 58)
    doc.text('Intermediary Bank: Bank of America, N.A.', 20, finalY + 65)
    doc.text('Bank Address: 100 N Tryon St, Charlotte, NC 28255', 20, finalY + 72)
    
    // Notes
    if (invoice.notes) {
      doc.text('Notas:', 20, finalY + 80)
      doc.setFontSize(8)
      doc.text(invoice.notes, 20, finalY + 87)
    }

    // Footer with page numbers
    doc.setFontSize(8)
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.text(
        `Generado el ${new Date().toLocaleDateString()} - Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
    }

    // Send PDF
    const buffer = Buffer.from(doc.output('arraybuffer'))
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.id}.pdf"`)
    res.send(buffer)

  } catch (error) {
    console.error('Error generating PDF:', error)
    res.status(500).json({ error: 'Error generating PDF' })
  }
}