import { supabaseServer as supabase } from '@/lib/supabaseServerClient'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.query
    
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

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width

    doc.setFontSize(20)
    doc.text('STONE BY RIC', pageWidth / 2, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.text('FACTURA', pageWidth / 2, 30, { align: 'center' })
    
    doc.setFontSize(10)
    doc.text(`Cliente: ${invoice.clients.name}`, 20, 50)
    doc.text(`Email: ${invoice.clients.email}`, 20, 57)
    doc.text(`Fecha: ${new Date(invoice.created_at).toLocaleDateString()}`, pageWidth - 60, 50)
    doc.text(`Factura #: ${invoice.id}`, pageWidth - 60, 57)

    doc.autoTable({
      startY: 70,
      head: [['Servicio', 'Descripción', 'Cantidad', 'Precio', 'Total']],
      body: invoice.invoice_items.map(item => [
        item.services?.name || '',
        item.description,
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${item.amount.toFixed(2)}`
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 100, 100] }
    })

    const finalY = doc.lastAutoTable.finalY + 10
    doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, pageWidth - 60, finalY)
    doc.text(`IVA (13%): $${invoice.tax_amount.toFixed(2)}`, pageWidth - 60, finalY + 7)
    
    if (invoice.discount_amount > 0) {
      doc.text(`Descuento: $${invoice.discount_amount.toFixed(2)}`, pageWidth - 60, finalY + 14)
      doc.text(`Total: $${invoice.total.toFixed(2)}`, pageWidth - 60, finalY + 21)
    } else {
      doc.text(`Total: $${invoice.total.toFixed(2)}`, pageWidth - 60, finalY + 14)
    }

    if (invoice.notes) {
      doc.text('Notas:', 20, finalY)
      doc.setFontSize(8)
      doc.text(invoice.notes, 20, finalY + 7)
    }

    doc.setFontSize(8)
    doc.text('Gracias por su preferencia', pageWidth / 2, doc.internal.pageSize.height - 20, { align: 'center' })

    const buffer = Buffer.from(doc.output('arraybuffer'))
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.id}.pdf"`)
    res.send(buffer)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error generating PDF' })
  }
}