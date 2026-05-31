from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    staff = "staff"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.staff)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True)
    phone = Column(String(20))
    position = Column(String(100))
    salary = Column(Float, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    attendances = relationship("Attendance", back_populates="employee")
    leaves = relationship("Leave", back_populates="employee")

class Attendance(Base):
    __tablename__ = "attendances"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(20), default="present")  # present, absent, late
    employee = relationship("Employee", back_populates="attendances")

class Leave(Base):
    __tablename__ = "leaves"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    reason = Column(Text)
    status = Column(String(20), default="pending")  # pending, approved, rejected
    employee = relationship("Employee", back_populates="leaves")

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(10), unique=True, nullable=False)
    room_type = Column(String(50))  # single, double, suite
    price_per_night = Column(Float)
    is_available = Column(Boolean, default=True)
    bookings = relationship("Booking", back_populates="room")

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    guest_name = Column(String(100), nullable=False)
    guest_email = Column(String(100))
    guest_phone = Column(String(20))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    check_in = Column(DateTime(timezone=True))
    check_out = Column(DateTime(timezone=True))
    total_amount = Column(Float, default=0)
    status = Column(String(20), default="confirmed")  # confirmed, checked_in, checked_out, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    room = relationship("Room", back_populates="bookings")

class InventoryItem(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50))
    quantity = Column(Integer, default=0)
    unit = Column(String(20))
    low_stock_threshold = Column(Integer, default=10)
    supplier = Column(String(100))
    unit_price = Column(Float, default=0)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    guest_name = Column(String(100))
    amount = Column(Float)
    tax = Column(Float, default=0)
    total = Column(Float)
    status = Column(String(20), default="unpaid")  # unpaid, paid
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    amount = Column(Float)
    category = Column(String(50))
    date = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)
