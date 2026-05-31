from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.models import Employee, Attendance, Leave
from app.services.auth_service import get_current_user

router = APIRouter()

class EmployeeCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    salary: float = 0

class AttendanceCreate(BaseModel):
    employee_id: int
    status: str = "present"

class LeaveCreate(BaseModel):
    employee_id: int
    start_date: str
    end_date: str
    reason: Optional[str] = None

@router.get("/")
def list_employees(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Employee).filter(Employee.is_active == True).all()

@router.post("/")
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    emp = Employee(**data.model_dump())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp

@router.put("/{emp_id}")
def update_employee(emp_id: int, data: EmployeeCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    for k, v in data.model_dump().items():
        setattr(emp, k, v)
    db.commit()
    return emp

@router.delete("/{emp_id}")
def delete_employee(emp_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    emp.is_active = False
    db.commit()
    return {"message": "Employee deactivated"}

@router.post("/attendance")
def mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    att = Attendance(**data.model_dump())
    db.add(att)
    db.commit()
    return {"message": "Attendance marked"}

@router.post("/leave")
def apply_leave(data: LeaveCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    leave = Leave(**data.model_dump())
    db.add(leave)
    db.commit()
    return {"message": "Leave applied"}
