
// import React, { useState, useEffect } from "react";
// import AdminMenu from "../../components/Layout/AdminMenu";
// import Layout from "./../../components/Layout/Layout";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Link } from "react-router-dom";

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [sortOption, setSortOption] = useState(""); // for sorting
//   const [priceFilter, setPriceFilter] = useState({ min: 0, max: 0 }); // for filtering by price
//   const [searchTerm, setSearchTerm] = useState(""); // for search functionality

//   // Fetch all products
//   const getAllProducts = async () => {
//     try {
//       const { data } = await axios.get("/api/v1/product/get-product");
//       if (data?.success) {
//         setProducts(data.products);
//         setFilteredProducts(data.products);
//       } else {
//         toast.error("Failed to fetch products");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong while fetching products");
//     }
//   };

//   useEffect(() => {
//     getAllProducts();
//   }, []);

//   // Get minimum price from product variants
//  const getMinPrice = (product) => {
//     if (!product.prices || product.prices.length === 0) return 0;
//     const prices = product.prices
//       .map((v) => Number(v.price))
//       .filter((p) => !isNaN(p));
//     return prices.length > 0 ? Math.min(...prices) : 0;
//   };

//   // Handle sorting
//   const handleSort = (e) => {
//     const value = e.target.value;
//     setSortOption(value);

//     let sortedProducts = [...filteredProducts];

//     switch (value) {
//       case "price-asc":
//         sortedProducts.sort((a, b) => getMinPrice(a) - getMinPrice(b));
//         break;
//       case "price-desc":
//         sortedProducts.sort((a, b) => getMinPrice(b) - getMinPrice(a));
//         break;
//       case "name-asc":
//         sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case "name-desc":
//         sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
//         break;
//       default:
//         break;
//     }

//     setFilteredProducts(sortedProducts);
//   };

//   // Handle price filter
//   const handlePriceFilter = (e) => {
//     e.preventDefault();
//     const { min, max } = priceFilter;
//     const filtered = products.filter(
//       (p) => getMinPrice(p) >= min && (max === 0 || getMinPrice(p) <= max)
//     );
//     setFilteredProducts(filtered);
//   };

//   // Handle search
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     const filtered = products.filter((p) =>
//       p.name.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredProducts(filtered);
//   };

//   return (
//     <Layout>
//       <div className="row dashboard">
//         <div className="col-md-3">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9">
//           <h1 className="text-center mb-4">All Products List</h1>
//           <h6 className="text-center">{filteredProducts?.length} result found</h6>

//           {/* Search Bar */}
//           <div className="row mb-3">
//             <div className="col-md-9 offset-1">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="form-control"
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//             </div>
//           </div>

//           {/* Filters and Sort */}
//           <div className="row mb-3">
//             <div className="col-md-9 offset-1 d-flex align-items-center justify-content-between">
//               {/* Sort Dropdown */}
//               <div>
//                 <label>Sort By: </label>
//                 <select
//                   value={sortOption}
//                   onChange={handleSort}
//                   className="ms-2"
//                   style={{ height: "40px", borderRadius: "10px" }}
//                 >
//                   <option value="">Default</option>
//                   <option value="price-asc">Price: Low to High</option>
//                   <option value="price-desc">Price: High to Low</option>
//                   <option value="name-asc">Name: A → Z</option>
//                   <option value="name-desc">Name: Z → A</option>
//                 </select>
//               </div>
//               {/* Price Filter */}
//               <form className="d-flex align-items-center" onSubmit={handlePriceFilter}>
//                 <label>Price: </label>
//                 <input
//                   type="number"
//                   placeholder="Min"
//                   className="form-control mx-1"
//                   style={{ width: "80px" }}
//                   value={priceFilter.min}
//                   onChange={(e) =>
//                     setPriceFilter({ ...priceFilter, min: Number(e.target.value) })
//                   }
//                 />
//                 <input
//                   type="number"
//                   placeholder="Max"
//                   className="form-control mx-1"
//                   style={{ width: "80px" }}
//                   value={priceFilter.max}
//                   onChange={(e) =>
//                     setPriceFilter({ ...priceFilter, max: Number(e.target.value) })
//                   }
//                 />
//                 <button className="btn btn-primary btn-sm">Apply</button>
//               </form>
//             </div>
//           </div>

//           <div className="d-flex flex-wrap">
//             {filteredProducts?.map((p) => (
//               <Link
//                 key={p.id}
//                 to={`/dashboard/admin/product/${p.slug}`}
//                 className="product-link"
//               >
//                 <div className="card m-2" style={{ width: "18rem" }}>
//                   {/* Show first image as thumbnail from backend */}
//                   {p.images && p.images.length > 0 ? (
//                     <img
//                       src={`/api/v1/product/product-photo/${p.id}/0`}
//                       alt={p.name}
//                       style={{ width: "100%", height: "200px", objectFit: "cover" }}
//                       className="card-img-top"
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         width: "100%",
//                         height: "200px",
//                         backgroundColor: "#f0f0f0",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "#888",
//                       }}
//                     >
//                       No Image
//                     </div>
//                   )}

//                   <div className="card-body">
//                     <h5 className="card-title">{p.name}</h5>
//                     <p className="card-text">{p.description}</p>

//                     {/* Show variants (weight + price) */}
//                     {/* {p.variants && p.variants.length > 0 && (
//                       <ul className="list-group list-group-flush">
//                         {p.variants.map((v, idx) => (
//                           <li
//                             key={idx}
//                             className="list-group-item d-flex justify-content-between"
//                           >
//                             <span>{v.weight}</span>
//                             <strong>₹{v.price}</strong>
//                           </li>
//                         ))}
//                       </ul>
//                     )} */}

//                     {/* Show minimum price */}
//                     <div className="mt-2">
//                       <strong>
//                         Price:{" "}
//                         {getMinPrice(p).toLocaleString("en-US", {
//                           style: "currency",
//                           currency: "INS",
//                         })}
//                       </strong>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Products;


import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState(""); 
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 0 }); // applied filter
  const [tempPriceFilter, setTempPriceFilter] = useState({ min: 0, max: 0 }); // input values
  const [searchTerm, setSearchTerm] = useState(""); 

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      if (data?.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching products");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Get minimum price from product variants
  const getMinPrice = (product) => {
    if (!product.prices || product.prices.length === 0) return 0;
    const prices = product.prices
      .map((v) => Number(v.price))
      .filter((p) => !isNaN(p));
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  // 🔥 Centralized filtering + sorting logic
  useEffect(() => {
    let list = [...products];

    // 1) Search filter
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    // 2) Price filter
    const min = Number(priceFilter.min) || 0;
    const max = Number(priceFilter.max) || 0;
    if (min > 0 || max > 0) {
      list = list.filter((p) => {
        const price = getMinPrice(p);
        const meetsMin = price >= min;
        const meetsMax = max === 0 ? true : price <= max;
        return meetsMin && meetsMax;
      });
    }

    // 3) Sorting
    switch (sortOption) {
      case "price-asc":
        list.sort((a, b) => getMinPrice(a) - getMinPrice(b));
        break;
      case "price-desc":
        list.sort((a, b) => getMinPrice(b) - getMinPrice(a));
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(list);
  }, [products, searchTerm, priceFilter, sortOption]);

  // Handlers
  const handleSort = (e) => setSortOption(e.target.value);

  const handlePriceFilter = (e) => {
    e.preventDefault();
    setPriceFilter({ ...tempPriceFilter }); // apply only on button click
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4">All Products List</h1>
          <h6 className="text-center">{filteredProducts?.length} result(s) found</h6>

          {/* Search Bar */}
          <div className="row mb-3">
            <div className="col-md-9 offset-1">
              <input
                type="text"
                placeholder="Search products..."
                className="form-control"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="row mb-3">
            <div className="col-md-9 offset-1 d-flex align-items-center justify-content-between">
              {/* Sort Dropdown */}
              <div>
                <label>Sort By: </label>
                <select
                  value={sortOption}
                  onChange={handleSort}
                  className="ms-2"
                  style={{ height: "40px", borderRadius: "10px" }}
                >
                  <option value="">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A → Z</option>
                  <option value="name-desc">Name: Z → A</option>
                </select>
              </div>

              {/* Price Filter */}
              <form className="d-flex align-items-center" onSubmit={handlePriceFilter}>
                <label>Price: </label>
                <input
                  type="number"
                  placeholder="Min"
                  className="form-control mx-1"
                  style={{ width: "80px" }}
                  value={tempPriceFilter.min}
                  onChange={(e) =>
                    setTempPriceFilter({ ...tempPriceFilter, min: Number(e.target.value) })
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="form-control mx-1"
                  style={{ width: "80px" }}
                  value={tempPriceFilter.max}
                  onChange={(e) =>
                    setTempPriceFilter({ ...tempPriceFilter, max: Number(e.target.value) })
                  }
                />
                <button className="btn btn-primary btn-sm">Apply</button>
              </form>
            </div>
          </div>

          {/* Products */}
          <div className="d-flex flex-wrap">
            {filteredProducts?.map((p) => (
              <Link
                key={p.id}
                to={`/dashboard/admin/product/${p.slug}`}
                className="product-link"
              >
                <div className="card m-2" style={{ width: "18rem" }}>
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={`/api/v1/product/product-photo/${p.id}/0`}
                      alt={p.name}
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                      className="card-img-top"
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#888",
                      }}
                    >
                      No Image
                    </div>
                  )}

                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                    <div className="mt-2">
                      <strong>
                        Price:{" "}
                        {getMinPrice(p).toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </strong>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {filteredProducts?.length === 0 && (
              <p className="mt-3">No products match your filters.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
