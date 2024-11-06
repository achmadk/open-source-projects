import { describe, it, expect } from 'vitest'

import { Container, injectable, multiBindToService } from "../../src";

describe("Transitive bindings", () => {

  it("Should be able to bind to a service", () => {

    @injectable()
    class MySqlDatabaseTransactionLog {
      public time: number;
      public name: string;
      public constructor() {
        this.time = new Date().getTime();
        this.name = "MySqlDatabaseTransactionLog";
      }
    }

    @injectable()
    class DatabaseTransactionLog {
      public time!: number;
      public name!: string;
    }

    @injectable()
    class TransactionLog {
      public time!: number;
      public name!: string;
    }

    const container = new Container();
    container.bind(MySqlDatabaseTransactionLog).toSelf().inSingletonScope();
    container.bind(DatabaseTransactionLog).toService(MySqlDatabaseTransactionLog);
    container.bind(TransactionLog).toService(DatabaseTransactionLog);

    const mySqlDatabaseTransactionLog = container.get(MySqlDatabaseTransactionLog);
    const databaseTransactionLog = container.get(DatabaseTransactionLog);
    const transactionLog = container.get(TransactionLog);

    expect(mySqlDatabaseTransactionLog.name).toEqual("MySqlDatabaseTransactionLog");
    expect(databaseTransactionLog.name).toEqual("MySqlDatabaseTransactionLog");
    expect(transactionLog.name).toEqual("MySqlDatabaseTransactionLog");
    expect(mySqlDatabaseTransactionLog.time).toEqual(databaseTransactionLog.time);
    expect(databaseTransactionLog.time).toEqual(transactionLog.time);

  });

  it("Should be able to bulk bind to a service", () => {

    @injectable()
    class MySqlDatabaseTransactionLog {
      public time: number;
      public name: string;
      public constructor() {
        this.time = new Date().getTime();
        this.name = "MySqlDatabaseTransactionLog";
      }
    }

    @injectable()
    class DatabaseTransactionLog {
      public time!: number;
      public name!: string;
    }

    @injectable()
    class TransactionLog {
      public time!: number;
      public name!: string;
    }

    const container = new Container();
    const mbts = multiBindToService(container);
    container.bind(MySqlDatabaseTransactionLog).toSelf().inSingletonScope();
    mbts(MySqlDatabaseTransactionLog)(DatabaseTransactionLog, TransactionLog);

    const mySqlDatabaseTransactionLog = container.get(MySqlDatabaseTransactionLog);
    const databaseTransactionLog = container.get(DatabaseTransactionLog);
    const transactionLog = container.get(TransactionLog);

    expect(mySqlDatabaseTransactionLog.name).toEqual("MySqlDatabaseTransactionLog");
    expect(databaseTransactionLog.name).toEqual("MySqlDatabaseTransactionLog");
    expect(transactionLog.name).toEqual("MySqlDatabaseTransactionLog");
    expect(mySqlDatabaseTransactionLog.time).toEqual(databaseTransactionLog.time);
    expect(databaseTransactionLog.time).toEqual(transactionLog.time);

  });

});