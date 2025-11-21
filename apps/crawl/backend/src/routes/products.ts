import { Router, Request, Response } from 'express';
import products from '../data/products.json';

const router = Router();

// GET /api/products - Get all products
router.get('/', (_req: Request, res: Response) => {
  res.json(products);
});

// GET /api/products/:id - Get single product
router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

export default router;
