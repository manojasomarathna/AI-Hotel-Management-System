from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.models import InventoryItem
from app.services.auth_service import get_current_user

router = APIRouter()

class ItemCreate(BaseModel):
    name: str
    category: Optional[str] = None
    quantity: int = 0
    unit: Optional[str] = None
    low_stock_threshold: int = 10
    supplier: Optional[str] = None
    unit_price: float = 0

@router.get("/")
def list_items(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(InventoryItem).all()

@router.get("/low-stock")
def low_stock(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(InventoryItem).filter(InventoryItem.quantity <= InventoryItem.low_stock_threshold).all()

@router.post("/")
def create_item(data: ItemCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    item = InventoryItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{item_id}")
def update_item(item_id: int, data: ItemCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    for k, v in data.model_dump().items():
        setattr(item, k, v)
    db.commit()
    return item

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}
