import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class GatewayConfiguration {
  @IsString()
  @IsUrl({ require_tld: false, protocols: ['http', 'https'] })
  account: string;

  @IsString()
  @IsUrl({ require_tld: false, protocols: ['http', 'https'] })
  blog: string;

  @IsString()
  @IsUrl({ require_tld: false, protocols: ['http', 'https'] })
  file: string;

  @IsString()
  @IsUrl({ require_tld: false, protocols: ['http', 'https'] })
  notify: string;
}
