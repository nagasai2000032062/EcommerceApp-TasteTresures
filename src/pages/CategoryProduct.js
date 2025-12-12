// import React, { useState, useEffect } from "react";
// import Layout from "../components/Layout/Layout";
// import { useParams, useNavigate } from "react-router-dom";
// import "../styles/CategoryProductStyles.css";
// import axios from "axios";

// const CategoryProduct = () => {
//   const params = useParams();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [category, setCategory] = useState({});
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [sortOption, setSortOption] = useState(""); // sorting
//   const [priceFilter, setPriceFilter] = useState({ min: 0, max: 0 }); // applied filter
//   const [tempPriceFilter, setTempPriceFilter] = useState({ min: 0, max: 0 }); // input values
//   const [searchTerm, setSearchTerm] = useState(""); // search

//   useEffect(() => {
//     if (params?.slug) getProductsByCat();
//   }, [params?.slug]);

//   // Fetch products by category
//   const getProductsByCat = async () => {
//     try {
//       const { data } = await axios.get(
//         `/api/v1/product/product-category/${params.slug}`
//       );
//       setProducts(data?.data || []);
//       setCategory(data?.data?.[0]?.category || {});
//       setFilteredProducts(data?.data || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Get minimum price from product variants
//   const getMinPrice = (product) => {
//     if (!product?.prices?.length) return 0;
//     const nums = product.prices
//       .map((v) => Number(v.price))
//       .filter((p) => !Number.isNaN(p));
//     return nums.length ? Math.min(...nums) : 0;
//   };

//   // Recompute filtered + sorted products whenever inputs change
//   useEffect(() => {
//     let list = [...products];

//     // 1) Search filter
//     const q = searchTerm.trim().toLowerCase();
//     if (q) {
//       list = list.filter((p) => p.name?.toLowerCase().includes(q));
//     }

//     // 2) Price filter (applied filter only)
//     const min = Number(priceFilter.min) || 0;
//     const max = Number(priceFilter.max) || 0;
//     if (min > 0 || max > 0) {
//       list = list.filter((p) => {
//         const price = getMinPrice(p);
//         const meetsMin = price >= min;
//         const meetsMax = max === 0 ? true : price <= max;
//         return meetsMin && meetsMax;
//       });
//     }

//     // 3) Sorting
//     switch (sortOption) {
//       case "price-asc":
//         list.sort((a, b) => getMinPrice(a) - getMinPrice(b));
//         break;
//       case "price-desc":
//         list.sort((a, b) => getMinPrice(b) - getMinPrice(a));
//         break;
//       case "name-asc":
//         list.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case "name-desc":
//         list.sort((a, b) => b.name.localeCompare(a.name));
//         break;
//       default:
//         break;
//     }

//     setFilteredProducts(list);
//   }, [products, searchTerm, priceFilter, sortOption]);

//   // Handlers
//   const handleSort = (e) => setSortOption(e.target.value);

//   const handlePriceFilter = (e) => {
//     e.preventDefault();
//     setPriceFilter(tempPriceFilter); // Apply only when button clicked
//   };

//   const handleSearch = (e) => setSearchTerm(e.target.value);

//   return (
//     <Layout>
//       <div className="container mt-3 category">
//         <h4 className="text-center">Category - {category?.name}</h4>
//         <h6 className="text-center">{filteredProducts?.length} result(s) found</h6>

//         {/* Search Bar */}
//         <div className="row mb-3">
//           <div className="col-md-9 offset-1">
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="form-control"
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           </div>
//         </div>

//         {/* Filters and Sort */}
//         <div className="row mb-3">
//           <div className="col-md-9 offset-1 d-flex align-items-center justify-content-between">
//             {/* Sort Dropdown */}
//             <div>
//               <label>Sort By: </label>
//               <select
//                 value={sortOption}
//                 onChange={handleSort}
//                 className="ms-2"
//                 style={{ height: "40px", borderRadius: "10px" }}
//               >
//                 <option value="">Default</option>
//                 <option value="price-asc">Price: Low to High</option>
//                 <option value="price-desc">Price: High to Low</option>
//                 <option value="name-asc">Name: A → Z</option>
//                 <option value="name-desc">Name: Z → A</option>
//               </select>
//             </div>

//             {/* Price Filter */}
//             <form className="d-flex align-items-center" onSubmit={handlePriceFilter}>
//               <label>Price: </label>
//               <input
//                 type="number"
//                 placeholder="Min"
//                 className="form-control mx-1"
//                 style={{ width: "80px" }}
//                 value={tempPriceFilter.min}
//                 onChange={(e) =>
//                   setTempPriceFilter({
//                     ...tempPriceFilter,
//                     min: Number(e.target.value),
//                   })
//                 }
//               />
//               <input
//                 type="number"
//                 placeholder="Max"
//                 className="form-control mx-1"
//                 style={{ width: "80px" }}
//                 value={tempPriceFilter.max}
//                 onChange={(e) =>
//                   setTempPriceFilter({
//                     ...tempPriceFilter,
//                     max: Number(e.target.value),
//                   })
//                 }
//               />
//               <button className="btn btn-primary btn-sm">Apply</button>
//             </form>
//           </div>
//         </div>

//         {/* Products */}
//         <div className="row">
//           <div className="col-md-9 offset-1">
//             <div className="d-flex flex-wrap">
//               {filteredProducts?.map((p) => (
//                 <div className="card m-2" key={p.id}>
//                   <img
//                     src={`/api/v1/product/product-photo/${p.id}/0`}
//                     className="card-img-top"
//                     alt={p.name}
//                   />
//                   <div className="card-body">
//                     <div className="card-name-price">
//                       <h5 className="card-title">{p.name}</h5>
//                       <h5 className="card-title card-price">
//                         {getMinPrice(p).toLocaleString("en-IN", {
//                           style: "currency",
//                           currency: "INR",
//                         })}
//                       </h5>
//                     </div>
//                     <p className="card-text">
//                       {p.description?.substring(0, 60)}...
//                     </p>
//                     <div className="card-name-price">
//                       <button
//                         className="btn btn-info ms-1"
//                         onClick={() => navigate(`/product/${p.slug}`)}
//                       >
//                         More Details
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {filteredProducts?.length === 0 && (
//                 <p className="mt-3">No products match your filters.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CategoryProduct;




import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import axios from "axios";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState(""); // sorting
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 0 }); // applied filter
  const [tempPriceFilter, setTempPriceFilter] = useState({ min: 0, max: 0 }); // input values
  const [searchTerm, setSearchTerm] = useState(""); // search

  const api="https://tastetresures-backend-production.up.railway.app";
  useEffect(() => {
    if (params?.slug) getProductsByCat();
  }, [params?.slug]);

  // Fetch products by category
  const getProductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${api}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.data || []);
      console.log(data.data);
      setCategory(data?.data?.[0]?.category || {});
      setFilteredProducts(data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Get minimum price from product variants
  const getMinPrice = (product) => {
    if (!product?.prices?.length) return 0;
    const nums = product.prices
      .map((v) => Number(v.price))
      .filter((p) => !Number.isNaN(p));
    return nums.length ? Math.min(...nums) : 0;
  };

  // Recompute filtered + sorted products whenever inputs change
  useEffect(() => {
    let list = [...products];

    // 1) Search filter
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => p.name?.toLowerCase().includes(q));
    }

    // 2) Price filter (applied filter only)
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
    setPriceFilter(tempPriceFilter); // Apply only when button clicked
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleReset = () => {
    setSearchTerm("");
    setSortOption("");
    setPriceFilter({ min: 0, max: 0 });
    setTempPriceFilter({ min: 0, max: 0 });
    setFilteredProducts(products); // reset to full product list
  };

  return (
    <Layout>
      <div className="container mt-3 category">
        <h4 className="text-center">Category - {category?.name}</h4>
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
                  setTempPriceFilter({
                    ...tempPriceFilter,
                    min: Number(e.target.value),
                  })
                }
              />
              <input
                type="number"
                placeholder="Max"
                className="form-control mx-1"
                style={{ width: "80px" }}
                value={tempPriceFilter.max}
                onChange={(e) =>
                  setTempPriceFilter({
                    ...tempPriceFilter,
                    max: Number(e.target.value),
                  })
                }
              />
              <button className="btn btn-primary btn-sm me-2">Apply</button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleReset}
              >
                ResetFilters
              </button>
            </form>
          </div>
        </div>

        {/* Products */}
        <div className="row">
          <div className="col-md-9 offset-1">
            <div className="d-flex flex-wrap">
              {filteredProducts?.map((p) => (
                <div className="card m-2" key={p.id}>
                  <img
                    src={`${api}/api/v1/product/product-photo/${p.id}/0`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p.name}</h5>
                      <h5 className="card-title card-price">
                        {getMinPrice(p).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </h5>
                    </div>
                    <p className="card-text">
                      {p.description?.substring(0, 60)}...
                    </p>
                    <div className="card-name-price">
                      <button
                        className="btn btn-info ms-1"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts?.length === 0 && (
                <p className="mt-3">No products match your filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
