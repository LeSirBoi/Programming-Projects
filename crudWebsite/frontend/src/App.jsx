import { useState, useEffect } from "react";
import Contacts from "./Contacts";
import "./App.css";
import ContactForm from "./ContactForm";

function App() {
  const [contacts, setContacts] = useState([]); // initialize empty contact list
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({});

  useEffect(() => {
    // execute after
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    // async function to fetch data
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();
    setContacts(data.contacts);
    console.log(data.contacts);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentContact({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (contact) => {
    if (isModalOpen) return;
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    fetchContacts();
  };

  return (
    <>
      <Contacts
        contacts={contacts}
        updateContact={openEditModal}
        updateCallback={onUpdate}
      />
      <button onClick={openCreateModal}>Create New Contact</button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <ContactForm
              existingContact={currentContact}
              updateCallback={onUpdate}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
