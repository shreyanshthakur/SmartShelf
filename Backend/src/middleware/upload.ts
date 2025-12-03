import { Request, Response, NextFunction } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import s3Client from "../config/aws";

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME || "default-bucket-name",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}-${file.originalname.replace(/\s+/g, "-")}`;
      cb(null, `products/images/${uniqueName}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!") as any, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

export async function uploadImages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const multerMiddleware = upload.array("images", 5);

  multerMiddleware(req, res, (error: any) => {
    if (error) {
      console.error("Upload error:", error);

      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "File too large (max 5MB)" });
        }
        if (error.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({ message: "Too many files (max 5)" });
        }
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({ message: "Unexpected field name" });
        }
      }
      return res.status(400).json({ message: error.message });
    }

    const uploadedFiles = req.files as Express.Multer.File[];

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    (req as any).uploadedImages = uploadedFiles.map((file) => ({
      url: (file as any).location,
      key: (file as any).key,
      size: file.size,
      mimetype: file.mimetype,
      originalName: file.originalname,
    }));

    console.log(`Successfully uploaded ${uploadedFiles.length} image(s)`);
    next();
  });
}
