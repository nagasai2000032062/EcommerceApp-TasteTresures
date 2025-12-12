// import React, { useState, useEffect } from "react";
// import Layout from "./../../components/Layout/Layout";
// import AdminMenu from "./../../components/Layout/AdminMenu";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { Select } from "antd";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/auth";
// const { Option } = Select;

// const CreateProduct = () => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [photos, setPhotos] = useState([]); // multiple images
//   const [variants, setVariants] = useState([{ weight: "", price: "" }]); // multiple variants
//   const [auth] = useAuth();

//   // Fetch categories
//   const getAllCategory = async () => {
//     try {
//       const { data } = await axios.get("/api/v1/category/get-category");
//       if (data?.success) {
//         setCategories(data?.data);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong in getting categories");
//     }
//   };

//   useEffect(() => {
//     getAllCategory();
//   }, []);

//   // Handle product creation
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       console.log(name,description,category);
//       const productJson = JSON.stringify({
//         name,
//         description,
//         category,
//         quantity: parseInt(quantity, 10),
//         variants: variants.map((v) => ({
//           weight: v.weight,
//           price: parseFloat(v.price),
//         })),
//       });

//       formData.append("product", productJson);

//       // Append multiple images
//       photos.forEach((photo) => {
//         formData.append("images", photo);
//       });

//       const { data } = await axios.post("/api/v1/product/create-product", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${auth?.token}`,
//         },
//       });

//       if (data?.success) {
//         toast.success("Product Created Successfully");
//         navigate("/dashboard/admin/products");
//       } else {
//         toast.error(data?.message || "Error in creating product");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong while creating the product");
//     }
//   };

//   // Add a new variant row
//   const addVariant = () => {
//     setVariants([...variants, { weight: "", price: "" }]);
//   };

//   // Remove a variant row
//   const removeVariant = (index) => {
//     const updated = [...variants];
//     updated.splice(index, 1);
//     setVariants(updated);
//   };

//   // Update a variant field
//   const handleVariantChange = (index, field, value) => {
//     const updated = [...variants];
//     updated[index][field] = value;
//     setVariants(updated);
//   };

//   return (
//     <Layout title={"Dashboard - Create Product"}>
//       <div className="container-fluid m-3 p-3 dashboard">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <h1>Create Product</h1>
//             <div className="m-1 w-75">
//               {/* Category Select */}
//               <Select
//                 bordered={false}
//                 placeholder="Select a category"
//                 size="large"
//                 showSearch
//                 className="form-select mb-3"
//                 onChange={(value) => setCategory(value)}
//               >
//                 {categories?.map((c) => (
//                   <Option key={c.id} value={c.name}>
//                     {c.name}
//                   </Option>
//                 ))}
//               </Select>

//               {/* Upload Multiple Photos */}
//               <div className="mb-3">
//                 <label className="form-label">Upload Photos</label>
//                 <input
//                   type="file"
//                   name="photos"
//                   accept="image/*"
//                   multiple
//                   className="form-control"
//                   onChange={(e) => setPhotos(Array.from(e.target.files))}
//                 />
//               </div>

//               {/* Preview all selected images */}
//               {photos.length > 0 && (
//                 <div className="text-center mb-3 d-flex flex-wrap gap-2">
//                   {photos.map((file, index) => (
//                     <div key={index} className="position-relative">
//                       <img
//                         src={URL.createObjectURL(file)}
//                         alt="preview"
//                         height="100px"
//                         className="img img-responsive rounded border"
//                       />
//                       {/* Remove image button */}
//                       <button
//                         type="button"
//                         className="btn btn-sm btn-danger position-absolute top-0 end-0"
//                         onClick={() => {
//                           const updated = [...photos];
//                           updated.splice(index, 1);
//                           setPhotos(updated);
//                         }}
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Product Details */}
//               <div className="mb-3">
//                 <input
//                   type="text"
//                   value={name}
//                   placeholder="Product Name"
//                   className="form-control"
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>
//               <div className="mb-3">
//                 <textarea
//                   value={description}
//                   placeholder="Product Description"
//                   className="form-control"
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </div>
//               <div className="mb-3">
//                 <input
//                   type="number"
//                   value={quantity}
//                   placeholder="Total Quantity"
//                   className="form-control"
//                   onChange={(e) => setQuantity(e.target.value)}
//                 />
//               </div>

//               {/* Variants Section */}
//               <h5>Variants (Weight + Price)</h5>
//               {variants.map((variant, index) => (
//                 <div key={index} className="d-flex gap-2 mb-2">
//                   <input
//                     type="text"
//                     placeholder="Weight (e.g. 250g)"
//                     className="form-control"
//                     value={variant.weight}
//                     onChange={(e) =>
//                       handleVariantChange(index, "weight", e.target.value)
//                     }
//                   />
//                   <input
//                     type="number"
//                     placeholder="Price"
//                     className="form-control"
//                     value={variant.price}
//                     onChange={(e) =>
//                       handleVariantChange(index, "price", e.target.value)
//                     }
//                   />
//                   {index > 0 && (
//                     <button
//                       type="button"
//                       className="btn btn-danger"
//                       onClick={() => removeVariant(index)}
//                     >
//                       X
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 className="btn btn-secondary mb-3"
//                 onClick={addVariant}
//               >
//                 + Add Variant
//               </button>

//               {/* Create Product Button */}
//               <div className="mb-3">
//                 <button className="btn btn-primary" onClick={handleCreate}>
//                   CREATE PRODUCT
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CreateProduct;

// import React, { useState, useEffect } from "react";
// import Layout from "./../../components/Layout/Layout";
// import AdminMenu from "./../../components/Layout/AdminMenu";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { Select } from "antd";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/auth";
// const { Option } = Select;

// const CreateProduct = () => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState(""); 
//   const [quantity, setQuantity] = useState("");
//   const [photos, setPhotos] = useState([]); // multiple images
//   const [variants, setVariants] = useState([{ weight: "", price: "" }]); // multiple variants
//   const [auth] = useAuth();

//   // Fetch categories
//   const getAllCategory = async () => {
//     try {
//       const { data } = await axios.get("/api/v1/category/get-category");
//       if (data?.success) {
//         setCategories(data?.data);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong in getting categories");
//     }
//   };

//   useEffect(() => {
//     getAllCategory();
//   }, []);

//   // Handle product creation
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();

//       // append fields directly instead of wrapping into productJson
//       formData.append("name", name);
//       formData.append("description", description);
//       formData.append("category", category);
//       formData.append("quantity", parseInt(quantity, 10));

//       // variants as JSON string
//       formData.append(
//         "variants",
//         JSON.stringify(
//           variants.map((v) => ({
//             weight: v.weight,
//             price: parseFloat(v.price),
//           }))
//         )
//       );

//       // Append multiple images
//       photos.forEach((photo) => {
//         formData.append("images", photo);
//       });

//       const { data } = await axios.post("/api/v1/product/create-product", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${auth?.token}`,
//         },
//       });

//       if (data?.success) {
//         toast.success("Product Created Successfully");
//         navigate("/dashboard/admin/products");
//       } else {
//         toast.error(data?.message || "Error in creating product");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong while creating the product");
//     }
//   };

//   // Add a new variant row
//   const addVariant = () => {
//     setVariants([...variants, { weight: "", price: "" }]);
//   };

//   // Remove a variant row
//   const removeVariant = (index) => {
//     const updated = [...variants];
//     updated.splice(index, 1);
//     setVariants(updated);
//   };

//   // Update a variant field
//   const handleVariantChange = (index, field, value) => {
//     const updated = [...variants];
//     updated[index][field] = value;
//     setVariants(updated);
//   };

//   return (
//     <Layout title={"Dashboard - Create Product"}>
//       <div className="container-fluid m-3 p-3 dashboard">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <h1>Create Product</h1>
//             <div className="m-1 w-75">
//               {/* Category Select */}
//               <Select
//                 bordered={false}
//                 placeholder="Select a category"
//                 size="large"
//                 showSearch
//                 className="form-select mb-3"
//                 onChange={(value) => setCategory(value)}
//               >
//                 {categories?.map((c) => (
//                   <Option key={c.id} value={c.name}>
//                     {c.name}
//                   </Option>
//                 ))}
//               </Select>

//               {/* Upload Multiple Photos */}
//               <div className="mb-3">
//                 <label className="btn btn-outline-secondary col-md-12">
//                   {photos.length > 0
//                     ? `${photos.length} file(s) selected`
//                     : "Upload Photos"}
//                   <input
//                     type="file"
//                     name="photos"
//                     accept="image/*"
//                     multiple
//                     onChange={(e) => setPhotos(Array.from(e.target.files))}
//                     hidden
//                   />
//                 </label>
//               </div>
//               {photos.length > 0 && (
//                 <div className="text-center mb-3 d-flex flex-wrap gap-2">
//                   {photos.map((file, index) => (
//                     <img
//                       key={index}
//                       src={URL.createObjectURL(file)}
//                       alt="preview"
//                       height="100px"
//                       className="img img-responsive rounded"
//                     />
//                   ))}
//                 </div>
//               )}

//               {/* Product Details */}
//               <div className="mb-3">
//                 <input
//                   type="text"
//                   value={name}
//                   placeholder="Product Name"
//                   className="form-control"
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>
//               <div className="mb-3">
//                 <textarea
//                   value={description}
//                   placeholder="Product Description"
//                   className="form-control"
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </div>
//               <div className="mb-3">
//                 <input
//                   type="number"
//                   value={quantity}
//                   placeholder="Total Quantity"
//                   className="form-control"
//                   onChange={(e) => setQuantity(e.target.value)}
//                 />
//               </div>

//               {/* Variants Section */}
//               <h5>Variants (Weight + Price)</h5>
//               {variants.map((variant, index) => (
//                 <div key={index} className="d-flex gap-2 mb-2">
//                   <input
//                     type="text"
//                     placeholder="Weight (e.g. 250g)"
//                     className="form-control"
//                     value={variant.weight}
//                     onChange={(e) =>
//                       handleVariantChange(index, "weight", e.target.value)
//                     }
//                   />
//                   <input
//                     type="number"
//                     placeholder="Price"
//                     className="form-control"
//                     value={variant.price}
//                     onChange={(e) =>
//                       handleVariantChange(index, "price", e.target.value)
//                     }
//                   />
//                   {index > 0 && (
//                     <button
//                       type="button"
//                       className="btn btn-danger"
//                       onClick={() => removeVariant(index)}
//                     >
//                       X
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 className="btn btn-secondary mb-3"
//                 onClick={addVariant}
//               >
//                 + Add Variant
//               </button>

//               {/* Create Product Button */}
//               <div className="mb-3">
//                 <button className="btn btn-primary" onClick={handleCreate}>
//                   CREATE PRODUCT
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CreateProduct;

import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // category name (backend expects name)
  const [quantity, setQuantity] = useState("");
  const [photos, setPhotos] = useState([]); // multiple images
  const [variants, setVariants] = useState([{ weight: "", price: "" }]); // multiple variants
  const [auth] = useAuth();

  const api="https://tastetresures-backend-production.up.railway.app";
  // Fetch categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${api}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data?.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle product creation
  const handleCreate = async (e) => {
    e.preventDefault();

    // Frontend validation (mirror backend checks to avoid 400s)
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!category) {
      toast.error("Category is required");
      return;
    }
    const qty = parseInt(quantity, 10);
    if (Number.isNaN(qty) || qty < 0) {
      toast.error("Quantity is required and must be >= 0");
      return;
    }
    if (!photos || photos.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    // Only keep valid variants and coerce price to number
    const validVariants = variants
      .map((v) => ({
        weight: (v.weight || "").trim(),
        price: v.price === "" ? "" : Number(v.price),
      }))
      .filter((v) => v.weight !== "" && v.price !== "" && !Number.isNaN(v.price));

    if (validVariants.length === 0) {
      toast.error("Please add at least one valid variant (weight + price)");
      return;
    }

    try {
      const formData = new FormData();

      // Basic fields (backend reads these directly on ProductDto)
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("category", category); // backend finds Category by name
      formData.append("quantity", String(qty));

      // Variants — MUST use Spring binding keys: prices[0].weight / prices[0].price
      validVariants.forEach((v, idx) => {
        formData.append(`prices[${idx}].weight`, v.weight);
        formData.append(`prices[${idx}].price`, String(v.price));
      });

      // Multiple images — repeat "images" field for each file
      photos.forEach((file) => {
        formData.append("images", file);
      });

      // IMPORTANT: let Axios set the multipart boundary automatically
      const { data } = await axios.post(`${api}/api/v1/product/create-product`, formData, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      console.log(data);
      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Error in creating product");
      }
    } catch (error) {
      console.error(error);
      // If backend returns plain string error (e.g., "Price is required"), show it
      const serverMsg =
        error?.response?.data && typeof error.response.data === "string"
          ? error.response.data
          : "Something went wrong while creating the product";
      toast.error(serverMsg);
    }
  };

  // Add a new variant row
  const addVariant = () => {
    setVariants([...variants, { weight: "", price: "" }]);
  };

  // Remove a variant row
  const removeVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  // Update a variant field
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    if (field === "price") {
      // keep "" when empty, else keep as raw (string) until submit where we coerce to Number
      updated[index][field] = value;
    } else {
      updated[index][field] = value;
    }
    setVariants(updated);
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
              {/* Category Select */}
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setCategory(value)}
                value={category || undefined}
                filterOption={(input, option) =>
                  (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                }
              >
                {categories?.map((c) => (
                  <Option key={c.id} value={c.name}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              {/* Upload Multiple Photos */}
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photos.length > 0
                    ? `${photos.length} file(s) selected`
                    : "Upload Photos"}
                  <input
                    type="file"
                    name="photos"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPhotos(Array.from(e.target.files || []))}
                    hidden
                  />
                </label>
              </div>
              {photos.length > 0 && (
                <div className="text-center mb-3 d-flex flex-wrap gap-2">
                  {photos.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      height="100px"
                      className="img img-responsive rounded"
                    />
                  ))}
                </div>
              )}

              {/* Product Details */}
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Product Name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  value={description}
                  placeholder="Product Description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Total Quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0"
                />
              </div>

              {/* Variants Section */}
              <h5>Variants (Weight + Price)</h5>
              {variants.map((variant, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Weight (e.g. 250g)"
                    className="form-control"
                    value={variant.weight}
                    onChange={(e) =>
                      handleVariantChange(index, "weight", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    className="form-control"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                    step="0.01"
                    min="0"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeVariant(index)}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary mb-3"
                onClick={addVariant}
              >
                + Add Variant
              </button>

              {/* Create Product Button */}
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
