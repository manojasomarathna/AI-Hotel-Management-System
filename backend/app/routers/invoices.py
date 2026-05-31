from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import io
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from app.database import get_db
from app.models.models import Invoice
from app.services.auth_service import get_current_user

router = APIRouter()

class InvoiceCreate(BaseModel):
    guest_name: str
    booking_id: Optional[int] = None
    amount: float
    tax: float = 0

@router.get("/")
def list_invoices(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Invoice).all()

@router.post("/")
def create_invoice(data: InvoiceCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    count = db.query(Invoice).count()
    invoice = Invoice(
        invoice_number=f"INV-{count + 1:04d}",
        guest_name=data.guest_name,
        booking_id=data.booking_id,
        amount=data.amount,
        tax=data.tax,
        total=round(data.amount + data.tax, 2),
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice

@router.put("/{invoice_id}/pay")
def mark_paid(invoice_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    invoice.status = "paid"
    db.commit()
    return {"message": "Invoice marked as paid"}

@router.get("/{invoice_id}/pdf")
def download_pdf(invoice_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(200, 800, "AI Hotel Management")
    c.setFont("Helvetica", 12)
    c.drawString(50, 760, f"Invoice #: {invoice.invoice_number}")
    c.drawString(50, 740, f"Guest: {invoice.guest_name}")
    c.drawString(50, 720, f"Amount: ${invoice.amount}")
    c.drawString(50, 700, f"Tax: ${invoice.tax}")
    c.drawString(50, 680, f"Total: ${invoice.total}")
    c.drawString(50, 660, f"Status: {invoice.status.upper()}")
    c.save()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={invoice.invoice_number}.pdf"})
