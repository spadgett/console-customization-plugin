# OpenShift Console Customizations Plugin

This project is a simple plugin that adds a Customizations nav item to the
Administrator perspective in OpenShift console. It requires OpenShift 4.10 to
use.

## Local development

1. `yarn install`
2. `yarn run start`

The server runs on port 9001 with CORS enabled.

See the plugin development section in
[Console Dynamic Plugins README](https://github.com/openshift/console/tree/master/frontend/packages/console-dynamic-plugin-sdk/README.md)
for details on how to run OpenShift console using local plugins.

## Deployment on cluster

You can deploy the plugin to a cluster by applying `manifest.yaml`.

```sh
oc apply -f manifest.yaml
```

Once deployed, patch the
[Console operator](https://github.com/openshift/console-operator)
config to enable the plugin.

```sh
oc patch consoles.operator.openshift.io cluster --patch '{ "spec": { "plugins": ["console-customization"] } }' --type=merge
```

## Docker image

1. Build the image:
   ```sh
   docker build -t quay.io/$USER/console-customization-plugin:latest .
   ```
2. Run the image:
   ```sh
   docker run -it --rm -d -p 9001:80 quay.io/$USER/console-customization-plugin:latest
   ```
3. Push the image to image registry:
   ```sh
   docker push quay.io/$USER/console-customization-plugin:latest
   ```

Update and apply `manifest.yaml` to use a custom plugin image.
