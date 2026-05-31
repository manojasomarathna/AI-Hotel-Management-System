from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, dashboard, employees, inventory, bookings, invoices, ai

app = FastAPI(title="AI Hotel Management System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["Invoices"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "AI Hotel Management System API"}
