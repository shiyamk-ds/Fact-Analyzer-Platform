from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router.fetch_news import fetch_news_router
from router.auth_router import auth_router
from router.fact_analysis import fact_analysis_router

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(fetch_news_router, prefix="/api", tags=["fetch_news"])
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(fact_analysis_router, prefix="/api", tags=["fact_analysis"])

