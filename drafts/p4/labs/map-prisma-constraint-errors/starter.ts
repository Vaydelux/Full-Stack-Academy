try {
  await createTask();
} catch (error) {
  return { status: 500, error: String(error) };
}
