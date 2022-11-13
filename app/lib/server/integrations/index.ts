import * as fileVmcd from './fileVmcd';

export const integrations = {
  [fileVmcd.metadata.id]: {
    meta: fileVmcd.metadata,
    spec: fileVmcd.graphSpec
  }
};

export const integrationList = [fileVmcd.metadata];
