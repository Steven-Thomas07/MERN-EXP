import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Viewproduct() {
  const [products, setproducts] = useState([]);

  useEffect(() => {
    viewproduct();
  }, []);

  const viewproduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:9001/viewproduct", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setproducts(response.data.products);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch products");
    }
  };

  const deleteproduct = async (id) => {
    const isConfirmed = confirm("Do you want to delete?");
    if (isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:9001/deleteproduct/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(response.data.message);
        viewproduct();
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <div className="bg-green-200">
      <h1 className="text-center font-bold text-2xl text-black-500">Stock detail</h1>
      <table className="border border-gray-400 mx-auto">
        <thead>
          <tr className="bg-orange-200 ">
            <th className="border border-gray-400 px-3 py-3">SI.NO</th>
            <th className="border border-gray-400 px-3 py-3">Name</th>
            <th className="border border-gray-400 px-3 py-3">Phno</th>
            <th className="border border-gray-400 px-3 py-3">Category</th>
            <th className="border border-gray-400 px-3 py-3">Quantity</th>
            <th colSpan={2} className="border border-gray-400 px-3 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => {
            return (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.phno}</td>
                <td>{item.category}</td>
                <td>{item.qty}</td>
                <td>
                  <Link to={`/editproduct/${item._id}`} className="text-blue-500 underline py-2 px-2">Edit</Link>
                </td>
                <td>
                  <button onClick={() => deleteproduct(item._id)} className="text-red-500 underline py-2 px-2">Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link to={'/add-product'} className="text-blue-400 cursor-pointer">Add the flower</Link>
    </div>
  );
}

export default Viewproduct;
