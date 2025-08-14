import { Memento } from 'vscode';
/**
 * InMemoryMemento is a simple, not thread-safe implementation of the Memento interface to store key-value pairs in memory in unit tests
 */
export class InMemoryMemento implements Memento {

    private readonly store: Map<string, any> = new Map<string, any>();

    keys(): string[] {
        return [...this.store.keys()];
    }

    get<T>(key: string, defaultValue?: T): T | undefined {
        const value = this.store.get(key) as T | undefined;

        return value ?? defaultValue;
    }

    update(key: string, value: any): Thenable<void> {
        this.store.set(key, value);
        return Promise.resolve();
    }
}
