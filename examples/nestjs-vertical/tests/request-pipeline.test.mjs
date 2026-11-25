import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyRedGreen } from '../scripts/red-green.mjs';
import { BadRequestException, HttpException } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';

const load = (slug, variant) => import('../dist/' + slug + '/' + variant + '.js');
const checkBoth = (slug, probe, expectedFailure) => verifyRedGreen(load, slug, probe, expectedFailure);

function context(request) {
  return { switchToHttp: () => ({ getRequest: () => request }) };
}

test('11.02.01 middleware assigns distinct IDs and invokes next once', async () => {
  await checkBoth('middleware-execution', async ({ CorrelationMiddleware }) => {
    const middleware = new CorrelationMiddleware();
    const a = {}, b = {};
    let called = 0;
    middleware.use(a, {}, () => { called += 1; });
    middleware.use(b, {}, () => { called += 1; });
    assert.equal(called, 2);
    assert.match(a.correlationId, /^[0-9a-f-]{36}$/i);
    assert.notEqual(a.correlationId, b.correlationId);
  });
});

test('11.02.02 validation rejects bad input and trims valid titles', async () => {
  await checkBoth('pipes-zod-validation', async ({ CreateTaskPipe }) => {
    const pipe = new CreateTaskPipe();
    assert.deepEqual(pipe.transform({ title: '  task  ' }), { title: 'task' });
    assert.throws(() => pipe.transform({ title: 'x' }), BadRequestException);
    assert.throws(() => pipe.transform({ title: 42 }), BadRequestException);
  });
});

test('11.02.03 authorization fails closed and accepts intended header', async () => {
  await checkBoth('guards-authorization', async ({ AccessGuard }) => {
    const guard = new AccessGuard();
    assert.equal(guard.canActivate(context({ headers: {} })), false);
    assert.equal(guard.canActivate(context({ headers: { authorization: 'Bearer invalid' } })), false);
    assert.equal(guard.canActivate(context({ headers: { authorization: 'Bearer teaching-only' } })), true);
  });
});

test('11.02.04 interceptor invokes handler and preserves data with trace ID', async () => {
  await checkBoth('interceptors-tracing', async ({ TraceInterceptor }) => {
    let called = 0;
    const interceptor = new TraceInterceptor();
    const result = await firstValueFrom(interceptor.intercept(context({}), {
      handle: () => { called += 1; return of({ id: 't1' }); },
    }));
    assert.equal(called, 1);
    assert.deepEqual(result.data, { id: 't1' });
    assert.match(result.traceId, /^[0-9a-f-]{36}$/i);
  });
});

test('11.02.05 exception filter preserves status without leaking exception details', async () => {
  await checkBoth('exception-filters', async ({ SafeHttpFilter }) => {
    let code, body;
    const response = {
      status(value) { code = value; return this; },
      send(value) { body = value; },
    };
    new SafeHttpFilter().catch(
      new HttpException('secret internal details', 403),
      { switchToHttp: () => ({ getResponse: () => response }) },
    );
    assert.equal(code, 403);
    assert.deepEqual(body, { error: 'REQUEST_FAILED', statusCode: 403 });
    assert.doesNotMatch(JSON.stringify(body), /secret internal details/);
  });
});

test('11.02.08 permission guard denies anonymous and unauthorized requests', async () => {
  await checkBoth('guard-order-bug-hunt', async ({ ProtectedRouteGuard }) => {
    const guard = new ProtectedRouteGuard();
    assert.equal(guard.canActivate(context({})), false);
    assert.equal(guard.canActivate(context({ user: { permissions: [] } })), false);
    assert.equal(guard.canActivate(context({ user: { permissions: ['tasks:read'] } })), true);
  });
});


test('11.02.06 public response does not expose stored password hashes', async () => {
  await checkBoth('structured-responses', async ({ accountResponse }) => {
    const account = { id: 'u1', displayName: 'Student', passwordHash: 'sensitive-hash' };
    assert.deepEqual(accountResponse(account), { id: 'u1', displayName: 'Student' });
    assert.doesNotMatch(JSON.stringify(accountResponse(account)), /sensitive-hash/);
  });
});

test('11.02.07 concurrent AsyncLocalStorage requests never share context', async () => {
  await checkBoth('request-context', async ({ withRequest, requestId }) => {
    let allowFirst;
    const holdFirst = new Promise(resolve => { allowFirst = resolve; });
    let notifyStarted;
    const started = new Promise(resolve => { notifyStarted = resolve; });
    const first = withRequest('one', async () => {
      notifyStarted();
      await holdFirst;
      return requestId();
    });
    await started;
    const second = await withRequest('two', async () => requestId());
    allowFirst();
    assert.equal(second, 'two');
    assert.equal(await first, 'one');
    assert.equal(requestId(), undefined);
  });
});
