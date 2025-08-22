require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3030;
const fs = require("fs");
const path = require("path");
//create a assets/temp
const tempDir = path.join(__dirname, "assets", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
const start = async () => {
  await connectDB(process.env.MONGO_URL);
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
};

start();
