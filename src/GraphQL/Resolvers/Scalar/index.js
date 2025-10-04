"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateScalar = void 0;
const graphql_1 = require("graphql");
// Fixed Date scalar for GraphQL with proper type annotations
exports.dateScalar = new graphql_1.GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString();
        }
        throw new Error('GraphQL Date Scalar serializer expected a Date object');
    },
    parseValue(value) {
        if (typeof value === 'string') {
            return new Date(value);
        }
        return null;
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});
