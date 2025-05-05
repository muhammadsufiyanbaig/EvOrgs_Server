import { GraphQLScalarType, Kind } from 'graphql';
// Fixed Date scalar for GraphQL with proper type annotations
export const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error('GraphQL Date Scalar serializer expected a Date object');
  },
  parseValue(value: unknown): Date | null {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return null;
  },
  parseLiteral(ast): Date | null {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});
