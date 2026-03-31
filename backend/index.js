const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const TABLE_NAME = "Tasks";

const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://127.0.0.1:8000",
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
});

const db = DynamoDBDocumentClient.from(client);

async function ensureTable() {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log(`Table "${TABLE_NAME}" already exists`);
  } catch (error) {
    if (error.name === "ResourceNotFoundException") {
      await client.send(
        new CreateTableCommand({
          TableName: TABLE_NAME,
          AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          BillingMode: "PAY_PER_REQUEST",
        }),
      );
      console.log(`Table "${TABLE_NAME}" created`);
    } else {
      throw error;
    }
  }
}

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

app.get("/tasks", async (req, res) => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.json(result.Items || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "title is required" });
    }

    const item = {
      id: crypto.randomUUID(),
      title: title.trim(),
      createdAt: new Date().toISOString(),
    };

    await db.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      }),
    );

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

ensureTable()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Startup error:", error);
  });
