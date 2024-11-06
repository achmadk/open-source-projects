import { describe, it, expect, vi } from 'vitest'

import { injectable, inject, LazyServiceIdentifier, Container } from '../../src';
import { getDependencies } from '../../src/planning/reflection_utils';
import { MetadataReader } from "../../src/planning/metadata_reader";

describe('Reflection Utilities Unit Tests', () => {

    it('Should unwrap LazyServiceIdentifier in getConstructorArgsAsTarget', () => {

        interface Ninja {
            fight(): string;
        }

        interface Katana {
            hit(): string;
        }

        @injectable()
        class Katana implements Katana {
            public hit() {
                return "cut!";
            }
        }

        const TYPES = {
            Katana: Symbol.for("Katana"),
            Ninja: Symbol.for("Ninja"),
        };

        @injectable()
        class Ninja implements Ninja {

        private _katana: Katana;

        public constructor(
            @inject(new LazyServiceIdentifier(() => TYPES.Katana)) katana: Katana,
        ) {
            this._katana = katana;
        }

        public fight() { return this._katana.hit(); }

        }

        const container = new Container();
        container.bind<Ninja>(TYPES.Ninja).to(Ninja);
        container.bind<Katana>(TYPES.Katana).to(Katana);

        const unwrapSpy = vi.spyOn(LazyServiceIdentifier.prototype, 'unwrap');

        const dependencies = getDependencies(new MetadataReader(), Ninja);

        expect(dependencies.length).toEqual(1);
        expect(unwrapSpy).toHaveBeenCalled();
    });
});