import { Module } from '@nestjs/common';
import { IntegrateController } from './integrate.controller';
import { IntegrateService } from './integrate.service';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { I_INTEGRATE_SERVICE } from './interfaces';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GOOGLE_EVENT_CLIENT',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:4050',
          package: 'google_event.service.v1',
          protoPath: [
            join(
              process.cwd(),
              'node_modules/@ld3v/nqh-shared',
              'src/gRPC/proto/v1/google-event.service.proto',
            ),
          ],
        },
      },
    ]),
  ],
  controllers: [IntegrateController],
  providers: [
    {
      provide: I_INTEGRATE_SERVICE,
      useClass: IntegrateService,
    },
  ],
  exports: [I_INTEGRATE_SERVICE],
})
export class IntegrateModule {}
