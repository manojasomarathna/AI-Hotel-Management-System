from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.models import Booking, Invoice, Expense, InventoryItem
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/summary")
def get_summary(db: Session = Depends(get_db), _=Depends(get_current_user)):
    total_bookings = db.query(func.count(Booking.id)).scalar()
    total_revenue = db.query(func.sum(Invoice.total)).filter(Invoice.status == "paid").scalar() or 0
    total_expenses = db.query(func.sum(Expense.amount)).scalar() or 0
    low_stock_count = db.query(func.count(InventoryItem.id)).filter(
        InventoryItem.quantity <= InventoryItem.low_stock_threshold
    ).scalar()
    return {
        "total_bookings": total_bookings,
        "total_revenue": round(total_revenue, 2),
        "total_expenses": round(total_expenses, 2),
        "net_profit": round(total_revenue - total_expenses, 2),
        "low_stock_alerts": low_stock_count,
    }

@router.get("/monthly-sales")
def monthly_sales(db: Session = Depends(get_db), _=Depends(get_current_user)):
    results = db.query(
        func.date_trunc("month", Invoice.created_at).label("month"),
        func.sum(Invoice.total).label("total")
    ).filter(Invoice.status == "paid").group_by("month").order_by("month").all()
    return [{"month": str(r.month)[:7], "total": round(r.total, 2)} for r in results]
