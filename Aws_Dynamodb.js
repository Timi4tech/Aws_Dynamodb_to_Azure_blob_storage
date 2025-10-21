import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";
 

dotenv.config();

// AWS DynamoDB setup
const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });

async function fetchAllData() {
  let items = [];
  let lastKey;

  do {
    const command = new ScanCommand({
      TableName: process.env.DYNAMO_TABLE,
      ExclusiveStartKey: lastKey,
    });
    const response = await dynamo.send(command);
    items = items.concat(response.Items);
    lastKey = response.LastEvaluatedKey;
  } while (lastKey);

  return items;
}

export default fetchAllData;