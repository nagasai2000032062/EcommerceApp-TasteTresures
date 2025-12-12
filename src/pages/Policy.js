// import React from "react";
// import Layout from "./../components/Layout/Layout";

// const Policy = () => {
//   return (
//     <Layout title={"Privacy Policy"}>
//       <div className="row contactus ">
//         <div className="col-md-6 ">
//           <img
//             src="/images/contactus.jpeg"
//             alt="contactus"
//             style={{ width: "100%" }}
//           />
//         </div>
//         <div className="col-md-4">
//           <h3>Terms & Conditions</h3>
//           <br></br>
//           <br></br>
//           <h4>Terms and Conditions</h4>
//           <p>These Terms and Conditions (“Agreement”) govern your use of the website located at palleturipachallu.com (“Website”), owned and operated by Palleturi Pachallu (“Company”) , a company registered in India. By accessing or using the Website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these Terms and Conditions, you must not use the Website.</p>
//           <h4>1.Website Use</h4>
//           <h4>1.1 Acceptable Use:</h4>
//           <p>You agree to use the Website solely for lawful purposes and in accordance with these Terms and Conditions. You shall not engage in any activities that may adversely affect the functionality or operation of the Website or the Company’s services.</p>
//           <h4>1.2 User Account:</h4>
//           <p>In order to access certain features of the Website, you may be required to create a user account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
//           <h4>1.3 User Content:</h4>
//           <p>You may have the opportunity to submit or post content on the Website, including but not limited to reviews, comments, or other information (“User Content”).</p>
//           <p>By submitting User Content, you grant the Company a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, distribute, and display such User Content in any media.</p>
//           <br></br>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Policy;
import React from "react";
import Layout from "./../components/Layout/Layout";
// import './Policy.css'; // Assuming you will create a CSS file for additional styles

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="container my-3">
        <div className="row">
          <div className="col-md-6">
            <img
              src="/images/contactus.jpeg"
              alt="Contact Us"
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-6">
            <h3 className="text-primary">Terms & Conditions</h3>
            <h4 className="mt-4">Terms and Conditions</h4>
            <p>
              These Terms and Conditions (“Agreement”) govern your use of the
              website located at palleturipachallu.com (“Website”), owned and
              operated by Palleturi Pachallu (“Company”), a company registered
              in India. By accessing or using the Website, you agree to be bound
              by these Terms and Conditions. If you do not agree with any part
              of these Terms and Conditions, you must not use the Website.
            </p>
            <h4 className="mt-4">1. Website Use</h4>
            <h5>1.1 Acceptable Use:</h5>
            <p>
              You agree to use the Website solely for lawful purposes and in
              accordance with these Terms and Conditions. You shall not engage
              in any activities that may adversely affect the functionality or
              operation of the Website or the Company’s services.
            </p>
            <h5>1.2 User Account:</h5>
            <p>
              In order to access certain features of the Website, you may be
              required to create a user account. You are responsible for
              maintaining the confidentiality of your account information and
              for all activities that occur under your account.
            </p>
            <h5>1.3 User Content:</h5>
            <p>
              You may have the opportunity to submit or post content on the
              Website, including but not limited to reviews, comments, or other
              information (“User  Content”).
            </p>
            <p>
              By submitting User Content, you grant the Company a
              non-exclusive, royalty-free, perpetual, irrevocable, and fully
              sublicensable right to use, reproduce, modify, adapt, publish,
              translate, distribute, and display such User Content in any media.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
