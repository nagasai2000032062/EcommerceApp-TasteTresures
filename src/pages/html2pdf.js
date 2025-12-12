// // src/lib/html2pdf.js
// // Standalone version – no npm install required
// // Requires: html2canvas & jsPDF installed in your project

// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const html2pdf = (() => {
//   function html2pdfBuilder(src, opt) {
//     const worker = new HTML2PDFWorker(opt);
//     if (src) worker.from(src);
//     return worker;
//   }

//   class HTML2PDFWorker {
//     constructor(options) {
//       this.options = Object.assign({}, defaultOptions, options);
//       this.element = null;
//       this.htmlString = null;
//     }

//     set(options) {
//       this.options = Object.assign({}, this.options, options);
//       return this;
//     }

//     from(source) {
//       if (typeof source === "string") {
//         this.element = document.createElement("div");
//         this.element.innerHTML = source;
//       } else {
//         this.element = source;
//       }
//       return this;
//     }

//     async save() {
//       const opt = this.options;

//       const targetEl = this.element;
//       if (!targetEl) {
//         console.error("html2pdf: No source element found.");
//         return;
//       }

//       // Convert HTML → Canvas
//       const canvas = await html2canvas(targetEl, opt.html2canvas);
//       const imgData = canvas.toDataURL("image/jpeg", opt.image.quality);

//       const pdf = new jsPDF(opt.jsPDF);

//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      
//       pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save(opt.filename);

//       return pdf;
//     }
//   }

//   const defaultOptions = {
//     margin: 10,
//     filename: "document.pdf",
//     image: { type: "jpeg", quality: 0.98 },
//     html2canvas: { scale: 2, useCORS: true },
//     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//   };

//   // Expose functions
//   html2pdfBuilder.defaults = defaultOptions;
//   html2pdfBuilder.Worker = HTML2PDFWorker;

//   return html2pdfBuilder;
// })();

// export default html2pdf;


// -----------------------------------------------
// Standalone html2pdf.js (NO NPM installation)
// Requires: html2canvas.js + jspdf.umd.js in same project
// -----------------------------------------------

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const html2pdf = (() => {
  function html2pdfBuilder(src, opt) {
    const worker = new HTML2PDFWorker(opt);
    if (src) worker.from(src);
    return worker;
  }

  class HTML2PDFWorker {
    constructor(options) {
      this.options = Object.assign({}, defaultOptions, options);
      this.element = null;
    }

    set(options) {
      this.options = Object.assign({}, this.options, options);
      return this;
    }

    from(source) {
      // Convert HTML string → DOM element
      if (typeof source === "string") {
        const wrapper = document.createElement("div");
        wrapper.style.position = "fixed";    // keep offscreen
        wrapper.style.left = "-9999px";
        wrapper.innerHTML = source;
        document.body.appendChild(wrapper);  // APPEND → required for html2canvas
        this.element = wrapper;
      } else {
        this.element = source;
      }
      return this;
    }

    async save() {
      if (!this.element) {
        console.error("html2pdf: No element found.");
        return;
      }

      const opt = this.options;

      // -----------------------------
      // HTML → Canvas
      // -----------------------------
      const canvas = await html2canvas(this.element, opt.html2canvas);
      const imgData = canvas.toDataURL("image/jpeg", opt.image.quality);

      // -----------------------------
      // Canvas → PDF
      // -----------------------------
      const pdf = new jsPDF(opt.jsPDF);
      const width = pdf.internal.pageSize.getWidth();

      const props = pdf.getImageProperties(imgData);
      const height = (props.height * width) / props.width;

      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      pdf.save(opt.filename);

      // Remove temporary DOM
      if (this.element && this.element.parentNode) {
        document.body.removeChild(this.element);
      }
    }
  }

  const defaultOptions = {
    filename: "document.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  return html2pdfBuilder;
})();

export default html2pdf;