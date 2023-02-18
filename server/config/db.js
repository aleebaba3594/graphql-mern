let mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (err) {
    console.log(`MongoDB Not connected: ${err}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
