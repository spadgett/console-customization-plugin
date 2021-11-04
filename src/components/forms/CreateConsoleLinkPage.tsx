import * as React from 'react';
import Helmet from 'react-helmet';
import { useHistory } from 'react-router';
import { consoleFetch } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionGroup,
  Alert,
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Form,
  FormGroup,
  Page,
  PageSection,
  TextInput,
  Title,
} from '@patternfly/react-core';
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon';

import { ConsoleLink } from '../../k8s/types';
import { referenceForObj } from '../../k8s/resources';

const locations: ConsoleLink['spec']['location'][] = [
  'ApplicationMenu',
  'HelpMenu',
  'UserMenu',
];

const CreateConsoleLinkPage = () => {
  const [name, setName] = React.useState('');
  const [text, setText] = React.useState('');
  const [location, setLocation] =
    React.useState<ConsoleLink['spec']['location']>('ApplicationMenu');
  const [href, setHref] = React.useState('');
  const [locationDropdownOpen, setLocationDropdownOpen] = React.useState(false);
  const [inFlight, setInFlight] = React.useState(false);
  const [error, setError] = React.useState('');
  const history = useHistory();

  const locationDropdownItems = locations.map((l) => {
    const onClick = () => {
      setLocation(l);
      setLocationDropdownOpen(false);
    };
    return (
      <DropdownItem key={l} component="button" onClick={onClick}>
        {l}
      </DropdownItem>
    );
  });

  const createLink = async () => {
    const link: ConsoleLink = {
      apiVersion: 'console.openshift.io/v1',
      kind: 'ConsoleLink',
      metadata: {
        name,
      },
      spec: {
        href,
        text,
        location,
      },
    };

    // TODO: Use `k8sCreate` when available in the SDK.
    const response = await consoleFetch(
      '/api/kubernetes/apis/console.openshift.io/v1/consolelinks/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(link),
      },
    );
    return response.json();
  };

  const cancel = () => {
    history.goBack();
  };

  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const created = await createLink();
      // FIXME: Use SDK method for building path when available.
      const path = `/k8s/cluster/${referenceForObj(created)}/${
        created.metadata.name
      }`;
      history.push(path);
    } catch (e) {
      setError(e.message || 'An error occurred');
      setInFlight(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create ConsoleLink</title>
      </Helmet>
      <Page
        additionalGroupedContent={
          <PageSection variant="light">
            <Title headingLevel="h1">Create ConsoleLink</Title>
          </PageSection>
        }
      >
        <PageSection variant="light">
          <Form isWidthLimited onSubmit={submit}>
            <FormGroup label="Name" fieldId="name" isRequired>
              <TextInput
                isRequired
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={setName}
              />
            </FormGroup>
            <FormGroup label="Location" fieldId="location" isRequired>
              <Dropdown
                toggle={
                  <DropdownToggle
                    id="toggle-id"
                    onToggle={setLocationDropdownOpen}
                    toggleIndicator={CaretDownIcon}
                  >
                    {location}
                  </DropdownToggle>
                }
                isOpen={locationDropdownOpen}
                dropdownItems={locationDropdownItems}
              />
            </FormGroup>
            <FormGroup label="Text" fieldId="text" isRequired>
              <TextInput
                isRequired
                type="text"
                id="text"
                name="text"
                value={text}
                onChange={setText}
              />
            </FormGroup>
            <FormGroup label="Link" fieldId="href" isRequired>
              <TextInput
                isRequired
                type="url"
                id="href"
                name="href"
                value={href}
                onChange={setHref}
              />
            </FormGroup>
            {error && (
              <Alert variant="danger" isInline title="Error creating link">
                {error}
              </Alert>
            )}
            <ActionGroup>
              <Button variant="primary" type="submit" isDisabled={inFlight}>
                Submit
              </Button>
              <Button variant="secondary" type="button" onClick={cancel}>
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        </PageSection>
      </Page>
    </>
  );
};

export default CreateConsoleLinkPage;
