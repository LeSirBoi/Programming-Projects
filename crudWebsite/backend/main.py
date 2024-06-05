# Contains main endpoints using Flask

from flask import request, jsonify
from config import app, db
from models import Contact

@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all() # get query
    json_contacts = list(map(lambda x: x.to_json(), contacts)) # converts each contact into JSON
    return jsonify({"contacts": json_contacts})

@app.route("/create_contact", methods=["POST"])
def create_contact():
    # Retrieves request contents
    first_name = request.json.get("firstName") 
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    if not (first_name and last_name and email):
        return (
            jsonify({"message": "You must include a first name, lsat name and email"},),
            400
        )
    
    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_contact) # adds new entry in the database
        db.session.commit() # commits the current transaction
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "User created!"}), 201

@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
def update_contact(user_id):
    contact = Contact.query.get(user_id) # retrieves user with specified ID

    if not contact:
        return jsonify({"message": "User not found"}), 404
    
    data = request.json
    # modify contacts
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)

    db.session.commit()
    return jsonify({"message": "User updated!"}), 201

@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id) # retrieves user with specified ID

    if not contact:
        return jsonify({"message": "User not found"}), 404
    
    db.session.delete(contact) # deletes entry from database
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 201


if __name__ == "__main__": # Checks if filename is being run directly
    with app.app_context():
        db.create_all() # initialize database if it does not exist

    app.run(debug=True) # run the app
