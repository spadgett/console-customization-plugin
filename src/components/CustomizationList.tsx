import * as React from 'react';
import {
  ListPageHeader,
  ListPageBody,
  VirtualizedTable,
  useK8sWatchResource,
  K8sResourceCommon,
  TableData,
  RowProps,
  ResourceLink,
  TableColumn,
} from '@openshift-console/dynamic-plugin-sdk';

type CustomizationResource = {
  spec?: {
    displayName?: string;
    description?: string;
    href?: string;
    text?: string;
  }
} & K8sResourceCommon;

const resources = [
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleCLIDownload',
  },
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleExternalLogLink',
  },
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleLink',
  },
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleNotification',
  },
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleQuickStart',
  },
  {
    group: 'console.openshift.io',
    version: 'v1',
    kind: 'ConsoleYAMLSample',
  },
  {
    group: 'console.openshift.io',
    version: 'v1alpha1',
    kind: 'ConsolePlugin',
  },
];

// TODO: Use utility when available in the SDK.
const referenceFor = (group: string, version: string, kind: string) => `${group}~${version}~${kind}`;

// TODO: Use utility when available in the SDK.
const referenceForObj = (obj: K8sResourceCommon) => {
  // Assumes obj has an API group
  const [group, version] = obj.apiVersion.split('/');
  return referenceFor(group, version, obj.kind);
};

const columns: TableColumn<CustomizationResource>[] = [
  {
    title: 'Name',
    id: 'name',
  },
  {
    title: 'Kind',
    id: 'kind',
  },
  {
    title: 'Display Name',
    id: 'displayName',
  },
  {
    title: 'Link',
    id: 'link',
  },
];

const PodRow: React.FC<RowProps<CustomizationResource>> = ({ obj, activeColumnIDs }) => {
  const reference = referenceForObj(obj);
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <ResourceLink kind={reference} name={obj.metadata.name} namespace={obj.metadata.namespace} />
      </TableData>
     <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {obj.kind}
      </TableData>
     <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        {obj.spec?.displayName || '-'}
      </TableData>
     <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        {obj.spec?.href ? <a href={obj.spec.href}>{obj.spec.text || obj.spec.href}</a> : '-'}
      </TableData>
    </>
  );
};

type CustomizationTableProps = {
  data: any[];
  unfilteredData: any[];
  loaded: boolean;
  loadError?: any;
};

const CustomizationTable: React.FC<CustomizationTableProps> = ({ data, unfilteredData, loaded, loadError }) => {
  return (
    <VirtualizedTable<CustomizationResource>
      data={data}
      unfilteredData={unfilteredData}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={PodRow}
    />
  );
};

const CustomizationList: React.FC<{}> = () => {
  const watches = resources.map(({group, version, kind}) => {
    const [data, loaded, error] = useK8sWatchResource<CustomizationResource[]>({
      kind: referenceFor(group, version, kind),
      isList: true,
      namespaced: false,
    });
    if (error) {
      console.error('Could not load', kind, error);
    }
    return [data, loaded, error];
  });

  const data = watches.map(([list]) => list).flat();
  const loaded = watches.every(([, loaded, error]) => !!(loaded || error));

  return (
    <>
      <ListPageHeader title="Customization" />
      <ListPageBody>
        <CustomizationTable
          data={data}
          unfilteredData={data}
          loaded={loaded}
        />
      </ListPageBody>
    </>
  );
};

export default CustomizationList;
