// Backend/src/seedItems.ts
import mongoose from "mongoose";
import Item from "./models/Item";
import User from "./models/User";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.CONNECTION_STRING;
const MONGODB_URI = connectionString
  ? `${connectionString}/smartShelf`
  : "mongodb://localhost:27017/smartshelf";

// Sample categories and their products
const sampleItems = [
  // Electronics
  {
    itemName: "Wireless Bluetooth Headphones",
    itemDescription:
      "Premium noise-canceling wireless headphones with 30-hour battery life. Features advanced active noise cancellation, crystal-clear audio, and comfortable over-ear design perfect for music lovers and professionals.",
    shortDescription: "Premium wireless headphones with ANC and 30hr battery",
    itemPrice: 149.99,
    compareAtPrice: 199.99,
    costPrice: 80.0,
    itemCategory: "Electronics",
    subcategory: "Audio",
    brand: "SoundPro",
    itemStock: 45,
    lowStockThreshold: 10,
    sku: "ELEC-AUD-HP001",
    tags: ["wireless", "bluetooth", "headphones", "audio", "noise-canceling"],
    itemDisplayImage: "https://picsum.photos/seed/headphones1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/headphones1/800/800.jpg",
      "https://picsum.photos/seed/headphones2/800/800.jpg",
      "https://picsum.photos/seed/headphones3/800/800.jpg",
    ],
    weight: 0.5,
    dimensions: { length: 7, width: 6, height: 3, unit: "in" },
    isFeatured: true,
    isActive: true,
  },
  {
    itemName: "4K Ultra HD Smart TV 55 inch",
    itemDescription:
      "Experience stunning 4K resolution with HDR support, built-in smart apps, and voice control. This 55-inch smart TV delivers vibrant colors and deep blacks for an immersive viewing experience.",
    shortDescription: "55-inch 4K Smart TV with HDR and voice control",
    itemPrice: 599.99,
    compareAtPrice: 799.99,
    costPrice: 400.0,
    itemCategory: "Electronics",
    subcategory: "Television",
    brand: "VisionTech",
    itemStock: 25,
    lowStockThreshold: 5,
    sku: "ELEC-TV-55001",
    tags: ["tv", "4k", "smart tv", "hdr", "entertainment"],
    itemDisplayImage: "https://picsum.photos/seed/tv55inch1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/tv55inch1/800/800.jpg",
      "https://picsum.photos/seed/tv55inch2/800/800.jpg",
    ],
    weight: 35,
    dimensions: { length: 49, width: 3, height: 28, unit: "in" },
    isFeatured: true,
    isActive: true,
  },
  {
    itemName: "Mechanical Gaming Keyboard RGB",
    itemDescription:
      "Professional-grade mechanical keyboard with customizable RGB backlighting, Cherry MX switches, and programmable macro keys. Perfect for gamers and typists who demand precision and style.",
    shortDescription: "RGB mechanical keyboard with Cherry MX switches",
    itemPrice: 129.99,
    compareAtPrice: 169.99,
    costPrice: 65.0,
    itemCategory: "Electronics",
    subcategory: "Gaming",
    brand: "KeyMaster",
    itemStock: 60,
    lowStockThreshold: 15,
    sku: "ELEC-GAM-KB001",
    tags: ["keyboard", "gaming", "mechanical", "rgb", "cherry mx"],
    itemDisplayImage: "https://picsum.photos/seed/keyboard1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/keyboard1/800/800.jpg",
      "https://picsum.photos/seed/keyboard2/800/800.jpg",
    ],
    weight: 2.2,
    dimensions: { length: 17, width: 5, height: 1.5, unit: "in" },
    isFeatured: false,
    isActive: true,
  },

  // Home & Kitchen
  {
    itemName: "Stainless Steel Coffee Maker",
    itemDescription:
      "Brew the perfect cup with this programmable 12-cup coffee maker. Features auto-brew timer, pause-and-pour function, and keeps coffee hot for hours. Durable stainless steel construction.",
    shortDescription: "Programmable 12-cup coffee maker with auto-brew",
    itemPrice: 79.99,
    compareAtPrice: 99.99,
    costPrice: 45.0,
    itemCategory: "Home & Kitchen",
    subcategory: "Appliances",
    brand: "BrewMaster",
    itemStock: 50,
    lowStockThreshold: 10,
    sku: "HOME-APP-CM001",
    tags: ["coffee maker", "kitchen", "appliance", "programmable"],
    itemDisplayImage: "https://picsum.photos/seed/coffeemaker1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/coffeemaker1/800/800.jpg",
      "https://picsum.photos/seed/coffeemaker2/800/800.jpg",
    ],
    weight: 4.5,
    dimensions: { length: 8, width: 9, height: 13, unit: "in" },
    isFeatured: false,
    isActive: true,
  },
  {
    itemName: "Non-Stick Cookware Set 10-Piece",
    itemDescription:
      "Complete cookware set including frying pans, saucepans, and stockpot. Premium non-stick coating, heat-resistant handles, and compatible with all stovetops including induction.",
    shortDescription: "10-piece non-stick cookware set for all stovetops",
    itemPrice: 159.99,
    compareAtPrice: 249.99,
    costPrice: 90.0,
    itemCategory: "Home & Kitchen",
    subcategory: "Cookware",
    brand: "ChefPro",
    itemStock: 30,
    lowStockThreshold: 8,
    sku: "HOME-CKW-SET001",
    tags: ["cookware", "non-stick", "kitchen", "pots", "pans"],
    itemDisplayImage: "https://picsum.photos/seed/cookware1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/cookware1/800/800.jpg",
      "https://picsum.photos/seed/cookware2/800/800.jpg",
    ],
    weight: 12,
    dimensions: { length: 18, width: 12, height: 10, unit: "in" },
    isFeatured: true,
    isActive: true,
  },

  // Fashion & Clothing
  {
    itemName: "Men's Classic Leather Jacket",
    itemDescription:
      "Genuine leather jacket with quilted lining and multiple pockets. Timeless design suitable for any occasion. Available in classic black with premium YKK zippers and soft inner lining.",
    shortDescription: "Genuine leather jacket with quilted lining",
    itemPrice: 249.99,
    compareAtPrice: 349.99,
    costPrice: 150.0,
    itemCategory: "Fashion",
    subcategory: "Men's Clothing",
    brand: "UrbanStyle",
    itemStock: 35,
    lowStockThreshold: 8,
    sku: "FASH-MEN-JK001",
    tags: ["leather", "jacket", "men", "fashion", "outerwear"],
    itemDisplayImage: "https://picsum.photos/seed/leatherjacket1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/leatherjacket1/800/800.jpg",
      "https://picsum.photos/seed/leatherjacket2/800/800.jpg",
    ],
    weight: 2.5,
    dimensions: { length: 26, width: 22, height: 2, unit: "in" },
    isFeatured: true,
    isActive: true,
  },
  {
    itemName: "Women's Running Shoes",
    itemDescription:
      "Lightweight athletic shoes with responsive cushioning and breathable mesh upper. Designed for optimal comfort during runs and workouts. Features advanced shock absorption technology.",
    shortDescription: "Lightweight running shoes with responsive cushioning",
    itemPrice: 89.99,
    compareAtPrice: 119.99,
    costPrice: 45.0,
    itemCategory: "Fashion",
    subcategory: "Footwear",
    brand: "ActiveFit",
    itemStock: 80,
    lowStockThreshold: 20,
    sku: "FASH-SHO-RUN001",
    tags: ["shoes", "running", "women", "athletic", "sports"],
    itemDisplayImage: "https://picsum.photos/seed/runningshoes1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/runningshoes1/800/800.jpg",
      "https://picsum.photos/seed/runningshoes2/800/800.jpg",
    ],
    weight: 1.2,
    dimensions: { length: 11, width: 4, height: 5, unit: "in" },
    isFeatured: false,
    isActive: true,
  },

  // Books & Media
  {
    itemName: "The Art of Programming - Hardcover",
    itemDescription:
      "Comprehensive guide to modern programming practices. Covers algorithms, data structures, design patterns, and best practices. Perfect for both beginners and experienced developers.",
    shortDescription: "Complete guide to modern programming practices",
    itemPrice: 49.99,
    compareAtPrice: 64.99,
    costPrice: 25.0,
    itemCategory: "Books",
    subcategory: "Technology",
    brand: "TechPress",
    itemStock: 100,
    lowStockThreshold: 25,
    sku: "BOOK-TEC-PRG001",
    tags: ["books", "programming", "education", "technology", "learning"],
    itemDisplayImage: "https://picsum.photos/seed/programmingbook1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/programmingbook1/800/800.jpg",
      "https://picsum.photos/seed/programmingbook2/800/800.jpg",
    ],
    weight: 2,
    dimensions: { length: 9, width: 6, height: 1.5, unit: "in" },
    isFeatured: false,
    isActive: true,
  },

  // Sports & Outdoors
  {
    itemName: "Yoga Mat Premium Non-Slip",
    itemDescription:
      "Extra-thick 6mm yoga mat with superior grip and cushioning. Eco-friendly materials, comes with carrying strap. Perfect for yoga, pilates, and floor exercises.",
    shortDescription: "6mm non-slip yoga mat with carrying strap",
    itemPrice: 34.99,
    compareAtPrice: 49.99,
    costPrice: 18.0,
    itemCategory: "Sports",
    subcategory: "Fitness",
    brand: "YogaZen",
    itemStock: 75,
    lowStockThreshold: 15,
    sku: "SPRT-FIT-YM001",
    tags: ["yoga", "mat", "fitness", "exercise", "eco-friendly"],
    itemDisplayImage: "https://picsum.photos/seed/yogamat1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/yogamat1/800/800.jpg",
      "https://picsum.photos/seed/yogamat2/800/800.jpg",
    ],
    weight: 2.5,
    dimensions: { length: 72, width: 24, height: 0.25, unit: "in" },
    isFeatured: false,
    isActive: true,
  },
  {
    itemName: "Camping Tent 4-Person Waterproof",
    itemDescription:
      "Spacious 4-person tent with waterproof rainfly and ventilation system. Easy setup with color-coded poles, includes stakes and carrying bag. Perfect for family camping trips.",
    shortDescription: "4-person waterproof tent with easy setup",
    itemPrice: 179.99,
    compareAtPrice: 229.99,
    costPrice: 100.0,
    itemCategory: "Sports",
    subcategory: "Camping",
    brand: "OutdoorPro",
    itemStock: 20,
    lowStockThreshold: 5,
    sku: "SPRT-CMP-TNT001",
    tags: ["tent", "camping", "outdoor", "waterproof", "family"],
    itemDisplayImage: "https://picsum.photos/seed/campingtent1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/campingtent1/800/800.jpg",
      "https://picsum.photos/seed/campingtent2/800/800.jpg",
    ],
    weight: 12,
    dimensions: { length: 24, width: 8, height: 8, unit: "in" },
    isFeatured: true,
    isActive: true,
  },

  // Toys & Games
  {
    itemName: "Educational STEM Building Blocks Set",
    itemDescription:
      "500-piece building blocks set that promotes creativity and STEM learning. Compatible with major brands, includes instruction booklet for 20+ models. Safe, non-toxic materials.",
    shortDescription: "500-piece STEM building blocks for creative learning",
    itemPrice: 39.99,
    compareAtPrice: 54.99,
    costPrice: 20.0,
    itemCategory: "Toys",
    subcategory: "Educational",
    brand: "SmartPlay",
    itemStock: 90,
    lowStockThreshold: 20,
    sku: "TOYS-EDU-BLK001",
    tags: ["toys", "stem", "educational", "building blocks", "kids"],
    itemDisplayImage: "https://picsum.photos/seed/buildingblocks1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/buildingblocks1/800/800.jpg",
      "https://picsum.photos/seed/buildingblocks2/800/800.jpg",
    ],
    weight: 3,
    dimensions: { length: 15, width: 12, height: 8, unit: "in" },
    isFeatured: false,
    isActive: true,
  },

  // Beauty & Personal Care
  {
    itemName: "Luxury Skincare Gift Set",
    itemDescription:
      "Complete skincare routine set including cleanser, toner, serum, and moisturizer. Made with natural ingredients, suitable for all skin types. Beautifully packaged, perfect for gifts.",
    shortDescription: "4-piece luxury skincare set with natural ingredients",
    itemPrice: 89.99,
    compareAtPrice: 129.99,
    costPrice: 45.0,
    itemCategory: "Beauty",
    subcategory: "Skincare",
    brand: "GlowLux",
    itemStock: 55,
    lowStockThreshold: 12,
    sku: "BEAU-SKN-SET001",
    tags: ["skincare", "beauty", "gift set", "natural", "moisturizer"],
    itemDisplayImage: "https://picsum.photos/seed/skincareset1/800/800.jpg",
    itemImages: [
      "https://picsum.photos/seed/skincareset1/800/800.jpg",
      "https://picsum.photos/seed/skincareset2/800/800.jpg",
    ],
    weight: 1.5,
    dimensions: { length: 10, width: 8, height: 4, unit: "in" },
    isFeatured: true,
    isActive: true,
  },
];

async function seedItems() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    // Get a user ID to assign as creator (use your existing user)
    const firstUser = await User.findOne();

    if (!firstUser) {
      console.error("No users found in database. Please create a user first.");
      process.exit(1);
    }

    const creatorId = firstUser._id;
    console.log(`Using user ${firstUser.email || firstUser._id} as creator`);

    // Clear existing items (optional - comment out if you want to keep existing items)
    const deleteResult = await Item.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing items`);

    // Add creator ID to all items
    const itemsToInsert = sampleItems.map((item) => ({
      ...item,
      createdBy: creatorId,
    }));

    // Insert all items
    const result = await Item.insertMany(itemsToInsert);
    console.log(`\n✅ Successfully created ${result.length} items!`);

    // Display summary
    console.log("\n📊 Items Summary:");
    const categories = await Item.aggregate([
      { $group: { _id: "$itemCategory", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    categories.forEach((cat) => {
      console.log(`  - ${cat._id}: ${cat.count} items`);
    });

    console.log("\n✨ Featured items:");
    const featured = result.filter((item) => item.isFeatured);
    featured.forEach((item) => {
      console.log(`  - ${item.itemName} ($${item.itemPrice})`);
    });
  } catch (error) {
    console.error("Error seeding items:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
    process.exit(0);
  }
}

// Run the seeding function
seedItems();
