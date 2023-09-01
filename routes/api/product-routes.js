const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
});

// get one product by its id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
});

// create new product
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
});

// update product
router.put("/:id", async (req, res) => {
  try {
    const updateProduct = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (req.body.tagIds && req.body.tagIds.lenth) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            porduct_id: req.params.id,
            tag_id,
          };
        });

      await Promise.all([
        ProductTag.destroy({
          where: { id: productTags.map(({ id }) => id) },
        }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    if (updateProduct[0] === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ message: "Product updated!" });
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
});

// delete a product by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deleteProduct = await Product.destroy({
      where: { id: req.params.id },
    });

    if (!deleteProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
