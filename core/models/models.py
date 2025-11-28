import sqlalchemy

metadata = sqlalchemy.MetaData()

events = sqlalchemy.Table(
    "events", metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("url", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("metrics", sqlalchemy.JSON, nullable=False),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, server_default=sqlalchemy.func.now()),
    sqlalchemy.Column("updated_at", sqlalchemy.DateTime, server_default=sqlalchemy.func.now(), onupdate=sqlalchemy.func.now())
)
