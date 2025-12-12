import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const api="https://tastetresures-backend-production.up.railway.app";
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photos, setPhotos] = useState([]); // multiple images
  const [variants, setVariants] = useState([{ weight: "", price: "" }]);
  const [id, setId] = useState("");
  const [auth] = useAuth();

  // Fetch single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`${api}/api/v1/product/get-product/${params.slug}`);
      const product = data.data.product;
      console.log(product);
      setId(product.id);
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category.name);
      setQuantity(product.quantity);
      // Map variants correctly
      setVariants(
        product.prices && product.prices.length > 0
          ? product.prices.map((v) => ({
              weight: v.weight || "",
              price: v.price || "",
            }))
          : [{ weight: "", price: "" }]
      );
      console.log(product.images);
      setPhotos(product.images);

      console.log(photos);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch product details");
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${api}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  
  // Variant handlers
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { weight: "", price: "" }]);
  };

  const removeVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) return toast.error("Name is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!category) return toast.error("Category is required");
    const validVariants = variants
      .map((v) => ({ weight: v.weight.trim(), price: v.price === "" ? "" : Number(v.price) }))
      .filter((v) => v.weight && v.price !== "" && !isNaN(v.price));
    const qty = parseInt(quantity, 10);
    if (Number.isNaN(qty) || qty < 0) {
      toast.error("Quantity is required and must be >= 0");
      return;
    }
    console.log(photos);
    console.log(photos.length);
    if (!photos || photos.length === 0) {
      toast.error("At least one image is required");
      return;
    }
    if (validVariants.length === 0) return toast.error("Add at least one valid variant");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("quantity", String(qty));
      validVariants.forEach((v, idx) => {
        formData.append(`prices[${idx}].weight`, v.weight);
        formData.append(`prices[${idx}].price`, String(v.price));
      });

      // Append only new images (File objects)
      photos.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });

      const { data } = await axios.put(
        `${api}/api/v1/product/update-product/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Error in updating product");
      }
    } catch (error) {
      console.log(error);
      const serverMsg =
        error?.response?.data && typeof error.response.data === "string"
          ? error.response.data
          : "Something went wrong while updating product";
      toast.error(serverMsg);
    }
  };

  // Delete product
const handleDelete = async () => {
  try {
    const answer = window.prompt("Are you sure you want to delete this product?");
    if (!answer) return;
    await axios.delete(`${api}/api/v1/product/delete-product/${id}`, {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    });
    toast.success("Product Deleted Successfully");
    navigate("/dashboard/admin/products");
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};


  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">

              {/* Category */}
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
                  <Option key={c.id} value={c.name}>{c.name}</Option>
                ))}
              </Select>

              {/* Upload Images */}
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photos.filter(p => p instanceof File).length > 0
                    ? `${photos.filter(p => p instanceof File).length} file(s) selected`
                    : "Upload Photos"}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setPhotos([...photos, ...Array.from(e.target.files || [])])}
                    hidden
                  />
                </label>
              </div>

              

              {/* Preview Images */}
              {photos.length > 0 && (
                <div className="text-center mb-3 d-flex flex-wrap gap-2">
                  {photos.map((file, index) => (
                    <img
                      key={index}
                      src={file instanceof File ? URL.createObjectURL(file) : `${api}/api/v1/product/product-photo/${id}/${index}`}
                      alt="preview"
                      height="100px"
                      className="img img-responsive rounded"
                    />
                  ))}
                </div>
              )}
              {/* Name & Description */}
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
              {/* Variants */}
              <h5>Variants (Weight + Price)</h5>
              {variants.map((variant, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Weight"
                    className="form-control"
                    value={variant.weight}
                    onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    className="form-control"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  {index > 0 && (
                    <button type="button" className="btn btn-danger" onClick={() => removeVariant(index)}>X</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-secondary mb-3" onClick={addVariant}>+ Add Variant</button>

              {/* Buttons */}
              <div className="mb-3">
                <button className="btn btn-primary me-2" onClick={handleUpdate}>UPDATE PRODUCT</button>
                <button className="btn btn-danger" onClick={handleDelete}>DELETE PRODUCT</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;