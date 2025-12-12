import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./../components/Layout/Layout";
import "../styles/Homepage.css";

const inr = (n) =>
  Number(n || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" });

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const api="https://tastetresures-backend-production.up.railway.app";
  // Fetch categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${api}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${api}/api/v1/product/get-product`);
      if (data?.success) {
        setProducts(data?.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getAllProducts();
  }, []);
const getMinPrice = (product) => {
    if (!product.prices || product.prices.length === 0) return 0;
    const prices = product.prices
      .map((v) => Number(v.price))
      .filter((p) => !isNaN(p));
    return prices.length > 0 ? Math.min(...prices) : 0;
  };
  return (
    <Layout title={"Collections & Products"}>
      <img
        src="/images/TasteTreasures.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
        height={"400px"}
      />

      <div className="container mt-4">
        <h2 className="mb-4">Collections</h2>
        <div className="row">
          {categories.map((c) => (
            <div
              className="col-md-4 mb-4"
              key={c.id}
              style={{ cursor: "pointer", borderRadius: "10px" }}
              onClick={() => navigate(`/category/${c.slug}`)}
            >
              <div className="category-card text-center p-4 shadow-sm rounded" style={{backgroundColor: "rgba(19, 18, 18, 0.04)"}}>
                <img
                  src={"/images/image.png"}
                  alt={c.name}
                  className="img-fluid mb-3"
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <h4>{c.name}</h4>
              </div>
            </div>
          ))}
        </div>

        <hr />

        <h2 className="mb-4">Items</h2>
        <div className="row">
          <div className="col-md-10 offset-1">
            <div className="d-flex flex-wrap">
              {products?.map((p) => (
                <div className="card m-2" key={p.id} style={{width:"250px"}}>
                  <img
                    src={`${api}/api/v1/product/product-photo/${p.id}/0`}
                    className="card-img-top"
                    alt={p.name}
                    style={{height:"200px"}}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p.name}</h5>
                      <h5 className="card-title card-price">
                        {getMinPrice(p).toLocaleString("en-US", {
                          style: "currency",
                          currency: "INS",
                        })}
                      </h5>
                    </div>
                    <p className="card-text">{p.description.substring(0, 60)}...</p>
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
