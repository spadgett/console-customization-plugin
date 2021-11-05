import * as React from 'react';
import Helmet from 'react-helmet';
import { useHistory } from 'react-router';
import { k8sCreate, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionGroup,
  Alert,
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Form,
  FormGroup,
  FormSection,
  Grid,
  Page,
  PageSection,
  TextInput,
  Title,
} from '@patternfly/react-core';
import CaretDownIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon';

import { ConsoleNotification } from '../../k8s/types';
import { referenceFor } from '../../k8s/resources';

const locations: ConsoleNotification['spec']['location'][] = [
  'BannerTop',
  'BannerBottom',
  'BannerTopBottom',
];

const reference = referenceFor(
  'console.openshift.io',
  'v1',
  'ConsoleNotification',
);

const CreateConsoleNotificationPage = () => {
  const [model] = useK8sModel(reference);
  const [name, setName] = React.useState('');
  const [text, setText] = React.useState('');
  const [location, setLocation] =
    React.useState<ConsoleNotification['spec']['location']>('BannerTop');
  const [color, setColor] = React.useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = React.useState('#004b95');
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

  return (
    <>
      <Helmet>
        <title>Create ConsoleNotification</title>
      </Helmet>
      <Page
        additionalGroupedContent={
          <PageSection variant="light">
            <Title headingLevel="h1">Create ConsoleNotification</Title>
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
            <FormGroup label="Location" fieldId="location">
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
                <FormGroup
                  label="Background"
                  fieldId="backgroundColor"
                  isInline
                >
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
                    {text || 'Your text here...'}
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
      </Page>
    </>
  );
};

export default CreateConsoleNotificationPage;
