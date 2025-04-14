import pool from '../db.mjs';

export const getProducts = async (req, res) => {
    try {
        const [products] = await pool.query(
            'SELECT * FROM products'
        );
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        throw new Error("Failed to fetch products");

    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const [product] = await pool.query(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );
        if (product.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product[0]);
    } catch (error) {
        console.error('Get product by ID error:', error);
        throw new Error("Failed to fetch product by ID");
    }
}