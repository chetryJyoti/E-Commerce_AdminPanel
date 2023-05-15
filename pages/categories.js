import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import { withSwal } from "react-sweetalert2";

const Categories = ({ swal }) => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editedCategory, setEditedCategory] = useState(null);

  async function getCategories() {
    await axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    getCategories();
  }, []);
  console.log("parentCategory:", parentCategory);

  const saveCategory = async (ev) => {
    ev.preventDefault();
    const data = { name, parentCategory };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    getCategories();
  };

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }
  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you really one to delete "${category.name}"`,
        showCancelButton: true,
        reverseButtons: true,
        cancelButtonTitle: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#f54e42",
      })
      .then(async (result) => {
        // when confirmed and promise resolved...
        console.log({ result });
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          getCategories();
        }
      })
      .catch((error) => {
        // when promise rejected...
        console.log("unable to delete");
      });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Editing category "${editedCategory?.name}"`
          : "New Category"}{" "}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1 mb-6">
        <input
          className="mb-0"
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          required
        ></input>
        <select
          className="mb-0"
          onChange={(ev) => setParentCategory(ev.target.value)}
          value={parentCategory}
        >
          <option value="0">No parent category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
      <table className="table_style">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>   
          {!isLoading &&
            categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name} </td>
                <td>{category.parent?.name}</td>
                <td className="flex gap-2">
                  <button
                    className="btn-primary"
                    onClick={() => editCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => deleteCategory(category)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {isLoading && <Loader loadingWhat="Loading Categories" />}
    </Layout>
  );
};

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
