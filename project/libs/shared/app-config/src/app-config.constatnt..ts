export enum ConfigSpace {
  App = 'application',
  Mongo = 'db',
  Mail = 'mail',
  Rabbit = 'rabbit',
}

export enum ConfigKey {
  Environment = 'environment',
  Host = 'host',
  Port = 'port',
  Title = 'title',
  User = 'user',
  Password = 'password',
  Name = 'name',
  From = 'from',
  AuthBase = 'authBase',
  Queue = 'queue',
  Exchange = 'exchange',
  AppHost = `${ConfigSpace.App}.${ConfigKey.Host}`,
  AppPort = `${ConfigSpace.App}.${ConfigKey.Port}`,
  AppTitle = `${ConfigSpace.App}.${ConfigKey.Title}`,
}
