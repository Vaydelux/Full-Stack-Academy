# NestJS request pipeline — practical reference

Companion to 11.02.01–08. Source-only reference, not a published lesson.

| API | Purpose | Common mistake |
|---|---|---|
| Middleware | Request metadata before route handling | Treating request IDs as identity |
| CanActivate | Authentication/authorization gate | Assuming DTO pipes already ran |
| PipeTransform | Parse and validate route input | Trusting TypeScript types at runtime |
| NestInterceptor | Wrap downstream execution and measure outcomes | Logging secrets or swallowing errors |
| ExceptionFilter | Translate uncaught exceptions | Returning internal stack traces |
| ExecutionContext | Inspect handler and transport | Assuming all transports are HTTP |

Normal HTTP order: middleware, guards, inbound interceptors, pipes, controller/service, outbound interceptors. Uncaught exceptions may enter filters. Guards run before pipes: parse and validate any raw route parameter needed for authorization explicitly.

## Practical contract

POST /tasks accepts a title and returns 201 only after persistence. Invalid input returns 400; unauthenticated requests 401; forbidden access 403; conflicting writes 409 or 412 depending on contract. A guard checks identity and policy, while the service enforces resource ownership in its database query. Use parameterized SQL and do not expose internal errors.

## Debugging exercise

Instrument middleware, guard, interceptor, pipe and handler with a request-scoped trace. Send valid, malformed and unauthorized requests. Predict which stages execute and verify with actual Nest integration tests. Add a rejected service promise and check the exception response. Never log tokens or request bodies by default.

Official references: https://docs.nestjs.com/faq/request-lifecycle and https://docs.nestjs.com/guards and https://docs.nestjs.com/pipes
