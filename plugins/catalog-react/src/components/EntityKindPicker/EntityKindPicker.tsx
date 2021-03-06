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

import React, { useEffect, useState } from 'react';
import { Alert } from '@material-ui/lab';
import { useEntityListProvider } from '../../hooks';
import { EntityKindFilter } from '../../filters';

/**
 * Props for {@link EntityKindPicker}.
 *
 * @public
 */
export interface EntityKindPickerProps {
  initialFilter?: string;
  hidden: boolean;
}

/** @public */
export const EntityKindPicker = (props: EntityKindPickerProps) => {
  const { initialFilter, hidden } = props;

  const { updateFilters, queryParameters } = useEntityListProvider();
  const [selectedKind] = useState(
    [queryParameters.kind].flat()[0] ?? initialFilter,
  );

  useEffect(() => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : undefined,
    });
  }, [selectedKind, updateFilters]);

  if (hidden) return null;

  // TODO(timbonicus): This should load available kinds from the catalog-backend, similar to
  // EntityTypePicker.

  return <Alert severity="warning">Kind filter not yet available</Alert>;
};
