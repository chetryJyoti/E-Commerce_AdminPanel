import Layout from "@/components/Layout";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
const products = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data);
    console.log({ res });
  };
  return (
    <Layout>
      <Link className="btn-primary" href={"/products/new"}>
        Add new product
      </Link>
      <div className="grid mt-5 grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id}>
            <div className="bg-white shadow-md border-r-emerald-700 border-solid  p-4">{product.title}</div>
            <div className="bg-white shadow-md  p-4">{product.description}</div>
            <div className="bg-white shadow-md  p-4">
              {product.price.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default products;
