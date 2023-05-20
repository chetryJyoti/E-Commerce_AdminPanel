import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnection } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

// Set the name of the S3 bucket to upload files to
const bucketName = "admin-ecommerce-nextjs";

// Define the request handler function
export default async function handle(req, res) {
  await mongooseConnection();
  await isAdminRequest(req, res);
  // Create a new instance of the multiparty form object to parse the incoming request
  const form = new multiparty.Form();

  // Parse the request and wait for the results
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  // Log some information about the uploaded files to the console
  console.log("file", files);
  console.log("length:", files.file.length);

  // Set up a new S3 client with the appropriate credentials and region
  const client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  // Create an array to hold the URLs of the uploaded files
  const links = [];

  // Loop over each uploaded file and upload it to S3
  for (const file of files.file) {
    // Extract the file extension from the original filename
    const ext = file.originalFilename.split(".").pop();
    // Create a new filename by appending the current timestamp and the original file extension
    const newFileName = Date.now() + "." + ext;
    console.log("extension:", ext);

    // Upload the file to S3 and wait for the result
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFileName,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );

    // Create a URL for the uploaded file and add it to the links array
    const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
    links.push(link);
  }

  // Return a JSON response containing the URLs of the uploaded files
  return res.json({ links });
}

// Disable the built-in body parser for this API route
export const config = {
  api: { bodyParser: false },
};
