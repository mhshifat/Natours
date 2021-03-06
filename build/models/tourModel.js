"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var _slugify = _interopRequireDefault(require("slugify"));

var tourSchema = new _mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tour name is required!"],
    unique: true,
    trim: true,
    minlength: [10, "A tour name must be above 10 characters length!"],
    maxlength: [40, "A tour name must be under 40 characters length!"]
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, "A tour must have a duration!"]
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size!"]
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty!"],
    "enum": {
      values: ["easy", "medium", "difficulty"],
      message: "Difficulty is either: easy, medium or difficult!"
    }
  },
  ratingsAverage: {
    type: Number,
    "default": 4.5,
    min: [1, "Tour ratings must be above 1.0"],
    max: [5, "Tour ratings must be under 5.0"]
  },
  ratingsQuantity: {
    type: Number,
    "default": 0
  },
  price: {
    type: Number,
    required: [true, "Tour price is required!"]
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function validator(val) {
        return val < this.price;
      },
      message: "Discount price should be below regular price!"
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a description!"]
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image!"]
  },
  images: [String],
  createdAt: {
    type: Date,
    "default": Date.now(),
    select: false
  },
  startDates: [Date],
  isSecretTour: {
    type: Boolean,
    "default": false
  },
  startLocation: {
    type: {
      type: String,
      "default": "Point",
      "enum": {
        values: ["Point"],
        message: "Start location type must be Point!"
      }
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [{
    type: {
      type: String,
      "default": "Point",
      "enum": {
        values: ["Point"],
        message: "Location type must be Point!"
      }
    },
    coordinates: [Number],
    address: String,
    description: String,
    day: Number
  }],
  guides: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id"
});
tourSchema.pre("save", function (next) {
  this.slug = (0, _slugify["default"])(this.name, {
    lower: true
  });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.find({
    isSecretTour: {
      $ne: true
    }
  });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt"
  });
  next();
});
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: {
      isSecretTour: {
        $ne: true
      }
    }
  });
  next();
});

var _default = (0, _mongoose.model)("Tour", tourSchema);

exports["default"] = _default;