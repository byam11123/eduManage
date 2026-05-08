# New Module Workflow
description: Scaffolds a complete new EduManage module from schema to UI. Invoke with /new-module

## Steps

1. Ask the user: What is the module name, what data does it store, and which existing module is most similar to it?

2. Apply the `new-module` skill.

3. Read `prisma/schema.prisma` via Prisma MCP to understand existing model conventions before writing the new model.

4. Add the Prisma model with all required fields (organizationId, branchId, createdAt, updatedAt, deletedAt). Apply `prisma-migration` skill to run the migration safely.

5. Create the TypeScript types and Zod schemas.

6. Create the service file in `src/lib/services/`. Implement getAll, getById, create, update, softDelete.

7. Create Server Actions in `src/app/admin/[module]/actions.ts`.

8. Scaffold UI pages: list page (TanStack Table), detail page, new/create page. Follow the admissions module pattern.

9. Create the data fetching hook in `src/hooks/`.

10. Add the module to sidebar navigation.

11. Update `GEMINI.md` module status matrix.

12. Output a walkthrough of all files created and their purpose.
