# NODE_IMAGE must be a locally present, reviewed node:24 digest, not a floating tag.
ARG NODE_IMAGE
FROM ${NODE_IMAGE}
WORKDIR /app
COPY --chown=10001:10001 serve.mjs service.mjs resilience.mjs telemetry.mjs ./
USER 10001:10001
ENV ACADEMY_LAB_PORT=8080
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 CMD ["node","-e","fetch('http://127.0.0.1:8080/health').then(r=>{if(!r.ok)process.exitCode=1}).catch(()=>{process.exitCode=1})"]
CMD ["node","serve.mjs"]
