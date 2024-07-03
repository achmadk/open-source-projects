import type { ServiceIdentifier } from "../interfaces";

export type ServiceIdentifierOrFunc<T> =
	| ServiceIdentifier<T>
	| LazyServiceIdentifier<T>;

export class LazyServiceIdentifier<T = unknown> {
	private _cb: () => ServiceIdentifier<T>;
	public constructor(cb: () => ServiceIdentifier<T>) {
		this._cb = cb;
	}

	public unwrap() {
		return this._cb();
	}
}
