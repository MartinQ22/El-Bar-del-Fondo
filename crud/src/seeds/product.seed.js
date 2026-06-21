import Product from '../models/productModel.js';
import { logger } from '../utils/logger.utils.js';

const initialProducts = [
  {
    title: 'Mouse gamer',
    description: 'Mouse gamer de alta precision con luces RGB',
    code: 'SEEDED-PROD1',
    price: 100,
    category: 'perifericos',
    stock: 10,
  },
  {
    title: 'Teclado mecánico',
    description: 'Teclado mecanico switch red ideal para programar',
    code: 'SEEDED-PROD2',
    price: 150,
    category: 'perifericos',
    stock: 20,
  },
  {
    title: 'Monitor 24 pulgadas',
    description: 'Monitor 24 pulgadas 144hz IPS',
    code: 'SEEDED-PROD3',
    price: 300,
    category: 'monitores',
    stock: 5,
  }
];

export async function seedProducts() {
  const productsCount = await Product.estimatedDocumentCount();

  if (productsCount > 0) {
    logger.info({
      msg: 'Products seed skipped',
      reason: 'Products already exist',
    });

    return;
  }

  const products = await Product.insertMany(initialProducts);

  logger.info({
    msg: 'Products seed completed',
    products: products.map((product) => product._id),
  });
}