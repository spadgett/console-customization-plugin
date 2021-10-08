# OpenShift Console Customizations Plugin

This project is a simple plugin that adds a Customizations nav item to the
Administrator perspective in OpenShift console. It requires OpenShift 4.9 to
use.

## Local development

1. `yarn build` to build the plugin, generating output to `dist` directory
2. `yarn http-server` to start an HTTP server hosting the generated assets

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
yarn http-server -a 127.0.0.1
```

See the plugin development section in
[Console Dynamic Plugins README](https://github.com/openshift/console/tree/master/frontend/packages/console-dynamic-plugin-sdk/README.md) for details
on how to run Bridge using local plugins.

## Deployment on cluster

You can deploy the plugin to a cluster by applying `oc-manifest.yaml`.

```sh
oc apply -f oc-manifest.yaml
```

Once deployed, edit the [Console
operator](https://github.com/openshift/console-operator) config and make sure
the plugin's name is listed in the `spec.plugins` sequence (add one if missing):

```sh
oc edit console.operator.openshift.io cluster
```

```yaml
# ...
spec:
  plugins:
    - console-customizations
# ...
```

## Docker image

Following commands should be executed in Console repository root.

1. Build the image:
   ```sh
   docker build -t quay.io/$USER/console-customization-plugin:latest .
   ```
2. Run the image:
   ```sh
   docker run -it -p 9001:9001 quay.io/$USER/console-customization-plugin:latest
   ```
3. Push the image to image registry:
   ```sh
   docker push quay.io/$USER/console-customization-plugin:latest
   ```

Update and apply `oc-manifest.yaml` to use a custom plugin image.
