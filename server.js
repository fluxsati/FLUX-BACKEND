const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const { socketHandler } = require('./socket/socketHandler');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// 1. Load Environment & Connect Database
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// 2. Global Middlewares
// UPDATED CORS: Allowing both your Netlify and Vercel domains
app.use(cors({
    origin: [
        'https://clubflux.netlify.app', 
        'https://clubflux.vercel.app', 
        'https://www.clubflux.in/',
          'www.clubflux.in/',
           'www.clubflux.in',
         'https://clubflux.in',
          'https://clubflux.in/',
        'http://localhost:5173', // Vite default
        'http://localhost:3000'  // React default
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.json()); 

// 3. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Root Route
app.get('/', (req, res) => {
    res.send('Flux-Web API is running with Shop & Socket systems active...');
});

// 4. Socket.io Initialization
// IMPORTANT: Ensure your socketHandler.js also uses these origins!
const io = socketHandler(server); 
app.set('socketio', io); 

// 5. Error Handling Middleware (MUST BE LAST)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// 6. Start Server
server.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});