import os
from dotenv import load_dotenv
import databases

load_dotenv()

DB_USER = os.environ["psql_user"]
DB_PASS = os.environ["psql_password"]
DB_HOST = os.environ.get("psql_host", "localhost")
DB_PORT = os.environ.get("psql_port", "5432")
DB_NAME = os.environ["psql_db"]

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

database = databases.Database(DATABASE_URL)
