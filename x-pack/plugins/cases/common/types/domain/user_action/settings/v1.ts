/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as rt from 'io-ts';
import { SettingsRt } from '../../../../api';
import { UserActionTypes } from '../action/v1';

export const SettingsUserActionPayloadRt = rt.strict({ settings: SettingsRt });

export const SettingsUserActionRt = rt.strict({
  type: rt.literal(UserActionTypes.settings),
  payload: SettingsUserActionPayloadRt,
});
