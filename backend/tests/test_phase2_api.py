"""Phase 2 API coverage."""

from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient


def future_date(days: int = 1) -> str:
    return (datetime.now(UTC) + timedelta(days=days)).isoformat()


def task_payload(
    title: str, *, priority: str = "Medium", status: str = "Pending"
) -> dict[str, str]:
    return {
        "title": title,
        "description": f"Description for {title}",
        "priority": priority,
        "status": status,
        "category": "Cloud",
        "due_date": future_date(),
    }


def test_authentication_and_current_user(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"


def test_task_crud_and_activity(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    created = client.post(
        "/api/v1/tasks", headers=auth_headers, json=task_payload("Build API")
    )
    assert created.status_code == 201
    task_id = created.json()["id"]

    updated_payload = task_payload("Build API", status="Completed", priority="High")
    updated = client.put(
        f"/api/v1/tasks/{task_id}", headers=auth_headers, json=updated_payload
    )
    assert updated.status_code == 200
    assert updated.json()["status"] == "Completed"

    activities = client.get("/api/v1/activities", headers=auth_headers)
    assert activities.status_code == 200
    assert len(activities.json()["data"]) == 2

    deleted = client.delete(f"/api/v1/tasks/{task_id}", headers=auth_headers)
    assert deleted.status_code == 200
    assert (
        client.get(f"/api/v1/tasks/{task_id}", headers=auth_headers).status_code == 404
    )


def test_search_filter_and_pagination(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    for title, priority in [
        ("Terraform setup", "High"),
        ("Write docs", "Low"),
        ("Terraform deploy", "High"),
    ]:
        assert (
            client.post(
                "/api/v1/tasks",
                headers=auth_headers,
                json=task_payload(title, priority=priority),
            ).status_code
            == 201
        )

    response = client.get(
        "/api/v1/tasks?search=terraform&priority=High&page=1&page_size=1",
        headers=auth_headers,
    )
    body = response.json()
    assert response.status_code == 200
    assert body["total"] == 2
    assert body["total_pages"] == 2
    assert len(body["data"]) == 1


def test_dashboard_and_validation(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    assert (
        client.post(
            "/api/v1/tasks",
            headers=auth_headers,
            json=task_payload("Done", status="Completed"),
        ).status_code
        == 201
    )
    dashboard = client.get("/api/v1/dashboard", headers=auth_headers)
    assert dashboard.status_code == 200
    assert dashboard.json()["completed"] == 1

    invalid = client.post(
        "/api/v1/tasks",
        headers=auth_headers,
        json={"title": "", "due_date": "2000-01-01T00:00:00Z"},
    )
    assert invalid.status_code == 422
    assert invalid.json()["error"] == "validation_error"
