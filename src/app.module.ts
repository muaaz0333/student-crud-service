import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from './schema/student.schema';
import { StudentService } from './service/student.service';
import { StudentController } from './controllers/student.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
// import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    ClientsModule.register([
      {
        name: 'STUDENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL || 'amqp://guest:guest@localhost:5672'],
          queue: 'email-queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    AuthModule,
    // HttpModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class AppModule {}
