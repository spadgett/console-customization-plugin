import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

// Union type for all console.openshift.io customization resources.
export type CustomizationResource = {
  spec?: {
    displayName?: string;
    description?: string;
    href?: string;
    text?: string;
    link?: {
      href?: string;
      text?: string;
    };
    location?: string;
  };
} & K8sResourceCommon;

export type ConsoleLink = {
  spec: {
    href: string;
    location:
      | 'ApplicationMenu'
      | 'HelpMenu'
      | 'UserMenu'
      | 'NamespaceDashboard';
    text: string;
  };
} & K8sResourceCommon;
