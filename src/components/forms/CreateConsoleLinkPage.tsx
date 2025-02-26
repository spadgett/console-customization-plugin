import * as React from 'react';
import Helmet from 'react-helmet';
import { useHistory } from 'react-router';
import { k8sCreate, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionGroup,
  Alert,
  Button,
  Form,
  FormGroup,
  FormHelperText,
  FormSelect,
  FormSelectOption,
  HelperText,
  HelperTextItem,
  PageSection,
  TextInput,
  Title,
} from '@patternfly/react-core';

import { ConsoleLink } from '../../k8s/types';
import { referenceFor } from '../../k8s/resources';

const locations: ConsoleLink['spec']['location'][] = [
  'ApplicationMenu',
  'HelpMenu',
  'UserMenu',
];

const group = 'console.openshift.io';
const version = 'v1';
const kind = 'ConsoleLink';
const reference = referenceFor(group, version, kind);

const CreateConsoleLinkPage = () => {
  const [model] = useK8sModel({ group, version, kind });
  const [name, setName] = React.useState('');
  const [text, setText] = React.useState('');
  const [location, setLocation] =
    React.useState<ConsoleLink['spec']['location']>('ApplicationMenu');
  const [href, setHref] = React.useState('');
  const [section, setSection] = React.useState('');
  const [inFlight, setInFlight] = React.useState(false);
  const [error, setError] = React.useState('');
  const history = useHistory();

  const createLink = async () => {
    const data: ConsoleLink = {
      apiVersion: 'console.openshift.io/v1',
      kind: 'ConsoleLink',
      metadata: {
        name,
      },
      spec: {
        href,
        text,
        location,
        ...(location === 'ApplicationMenu'
          ? {
              applicationMenu: {
                section,
              },
            }
          : {}),
      },
    };

    return await k8sCreate({ model, data });
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
      const path = `/k8s/cluster/${reference}/${created.metadata.name}`;
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
      <PageSection>
        <Title headingLevel="h1">Create ConsoleLink</Title>
      </PageSection>
      <PageSection>
        <Form isWidthLimited onSubmit={submit}>
          <FormGroup label="Name" fieldId="name" isRequired>
            <TextInput
              isRequired
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(_event, value) => setName(value)}
              placeholder="my-link"
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  Unique name for the link. This is not displayed to the user.
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
          <FormGroup label="Location" fieldId="location">
            <FormSelect
              value={location}
              onChange={(_event, value: ConsoleLink['spec']['location']) =>
                setLocation(value)
              }
              aria-label="FormSelect Input"
              ouiaId="BasicFormSelect"
            >
              {locations.map((option) => (
                <FormSelectOption key={option} value={option} label={option} />
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup label="Text" fieldId="text" isRequired>
            <TextInput
              isRequired
              type="text"
              id="text"
              name="text"
              value={text}
              onChange={(_event, value) => setText(value)}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>Label for the link.</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
          <FormGroup label="Link" fieldId="href" isRequired>
            <TextInput
              isRequired
              type="url"
              id="href"
              name="href"
              value={href}
              onChange={(_event, value) => setHref(value)}
              placeholder="https://www.example.com/"
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  Link URL. Must start with https://
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
          {location === 'ApplicationMenu' && (
            <FormGroup label="Section" fieldId="section" isRequired>
              <TextInput
                isRequired
                type="text"
                id="section"
                name="section"
                value={section}
                onChange={(_event, value) => setSection(value)}
              />
              <FormHelperText>
                <HelperText>
                  <HelperTextItem>
                    Section to use in the application launcher dropdown. Can be
                    any text.
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            </FormGroup>
          )}
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
    </>
  );
};

export default CreateConsoleLinkPage;
