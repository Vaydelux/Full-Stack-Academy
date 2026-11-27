# P4 artifact extraction repair

Run 46003036078 failed both jobs before dependency installation or database access. Both downloaded artifact 15197098466 and reported the expected ZIP SHA-256 be91023acc95adddd555a57879019455f3ed952d0fe67e95facfeb4508d223d5. Logs show actions/download-artifact@v4 extracted the artifact under verified-prisma-lock/p4-prisma-lock-d6afc2cd3316139d3dda6af7d24d20a1f8f11b08 because merge-multiple defaults to false for ID-based selection. The validator then failed ENOENT for verified-prisma-lock/package.json.

Both download steps now set merge-multiple: true to flatten this single explicitly selected artifact into the expected directory. Artifact ID, source commit, digest checks, audit, restricted database and separated write/read-only job permissions are unchanged. The fix requires a new workflow execution; no migration or CRUD pass is claimed. The P1 review branch is untouched.
