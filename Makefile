install:
	python -m pip install -r requirements.txt

run:
	uvicorn backend.app.main:app --reload

test:
	pytest

lint:
	ruff check backend tests
