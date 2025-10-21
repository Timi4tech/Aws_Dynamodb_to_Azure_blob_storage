import express from "express";
import cron from "node-cron";
import dotenv from "dotenv";
import uploadToAzure from "./Azure_Blob_Setup";
import fetchAllData from "./Aws_Dynamodb";

dotenv.config()

const app =  express()
// API endpoint

 const fetchData =  async (req, res) => {
  try {
    console.log("Fetching data from DynamoDB...");
    const data = await fetchAllData();

    console.log(`Fetched ${data.length} items. Uploading to Azure...`);
    const blobName = await uploadToAzure(data);

    res.json({
      message: "Data migration completed successfully!",
      items: data.length,
      azureBlob: blobName,
    });
  } catch (err) {
    console.error("Migration error:", err);
    res.status(500).json({ error: err.message });
  }};


const automation = cron.schedule(process.env.AUTOMATIONTIME,fetchData)


app.get("/auto-migrate", automation);

app.get("/migrate", fetchData)

app.listen(port, () =>
  console.log(`🚀 Server running at http://localhost:${port}/migrate`)
);