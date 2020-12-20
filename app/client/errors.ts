import { Errors } from '@sotaoi/client/errors';

// gate errors
Errors.InvalidRegisterRepository = class InvalidRegisterRepositoryError extends Error {};

export { Errors };
