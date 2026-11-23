// Vulnerable: unauthenticated body accepted and processed twice on retries.
app.post("/hooks/document", async (req, res) => {
  await processDocument(req.body.objectPath);
  res.sendStatus(200);
});
