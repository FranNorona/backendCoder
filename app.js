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
  try {
    const products = await getAllProducts();
    res.render("home", {
      title: "Lista de Productos",
      products: products.docs,
    });
  } catch (error) {
    res.status(500).send({ error: "Error al obtener productos" });
  }
});

app.get("/home", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.render("home", {
      title: "Lista de Productos",
      products: products.docs,
    });
  } catch (error) {
    res.status(500).send({ error: "Error al obtener productos" });
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
