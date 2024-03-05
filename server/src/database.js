import * as mongodb from "mongodb";
export const collections = {};
export async function connectToDatabase(uri) {
    if (!uri || typeof uri !== "string") {
        throw new Error("Database URI is not defined");
    }
    const client = new mongodb.MongoClient(uri);
    await client.connect();
    const db = client.db(process.env.DATABASE_NAME);
    const booksCollection = db.collection("books");
    const authorsCollection = db.collection("authors");
    const reviewsCollection = db.collection("reviews");
    const usersCollection = db.collection("users");
    const issueDetailCollection = db.collection("issueDetails");
    collections.books = booksCollection;
    collections.authors = authorsCollection;
    collections.reviews = reviewsCollection;
    collections.users = usersCollection;
    collections.issueDetails = issueDetailCollection;
    return client;
}
