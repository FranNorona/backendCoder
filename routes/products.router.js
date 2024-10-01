import { Router } from "express";

const router = Router();

const products = [
  {
    id: 1,
    title: "Cámara DSLR",
    description:
      "Cámara réflex digital con sensor de 24.1 MP y grabación de video en 1080p.",
    code: "CAM-DSLR-001",
    price: 749.99,
    status: "available",
    stock: 25,
    category: "Electrónica",
    thumbnails: ["url_imagen_1.jpg", "url_imagen_2.jpg"],
  },
  {
    id: 2,
    title: "Auriculares Inalámbricos",
    description:
      "Auriculares Bluetooth con cancelación de ruido y 20 horas de batería.",
    code: "AUD-WIRE-002",
    price: 199.99,
    status: "available",
    stock: 50,
    category: "Accesorios",
    thumbnails: ["url_imagen_3.jpg", "url_imagen_4.jpg"],
  },
  {
    id: 3,
    title: "Laptop Gaming",
    description:
      "Laptop para videojuegos con procesador i7, 16 GB de RAM y tarjeta gráfica RTX 3060.",
    code: "LAP-GAM-003",
    price: 1299.99,
    status: "available",
    stock: 10,
    category: "Computadoras",
    thumbnails: ["url_imagen_5.jpg", "url_imagen_6.jpg"],
  },
  {
    id: 4,
    title: "Reloj Inteligente",
    description:
      "Reloj inteligente con monitoreo de salud, GPS y notificaciones de smartphone.",
    code: "WAT-SMRT-004",
    price: 299.99,
    status: "available",
    stock: 30,
    category: "Wearables",
    thumbnails: ["url_imagen_7.jpg", "url_imagen_8.jpg"],
  },
];

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit, 10);

  const result =
    !isNaN(limit) && limit > 0 ? products.slice(0, limit) : products;

  res.status(200).send({ error: null, data: result });
  console.log("Get realizado");
});

router.get("/:pid", (req, res) => {
  const { pid } = req.params;

  const product = products.find((p) => p.id === parseInt(pid, 10));

  if (product) {
    res.status(200).send({ error: null, data: product });
  } else {
    res.status(404).send({ error: "Producto no encontrado", data: null });
  }
});

router.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails = [],
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    stock === undefined ||
    !category
  ) {
    return res.status(404).send({
      error: "Todos los campos excepto 'thumbnails' son obligatorios",
      data: null,
    });
  }

  const newId = products.length ? products[products.length - 1].id + 1 : 1;

  const newProduct = {
    id: newId,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  products.push(newProduct);

  res.status(201).send({ error: null, data: newProduct });
  console.log("Producto agregado:", newProduct);
});

router.put('/:pid', (req, res) => {
  const { pid } = req.params;

  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;
  
  const productIndex = products.findIndex((p) => p.id === parseInt(pid, 10));

  if (productIndex === -1) {
    return res.status(404).send({ error: 'Producto no encontrado', data: null});
  }

  const product = products[productIndex];

  const updatedProduct = {
    ...product,
    title: title !== undefined ? title : product.title,
    description: description !== undefined ? description : product.description,
    code: code !== undefined ? code : product.code,
    price: price !== undefined ? price : product.price,
    status: status !== undefined ? status : product.status,
    stock: stock !== undefined ? stock : product.stock,
    category: category !== undefined ? category : product.category,
    thumbnails: thumbnails !== undefined ? thumbnails : product.thumbnails,
  }

  products[productIndex] = updatedProduct;

  res.status(200).send({error: null, data: updatedProduct});
  console.log("Producto actualizado:", updatedProduct);
});

router.delete('pid', (req, res) => {
  const { pid } = req.params;

  const productIndex = products.findIndex((p) => p.id === parseInt(pid, 10));

  if (productIndex === -1) {
    return res.status(404).send({error: "Producto no encontrado", data: null});
  }

  const deletedProduct = products.splice(productIndex, 1);

  res.status(200).send({error: null, data: deletedProduct});
  console.log("Producto eliminado:", deletedProduct);
});

export default router;
