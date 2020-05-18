# pull official base image
FROM python:latest

# set work directory
WORKDIR /usr/src/app

# install dependencies
RUN pip install --upgrade pip

COPY ./requirements.txt /usr/src/app/requirements.txt

RUN pip install -r requirements.txt

COPY . /usr/src/app/

CMD ["python3", "__init__.py"]
