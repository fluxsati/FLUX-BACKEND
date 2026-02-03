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
    image: 'https://www.sparkfun.com/media/catalog/product/cache/a793f13fd3d678cea13d28206895ba0c/1/1/11021-01.jpg',
    description: 'The industry standard for electronics prototyping. Includes USB cable.',
    category: 'Microcontrollers',
    price: 650,
    countInStock: 25,
  },
  {
    name: 'ESP32 DevKit V1 (WROOM-32)',
    image: 'https://www.az-delivery.de/cdn/shop/products/esp32-nodemcu-module-wlan-wifi-development-board-mit-cp2102-nachfolgermodell-zum-esp8266-kompatibel-mit-arduino-872375.jpg?v=1679400491&width=1200',
    description: 'Powerful Dual-core CPU with built-in WiFi and Bluetooth for IoT projects.',
    category: 'IoT Boards',
    price: 550,
    countInStock: 40,
  },
  {
    name: 'NodeMCU ESP8266',
    image: 'https://www.az-delivery.de/cdn/shop/products/nodemcu-lua-amica-modul-v2-esp8266-esp-12f-wifi-wifi-development-board-mit-cp2102-498114.jpg?v=1679402568&width=1200',
    description: 'Affordable WiFi microcontroller for smart home and wireless sensors.',
    category: 'IoT Boards',
    price: 350,
    countInStock: 50,
  },

  // --- ROBOTICS KITS & PARTS ---
  {
    name: '4WD Smart Robot Chassis Kit',
    image: 'https://m.media-amazon.com/images/I/713pKLr35LL._AC_UF1000,1000_QL80_.jpg',
    description: 'Acrylic chassis, 4 BO motors, 4 wheels, and battery holder. Assembly required.',
    category: 'Robotics',
    price: 899,
    countInStock: 10,
  },
  {
    name: 'L298N Motor Driver Module',
    image: 'https://m.media-amazon.com/images/I/51OL+JML2OL._AC_UF1000,1000_QL80_.jpg',
    description: 'High-power dual-channel motor driver for DC motors.',
    category: 'Robotics',
    price: 180,
    countInStock: 100,
  },
  {
    name: 'SG90 TowerPro Servo Motor',
    image: 'https://m.media-amazon.com/images/I/61yfIwAxe0L.jpg',
    description: 'Tiny 9g servo motor for 180 degree precise movement.',
    category: 'Robotics',
    price: 150,
    countInStock: 60,
  },

  // --- SENSORS ---
  {
    name: 'Ultrasonic Distance Sensor (HC-SR04)',
    image: 'https://cdn3.botland.store/119036/ultrasonic-distance-sensor-hc-sr04-2-200cm-justpi.jpg',
    description: 'Measures distance from 2cm to 400cm. Used for obstacle avoidance.',
    category: 'Sensors',
    price: 120,
    countInStock: 80,
  },
  {
    name: 'DHT11 Temperature & Humidity Sensor',
    image: 'https://probots.co.in/pub/media/catalog/product/cache/ca2cd736c0c15942c77daffc8cf27b66/d/h/dht11_humidity_and_temperature_sensor_module_for_arduino-5.jpg',
    description: 'Digital sensor for measuring ambient temperature and humidity.',
    category: 'Sensors',
    price: 140,
    countInStock: 45,
  },

  // --- THE "SMALL" STUFF (WIRES & ACCESSORIES) ---
  {
    name: 'Jumper Wires Mix Pack (60 Pcs)',
    image: 'https://www.makerfabs.com/media/catalog/product/cache/5082619e83af502b1cf28572733576a0/b/r/breadboard_jumper_wire_60pcs_pack-1.jpg',
    description: 'Set of Male-to-Male, Male-to-Female, and Female-to-Female wires.',
    category: 'Accessories',
    price: 160,
    countInStock: 200,
  },
  {
    name: 'Full-Size Breadboard (830 Points)',
    image: 'https://robocraze.com/cdn/shop/products/Solderless_Breadboard.jpg?v=1743773947',
    description: 'High-quality breadboard for prototyping without soldering.',
    category: 'Accessories',
    price: 150,
    countInStock: 120,
  },
  {
    name: '9V High-Power Battery with DC Jack',
    image: 'https://robocraze.com/cdn/shop/files/9V_Battery_Case_with_DC_Jack.png?v=1762914405',
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