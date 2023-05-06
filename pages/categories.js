import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
const categories = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getCategories() {
    await axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    getCategories();
  }, []);

  const saveCategory = async (ev) => {
    ev.preventDefault();
    await axios.post("/api/categories", { name });
    setName("");
    getCategories();
  };
  return (
    <Layout>
      <h1>Categories</h1>
      <label>New Category</label>
      <form onSubmit={saveCategory} className="flex gap-1 mb-6">
        <input
          className="mb-0"
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          required
        ></input>
        <select className="mb-0">
          <option value="0">No parent category</option>
          {categories.length>0 && categories.map(category=>(
            <option key={category._id} value={category._id}>{category.name}</option>
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
          </tr>
        </thead>
        <tbody>
          {isLoading && <Loader loadingWhat="Loading Categories" />}
          {!isLoading &&
            categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default categories;
