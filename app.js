import express from "express";
import http from "http";
import config from "./config.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import initSocket from "./sockets.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

initSocket(server);

server.listen(config.PORT, () => {
  console.log(`Server activo en puerto ${config.PORT}`);
});
