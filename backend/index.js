const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config(); // This should be at the very top

const app = express()
const Routes = require("./routes/route.js")

const PORT = process.env.PORT || 2000

app.use(express.json({ limit: '10mb' }))
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
  }));
  
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("MongoDB Connection Error:", err))

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})