import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import { typeDefs } from "./GraphQL/typeDefs"; // Adjust the path as needed
import { resolvers } from "./GraphQL/Resolvers"; // Adjust the path as needed
import { authMiddleware } from "./middleware/auth"; // Import your auth middleware
import { Context, createContext } from "./GraphQL/Context";


dotenv.config();

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(authMiddleware); // Optional: Apply auth middleware if you have it

  // Apollo Server Setup
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  await server.start();
  // GraphQL Endpoint with proper context
  app.use('/graphql', expressMiddleware(server, {
    context: createContext,
  }));

  // Start Express Server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

// Start the server
startServer().catch((err) => {
  console.error("Error starting the server:", err);
});