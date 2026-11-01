import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { NodeEnv } from '@core/enum';
import * as _ from 'lodash';

@Injectable()
export class ErrorService {
  constructor(private readonly configService: ConfigService) {}
  message(err: string | object, i18n: I18nContext, stackTrace: any) {
    const errorMessage = _.isArray(err['message'])
      ? err['message'][0]
      : err['message'];
    switch (err['error']) {
      case 'Bad Request':
        return this.combine(errorMessage, i18n);
      case 'Forbidden':
        return this.combine(errorMessage, i18n);
      case 'Internal Server Error':
        if (this.configService.get('NODE_ENV') == NodeEnv.DEVELOPMENT) {
          return this.combineDev(errorMessage, i18n, stackTrace);
        }
        return this.combine(errorMessage, i18n);
      case 'Not Found':
        return this.combine(errorMessage, i18n);
      case 'Unauthorized':
        return this.combine(errorMessage, i18n);
      case 'Unprocessable Entity':
        return this.handleUnprocessEntity(err, i18n);
      default:
        return this.combine(errorMessage, i18n);
    }
  }

  private handleUnprocessEntity(error: string | object, i18n: I18nContext) {
    const transformedError = this.transform(error['message'], i18n).flat();

    return this.combine('CUS-0401', i18n, transformedError);
  }

  private transform(errors: ValidationError[], i18n: I18nContext) {
    const transformedError = errors.map((err: ValidationError) => {
      return Object.values(err.constraints).map((value: string) => {
        return Object.assign(
          i18n.t(`errors.${value}`, {
            args: { property: err.property },
          }),
          { field: err.property },
        );
      });
    });

    return transformedError;
  }

  private combine(err_msg: string, i18n: I18nContext, _errors: object[] = []) {
    const translation = i18n ? i18n.t(`errors.${err_msg}`) : null;
    if (
      !translation ||
      translation === `errors.${err_msg}` ||
      (typeof translation === 'string' && translation.startsWith('errors.'))
    ) {
      return { message: err_msg };
    }
    return typeof translation === 'object'
      ? Object.assign(translation, {})
      : { message: translation };
  }

  private combineDev(err_msg: string, i18n: I18nContext, stackTrace: any) {
    const translation = i18n ? i18n.t(`errors.${err_msg}`) : null;
    if (
      !translation ||
      translation === `errors.${err_msg}` ||
      (typeof translation === 'string' && translation.startsWith('errors.'))
    ) {
      return { message: err_msg, details: stackTrace };
    }
    return Object.assign(translation, {
      details: stackTrace,
    });
  }
}
