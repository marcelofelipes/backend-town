import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // named import correto
import type { INestApplication } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });

    if (process.env.NODE_ENV === 'development') {
      this.$on('query' as never, (e: any) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Params: ${e.params}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    // Se desejar usar middleware de soft delete, chame-o aqui:
    // this.addSoftDeleteMiddleware();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
      await this.testConnection();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Database connection error', error.stack);
      }
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Database disconnection error', error.stack);
      }
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }

  private addSoftDeleteMiddleware() {
    this.$use((params: any, next: any) => {
      if (params.action === 'delete') {
        params.action = 'update';
        params.args.data = { deletedAt: new Date() };
      }
      return next(params);
    });
  }

  private async testConnection() {
    try {
      await this.$queryRaw`SELECT 1`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Database connection test failed', error.stack);
      }
      throw new Error('Unable to connect to database');
    }
  }
}

export type PrismaTransactionalClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;
