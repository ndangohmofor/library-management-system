//This should always be the first import
import "./load-env-vars.js";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectToDatabase } from "./database.js";

const app = express();
const port = process.env.PORT || "5000";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

await connectToDatabase(process.env.DATABASE_URI);
console.log("Connected to database!");

app.get("/", (_, res) => res.sendStatus(200));

app.use("/authors", (await import("./routes/authors.js")).default);
app.use("/books", (await import("./routes/books.js")).default);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
