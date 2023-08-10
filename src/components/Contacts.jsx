import axios from "axios";
import { useEffect, useState } from "react";
import { AiTwotoneDelete, AiFillEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  const swalWithButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-600 text-white px-5 py-1 rounded shadow-lg",
      cancelButton: "bg-red-600 text-white px-5 py-1 rounded shadow-lg mr-4",
    },
    buttonsStyling: false,
  });

  const getContacts = async () => {
    const { data } = await axios.get("http://localhost:3000/contacts");
    setContacts(data);
  };

  useEffect(() => {
    getContacts();
  }, []);

  const apiDeleteContact = async (id) => {
    swalWithButtons
      .fire({
        title: "Are you sure?",
        text: "Are you sure you want to delete this contact?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          swalWithButtons.fire(
            "Deleted!",
            "Contact has been deleted.",
            "success"
          );
          const { data } = await axios.delete(
            `http://localhost:3000/contacts/${id}`
          );
          console.log(data);
          getContacts();
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithButtons.fire(
            "Cancelled",
            "Your imaginary file is safe :)",
            "error"
          );
        }
      });
  };

  return (
    <>
      <Link to={"/create"}>
        <button className="text-white bg-gray-800 px-4 py-2 rounded my-5">
          Create New Contact
        </button>
      </Link>
      <div>
        <div className="relative overflow-x-auto shadow-md">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                >
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                >
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                  >
                    {contact.name}
                  </th>
                  <td className="px-6 py-4">{contact.phone}</td>
                  <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                    {contact.email}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <Link to={`/edit/${contact.id}`}>
                      <AiFillEdit className="text-xl text-cyan-500" />
                    </Link>
                    <AiTwotoneDelete
                      onClick={() => apiDeleteContact(contact.id)}
                      className="text-xl text-red-500 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Contacts;
