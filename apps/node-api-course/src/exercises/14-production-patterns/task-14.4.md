# Задание 14.4: GraphQL Basics

## 🎯 Цель

Освоить GraphQL с Apollo Server: определение схемы (typeDefs), реализация resolvers, обработка queries и mutations, контекст и DataLoader.

## Требования

1. Определите typeDefs: типы User и Post, Query (users, user, posts), Mutation (createUser, createPost, deletePost)
2. Реализуйте resolvers для Query и Mutation с использованием Prisma через context
3. Настройте Apollo Server с expressMiddleware и context (db, user, loaders)
4. Покажите GraphQL queries и mutations с ответами
5. Продемонстрируйте field resolver для User.posts с DataLoader (предотвращение N+1)

## Чеклист

- [ ] TypeDefs определяют типы, Query и Mutation
- [ ] Resolvers обрабатывают queries и mutations
- [ ] Context передаёт db, user и loaders в каждый resolver
- [ ] GraphQL queries возвращают правильные данные
- [ ] DataLoader предотвращает N+1 для вложенных запросов

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: схема определена, queries и mutations работают, context доступен в resolvers, DataLoader предотвращает N+1.
