import { ApplicationError } from '@/protocols';

export function notFoundError(customMessage?: string): ApplicationError {
    return {
        name: 'NotFoundError',
        message: customMessage || 'No result for this search!',
    };
}
