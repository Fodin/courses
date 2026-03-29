# Task 4.3: Response DTOs

## 🎯 Goal

Implement the DTO (Data Transfer Object) pattern for safe response serialization: field filtering, transformation, and different DTOs for different contexts.

## Requirements

1. Show the problem: sending a DB object directly leaks password_hash, internal_notes, stripe_customer_id
2. Implement `UserResponseDTO.fromEntity()` -- a static method for safe transformation
3. Show the `toJSON` pattern for Mongoose/Sequelize models
4. Implement different DTOs for different contexts: UserListDTO, UserDetailDTO, AdminUserDTO
5. Show snake_case -> camelCase transformation

## Checklist

- [ ] Data leakage problem demonstrated clearly (DB object vs client response)
- [ ] DTO contains only public fields (id, name, email, createdAt)
- [ ] `fromEntity()` transforms snake_case to camelCase
- [ ] `toJSON` overrides serialization at the model level
- [ ] Different DTOs: List (id, name, avatar), Detail (+ email, bio), Admin (+ role, lastLogin)

## How to Verify

Click "Run" and verify that: data leakage is demonstrated, DTO filters sensitive fields, and three contexts (list, detail, admin) show different field sets.
