const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });

    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });

    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);

    res.status(201).json(newTag);

    if (!newTag) {
      res.status(404).json({ message: "Tag not created" });
      return;
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updateTag = await Tag.update(req.body, {
      where: { id: req.params.id },
    });

    if (updateTag[0] === 0) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    res.status(200).json({ message: "Tag updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deleteTag = await Tag.destroy({
      where: { id: req.params.id },
    });

    if (!deleteTag) {
      res.status(404).json({ message: " Requested tag to delete not found" });
      return;
    }

    res.status(200).json({ message: "Request to delete tag successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
