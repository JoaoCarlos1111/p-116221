
// Error handling middleware

export const notFoundHandler = (req: any, res: any, next: any) => {
  res.status(404).json({ error: 'Resource not found' });
};

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
};
