from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from openai import OpenAI
import pytesseract
from PIL import Image
import io
from app.database import get_db
from app.models.models import Invoice, Booking, Expense
from app.config import settings
from app.services.auth_service import get_current_user

router = APIRouter()
client = OpenAI(api_key=settings.OPENAI_API_KEY)

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def ai_chat(data: ChatRequest, db: Session = Depends(get_db), _=Depends(get_current_user)):
    total_revenue = db.query(func.sum(Invoice.total)).filter(Invoice.status == "paid").scalar() or 0
    total_bookings = db.query(func.count(Booking.id)).scalar()
    total_expenses = db.query(func.sum(Expense.amount)).scalar() or 0

    system_prompt = f"""You are an AI assistant for a hotel management system.
Current hotel data:
- Total Revenue: ${total_revenue:.2f}
- Total Bookings: {total_bookings}
- Total Expenses: ${total_expenses:.2f}
- Net Profit: ${total_revenue - total_expenses:.2f}
Answer questions based on this data. Be concise and helpful."""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": data.message}]
    )
    return {"reply": response.choices[0].message.content}

@router.get("/report-summary")
def ai_report_summary(db: Session = Depends(get_db), _=Depends(get_current_user)):
    total_revenue = db.query(func.sum(Invoice.total)).filter(Invoice.status == "paid").scalar() or 0
    total_bookings = db.query(func.count(Booking.id)).scalar()
    total_expenses = db.query(func.sum(Expense.amount)).scalar() or 0

    prompt = f"""Generate a brief hotel performance summary:
- Revenue: ${total_revenue:.2f}
- Bookings: {total_bookings}
- Expenses: ${total_expenses:.2f}
- Net Profit: ${total_revenue - total_expenses:.2f}
Provide 3-4 sentences with key insights and recommendations."""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return {"summary": response.choices[0].message.content}

@router.get("/sales-prediction")
def sales_prediction(db: Session = Depends(get_db), _=Depends(get_current_user)):
    monthly = db.query(
        func.date_trunc("month", Invoice.created_at).label("month"),
        func.sum(Invoice.total).label("total")
    ).filter(Invoice.status == "paid").group_by("month").order_by("month").limit(6).all()

    if not monthly:
        return {"prediction": "Not enough data for prediction"}

    data_str = "\n".join([f"{str(r.month)[:7]}: ${r.total:.2f}" for r in monthly])
    prompt = f"""Based on this hotel monthly sales data:
{data_str}
Predict next month's sales and provide a brief trend analysis in 2-3 sentences."""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return {"prediction": response.choices[0].message.content, "historical_data": data_str}

@router.post("/invoice-reader")
async def invoice_reader(file: UploadFile = File(...), _=Depends(get_current_user)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are supported")
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    extracted_text = pytesseract.image_to_string(image)

    prompt = f"""Extract invoice details from this text and return as JSON with fields: 
guest_name, amount, tax, date, items (list).
Text: {extracted_text}"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return {"extracted_text": extracted_text, "parsed_data": response.choices[0].message.content}
