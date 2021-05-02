import { Errors, ErrorException } from '@sotaoi/omni/errors';

// gate errors
Errors.InvalidRegisterRepository = class InvalidRegisterRepositoryError extends ErrorException {};

export { Errors };
