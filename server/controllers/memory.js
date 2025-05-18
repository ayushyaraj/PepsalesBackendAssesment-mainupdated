const Memory = require("../models/Memory");
const { uploadImageToCloudinary } = require("../utils/ImageUploader");
require("dotenv").config();

//subsection controller
//create subsection

exports.createMemory = async (req, res) => {
  try {
    //fetch data
    const { title, timeDuration, description, images } = req.body;
    //extract file/video

    const image = req.files.images;

    //data validation
    if (!title || !timeDuration || !description || !images) {
      return res.status(400).json({
        success: false,
        message: "All fields are requird",
      });
    }
    //upload video to cloudinary

    const uploadDetails = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME
    );

    //create subsection

    const memory = await Memory.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      //   videoUrl: uploadDetails.secure_url,
      image: uploadDetails.secure_url,
    });

    return res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while creating subsection try again",
    });
  }
};
exports.getUserMemories = async (req, res) => {
  try {
    const memories = await Memory.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: memories });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching memories" });
  }
};

//delete subsection
exports.deleteMemory = async (req, res) => {
  try {
    const memoryId = req.params.id;
    const memory = await Memory.findOneAndDelete({
      _id: memoryId,
      createdBy: req.user.id,
    });

    if (!memory) {
      return res
        .status(404)
        .json({ success: false, message: "Memory not found" });
    }

    res.status(200).json({ success: true, message: "Memory deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting memory" });
  }
};
