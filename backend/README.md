# TaskFlow Platform API

FastAPI backend foundation for the TaskFlow Platform SaaS application.

## Local setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`. Interactive documentation is
available at `/docs`, and the liveness endpoint is `/api/v1/health`.

Database migrations use Alembic:

```powershell
alembic upgrade head
```

The current slice contains the application bootstrap and migration environment.
Authentication, users, tasks, and dashboard migrations will be added in the next
implementation increment.

