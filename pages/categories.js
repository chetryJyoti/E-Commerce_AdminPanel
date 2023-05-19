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
  const [properties, setProperties] = useState([]);

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
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    getCategories();
  };

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
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
  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  function handlePropertyNameChange(index, property, newName) {
    console.log({ index, property, newName });
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValueChange(index, property, newValue) {
    console.log({ index, property, newValue });
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValue;
      return properties;
    });
  }

  function removeProperty(index) {
    setProperties((prev) => {
      const newProperties = [...prev]; // Create a new array to avoid mutating the original state
      newProperties.splice(index, 1); // Remove the property at the specified index
      return newProperties; // Return the updated array as the new state
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
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            required
          ></input>
          <select
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
        </div>

        <div className="mb-2">
          <label className="block mb-1">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-secondary text-sm mb-1"
          >
            Add new Property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2">
                <input
                  className="mb-0"
                  type="text"
                  placeholder="property name (eg:color)"
                  value={property.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                ></input>
                <input
                  className="mb-0"
                  type="text"
                  placeholder="values , comma seperated"
                  value={property.values}
                  onChange={(ev) =>
                    handlePropertyValueChange(index, property, ev.target.value)
                  }
                ></input>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => removeProperty(index)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>

      {!editedCategory && (
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
      )}
      {isLoading && <Loader loadingWhat="Loading Categories" />}
    </Layout>
  );
};

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
