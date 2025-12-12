// import React, { useState, useEffect } from "react";
// import Layout from "./../components/Layout/Layout";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import "../styles/ProductDetailsStyles.css";
// import { useCart } from "../context/cart";
// import toast from "react-hot-toast";

// const ProductDetails = () => {
//   const params = useParams();
//   const navigate = useNavigate();
//   const [cart, setCart] = useCart();
//   const [product, setProduct] = useState({});
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [availability, setAvailability]=useState(false);

//   useEffect(() => {
//     if (params?.slug) getProduct();
//   }, [params?.slug]);

//   // get product details
//   const getProduct = async () => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/product/get-product/${params.slug}`
//       );
//       const prod = data?.data.product;
//       setProduct(prod);
//       console.log(prod);
//       // set default image
//       if (prod?.images && prod.images.length > 0) {
//         setSelectedImage(`/api/v1/product/product-photo/${prod.id}/0`);
//       }

//       // set default variant (first one)
//       if (prod?.prices && prod.prices.length > 0) {
//         setSelectedVariant(prod.prices[0]);
//       }
//       setAvailability(prod?.availability);
//       console.log(availability);
//       getSimilarProduct(prod.id, prod.category.id);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // get related products
//   const getSimilarProduct = async (pid, cid) => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/product/related-products/${pid}/${cid}`
//       );
//       setRelatedProducts(data?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // quantity handlers
//   const increaseQty = () => setQuantity((prev) => prev + 1);
//   const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   // add to cart handler
//   const handleAddToCart = () => {
//     if (!selectedVariant) {
//       toast.error("Please select a variant");
//       return;
//     }

//     const cartItem = {
//       id: product.id,
//       name: product.name,
//       slug: product.slug,
//       image: selectedImage,
//       variant: selectedVariant,
//       price: selectedVariant.price,
//       weight: selectedVariant.weight,
//       quantity: quantity,
//     };

//     const updatedCart = [...cart, cartItem];
//     setCart(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     toast.success(`${quantity} x ${product.name} added to cart`);
//   };

//   return (
//     <Layout>
//       <div className="row container product-details">
//         {/* Left side images */}
//         <div className="col-md-6">
//           <div className="main-image">
//             <img
//               src={selectedImage}
//               alt={product.name}
//               className="img-fluid"
//               style={{ borderRadius: "10px", width:"300px",height:"300px" }}
//             />
//           </div>
//           {/* Thumbnail Images */}
//           <div className="d-flex mt-3">
//             {product?.images?.map((img, index) => (
//               <img
//                 key={index}
//                 src={`/api/v1/product/product-photo/${product.id}/${index}`}
//                 alt={`thumb-${index}`}
//                 className="img-thumbnail me-2"
//                 style={{
//                   width: "80px",
//                   height: "80px",
//                   cursor: "pointer",
//                   border:
//                     selectedImage ===
//                     `/api/v1/product/product-photo/${product.id}/${index}`
//                       ? "2px solid #000"
//                       : "1px solid #ddd",
//                 }}
//                 onClick={() =>
//                   setSelectedImage(
//                     `/api/v1/product/product-photo/${product.id}/${index}`
//                   )
//                 }
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right side details */}
//         <div className="col-md-6 product-details-info">
//           <h2>{product.name}</h2>
//           <h4>
//             {selectedVariant
//               ? `₹ ${selectedVariant.price.toFixed(2)}`
//               : "Select a variant"}
//           </h4>
//           <p>{product.description}</p>

//           {/* Weight Selection */}
//           <div className="mt-3">
//             <h6>Weight:</h6>
//             <div className="d-flex flex-wrap">
//               {product?.prices?.map((variant, index) => (
//                 <button
//                   key={index}
//                   className={`btn me-2 mb-2 ${
//                     selectedVariant?.id === variant.id
//                       ? "btn-dark"
//                       : "btn-outline-dark"
//                   }`}
//                   onClick={() => setSelectedVariant(variant)}
//                 >
//                   {variant.weight}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Quantity Selection */}
//           <div className="mt-3">
//             <h6>Quantity:</h6>
//             <div className="input-group" style={{ width: "140px" }}>
//               <button
//                 className="btn btn-outline-secondary"
//                 onClick={decreaseQty}
//               >
//                 -
//               </button>
//               <input
//                 type="text"
//                 className="form-control text-center"
//                 value={quantity}
//                 readOnly
//               />
//               <button
//                 className="btn btn-outline-secondary"
//                 onClick={increaseQty}
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Add to Cart */}
//           <div className="mt-4">
//             <button className="btn btn-dark ms-1" onClick={handleAddToCart} disabled={!availability}
//               title={availability ? "Add to cart" : "Product out of stock"}>
//               Add {quantity} to Cart
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       <hr />
//       <div className="row container similar-products">
//         <h4>Similar Products ➡️</h4>
//         {relatedProducts.length < 1 && (
//           <p className="text-center">No Similar Products found</p>
//         )}
//         <div className="d-flex flex-wrap">
//           {relatedProducts?.map((p) => (
//             <div className="card m-2" key={p.id} style={{ width: "18rem" }}>
//               <img
//                 src={`/api/v1/product/product-photo/${p.id}/0`}
//                 className="card-img-top"
//                 alt={p.name}
//               />
//               <div className="card-body">
//                 <h5 className="card-title">{p.name}</h5>
//                 <h6>
//                   {p?.prices?.length > 0 &&
//                     `From ₹${Math.min(...p.prices.map((v) => v.price))}`}
//                 </h6>
//                 <p className="card-text">
//                   {p.description.substring(0, 60)}...
//                 </p>
//                 <button
//                   className="btn btn-info"
//                   onClick={() => navigate(`/product/${p.slug}`)}
//                 >
//                   More Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ProductDetails;







//-----------------------------------------------------------------------------------------------------------------------------






// import React, { useState, useEffect } from "react";
// import Layout from "./../components/Layout/Layout";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import "../styles/ProductDetailsStyles.css";
// import { useCart } from "../context/cart";
// import toast from "react-hot-toast";

// const ProductDetails = () => {
//   const params = useParams();
//   const navigate = useNavigate();
//   const [cart, setCart] = useCart();
//   const [product, setProduct] = useState({});
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [availability, setAvailability] = useState(false);

//   // reviews state
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
//   const [showAllReviews, setShowAllReviews] = useState(false);

//   useEffect(() => {
//     if (params?.slug) getProduct();
//   }, [params?.slug]);

//   // get product details
//   const getProduct = async () => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/product/get-product/${params.slug}`
//       );
//       const prod = data?.data.product;
//       setProduct(prod);

//       if (prod?.images?.length > 0) {
//         setSelectedImage(`/api/v1/product/product-photo/${prod.id}/0`);
//       }

//       if (prod?.prices?.length > 0) {
//         setSelectedVariant(prod.prices[0]);
//       }

//       setAvailability(prod?.availability);

//       getSimilarProduct(prod.id, prod.category.id);
//       getReviews(prod.id);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // get related products
//   const getSimilarProduct = async (pid, cid) => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/product/related-products/${pid}/${cid}`
//       );
//       setRelatedProducts(data?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // get reviews for product
//   const getReviews = async (pid) => {
//     try {
//       const { data } = await axios.get(`/api/v1/reviews/get-reviews/${pid}`);
//       setReviews(data?.data || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // handle review submit
//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const uId = JSON.parse(localStorage.getItem("auth"))?.user?.id;
//       if (!uId) {
//         toast.error("User not logged in.");
//         return;
//       }
//       const reviewData = {
//         productId: product.id,
//         userId: uId,
//         rating: newReview.rating,
//         comment: newReview.comment,
//       };
//       const { data } = await axios.post(
//         "/api/v1/reviews/create-review",
//         reviewData
//       );

//       if (data.success) {
//         toast.success("Review submitted!");
//         setNewReview({ rating: 0, comment: "" });
//         getReviews(product.id);
//       } else {
//         toast.error(data.message || "Failed to submit review");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Error submitting review");
//     }
//   };

//   // quantity handlers
//   const increaseQty = () => setQuantity((prev) => prev + 1);
//   const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   // add to cart handler
//   const handleAddToCart = () => {
//     if (!selectedVariant) {
//       toast.error("Please select a variant");
//       return;
//     }

//     const cartItem = {
//       id: product.id,
//       name: product.name,
//       slug: product.slug,
//       image: selectedImage,
//       variant: selectedVariant,
//       price: selectedVariant.price,
//       weight: selectedVariant.weight,
//       quantity: quantity,
//     };

//     const updatedCart = [...cart, cartItem];
//     setCart(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     toast.success(`${quantity} x ${product.name} added to cart`);
//   };

//   // format date helper
//   const formatDate = (dateStr) => {
//     const d = new Date(dateStr);
//     return d.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   return (
//     <Layout>
//       <div className="row container product-details">
//         {/* Left side images */}
//         <div className="col-md-6">
//           <div className="main-image">
//             <img
//               src={selectedImage}
//               alt={product.name}
//               className="img-fluid"
//               style={{ borderRadius: "10px", width: "300px", height: "300px" }}
//             />
//           </div>
//           <div className="d-flex mt-3">
//             {product?.images?.map((img, index) => (
//               <img
//                 key={index}
//                 src={`/api/v1/product/product-photo/${product.id}/${index}`}
//                 alt={`thumb-${index}`}
//                 className="img-thumbnail me-2"
//                 style={{
//                   width: "80px",
//                   height: "80px",
//                   cursor: "pointer",
//                   border:
//                     selectedImage ===
//                     `/api/v1/product/product-photo/${product.id}/${index}`
//                       ? "2px solid #000"
//                       : "1px solid #ddd",
//                 }}
//                 onClick={() =>
//                   setSelectedImage(
//                     `/api/v1/product/product-photo/${product.id}/${index}`
//                   )
//                 }
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right side details */}
//         <div className="col-md-6 product-details-info">
//           <h2>{product.name}</h2>
//           <h4>
//             {selectedVariant
//               ? `₹ ${selectedVariant.price.toFixed(2)}`
//               : "Select a variant"}
//           </h4>
//           <p>{product.description}</p>

//           {/* Weight Selection */}
//           <div className="mt-3">
//             <h6>Weight:</h6>
//             <div className="d-flex flex-wrap">
//               {product?.prices?.map((variant, index) => (
//                 <button
//                   key={index}
//                   className={`btn me-2 mb-2 ${
//                     selectedVariant?.id === variant.id
//                       ? "btn-dark"
//                       : "btn-outline-dark"
//                   }`}
//                   onClick={() => setSelectedVariant(variant)}
//                 >
//                   {variant.weight}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Quantity Selection */}
//           <div className="mt-3">
//             <h6>Quantity:</h6>
//             <div className="input-group" style={{ width: "140px" }}>
//               <button
//                 className="btn btn-outline-secondary"
//                 onClick={decreaseQty}
//               >
//                 -
//               </button>
//               <input
//                 type="text"
//                 className="form-control text-center"
//                 value={quantity}
//                 readOnly
//               />
//               <button
//                 className="btn btn-outline-secondary"
//                 onClick={increaseQty}
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* Add to Cart */}
//           <div className="mt-4">
//             <button
//               className="btn btn-dark ms-1"
//               onClick={handleAddToCart}
//               disabled={!availability}
//               title={availability ? "Add to cart" : "Product out of stock"}
//             >
//               Add {quantity} to Cart
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Reviews Section */}
//       <hr />
//       <div className="container mt-4">
//         <h4>Customer Reviews</h4>
//         {reviews.length === 0 ? (
//           <p>No reviews yet. Be the first to review!</p>
//         ) : (
//           <>
//             {(showAllReviews ? reviews : reviews.slice(0, 2)).map((r) => (
//               <div key={r.id} className="border p-2 mb-2 rounded">
//                 <strong>{r.user?.name || "Anonymous"}</strong>{" "}
//                 <span>⭐ {r.rating}/5</span>
//                 <small className="text-muted ms-2">
//                   {r.createdAt ? formatDate(r.createdAt) : ""}
//                 </small>
//                 <p className="mb-0">{r.comment}</p>
//               </div>
//             ))}
//             {reviews.length > 2 && (
//               <button
//                 className="btn btn-link"
//                 onClick={() => setShowAllReviews(!showAllReviews)}
//               >
//                 {showAllReviews ? "Show Less" : "Show More"}
//               </button>
//             )}
//           </>
//         )}

//         {/* Add Review */}
//         <form onSubmit={handleReviewSubmit} className="mt-3">
//           <h6>Write a Review</h6>
//           <div className="mb-2">
//             <label>Rating:</label>
//             <select
//               className="form-select"
//               value={newReview.rating}
//               onChange={(e) =>
//                 setNewReview({ ...newReview, rating: e.target.value })
//               }
//               required
//             >
//               <option value="">Select rating</option>
//               {[1, 2, 3, 4, 5].map((n) => (
//                 <option key={n} value={n}>
//                   {n}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-2">
//             <label>Comment:</label>
//             <textarea
//               className="form-control"
//               value={newReview.comment}
//               onChange={(e) =>
//                 setNewReview({ ...newReview, comment: e.target.value })
//               }
//               required
//             ></textarea>
//           </div>
//           <button className="btn btn-primary">Submit Review</button>
//         </form>
//       </div>

//       {/* Related Products */}
//       <hr />
//       <div className="row container similar-products">
//         <h4>Similar Products ➡️</h4>
//         {relatedProducts.length < 1 && (
//           <p className="text-center">No Similar Products found</p>
//         )}
//         <div className="d-flex flex-wrap">
//           {relatedProducts?.map((p) => (
//             <div className="card m-2" key={p.id} style={{ width: "18rem" }}>
//               <img
//                 src={`/api/v1/product/product-photo/${p.id}/0`}
//                 className="card-img-top"
//                 alt={p.name}
//               />
//               <div className="card-body">
//                 <h5 className="card-title">{p.name}</h5>
//                 <h6>
//                   {p?.prices?.length > 0 &&
//                     `From ₹${Math.min(...p.prices.map((v) => v.price))}`}
//                 </h6>
//                 <p className="card-text">
//                   {p.description.substring(0, 60)}...
//                 </p>
//                 <button
//                   className="btn btn-info"
//                   onClick={() => navigate(`/product/${p.slug}`)}
//                 >
//                   More Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ProductDetails;


//-----------------------------------------------------------------------------------------------------------------------------------









import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [availability, setAvailability] = useState(false);

  // reviews state
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all"); // ⭐ filter state

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // get product details
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      const prod = data?.data.product;
      setProduct(prod);

      if (prod?.images?.length > 0) {
        setSelectedImage(`/api/v1/product/product-photo/${prod.id}/0`);
      }

      if (prod?.prices?.length > 0) {
        setSelectedVariant(prod.prices[0]);
      }

      setAvailability(prod?.availability);

      getSimilarProduct(prod.id, prod.category.id);
      getReviews(prod.id);
    } catch (error) {
      console.log(error);
    }
  };

  // get related products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-products/${pid}/${cid}`
      );
      setRelatedProducts(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // get reviews for product
  const getReviews = async (pid) => {
    try {
      const { data } = await axios.get(`/api/v1/reviews/get-reviews/${pid}`);
      setReviews(data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const uId = JSON.parse(localStorage.getItem("auth"))?.user?.id;
      if (!uId) {
        toast.error("User not logged in.");
        return;
      }
      const reviewData = {
        productId: product.id,
        userId: uId,
        rating: Number(newReview.rating),
        comment: newReview.comment,
      };
      const { data } = await axios.post(
        "/api/v1/reviews/create-review",
        reviewData
      );

      if (data.success) {
        toast.success("Review submitted!");
        setNewReview({ rating: 0, comment: "" });
        getReviews(product.id);
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error submitting review");
    }
  };

  // quantity handlers
  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // add to cart handler
  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: selectedImage,
      variant: selectedVariant,
      price: selectedVariant.price,
      weight: selectedVariant.weight,
      quantity: quantity,
    };

    const updatedCart = [...cart, cartItem];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  // format date helper
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // calculate average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  // apply rating filter
  const filteredReviews =
    ratingFilter === "all"
      ? reviews
      : reviews.filter((r) => r.rating === Number(ratingFilter));

  return (
    <Layout>
      <div className="row container product-details">
        {/* Left side images */}
        <div className="col-md-6">
          <div className="main-image">
            <img
              src={selectedImage}
              alt={product.name}
              className="img-fluid"
              style={{ borderRadius: "10px", width: "300px", height: "300px" }}
            />
          </div>
          <div className="d-flex mt-3">
            {product?.images?.map((img, index) => (
              <img
                key={index}
                src={`/api/v1/product/product-photo/${product.id}/${index}`}
                alt={`thumb-${index}`}
                className="img-thumbnail me-2"
                style={{
                  width: "80px",
                  height: "80px",
                  cursor: "pointer",
                  border:
                    selectedImage ===
                    `/api/v1/product/product-photo/${product.id}/${index}`
                      ? "2px solid #000"
                      : "1px solid #ddd",
                }}
                onClick={() =>
                  setSelectedImage(
                    `/api/v1/product/product-photo/${product.id}/${index}`
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Right side details */}
        <div className="col-md-6 product-details-info">
          <h2>{product.name}</h2>
          <h4>
            {selectedVariant
              ? `₹ ${selectedVariant.price.toFixed(2)}`
              : "Select a variant"}
          </h4>
          <p>{product.description}</p>

          {/* Weight Selection */}
          <div className="mt-3">
            <h6>Weight:</h6>
            <div className="d-flex flex-wrap">
              {product?.prices?.map((variant, index) => (
                <button
                  key={index}
                  className={`btn me-2 mb-2 ${
                    selectedVariant?.id === variant.id
                      ? "btn-dark"
                      : "btn-outline-dark"
                  }`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant.weight}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mt-3">
            <h6>Quantity:</h6>
            <div className="input-group" style={{ width: "140px" }}>
              <button
                className="btn btn-outline-secondary"
                onClick={decreaseQty}
              >
                -
              </button>
              <input
                type="text"
                className="form-control text-center"
                value={quantity}
                readOnly
              />
              <button
                className="btn btn-outline-secondary"
                onClick={increaseQty}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-4">
            <button
              className="btn btn-dark ms-1"
              onClick={handleAddToCart}
              disabled={!availability}
              title={availability ? "Add to cart" : "Product out of stock"}
            >
              {/* Add {quantity} to Cart */}
              {availability ? `Add ${quantity} to Cart` : "Sold Out"}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <hr />
      <div className="container mt-4">
        <h4>Customer Reviews</h4>

        {/* ⭐ Show Average Rating */}
        {averageRating && (
          <p>
            ⭐ <strong>{averageRating}</strong> out of 5 ({reviews.length}{" "}
            reviews)
          </p>
        )}

        {/* ⭐ Rating Filter */}
        <div className="mb-3">
          <label>Filter by Rating:</label>
          <select
            className="form-select"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">All Ratings</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} Stars
              </option>
            ))}
          </select>
        </div>

        {filteredReviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <>
            <b>{ ratingFilter!="all" ?`${ratingFilter} Star rated reviews = ${filteredReviews.length}`:""}</b>

            {(showAllReviews ? filteredReviews : filteredReviews.slice(0, 2)).map((r) => (
              <div key={r.id} className="border p-2 mb-2 rounded">
                <strong>{r.user?.name || "Anonymous"}</strong>{" "}
                <span>⭐ {r.rating}/5</span>
                <small className="text-muted ms-2">
                  {r.createdAt ? formatDate(r.createdAt) : ""}
                </small>
                <p className="mb-0">{r.comment}</p>
              </div>
            ))}
            {filteredReviews.length > 2 && (
              <button
                className="btn btn-link"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? "Show Less" : "Show More"}
              </button>
            )}
          </>
        )}

        {/* Add Review */}
        <form onSubmit={handleReviewSubmit} className="mt-3">
          <h6>Write a Review</h6>
          <div className="mb-2">
            <label>Rating:</label>
            <select
              className="form-select"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: e.target.value })
              }
              required
            >
              <option value="">Select rating</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label>Comment:</label>
            <textarea
              className="form-control"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              required
            ></textarea>
          </div>
          <button className="btn btn-primary">Submit Review</button>
        </form>
      </div>

      {/* Related Products */}
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p.id} style={{ width: "18rem" }}>
              <img
                src={`/api/v1/product/product-photo/${p.id}/0`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <h6>
                  {p?.prices?.length > 0 &&
                    `From ₹${Math.min(...p.prices.map((v) => v.price))}`}
                </h6>
                <p className="card-text">
                  {p.description.substring(0, 60)}...
                </p>
                <button
                  className="btn btn-info"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  More Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
