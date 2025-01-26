import dayjs from 'dayjs';

export type DateTimeUnit = 's' | 'h' | 'd' | 'm' | 'y';
export type TimeAndUnit = { value: number; unit: DateTimeUnit };

export function parseTime(time: string): TimeAndUnit {
  const regex = /^(\d+)([shdmy])/;
  const match = regex.exec(time);

  if (!match) {
    new TypeError(`Unable to parse "${time}" as time`);
  }

  const [, valueRaw, unitRaw] = match;
  const value = parseInt(valueRaw, 10);
  const unit = unitRaw as DateTimeUnit;

  if (isNaN(value)) {
    throw new TypeError(`Unable to parse "${value}" as number`);
  }

  return { value, unit };
}

export function getExpiresIn(value: string): Date {
  const timeValue = parseTime(value);
  return dayjs().add(timeValue.value, timeValue.unit).toDate();
}

export function getApplicationUrl(host: string, port: number, prefix: string): string {
  return `http://${host}:${port}/${prefix}`;
}

export function getMongoConnectionString({
  username,
  password,
  host,
  port,
  databaseName,
  authDatabase,
}): string {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
}

export function getRabbitMQConnectionString({ user, password, host, port }): string {
  return `amqp://${user}:${password}@${host}:${port}`;
}
