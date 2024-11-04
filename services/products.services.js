import productModel from "../dao/models/product.model.js";

export const getAllProducts = async (query = {}, options = {}) => {
  try {
    const result = await productModel.paginate(query, options);
    return result;
  } catch (error) {
    throw new Error("Error al obtener productos: " + error.message);
  }
};

export const addProduct = async (productData) => {
  try {
    const newProduct = new productModel(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error("Error al agregar producto: " + error.message);
  }
};

export const updateProduct = async (pid, updatedData) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      pid,
      updatedData,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      throw new Error("Producto no encontrado");
    }
    return updatedProduct;
  } catch (error) {
    throw new Error("Error al actualizar producto: " + error.message);
  }
};

export const deleteProduct = async (pid) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(pid);
    if (!deletedProduct) {
      throw new Error("Producto no encontrado");
    }
    return deletedProduct;
  } catch (error) {
    throw new Error("Error al eliminar producto: " + error.message);
  }
};
