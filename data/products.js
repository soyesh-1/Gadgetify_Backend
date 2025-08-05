// Gadgetify_backend/data/products.js
const products = [
  {
    name: "iPhone 15 Pro Max",
    price: 170000,
    description: "The iPhone 15 Pro Max features a stunning ProMotion XDR display...",
    image: "/uploads/iphone15pro.jpg", // CORRECT UNIFIED PATH
    category: "Mobiles",
    stock: 50,
    specifications: [
      { name: "Display", value: "6.7-inch Super Retina XDR display" },
      { name: "Chip", value: "A17 Bionic chip" },
    ]
  },
  {
    name: "Samsung Galaxy S24",
    price: 150000,
    description: "Discover the Samsung Galaxy S24, featuring cutting-edge AI capabilities...",
    image: "/uploads/SamsungS24.jpg", // CORRECT UNIFIED PATH
    category: "Mobiles",
    stock: 30,
    specifications: [
        { name: "Display", value: "6.2-inch Dynamic AMOLED 2X" },
        { name: "RAM", value: "8GB / 12GB" },
    ]
  },
  {
    name: "Sony WH-1000XM5",
    price: 45000,
    description: "Experience industry-leading noise cancellation with the Sony WH-1000XM5...",
    image: "/uploads/Sony WH-1000XM5.jpg", // CORRECT UNIFIED PATH
    category: "Headphones",
    stock: 75,
    specifications: [
        { name: "Type", value: "Over-ear, Noise-cancelling" },
        { name: "Battery Life", value: "Up to 30 hours (NC on)" },
    ]
  },
  {
    name: "Apple MacBook Air M3",
    price: 210000,
    description: "The new MacBook Air with the M3 chip delivers even more performance...",
    image: "/uploads/Apple MacBook Air M3.jpg", // CORRECT UNIFIED PATH
    category: "Laptops",
    stock: 25,
    specifications: [
        { name: "Chip", value: "Apple M3 chip" },
        { name: "Display", value: "13.6-inch Liquid Retina display" },
    ]
  },
];

module.exports = products;
