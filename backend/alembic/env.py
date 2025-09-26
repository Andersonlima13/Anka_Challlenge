from logging.config import fileConfig
from sqlalchemy import pool, create_engine
from alembic import context

# importa a Base, DATABASE_URL e models
from config.database import Base, DATABASE_URL
import model  # garante que todos os models estão carregados

# Alembic config object
config = context.config

# Configura logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata dos models
target_metadata = Base.metadata

# --- Offline migrations ---
def run_migrations_offline():
    context.configure(
        url=DATABASE_URL,  # usa diretamente a URL do database.py
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

# --- Online migrations ---
def run_migrations_online():
    connectable = create_engine(DATABASE_URL, poolclass=pool.NullPool)  # usa DATABASE_URL

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

# Executa offline ou online
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
