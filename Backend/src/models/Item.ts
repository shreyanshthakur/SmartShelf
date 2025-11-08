// Backend/src/models/Item.ts - Enhanced version
import mongoose, { Document, Schema, Types } from "mongoose";

// Enhanced interface
export interface IItem extends Document {
  _id: Types.ObjectId;

  // Your existing basic fields (enhanced)
  itemName: string;
  itemSlug: string; // SEO-friendly URL
  itemDescription?: string;
  shortDescription?: string;
  itemPrice: number;
  itemCategory: string;
  itemStock: number;
  itemDisplayImage?: string;
  itemImages?: string[];

  // New essential e-commerce fields
  compareAtPrice?: number; // Original price for discounts
  costPrice?: number; // For profit calculations
  subcategory?: string;
  brand?: string;
  tags: string[];

  // Advanced inventory
  reserved: number; // Items in pending orders
  lowStockThreshold: number;
  sku: string; // Stock Keeping Unit
  barcode?: string;
  trackInventory: boolean;

  // Physical properties
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  // SEO & Search
  metaTitle?: string;
  metaDescription?: string;
  searchKeywords: string[];

  // Product status
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;

  // Analytics
  viewCount: number;
  salesCount: number;
  rating: number;
  reviewCount: number;

  // Management
  createdBy: Types.ObjectId;
  lastUpdatedBy?: Types.ObjectId;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  availableStock: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  discountPercentage: number;
  profitMargin: number | null;
}

const itemSchema = new mongoose.Schema(
  {
    // ==================== YOUR EXISTING FIELDS (Enhanced) ====================
    itemName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
      index: true, // Add index for searching
    },

    itemSlug: {
      type: String,
      unique: true,
      index: true,
      // Will be auto-generated from itemName
    },

    itemDescription: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    shortDescription: {
      type: String,
      maxlength: [160, "Short description cannot exceed 160 characters"],
    },

    itemPrice: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      index: true, // Add index for price sorting/filtering
    },

    itemCategory: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true, // Add index for category filtering
    },

    itemStock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number",
      },
    },

    // Enhanced image validation (keeping your existing logic)
    itemDisplayImage: {
      type: String,
      required: false,
      validate: {
        validator: function (v: string) {
          if (!v) return true; // Allow empty or undefined
          return /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w\-./?%&=]*)?\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(
            v
          );
        },
        message: "Invalid display image URL",
      },
    },

    itemImages: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          if (!v || v.length === 0) return true;
          if (v.length > 10) return false; // Increased from 5 to 10
          const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i;
          return v.every((imgUrl) => urlRegex.test(imgUrl));
        },
        message: "Maximum 10 images allowed, each must be a valid image URL",
      },
    },

    // ==================== NEW E-COMMERCE FIELDS ====================
    // Pricing enhancements
    compareAtPrice: {
      type: Number,
      min: [0, "Compare price cannot be negative"],
      validate: {
        validator: function (this: IItem, value: number) {
          return !value || value >= this.itemPrice;
        },
        message:
          "Compare at price should be greater than or equal to selling price",
      },
    },

    costPrice: {
      type: Number,
      min: [0, "Cost price cannot be negative"],
    },

    // Enhanced categorization
    subcategory: {
      type: String,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],

    // Advanced inventory
    reserved: {
      type: Number,
      default: 0,
      min: [0, "Reserved stock cannot be negative"],
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, "Low stock threshold cannot be negative"],
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [50, "SKU cannot exceed 50 characters"],
      // Will be auto-generated if not provided
    },

    barcode: {
      type: String,
      unique: true,
      sparse: true, // Allow nulls but ensure uniqueness
      trim: true,
    },

    trackInventory: {
      type: Boolean,
      default: true,
    },

    // Physical properties
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },

    dimensions: {
      length: { type: Number, min: [0, "Length cannot be negative"] },
      width: { type: Number, min: [0, "Width cannot be negative"] },
      height: { type: Number, min: [0, "Height cannot be negative"] },
      unit: {
        type: String,
        enum: ["in", "cm", "mm", "ft"],
        default: "in",
      },
    },

    // SEO optimization
    metaTitle: {
      type: String,
      maxlength: [60, "Meta title should not exceed 60 characters"],
    },

    metaDescription: {
      type: String,
      maxlength: [160, "Meta description should not exceed 160 characters"],
    },

    searchKeywords: [
      {
        type: String,
        trim: true,
        maxlength: [30, "Keyword cannot exceed 30 characters"],
      },
    ],

    // Product status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDigital: {
      type: Boolean,
      default: false,
    },

    // Analytics
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    salesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Management (who created/updated)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: {
      virtuals: true,
      transform: function (_doc: any, ret: Record<string, any>) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// ==================== PERFORMANCE INDEXES ====================
itemSchema.index({ itemName: "text", itemDescription: "text", tags: "text" }); // Text search
itemSchema.index({ itemCategory: 1, isActive: 1 }); // Category filtering
itemSchema.index({ itemPrice: 1 }); // Price sorting
itemSchema.index({ isFeatured: 1, isActive: 1 }); // Featured products
itemSchema.index({ brand: 1, isActive: 1 }); // Brand filtering
itemSchema.index({ createdAt: -1 }); // Recent products
itemSchema.index({ salesCount: -1 }); // Best sellers
itemSchema.index({ rating: -1, reviewCount: -1 }); // Top rated

// ==================== VIRTUAL FIELDS ====================
// Available stock (total - reserved)
itemSchema.virtual("availableStock").get(function () {
  return Math.max(0, this.itemStock - this.reserved);
});

// Low stock check
itemSchema.virtual("isLowStock").get(function () {
  const available = Math.max(0, this.itemStock - this.reserved);
  return this.trackInventory && available <= this.lowStockThreshold;
});

// Out of stock check
itemSchema.virtual("isOutOfStock").get(function () {
  const available = Math.max(0, this.itemStock - this.reserved);
  return this.trackInventory && available <= 0;
});

// Discount percentage
itemSchema.virtual("discountPercentage").get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.itemPrice) return 0;
  return Math.round(
    ((this.compareAtPrice - this.itemPrice) / this.compareAtPrice) * 100
  );
});

// Profit margin
itemSchema.virtual("profitMargin").get(function () {
  if (!this.costPrice) return null;
  return this.itemPrice - this.costPrice;
});

// ==================== MIDDLEWARE ====================
// Auto-generate slug and SKU before saving
itemSchema.pre("save", async function (next) {
  try {
    // Generate slug from itemName
    if (this.isNew || this.isModified("itemName")) {
      this.itemSlug = await generateUniqueSlug(
        this.itemName,
        this.constructor as any
      );
    }

    // Auto-generate SKU if not provided
    if (this.isNew && !this.sku) {
      this.sku = await generateUniqueSKU(this.constructor as any);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Update lastUpdatedBy on save
itemSchema.pre("save", function (next) {
  if (!this.isNew && this.isModified() && this.lastUpdatedBy) {
    // lastUpdatedBy will be set by the controller
  }
  next();
});

// ==================== HELPER FUNCTIONS ====================
async function generateUniqueSlug(name: string, Model: any): Promise<string> {
  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  if (!baseSlug) {
    baseSlug = "product"; // Fallback
  }

  let slug = baseSlug;
  let counter = 1;
  const MAX_ITERATIONS = 1000;

  // Check for uniqueness with a maximum iteration limit
  while (await Model.findOne({ itemSlug: slug })) {
    if (counter > MAX_ITERATIONS) {
      throw new Error("Unable to generate a unique slug after many attempts.");
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
  async function generateUniqueSKU(Model: any): Promise<string> {
    let sku: string = "";
    let exists = true;
    const maxAttempts = 20;
    let attempts = 0;

    while (exists && attempts < maxAttempts) {
      // Generate SKU: SS (SmartShelf) + timestamp + 4 random hex chars
      const timestamp = Date.now().toString(36);
      const randomHex = Math.random().toString(16).slice(2, 6).toUpperCase();
      sku = `SS${timestamp}${randomHex}`;

      const existing = await Model.findOne({ sku });
      exists = !!existing;
      attempts++;
    }

    if (exists) {
      throw new Error(
        "Unable to generate a unique SKU after multiple attempts."
      );
    }

    return sku;
  }
}

// ==================== STATIC METHODS ====================
// Find products with low stock
itemSchema.statics.findLowStock = function () {
  return this.aggregate([
    {
      $addFields: {
        availableStock: { $subtract: ["$itemStock", "$reserved"] },
      },
    },
    {
      $match: {
        trackInventory: true,
        isActive: true,
        $expr: { $lte: ["$availableStock", "$lowStockThreshold"] },
      },
    },
  ]);
};

// Find featured products
itemSchema.statics.findFeatured = function (limit: number = 10) {
  return this.find({
    isFeatured: true,
    isActive: true,
  })
    .sort({ salesCount: -1, rating: -1 })
    .limit(limit);
};

const Item = mongoose.model<IItem>("Item", itemSchema);

export default Item;
