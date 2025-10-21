import { BlobServiceClient } from "@azure/storage-blob";
// Azure Blob setup
const blobService = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobService.getContainerClient(
  process.env.AZURE_CONTAINER_NAME
);

// Helper: upload data to Azure Blob
async function uploadToAzure(data) {
  const blobName = `dynamo-backup-${Date.now()}.json`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const jsonData = JSON.stringify(data, null, 2);
  await blockBlobClient.upload(jsonData, Buffer.byteLength(jsonData));

  return blobName;
}


export default uploadToAzure;