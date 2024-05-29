FROM python:3.9

WORKDIR /app

COPY . .

CMD ["python", "helloworld.py"]
