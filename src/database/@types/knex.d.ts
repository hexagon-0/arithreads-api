import User from "../models/user";

declare module 'knex/types/tables' {
  interface Tables {
    users: User
  }
}
