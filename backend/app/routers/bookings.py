from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.models import Booking, Room
from app.services.auth_service import get_current_user

router = APIRouter()

class BookingCreate(BaseModel):
    guest_name: str
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None
    room_id: int
    check_in: str
    check_out: str

@router.get("/")
def list_bookings(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Booking).all()

@router.post("/")
def create_booking(data: BookingCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    room = db.query(Room).filter(Room.id == data.room_id, Room.is_available == True).first()
    if not room:
        raise HTTPException(status_code=400, detail="Room not available")
    booking = Booking(**data.model_dump())
    room.is_available = False
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@router.put("/{booking_id}/status")
def update_status(booking_id: int, status: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = status
    if status in ["checked_out", "cancelled"]:
        room = db.query(Room).filter(Room.id == booking.room_id).first()
        if room:
            room.is_available = True
    db.commit()
    return {"message": f"Booking status updated to {status}"}

@router.get("/rooms")
def list_rooms(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Room).all()
