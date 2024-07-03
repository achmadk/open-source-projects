import { KEY_NOT_FOUND, NULL_ARGUMENT } from "../constants/error_msgs";
import type {
	Lookup as LookupInterface,
	ServiceIdentifier,
} from "../interfaces";
import { isClonable } from "../utils";

export class Lookup<T> implements LookupInterface<T> {
	// dictionary used store multiple values for each key <key>
	private _map: Map<ServiceIdentifier, T[]>;

	public constructor() {
		this._map = new Map<ServiceIdentifier, T[]>();
	}

	public getMap() {
		return this._map;
	}

	// adds a new entry to _map
	public add(serviceIdentifier: ServiceIdentifier, value: T): void {
		if (serviceIdentifier === null || serviceIdentifier === undefined) {
			throw new Error(NULL_ARGUMENT);
		}

		if (value === null || value === undefined) {
			throw new Error(NULL_ARGUMENT);
		}

		const entry = this._map.get(serviceIdentifier);
		if (entry !== undefined) {
			entry.push(value);
		} else {
			this._map.set(serviceIdentifier, [value]);
		}
	}

	// gets the value of a entry by its key (serviceIdentifier)
	public get(serviceIdentifier: ServiceIdentifier): T[] {
		if (serviceIdentifier === null || serviceIdentifier === undefined) {
			throw new Error(NULL_ARGUMENT);
		}

		const entry = this._map.get(serviceIdentifier);

		if (entry !== undefined) {
			return entry;
		}
		throw new Error(KEY_NOT_FOUND);
	}

	// removes a entry from _map by its key (serviceIdentifier)
	public remove(serviceIdentifier: ServiceIdentifier): void {
		if (serviceIdentifier === null || serviceIdentifier === undefined) {
			throw new Error(NULL_ARGUMENT);
		}

		if (!this._map.delete(serviceIdentifier)) {
			throw new Error(KEY_NOT_FOUND);
		}
	}

	removeIntersection(lookup: LookupInterface<T>): void {
		this.traverse(
			(serviceIdentifier: ServiceIdentifier<unknown>, value: T[]) => {
				const lookupActivations = lookup.hasKey(serviceIdentifier)
					? lookup.get(serviceIdentifier)
					: undefined;
				if (lookupActivations !== undefined) {
					const filteredValues = value.filter(
						(lookupValue) =>
							!lookupActivations.some(
								(moduleActivation) => lookupValue === moduleActivation,
							),
					);

					this._setValue(serviceIdentifier, filteredValues);
				}
			},
		);
	}

	public removeByCondition(condition: (item: T) => boolean): T[] {
		const removals: T[] = [];
		this._map.forEach((entries, key) => {
			const updatedEntries: T[] = [];

			for (const entry of entries) {
				const remove = condition(entry);
				if (remove) {
					removals.push(entry);
				} else {
					updatedEntries.push(entry);
				}
			}

			this._setValue(key, updatedEntries);
		});

		return removals;
	}

	// returns true if _map contains a key (serviceIdentifier)
	public hasKey(serviceIdentifier: ServiceIdentifier): boolean {
		if (serviceIdentifier === null || serviceIdentifier === undefined) {
			throw new Error(NULL_ARGUMENT);
		}

		return this._map.has(serviceIdentifier);
	}

	// returns a new Lookup instance; note: this is not a deep clone, only Lookup related data structure (dictionary) is
	// cloned, content remains the same
	public clone(): LookupInterface<T> {
		const copy = new Lookup<T>();

		this._map.forEach((value, key) => {
			// biome-ignore lint/complexity/noForEach: <explanation>
			value.forEach((b) => copy.add(key, isClonable<T>(b) ? b.clone() : b));
		});

		return copy;
	}

	public traverse(func: (key: ServiceIdentifier, value: T[]) => void): void {
		this._map.forEach((value, key) => {
			func(key, value);
		});
	}

	private _setValue(
		serviceIdentifier: ServiceIdentifier<unknown>,
		value: T[],
	): void {
		if (value.length > 0) {
			this._map.set(serviceIdentifier, value);
		} else {
			this._map.delete(serviceIdentifier);
		}
	}
}
