# OpenShift Console Customizations Plugin

This project is a simple plugin that adds a Customizations nav item to the
Administrator perspective in OpenShift console. It requires OpenShift 4.10 to
use.

## Local development

1. `yarn install` to install dependencies
2. `yarn run build` to build the plugin, generating output to `dist` directory
3. `yarn run http-server` to start an HTTP server hosting the generated assets

```
Starting up http-server, serving ./dist
Available on:
  http://127.0.0.1:9001
  http://192.168.1.190:9001
  http://10.40.192.80:9001
Hit CTRL-C to stop the server
```

The server runs on port 9001 with caching disabled and CORS enabled. Additional
[server options](https://github.com/http-party/http-server#available-options) can be passed to
the script, for example:

```sh
yarn run http-server -a 127.0.0.1
```

See the plugin development section in
[Console Dynamic Plugins README](https://github.com/openshift/console/tree/master/frontend/packages/console-dynamic-plugin-sdk/README.md) for details
on how to run Bridge using local plugins.

## Deployment on cluster

You can deploy the plugin to a cluster by applying `oc-manifest.yaml`.

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

Update and apply `oc-manifest.yaml` to use a custom plugin image.
