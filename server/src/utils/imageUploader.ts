import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from "cloudinary";

interface UploadFile {
  tempFilePath: string;
}

export const uploadImageToCloudinary = async ( file: UploadFile, folder: string, height?: number, quality?: number | string ): Promise<UploadApiResponse> => {
  const options: UploadApiOptions = {
    folder,
    resource_type: "auto",
  };

  if (height) {
    options.height = height;
  }

  if (quality) {
    options.quality = quality;
  }

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};