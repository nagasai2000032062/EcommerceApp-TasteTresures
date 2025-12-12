import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Ecommer app"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h5>App Owner: Naga Sai Chaitanya</h5>
          <p className="text-justify mt-2">
            Selling different types of items.We are selling veg pickles, non-veg pickles, Sweets, Snacks.Once order you can not able to cancel. If you want to cancel message in whatsapp.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
