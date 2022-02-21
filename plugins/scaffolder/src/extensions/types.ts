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
import { ApiHolder } from '@backstage/core-plugin-api';
import { FieldValidation, FieldProps } from '@rjsf/core';

/**
 * Field validation type for Custom Field Extensions.
 *
 * @public
 */
export type CustomFieldValidator<T> =
  | ((data: T, field: FieldValidation) => void)
  | ((
      data: T,
      field: FieldValidation,
      context: { apiHolder: ApiHolder },
    ) => void);

/**
 * Type for the Custom Field Extension with the
 * name and components and validation function.
 *
 * @public
 */
export type FieldExtensionOptions<T = any> = {
  name: string;
  component: (props: FieldProps<T>) => JSX.Element | null;
  validation?: CustomFieldValidator<T>;
};

/**
 * Type for field extensions and being able to type
 * incoming props easier.
 *
 * @public
 */
export interface FieldExtensionComponentProps<
  ReturnValue,
  UiOptions extends {} = {},
> extends FieldProps<ReturnValue> {
  uiSchema: {
    'ui:options'?: UiOptions;
  };
}
