import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  const api="https://tastetresures-backend-production.up.railway.app";
  //get cat
  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${api}/api/v1/category/get-category`);
      setCategories(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}
