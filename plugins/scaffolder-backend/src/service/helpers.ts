/*
 * Copyright 2020 The Backstage Authors
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

import { CatalogApi } from '@backstage/catalog-client';
import {
  Entity,
  ANNOTATION_LOCATION,
  parseLocationRef,
  ANNOTATION_SOURCE_LOCATION,
  EntityRef,
  parseEntityRef,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { assertError, ConflictError, NotFoundError } from '@backstage/errors';
import {
  TemplateEntityV1beta2,
  TemplateEntityV1beta3,
} from '@backstage/plugin-scaffolder-common';
import fs from 'fs-extra';
import os from 'os';
import { Logger } from 'winston';

export async function getWorkingDirectory(
  config: Config,
  logger: Logger,
): Promise<string> {
  if (!config.has('backend.workingDirectory')) {
    return os.tmpdir();
  }

  const workingDirectory = config.getString('backend.workingDirectory');
  try {
    // Check if working directory exists and is writable
    await fs.access(workingDirectory, fs.constants.F_OK | fs.constants.W_OK);
    logger.info(`using working directory: ${workingDirectory}`);
  } catch (err) {
    assertError(err);
    logger.error(
      `working directory ${workingDirectory} ${
        err.code === 'ENOENT' ? 'does not exist' : 'is not writable'
      }`,
    );
    throw err;
  }
  return workingDirectory;
}

/**
 * Gets the base URL of the entity location that points to the source location
 * of the entity description within a repo. If there is not source location
 * or if it has an invalid type, undefined will be returned instead.
 *
 * For file locations this will return a `file://` URL.
 */
export function getEntityBaseUrl(entity: Entity): string | undefined {
  let location = entity.metadata.annotations?.[ANNOTATION_SOURCE_LOCATION];
  if (!location) {
    location = entity.metadata.annotations?.[ANNOTATION_LOCATION];
  }
  if (!location) {
    return undefined;
  }

  const { type, target } = parseLocationRef(location);
  if (type === 'url') {
    return target;
  } else if (type === 'file') {
    return `file://${target}`;
  }

  // Only url and file location are handled, as we otherwise don't know if
  // what the url is pointing to makes sense to use as a baseUrl
  return undefined;
}

/**
 * Will use the provided CatalogApi to go find the template entity ref that is provided with and additional token
 * Returns the first matching template, throws a NotFoundError or ConflictError if 0 or multiple templates are found.
 */
export async function findTemplate({
  entityRef,
  token,
  catalogApi,
}: {
  entityRef: EntityRef;
  token?: string;
  catalogApi: CatalogApi;
}): Promise<TemplateEntityV1beta3 | TemplateEntityV1beta2> {
  const parsedEntityRef = parseEntityRef(entityRef, {
    defaultKind: 'template',
    defaultNamespace: 'default',
  });
  const { items } = await catalogApi.getEntities(
    {
      filter: {
        kind: 'template',
        'metadata.name': parsedEntityRef.name,
        'metadata.namespace': parsedEntityRef.namespace,
      },
    },
    {
      token,
    },
  );

  const templates = items.filter(
    (entity): entity is TemplateEntityV1beta3 | TemplateEntityV1beta2 =>
      entity.kind === 'Template',
  );

  if (templates.length !== 1) {
    if (templates.length > 1) {
      throw new ConflictError('Templates lookup resulted in multiple matches');
    } else {
      throw new NotFoundError('Template not found');
    }
  }

  return templates[0];
}
