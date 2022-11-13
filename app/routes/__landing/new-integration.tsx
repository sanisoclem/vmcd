import { Button } from '~/components/Button';
import { ensureValidUser } from '~/lib/utils';
import { Form, useTransition } from '@remix-run/react';
import { Fieldset } from '~/components/Fieldset';
import { InputRadio, InputText } from '~/components/Input';
import { IntegrationService } from '~server/integration';
import * as C from 'purify-ts';
import * as Model from '~/lib/model';
import { useLoaderDataStrict } from '~/hooks';

export const loaderDataCodec = C.array(Model.integrationMetadataCodec);

export const loader: CFLoaderFunction<unknown> = async ({ context }) => {
  const integrationTypes = IntegrationService.getIntegrationTypes();

  return loaderDataCodec.encode(integrationTypes);
};

export const action: CFActionFunction<{}> = async ({ request, context }) => {
  await ensureValidUser(context, request);
  // const form = await request.formData();

  // TODO: create the integration

  return {};
};

export default function NewLedger() {
  const transition = useTransition();
  const isLoading = transition.state === 'loading' || transition.state === 'submitting';
  const integrationTypes = useLoaderDataStrict(loaderDataCodec);

  return (
    <>
      <p className="my-4">Create a new integration.</p>
      <Form method="post" className="flex w-full items-center justify-center py-4">
        <div className="my-4 w-full max-w-md rounded-sm shadow">
          <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
            <InputText
              id="integrationName"
              label="Name"
              name="name"
              placeholder="a descriptive name"
              className="col-span-3"
            />
            <Fieldset legend="Integration Type" className="space-y-4">
              {integrationTypes.map((it) => (
                <InputRadio
                  key={it.id}
                  name="integrationType"
                  label={it.name}
                  value={it.id}
                  helpText={it.description}
                />
              ))}
            </Fieldset>
          </div>
          <div className="flex justify-end bg-gray-50 px-4 py-3 sm:px-6">
            <Button type="submit" className="inline-block" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Integration'
              )}
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}
