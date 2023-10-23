import { ApplicationError } from '@/protocols';

export function cannotListHotelsError(customMessage?: string): ApplicationError {
    return {
        name: 'CannotListHotelsError',
        message: customMessage || 'Cannot list hotels!',
    };
}
