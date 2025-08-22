const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("File path not provided");
    }
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return { url: res.secure_url, publicId: res.public_id };
  } catch (error) {
    console.log("Error while Uploading: ", error.message);
    return error;
  }
};
async function deleteFromCloudinary(publicId) {
  // returns a result object you can log if you want
  return cloudinary.uploader.destroy(publicId);
}
module.exports = { uploadOnCloudinary, deleteFromCloudinary };
