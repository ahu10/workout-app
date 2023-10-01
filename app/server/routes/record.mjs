import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const router = express.Router();

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, could not find token" });
  }

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

// Common function to get the userId from the request
function getUserIdFromRequest(req) {
  const token = req.headers.authorization;

  if (!token) {
    return null; // Handle the case when no token is provided
  }

  try {
    // Decode the token to get the payload
    const decodedToken = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);

    // Extract the userId from the payload
    const userId = decodedToken.userId;

    return userId;
  } catch (error) {
    // Handle token verification errors
    console.error('Error decoding token:', error);
    return null;
  }
}

// Get exercises specific to the authenticated user
router.get("/exercises", async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    console.log("This is the userId", req)

    if (!userId) {
      console.log("No User")
      return res.status(401).json({ message: "Unauthorized, no exercises delivered" });
    }

    const collection = await db.collection("exercises");
    const results = await collection.find({ userId }).toArray();

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new exercise specific to the authenticated user
router.post("/exercises", verifyToken, async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, no exercise created" });
    }

    const collection = await db.collection("exercises");
    const exist = await collection.findOne({
      name: req.body.name,
      userId,
    });

    if (!exist) {
      const newDocument = {
        name: req.body.name,
        userId,
      };

      const result = await collection.insertOne(newDocument);
      return res.status(201).json(newDocument);
    } else {
      return res.status(409).json({ message: "Exercise already exists" });
    }
  } catch (error) {
    console.error("Error adding exercise:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete an exercise specific to the authenticated user by ID
router.delete("/exercises/:id", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const exerciseId = req.params.id;
  const query = { _id: new ObjectId(exerciseId), userId };

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const collection = db.collection("exercises");
  let result = await collection.deleteOne(query);

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Exercise not found' });
  }

  res.status(204).send();
});

router.post("/signup", async (req, res) => {
  try {
    const collection = await db.collection("users");
    const user = await collection.findOne({ username: req.body.username });

    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newDocument = {
      username: req.body.username,
      password: req.body.password,
    };

    const result = await collection.insertOne(newDocument);

    if (result.insertedCount === 1) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Failed to create user' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let collection = await db.collection("users");
  const user = await collection.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed, user not found' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Authentication failed, password does not match' });
  }

  const secretKey = process.env.JWT_SECRET_KEY || crypto.randomBytes(64).toString('hex');

  if (!process.env.JWT_SECRET_KEY) {
     const fs = require('fs');
     fs.writeFileSync('.env', `JWT_SECRET_KEY=${secretKey}\n`, { flag: 'a' });
  }

  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
  console.log(token)

  res.status(200).json({ token, message: 'Authentication successful' });
});

export default router;
