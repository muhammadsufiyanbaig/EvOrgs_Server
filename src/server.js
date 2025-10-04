"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const dotenv_1 = __importDefault(require("dotenv"));
const typeDefs_1 = require("./GraphQL/typeDefs"); // Adjust the path as needed
const Resolvers_1 = require("./GraphQL/Resolvers"); // Adjust the path as needed
const auth_1 = require("./middleware/auth"); // Import your auth middleware
const Context_1 = require("./GraphQL/Context");
const http_1 = require("http");
const Socket_1 = require("./Features/Chats/Socket");
dotenv_1.default.config();
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const httpServer = (0, http_1.createServer)(app);
        // Initialize Socket.IO for chat
        (0, Socket_1.initializeChatSocket)(httpServer);
        // Middleware
        app.use((0, cors_1.default)());
        app.use(body_parser_1.default.json());
        app.use(auth_1.authMiddleware); // Optional: Apply auth middleware if you have it
        // Apollo Server Setup
        const server = new server_1.ApolloServer({
            typeDefs: typeDefs_1.typeDefs,
            resolvers: Resolvers_1.resolvers,
        });
        yield server.start();
        // GraphQL Endpoint with proper context
        app.use('/graphql', (0, express4_1.expressMiddleware)(server, {
            context: Context_1.createContext,
        }));
        // Start Express Server
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        });
    });
}
// Start the server
startServer().catch((err) => {
    console.error("Error starting the server:", err);
});
