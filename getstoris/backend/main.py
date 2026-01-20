from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Middleware to log all requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"➡️  Incoming request: {request.method} {request.url}")
    print(f"    Client: {request.client.host if request.client else 'unknown'}")
    response = await call_next(request)
    print(f"⬅️  Response status: {response.status_code} for {request.url.path}")
    return response

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "GetStoris API is running"}
