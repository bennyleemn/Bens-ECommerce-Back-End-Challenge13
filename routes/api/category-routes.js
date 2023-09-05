const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint
// Get ALL categories
router.get("/", async (req, res) => {
  console.log("Hello!");
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    console.log(categories);
    res.status(200).json(categories);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Error" });
  }
});

// Get Category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!category) {
      res.status(404).json({ message: "Category ID not found" });
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new Category
router.post("/", async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Category not created" });
  }
});

// Update a category by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const updateCategory = await Category.update(req.body, {
      where: { id: req.params.id },
    });

    if (updateCategory[0] === 0) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({ message: "Category updated" });
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
});

// delete a category by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deleteCategory = await Category.destroy({
      where: { id: req.params.id },
    });

    if (!deleteCategory) {
      res
        .status(404)
        .json({ message: "Category not deleted because it was not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Requested category successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "Interal Error" });
  }
});

module.exports = router;
