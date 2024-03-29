/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { UptimeMonitor } from '../../types';
import Typography from '@material-ui/core/Typography';

export const UptimeMonitorCheckType = ({
  uptimeMonitor,
}: {
  uptimeMonitor: UptimeMonitor;
}) => {
  switch (uptimeMonitor.region) {
    case 'EU':
      return (
        <Typography
          noWrap
          // eslint-disable-next-line no-restricted-syntax
        >{`${uptimeMonitor.checkType.toUpperCase()} 🇩🇪`}</Typography>
      );
    default:
      return (
        <Typography
          noWrap
          // eslint-disable-next-line no-restricted-syntax
        >{`${uptimeMonitor.checkType.toUpperCase()} 🇺🇸`}</Typography>
      );
  }
};
