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
  FormSection,
  FormSelect,
  FormSelectOption,
  Grid,
  HelperText,
  HelperTextItem,
  PageSection,
  TextInput,
  Title,
} from '@patternfly/react-core';

import { ConsoleNotification } from '../../k8s/types';
import { referenceFor } from '../../k8s/resources';

const locations: ConsoleNotification['spec']['location'][] = [
  'BannerTop',
  'BannerBottom',
  'BannerTopBottom',
];

const group = 'console.openshift.io';
const version = 'v1';
const kind = 'ConsoleNotification';
const reference = referenceFor(group, version, kind);

const CreateConsoleNotificationPage = () => {
  const [model] = useK8sModel({ group, version, kind });
  const [name, setName] = React.useState('');
  const [text, setText] = React.useState('');
  const [location, setLocation] =
    React.useState<ConsoleNotification['spec']['location']>('BannerTop');
  const [color, setColor] = React.useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = React.useState('#004b95');
  const [inFlight, setInFlight] = React.useState(false);
  const [error, setError] = React.useState('');
  const history = useHistory();

  const createNotification = async () => {
    const data: ConsoleNotification = {
      apiVersion: 'console.openshift.io/v1',
      kind: 'ConsoleNotification',
      metadata: {
        name,
      },
      spec: {
        backgroundColor,
        color,
        location,
        text,
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
      const created = await createNotification();
      // FIXME: Use SDK method for building path when available.
      const path = `/k8s/cluster/${reference}/${created.metadata.name}`;
      history.push(path);
    } catch (e) {
      setError(e.message || 'An error occurred');
      setInFlight(false);
    }
  };

  const textPlaceholder = 'Your message here...';
  return (
    <>
      <Helmet>
        <title>Create ConsoleNotification</title>
      </Helmet>
      <PageSection>
        <Title headingLevel="h1">Create ConsoleNotification</Title>
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
              placeholder="my-notification"
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
              onChange={(
                _event,
                value: ConsoleNotification['spec']['location'],
              ) => setLocation(value)}
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
              placeholder={textPlaceholder}
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>Message to show the user.</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
          <FormSection title="Colors">
            <Grid hasGutter md={6}>
              <FormGroup label="Foreground" fieldId="color" isInline>
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.currentTarget.value)}
                />
              </FormGroup>
              <FormGroup label="Background" fieldId="backgroundColor" isInline>
                <input
                  type="color"
                  id="backgroundColor"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.currentTarget.value)}
                />
              </FormGroup>
            </Grid>
          </FormSection>
          <FormSection title="Preview">
            <div
              className="co-global-notification"
              data-test="test-BannerTop"
              style={{ backgroundColor, color }}
            >
              <div className="co-global-notification__content">
                <p className="co-global-notification__text">
                  {text || textPlaceholder}
                </p>
              </div>
            </div>
          </FormSection>
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

export default CreateConsoleNotificationPage;
