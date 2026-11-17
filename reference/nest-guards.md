# Reference — NestJS `CanActivate` / Guards

**Category:** Backend authorization · **Status:** authored reference draft · **Canonical:** https://docs.nestjs.com/guards

## At a glance

Guards decide whether a request can reach a route handler. Authentication guards can check a valid user identity; object-level authorization usually needs additional checks within a policy-aware service.

## Syntax

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class DemoGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return Boolean(context.switchToHttp().getRequest().user);
  }
}
```

**Important:** This assumes a separate trusted authentication component has already populated `request.user`. It is not a complete authentication solution or a substitute for JWT verification.

## Common mistakes

- Treating any authenticated request as authorized for any record ID.
- Trusting unverified user IDs from request parameters or body.
- Using a global guard without registering DI correctly.
- Forgetting authorization on WebSocket and asynchronous operations.

**Related:** `@UseGuards`, `APP_GUARD`, OWASP BOLA, resource authorization, lesson 15.02.04.
