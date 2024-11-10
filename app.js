import express from "express";
import http from "http";
import config from "./config.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import initSocket from "./sockets.js";
import mongoose from "mongoose";
import { create } from "express-handlebars";
import { getAllProducts } from "./services/products.services.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());

mongoose
  .connect(config.MONGODB_URI_LOCAL, {})
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

const io = initSocket(server);
app.set("socketio", io);

const handlebars = create({
  extname: ".handlebars",
  layoutsDir: "./views/layouts",
  defaultLayout: "main",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine(".handlebars", handlebars.engine);
app.set("view engine", ".handlebars");
app.set("views", `${config.DIRNAME}/views`);

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/static", express.static(`${config.DIRNAME}/public`));

app.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const sort = req.query.sort || "";
  const category = req.query.category || "";
  const availability = req.query.status;
  const query = {};
  if (req.query.query) {
    query.title = { $regex: req.query.query, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  if (availability !== undefined) {
    query.status = availability === "true";
  }
  const options = {
    limit,
    page,
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
  };

  try {
    const result = await getAllProducts(query, options);
    const totalPages = result.totalPages;
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    res.render("home", {
      title: "Lista de Productos",
      products: result.docs,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage ? `${baseUrl}/home?page=${prevPage}` : null,
      nextLink: nextPage ? `${baseUrl}/home?page=${nextPage}` : null,
    });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

app.get("/home", async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const sort = req.query.sort || "";
  const category = req.query.category || "";
  const availability = req.query.status;
  const query = {};
  if (req.query.query) {
    query.title = { $regex: req.query.query, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  if (availability !== undefined) {
    query.status = availability === "true";
  }
  const options = {
    limit,
    page,
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
  };

  try {
    const result = await getAllProducts(query, options);
    const totalPages = result.totalPages;
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    res.render("home", {
      title: "Lista de Productos",
      products: result.docs,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage ? `${baseUrl}/home?page=${prevPage}` : null,
      nextLink: nextPage ? `${baseUrl}/home?page=${nextPage}` : null,
    });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.render("realTimeProducts", {
      title: "Productos en Tiempo Real",
      products: products.docs,
    });
  } catch (error) {
    res.status(500).send({ error: "Error al obtener productos" });
  }
});

server.listen(config.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${config.PORT}`);
});
