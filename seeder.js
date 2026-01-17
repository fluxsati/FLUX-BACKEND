const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const products = [
  // --- BIG BOARDS (MICROCONTROLLERS) ---
  {
    name: 'Arduino Uno R3 (Compatible)',
    image: 'https://store-usa.arduino.cc/cdn/shop/products/A000066_03.front_934x700.jpg',
    description: 'The industry standard for electronics prototyping. Includes USB cable.',
    category: 'Microcontrollers',
    price: 650,
    countInStock: 25,
  },
  {
    name: 'ESP32 DevKit V1 (WROOM-32)',
    image: 'https://m.media-amazon.com/images/I/61u17n9A-3L.jpg',
    description: 'Powerful Dual-core CPU with built-in WiFi and Bluetooth for IoT projects.',
    category: 'IoT Boards',
    price: 550,
    countInStock: 40,
  },
  {
    name: 'NodeMCU ESP8266',
    image: 'https://components101.com/sites/default/files/component_pinout/NodeMCU-ESP8266-Pinout.png',
    description: 'Affordable WiFi microcontroller for smart home and wireless sensors.',
    category: 'IoT Boards',
    price: 350,
    countInStock: 50,
  },

  // --- ROBOTICS KITS & PARTS ---
  {
    name: '4WD Smart Robot Chassis Kit',
    image: 'https://m.media-amazon.com/images/I/61N+V+X2G1L._SL1000_.jpg',
    description: 'Acrylic chassis, 4 BO motors, 4 wheels, and battery holder. Assembly required.',
    category: 'Robotics',
    price: 899,
    countInStock: 10,
  },
  {
    name: 'L298N Motor Driver Module',
    image: 'https://www.handsontec.com/pdf_learn/L298N%20Motor%20Driver.pdf',
    description: 'High-power dual-channel motor driver for DC motors.',
    category: 'Robotics',
    price: 180,
    countInStock: 100,
  },
  {
    name: 'SG90 TowerPro Servo Motor',
    image: 'https://m.media-amazon.com/images/I/41D86pD9hGL.jpg',
    description: 'Tiny 9g servo motor for 180 degree precise movement.',
    category: 'Robotics',
    price: 150,
    countInStock: 60,
  },

  // --- SENSORS ---
  {
    name: 'Ultrasonic Distance Sensor (HC-SR04)',
    image: 'https://m.media-amazon.com/images/I/51H9kH7p2GL.jpg',
    description: 'Measures distance from 2cm to 400cm. Used for obstacle avoidance.',
    category: 'Sensors',
    price: 120,
    countInStock: 80,
  },
  {
    name: 'DHT11 Temperature & Humidity Sensor',
    image: 'https://m.media-amazon.com/images/I/41K79H0m1KL.jpg',
    description: 'Digital sensor for measuring ambient temperature and humidity.',
    category: 'Sensors',
    price: 140,
    countInStock: 45,
  },

  // --- THE "SMALL" STUFF (WIRES & ACCESSORIES) ---
  {
    name: 'Jumper Wires Mix Pack (60 Pcs)',
    image: 'https://m.media-amazon.com/images/I/71p0f9M-7hL._SL1500_.jpg',
    description: 'Set of Male-to-Male, Male-to-Female, and Female-to-Female wires.',
    category: 'Accessories',
    price: 160,
    countInStock: 200,
  },
  {
    name: 'Full-Size Breadboard (830 Points)',
    image: 'https://m.media-amazon.com/images/I/51vIq3K+tXL._SL1000_.jpg',
    description: 'High-quality breadboard for prototyping without soldering.',
    category: 'Accessories',
    price: 150,
    countInStock: 120,
  },
  {
    name: '9V High-Power Battery with DC Jack',
    image: 'https://m.media-amazon.com/images/I/41E0-6Q631L.jpg',
    description: 'Powers your Arduino/ESP32 on the go. Includes connector.',
    category: 'Power',
    price: 85,
    countInStock: 150,
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ All Items Injected (Big Boards to Small Wires)!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // Destroys all data if run with -d flag
  Product.deleteMany().then(() => {
    console.log('⚠️ Data Destroyed!');
    process.exit();
  });
} else {
  importData();
}