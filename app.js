import express from "express";
import http from "http";
import config from "./config.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import initSocket from "./sockets.js";
import { create } from "express-handlebars";
import { getAllProducts } from "./services/products.services.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());

const products = getAllProducts();

initSocket(server, products);

const handlebars = create({
  extname: ".handlebars",
  layoutsDir: "./views/layouts",
  defaultLayout: "main",
});

app.engine(".handlebars", handlebars.engine);
app.set("view engine", ".handlebars");
app.set("views", `${config.DIRNAME}/views`);

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/static", express.static(`${config.DIRNAME}/public`));

app.get("/", (req, res) => {
  const products = getAllProducts();
  res.render("home", { title: "Lista de Productos", products });
});

app.get("/home", (req, res) => {
  const products = getAllProducts();
  res.render("home", { title: "Lista de Productos", products });
});

app.get("/realtimeproducts", (req, res) => {
  const products = getAllProducts();
  res.render("realTimeProducts", {
    title: "Productos en Tiempo Real",
    products,
  });
});

server.listen(config.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${config.PORT}`);
});
