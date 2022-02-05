const express = require("express");
const fs = require("fs-extra");
const { PrismaClient: DogClient } = require(".prisma/dog-client");
const { PrismaClient: CatClient } = require(".prisma/cat-client");
const serverless = require("serverless-http");
const port = process.env.PORT || 8000;

// Instantiate Clients
const dogClient = new DogClient();
const catClient = new CatClient();

// Get express application
const app = express();

// Wrapper for async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Parse POST bodies
app.use(express.json());

// Set up default route
app.get("/", (req, res) => {
  res.status(200).send(`Welcome to the Petstore!`);
});

// Get all dogs
app.get(
  "/dog",
  asyncHandler(async (req, res) => {
    const dogs = await dogClient.dog.findMany();
    res.json(dogs);
  })
);

// Create a dog
app.post(
  "/dog",
  asyncHandler(async (req, res) => {
    const { name, color } = req.body;
    const newDog = await dogClient.dog.create({
      data: { name, color },
    });

    res.status(200).json(newDog);
  })
);

// Get all cats
app.get(
  "/cat",
  asyncHandler(async (req, res) => {
    const cats = await catClient.cat.findMany();
    res.json(cats);
  })
);

// Create a cat
app.post(
  "/cat",
  asyncHandler(async (req, res) => {
    const { name, color } = req.body;
    const newCat = await catClient.cat.create({
      data: { name, color },
    });

    res.status(200).json(newCat);
  })
);

// Catch any errors, throw detailed info if in development
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong",
    ...(process.env.NODE_ENV === "development"
      ? { devMessage: err.message, devStack: err.stack }
      : {}),
  });
});

// Start 'er up!
app.listen(port, async () => {
  // Only needed for SQLite
  if (process.env.NODE_ENV === "aws-testing") {
    // If we are on AWS, our SQLite DBs aren't writable unless in tmp
    await fs.copy("/opt/nodejs/prisma", "/tmp/prisma");
  }
  console.log(`Listening on: http://localhost:${port} `);
});

module.exports.handler = serverless(app);