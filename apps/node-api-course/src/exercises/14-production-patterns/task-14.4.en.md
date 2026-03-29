# Task 14.4: GraphQL Basics

## 🎯 Goal

Master GraphQL with Apollo Server: schema definition (typeDefs), resolver implementation, handling queries and mutations, context, and DataLoader.

## Requirements

1. Define typeDefs: User and Post types, Query (users, user, posts), Mutation (createUser, createPost, deletePost)
2. Implement resolvers for Query and Mutation using Prisma via context
3. Configure Apollo Server with expressMiddleware and context (db, user, loaders)
4. Show GraphQL queries and mutations with responses
5. Demonstrate field resolver for User.posts with DataLoader (N+1 prevention)

## Checklist

- [ ] TypeDefs define types, Query, and Mutation
- [ ] Resolvers handle queries and mutations
- [ ] Context provides db, user, and loaders to each resolver
- [ ] GraphQL queries return correct data
- [ ] DataLoader prevents N+1 for nested queries

## How to Verify

Click "Run" and verify that: schema is defined, queries and mutations work, context is accessible in resolvers, DataLoader prevents N+1.
