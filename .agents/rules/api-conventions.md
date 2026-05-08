# API & Server Action Conventions
activation: always

## Server Actions
- Always validate input with Zod before calling any service
- Always return `{ success: boolean, data?: T, error?: string }`
- Call service functions — never write business logic inside the action itself
- Always `revalidatePath` after mutations

## Service Layer
- One service file per module: `admissionService.ts`, `feeService.ts`, etc.
- Services receive validated, typed inputs
- Services return typed outputs — never raw Prisma models
- Financial operations (fees, installments, receipts) MUST use `prisma.$transaction()`

## Error Handling
- Services throw domain errors with meaningful messages
- Actions catch and return `{ success: false, error: "user-friendly message" }`
- Never expose Prisma stack traces or DB errors to client

## Example pattern
```ts
// Server Action
export async function createAdmission(input: unknown) {
  const validated = AdmissionSchema.parse(input)
  try {
    const result = await admissionService.create(validated)
    revalidatePath('/admin/admissions')
    return { success: true, data: result }
  } catch (e) {
    return { success: false, error: 'Failed to create admission' }
  }
}
```
