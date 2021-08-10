FROM python:3.6

ENV FLASK_APP gentelella.py

COPY gentelella.py gunicorn.py requirements.txt config.py .env ./
#COPY app app
COPY migrations migrations

COPY plugins plugins

RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install -r /plugins/requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

EXPOSE 5000
CMD ["gunicorn", "--config", "gunicorn.py", "gentelella:app"]