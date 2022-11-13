import { IntegrationMetadata, makeGraph, nodes, ports } from '~/lib/model/integration';

export const metadata: IntegrationMetadata = {
  id: 'abcd1234efefe-14',
  name: 'File VMCD Integration',
  description: 'This is a very simple test integration type'
};

export interface Config {
  schedule: string;
  scheduleTimezone: string;
  inputFiles: Record<string, StagingFile>;
  destinations: Record<string, StagingFile>;
  schemas: Record<string, string[]>;
  refData: Record<string, Array<Record<string, string>>>;
}

type StagingFile =
  | {
      type: 'r2';
      pathExp: string;
      accessKey: string;
      accessSecret: string;
    }
  | {
      type: 's3';
      pathExp: string;
      accessKey: string;
      accessSecret: string;
    }
  | {
      type: 'azure';
      pathExp: string;
      connectionString: string;
    };

export const graphSpec = (config: Config) =>
  makeGraph(
    config,
    {
      number: ports.number(),
      string: ports.string(),
      bytes: ports.bytes()
    },
    (ports) =>
      nodes.makeRoot(
        'Upload',
        'Re-uploads the file to the staging area',
        {
          data: ports.bytes.describe('Data', 'Data to upload'),
          fileName: ports.string.describe('File Name', 'File name of the file')
        },
        uploadFile
      ),
    (ports) => ({
      getFile: nodes.makeNode(
        'Get File',
        'Gets an input file',
        {
          fileId: ports.string.describe(
            'Input File',
            'The file id of the input file to get (this is temporary, it should be a predefined list calculated from the config)'
          )
        },
        {
          data: ports.bytes.describe('Data', 'The raw byte stream'),
          fileName: ports.string.describe('File Name', 'The full file name')
        },
        getFile
      ),
      concat: nodes.makeNode(
        'Concatenate',
        'Concatenates two strings',
        {
          input1: ports.string.describe('Input1', ''),
          input2: ports.string.describe('Input2', '')
        },
        {
          combined: ports.string.describe('Output', 'The combined string')
        },
        concat
      )
    })
  );

const concat = async (input: { input1: string; input2: string }): Promise<{ combined: string }> => {
  return { combined: `${input.input1}${input.input2}` };
};

const getFile = async (input: {
  fileId: string;
}): Promise<{ data: Uint8Array; fileName: string }> => {
  throw new Error();
};

const uploadFile = async (input: { data: Uint8Array; fileName: string }): Promise<undefined> => {
  return undefined;
};
