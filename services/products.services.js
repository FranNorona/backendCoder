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

export const getAllProducts = () => products;

export const addProduct = (product) => {
  product.id = products.length + 1;
  products.push(product);
  return product;
};

export const updateProduct = (pid, updatedData) => {
  const index = products.findIndex((p) => p.id === pid);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData };
    return products[index];
  }
  return null;
};

export const deleteProduct = (pid) => {
  const index = products.findIndex((p) => p.id === pid);
  if (index !== -1) {
    const deletedProduct = products.splice(index, 1);
    return deletedProduct[0];
  }
  return null;
};
