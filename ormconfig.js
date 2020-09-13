require('dotenv').config();
module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: 'barberdb',
    port: 5432,
    username: 'docker',
    password: 'docker',
    database: 'gobarber',
    entities:
      process.env.APP_ENV === 'local'
        ? ['./src/modules/**/infra/typeorm/entities/*.ts']
        : ['./dist/modules/**/infra/typeorm/entities/*.js'],
    migrations: [
      process.env.APP_ENV === 'local'
        ? './src/shared/infra/typeorm/migrations/*.ts'
        : './dist/shared/infra/typeorm/migrations/*.js',
    ],
    cli: {
      entitiesDir:
        process.env.APP_ENV === 'local'
          ? './src/modules/**/infra/typeorm/entities/*.ts'
          : './dist/modules/**/infra/typeorm/entities/*.js',
      migrationsDir:
        process.env.APP_ENV === 'local'
          ? './src/shared/infra/typeorm/migrations'
          : './dist/shared/infra/typeorm/migrations',
    },
  },
  {
    name: 'mongo',
    type: 'mongodb',
    host: 'barbermongo',
    port: 27017,
    username: 'root',
    password: '',
    database: 'gobarber',
    useUnifiedTopology: true,
    entities: [
      process.env.APP_ENV === 'local'
        ? './dist/modules/**/infra/typeorm/schemas/*.ts'
        : './dist/modules/**/infra/typeorm/schemas/*.js',
    ],
  },
];
