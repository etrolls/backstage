/*
 * Copyright 2022 The Backstage Authors
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
import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

interface ContextInterface {
  projectId?: number;
  setProjectId?: Dispatch<SetStateAction<number | undefined>>;
  apiKey?: string;
  setApiKey?: Dispatch<SetStateAction<string>>;
}

export const Context = React.createContext<ContextInterface>({});

export const ContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [projectId, setProjectId] = useState<number>();
  const [apiKey, setApiKey] = useState<string>('');

  return (
    <Context.Provider
      value={{
        projectId,
        setProjectId,
        apiKey,
        setApiKey,
      }}
    >
      {children}
    </Context.Provider>
  );
};
