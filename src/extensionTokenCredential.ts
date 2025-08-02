import { CachingAzureCliCredential } from './CachingAzureCliCredential';
import { TokenCredential           } from '@azure/identity';

export function resolveTokenProvider(
    onLogMessage        : (message: string) => void, 
    onInformationMessage: (message: string) => void
): TokenCredential {
    return new CachingAzureCliCredential(
        (message: string) => {
            onLogMessage(`Authenticate : ${message}`);
        },
        (message: string) => {
            onLogMessage        (`Authenticate : ${message}`);
            onInformationMessage(`Authenticate : ${message}`);
        }
    );
}
