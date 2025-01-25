export class ValidationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}