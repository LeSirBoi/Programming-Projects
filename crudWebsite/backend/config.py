# Contains the main configuration of application in Flask
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__) # intializes Flask
CORS(app) # disable CORS error

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///info.db" # specifies location of local DB
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False # disable notification tracking

db = SQLAlchemy(app) # creates database instance