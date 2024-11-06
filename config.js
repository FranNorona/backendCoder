import * as url from "url";

const config = {
  PORT: 8080,
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),

  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/uploads`;
  },

  MONGODB_URI_LOCAL: "mongodb://localhost:27017/codebackend",

  // MONGODB_URI:
  //   "mongodb+srv://franconorona:Fl240319@cluster0.rqzii.mongodb.net/coderbackend",
};

export default config;
