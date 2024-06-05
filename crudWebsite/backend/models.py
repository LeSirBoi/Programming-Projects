# Contains all database models using Flask SQL Alchemy
from config import db # import from config.py

# Create Python class of database
class Contact(db.Model):
    # attributes
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def to_json(self): # pass above properties and convert to JSON
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email
        }