import express from "express";
import config from "./config.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.listen(config.PORT, () => {
  console.log(`Server activo en puerto ${config.PORT}`);
});
