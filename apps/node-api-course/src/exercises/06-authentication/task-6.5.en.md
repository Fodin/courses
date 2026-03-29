# Task 6.5: RBAC

## 🎯 Goal

Implement Role-Based Access Control: define roles and permissions, access control middleware, and resource-level permissions.

## Requirements

1. Define roles and permissions: admin (full access), editor (posts), user (own posts), viewer (read-only)
2. Implement `requirePermission(...permissions)` middleware for access checks
3. Demonstrate access checks for different roles and endpoints
4. Implement resource-level permissions: user can only edit their own resources
5. Show 403 Forbidden response with required permissions info

## Checklist

- [ ] Role table: admin, editor, user, viewer with permission lists
- [ ] `requirePermission()` checks that all specified permissions exist for the role
- [ ] 403 contains: required permissions and user's current role
- [ ] Resource-level: check authorId === req.user.id || role === 'admin'
- [ ] Middleware usage: `router.delete('/users/:id', requirePermission('users.delete'), handler)`

## How to Verify

Click "Run" and verify that: role table is shown, access check simulation for different roles is correct, and resource-level permissions are explained.
