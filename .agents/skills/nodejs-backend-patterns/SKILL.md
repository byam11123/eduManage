---
name: nodejs-backend-patterns
description: Build production-ready Node.js backend services with Express/Fastify, implementing middleware patterns, error handling, authentication, database integration, and API design best practices. Use when creating Node.js servers, REST APIs, GraphQL backends, or microservices architectures.
---

# Node.js Backend Patterns

Comprehensive guidance for building scalable, maintainable, and production-ready Node.js backend applications with modern frameworks, architectural patterns, and best practices.

## When to Use This Skill

- Building REST APIs or GraphQL servers
- Creating microservices with Node.js
- Implementing authentication and authorization
- Designing scalable backend architectures
- Setting up middleware and error handling
- Integrating databases (SQL and NoSQL)
- Building real-time applications with WebSockets
- Implementing background job processing

## Detailed patterns and worked examples

Detailed pattern documentation lives in `references/details.md`. Read that file when the navigation tier above is insufficient.

## Best Practices

1. **Use TypeScript**: Type safety prevents runtime errors
2. **Implement proper error handling**: Use custom error classes
3. **Validate input**: Use libraries like Zod or Joi
4. **Use environment variables**: Never hardcode secrets
5. **Implement logging**: Use structured logging (Pino, Winston)
6. **Add rate limiting**: Prevent abuse
7. **Use HTTPS**: Always in production
8. **Implement CORS properly**: Don't use `*` in production
9. **Use dependency injection**: Easier testing and maintenance
10. **Write tests**: Unit, integration, and E2E tests
11. **Handle graceful shutdown**: Clean up resources
12. **Use connection pooling**: For databases
13. **Implement health checks**: For monitoring
14. **Use compression**: Reduce response size
15. **Monitor performance**: Use APM tools

## Testing Patterns

See `javascript-testing-patterns` skill for comprehensive testing guidance.

---

## EduManage API Conventions

When building API routes for EduManage, these are the non-negotiable patterns:

### Auth Enforcement (Every Route)
```typescript
import { extractToken, verifyToken } from '@/lib/auth-utils'

const token = extractToken(request)
if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
const payload = await verifyToken(token)
if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
```

### Response Shape (Consistent Across All Routes)
```typescript
// Success
return NextResponse.json({ success: true, data: result })

// Error
return NextResponse.json({ success: false, error: 'Human-readable message' }, { status: 4xx })
```

### Org Scoping (All Queries)
```typescript
// ALWAYS filter by organizationId from the JWT payload
const data = await db.model.findMany({
  where: {
    organizationId: payload.organizationId,  // ← NEVER skip this
    // branch admins also need branchId filter:
    ...(payload.role !== 'super_admin' ? { branchId: payload.branchId } : {})
  }
})
```

### Financial Operations (Atomic Transactions)
```typescript
// All payment operations MUST use $transaction
const result = await db.$transaction(async (tx) => {
  // 1. Update Installment/AdditionalFee
  // 2. Generate sequential receipt number inside tx
  // 3. Create Receipt record
  // Return all updated data
})
```

### Error Logging Pattern
```typescript
try {
  // ...
} catch (error) {
  console.error('[API /admin/module-name] Error:', error)
  return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
}
```

### Never Do These
- Never expose Prisma errors to the client (map to friendly messages)
- Never skip organizationId in WHERE clauses
- Never trust client-provided organizationId — always use payload.organizationId
- Never put business logic in the route handler — call service layer
