import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import winston, { format } from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import LokiTransport from 'winston-loki';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('five-a-side-api'),
            ),
          }),
          new LokiTransport({
            host: config.get('grafana.loki.host'),
            basicAuth: `${config.get('grafana.loki.username')}:${config.get(
              'grafana.loki.password',
            )}`,
            labels: { app: 'five-a-side-api' },
            json: true,
            format: format.json(),
            replaceTimestamp: true,
            onConnectionError: (err) => console.error(err),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class LoggingModule {}
