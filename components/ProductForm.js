import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { ReactSortable } from "react-sortablejs";
const ProductForm = ({
  _id,
  title: currentTitle,
  description: currentDesc,
  price: currentPrice,
  images: currentImages,
}) => {
  const [title, setTitle] = useState(currentTitle || "");
  const [description, setDescription] = useState(currentDesc || "");
  const [price, setPrice] = useState(currentPrice || "");
  const [images, setImages] = useState(currentImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // console.log("product_id:", _id);

  const saveProduct = async (ev) => {
    ev.preventDefault();
    const data = { title, description, price, images };
    //update
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  };

  async function uploadImages(ev) {
    const files = ev.target?.files;
    console.log(files);
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/uploadImg", data);
      console.log(res.data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
    }
    setIsUploading(false);
  }

 function updateImagesOrder(images){
  // console.log(images);
  setImages(images);
 }

  if (goToProducts) {
    router.push("/products");
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <label>Description</label>
      <textarea
        type="text"
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Upload Photos:</label>
      <div className="my-2 flex flex-wrap gap-2 ">
        <ReactSortable className="flex flex-wrap gap-2 cursor-pointer " list={images} setList={updateImagesOrder}>
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24 ">
                <img src={link} className="rounded-md" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="w-24 h-24 cursor-pointer bg-gray-200 text-gray-500 flex flex-col justify-center items-center rounded-md">
            <ClipLoader size={25} color={"#123abc"} />
            <p>Uploading </p>
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer bg-gray-200 text-gray-500 flex flex-col justify-center items-center rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>
          <div>Upload</div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
      </div>
      <div className="my-3">
        {" "}
        {!images?.length && <div>No images for this product</div>}
      </div>
      <label>Price ( ₹ )</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      ></input>
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
};

export default ProductForm;
