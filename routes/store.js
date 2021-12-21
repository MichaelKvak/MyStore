var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

mongoose.connect(
  "mongodb+srv://mike:1987@cluster0.9rfaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Schema = mongoose.Schema;
const storesScheme = new Schema({
  title: String,
  image: String,
  price: Number,
  quantity: Number,
  description: String,
});

const Store = mongoose.model("Store", storesScheme);

router.get("/", function (req, res, next) {
  if (req.query.filter_property)
    Store.find(
      {
        [req.query.filter_property]: req.query.filter_value,
      },
      function (err, docs) {
        if (err)
          return res
            .status(500)
            .json({ success: false, err: { msg: "Fetch failed!" } });
        res.status(200).json({ success: true, data: docs });
      }
    );
  else
    Store.find({}, function (err, docs) {
      if (err)
        return res
          .status(500)
          .json({ success: false, err: { msg: "Fetch failed!" } });
      res.status(200).json({ success: true, data: docs });
    });
});

router.post(
  "/add",
  body("title")
    .isLength({ min: 3 })
    .trim()
    .withMessage("item name must be specified")
    .escape(),
  body("image")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Image size rate 10M")
    .escape(),
  body("price")
    .isInt({ min: 1 })
    .withMessage("Minimum price must be under 1")
    .toInt()
    .escape(),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Minimum quantity must be under 1")
    .toInt()
    .escape(),
  body("description")
    .isLength({ min: 3 })
    .trim()
    .withMessage("item description must be not less 3")
    .escape(),
  function (req, res, next) {
    const store = new Store({
      title: req.body.storeTitle,
      image: req.body.storeImage,
      price: parseInt(req.body.storePrice),
      quantity: parseInt(req.body.storeQuantity),
      description: req.body.storeDescription,
    });
    store.save(function (err, storeDoc) {
      if (err)
        return res
          .status(500)
          .json({ success: false, err: { msg: "Saving failed!" } });
      res.status(200).json({ success: true, storeId: storeDoc._id });
    });
  }
);

router.delete("/", function (req, res, next) {
  Store.findByIdAndDelete(req.body.storeId, function (err, doc) {
    if (err)
      return res
        .status(500)
        .json({ success: false, err: { msg: "Delete failed!" } });
    res.status(200).json({ success: true });
  });
});

router.get("/:storeId", function (req, res, next) {
  Store.findById(req.params["storeId"], function (err, doc) {
    if (err)
      return res
        .status(500)
        .json({ success: false, err: { msg: "Fetch failed!" } });
    res.status(200).json({ success: true, data: doc });
  });
});

router.put(
  "/update",
  body("title")
    .isLength({ min: 3 })
    .trim()
    .withMessage("item name must be specified")
    .escape(),
  body("image")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Image size rate 10M")
    .escape(),
  body("price")
    .isInt({ min: 1 })
    .withMessage("Minimum price must be under 1")
    .toInt()
    .escape(),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Minimum quantity must be under 1")
    .toInt()
    .escape(),
  body("description")
    .isLength({ min: 3 })
    .trim()
    .withMessage("item description must be not less 3")
    .escape(),
  function (req, res, next) {
    Store.findByIdAndUpdate(
      req.body.storeId,
      {
        title: req.body.storeTitle,
        image: req.body.storeImage,
        price: parseInt(req.body.storePrice),
        quantity: parseInt(req.body.storeQuantity),
        description: req.body.storeDescription,
      },
      function (err, storeDoc) {
        if (err)
          return res
            .status(500)
            .json({ success: false, err: { msg: "Saving failed!" } });
        res.status(200).json({ success: true });
      }
    );
  }
);

module.exports = router;
