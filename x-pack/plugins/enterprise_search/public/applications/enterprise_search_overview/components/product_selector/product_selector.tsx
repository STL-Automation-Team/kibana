/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import { useValues } from 'kea';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiTitle } from '@elastic/eui';
import { Chat } from '@kbn/cloud-chat-plugin/public';
import { i18n } from '@kbn/i18n';

import {
  APP_SEARCH_PLUGIN,
  ELASTICSEARCH_PLUGIN,
  WORKPLACE_SEARCH_PLUGIN,
} from '../../../../../common/constants';
import { AddContentEmptyPrompt } from '../../../shared/add_content_empty_prompt';
import { docLinks } from '../../../shared/doc_links';
import { ErrorStateCallout } from '../../../shared/error_state';
import { HttpLogic } from '../../../shared/http';
import { KibanaLogic } from '../../../shared/kibana';
import { SetSearchChrome as SetPageChrome } from '../../../shared/kibana_chrome';
import { SendEnterpriseSearchTelemetry as SendTelemetry } from '../../../shared/telemetry';

import { EnterpriseSearchOverviewPageTemplate } from '../layout';
import { ProductCard } from '../product_card';
import { SetupGuideCta } from '../setup_guide';
import { TrialCallout } from '../trial_callout';

interface ProductSelectorProps {
  access: {
    hasAppSearchAccess?: boolean;
    hasWorkplaceSearchAccess?: boolean;
  };
  isWorkplaceSearchAdmin: boolean;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  access,
  isWorkplaceSearchAdmin,
}) => {
  const { hasAppSearchAccess, hasWorkplaceSearchAccess } = access;
  const { config } = useValues(KibanaLogic);
  const { errorConnectingMessage } = useValues(HttpLogic);

  const showErrorConnecting = !!(config.host && errorConnectingMessage);
  // The create index flow does not work without ent-search, when content is updated
  // to no longer rely on ent-search we can always show the Add Content component
  const showAddContent = config.host && !errorConnectingMessage;

  // If Enterprise Search hasn't been set up yet, show all products. Otherwise, only show products the user has access to
  const shouldShowAppSearchCard = (!config.host && config.canDeployEntSearch) || hasAppSearchAccess;
  const shouldShowWorkplaceSearchCard =
    (!config.host && config.canDeployEntSearch) || hasWorkplaceSearchAccess;

  const WORKPLACE_SEARCH_URL = isWorkplaceSearchAdmin
    ? WORKPLACE_SEARCH_PLUGIN.URL
    : WORKPLACE_SEARCH_PLUGIN.NON_ADMIN_URL;

  return (
    <EnterpriseSearchOverviewPageTemplate
      restrictWidth
      pageHeader={{
        pageTitle: i18n.translate('xpack.enterpriseSearch.overview.pageTitle', {
          defaultMessage: 'Welcome to Search',
        }),
      }}
    >
      <SetPageChrome />
      <SendTelemetry action="viewed" metric="overview" />
      <TrialCallout />
      {showAddContent && (
        <>
          <AddContentEmptyPrompt
            title={i18n.translate('xpack.enterpriseSearch.overview.emptyPromptTitle', {
              defaultMessage: 'Add data and start searching',
            })}
            buttonLabel={i18n.translate('xpack.enterpriseSearch.overview.emptyPromptButtonLabel', {
              defaultMessage: 'Create an Elasticsearch index',
            })}
          />
          <EuiSpacer size="xxl" />
        </>
      )}
      {showErrorConnecting && (
        <>
          <SendTelemetry action="error" metric="cannot_connect" />
          <ErrorStateCallout />
        </>
      )}
      <EuiSpacer size="xxl" />
      <EuiTitle>
        <h3>
          {i18n.translate('xpack.enterpriseSearch.overview.productSelector.title', {
            defaultMessage: 'Search experiences for every use case',
          })}
        </h3>
      </EuiTitle>
      <EuiSpacer size="xl" />
      <EuiFlexGroup direction="column" gutterSize="m">
        <EuiFlexItem>
          <ProductCard
            data-test-subj="productCard-elasticsearch"
            cta={i18n.translate('xpack.enterpriseSearch.elasticsearch.productCardCTA', {
              defaultMessage: 'View the setup guide',
            })}
            description={i18n.translate(
              'xpack.enterpriseSearch.elasticsearch.productCardDescription',
              {
                defaultMessage:
                  'Ideal for bespoke applications, Elasticsearch helps you build highly customizable search and offers many different ingestion methods.',
              }
            )}
            features={[
              i18n.translate('xpack.enterpriseSearch.elasticsearch.features.integrate', {
                defaultMessage: 'Integrate with databases, websites, and more',
              }),
              i18n.translate('xpack.enterpriseSearch.elasticsearch.features.buildTooling', {
                defaultMessage: 'Build custom tooling',
              }),
              i18n.translate(
                'xpack.enterpriseSearch.elasticsearch.features.buildSearchExperiences',
                {
                  defaultMessage: 'Build custom search experiences',
                }
              ),
            ]}
            emptyCta
            icon="logoElasticsearch"
            name={ELASTICSEARCH_PLUGIN.NAME}
            productId={ELASTICSEARCH_PLUGIN.ID}
            resourceLinks={[
              {
                label: i18n.translate(
                  'xpack.enterpriseSearch.elasticsearch.resources.gettingStartedLabel',
                  {
                    defaultMessage: 'Getting started with Elasticsearch',
                  }
                ),
                to: docLinks.start,
              },
              {
                label: i18n.translate(
                  'xpack.enterpriseSearch.elasticsearch.resources.createNewIndexLabel',
                  {
                    defaultMessage: 'Create a new index',
                  }
                ),
                to: docLinks.start,
              },
              {
                label: i18n.translate(
                  'xpack.enterpriseSearch.elasticsearch.resources.languageClientLabel',
                  {
                    defaultMessage: 'Set up a language client',
                  }
                ),
                to: docLinks.languageClients,
              },
              {
                label: i18n.translate(
                  'xpack.enterpriseSearch.elasticsearch.resources.searchUILabel',
                  {
                    defaultMessage: 'Search UI for Elasticsearch',
                  }
                ),
                to: docLinks.searchUIElasticsearch,
              },
            ]}
            url={ELASTICSEARCH_PLUGIN.URL}
          />
        </EuiFlexItem>
        {shouldShowAppSearchCard && (
          <EuiFlexItem>
            <ProductCard
              data-test-subj="productCard-appSearch"
              cta={i18n.translate('xpack.enterpriseSearch.appSearch.productCardCTA', {
                defaultMessage: 'Open App Search',
              })}
              description={i18n.translate(
                'xpack.enterpriseSearch.appSearch.productCardDescription',
                {
                  defaultMessage:
                    'Ideal for apps and websites, App Search helps you design, deploy, and manage powerful search experiences.',
                }
              )}
              features={[
                i18n.translate('xpack.enterpriseSearch.appSearch.features.ingest', {
                  defaultMessage: 'Ingest with a web crawler, API, or Elasticsearch',
                }),
                i18n.translate('xpack.enterpriseSearch.appSearch.features.managementDashboards', {
                  defaultMessage: 'Search management dashboards',
                }),
                i18n.translate('xpack.enterpriseSearch.appSearch.features.searchApis', {
                  defaultMessage: 'Search-optimized APIs',
                }),
              ]}
              icon="logoAppSearch"
              name={APP_SEARCH_PLUGIN.NAME}
              productId={APP_SEARCH_PLUGIN.ID}
              resourceLinks={[
                {
                  label: i18n.translate(
                    'xpack.enterpriseSearch.appSearch.resources.gettingStartedLabel',
                    {
                      defaultMessage: 'Getting started with App Search',
                    }
                  ),
                  to: docLinks.appSearchGettingStarted,
                },
                {
                  label: i18n.translate(
                    'xpack.enterpriseSearch.appSearch.resources.searchUILabel',
                    {
                      defaultMessage: 'Search UI for App Search',
                    }
                  ),
                  to: docLinks.searchUIAppSearch,
                },
                {
                  label: i18n.translate(
                    'xpack.enterpriseSearch.appSearch.resources.searchRelevanceLabel',
                    {
                      defaultMessage: 'Tune your search relevance',
                    }
                  ),
                  to: docLinks.appSearchRelevance,
                },
                {
                  label: i18n.translate(
                    'xpack.enterpriseSearch.appSearch.resources.adaptiveRelevanceLabel',
                    {
                      defaultMessage: 'Automate with Adaptive Relevance',
                    }
                  ),
                  to: docLinks.appSearchAdaptiveRelevance,
                },
              ]}
              url={APP_SEARCH_PLUGIN.URL}
            />
          </EuiFlexItem>
        )}
        {shouldShowWorkplaceSearchCard && (
          <EuiFlexItem>
            <ProductCard
              data-test-subj="productCard-workplaceSearch"
              cta={i18n.translate('xpack.enterpriseSearch.workplaceSearch.productCardCTA', {
                defaultMessage: 'Open Workplace Search',
              })}
              description={i18n.translate(
                'xpack.enterpriseSearch.workplaceSearch.productCardDescription',
                {
                  defaultMessage:
                    'Ideal for internal teams, Workplace Search helps unify your content in one place with instant connectivity to popular productivity tools.',
                }
              )}
              features={[
                i18n.translate('xpack.enterpriseSearch.workplaceSearch.features.ingest', {
                  defaultMessage: 'Ingest from third-party sources',
                }),
                i18n.translate(
                  'xpack.enterpriseSearch.workplaceSearch.features.managementDashboards',
                  {
                    defaultMessage: 'Search management dashboards',
                  }
                ),
                i18n.translate(
                  'xpack.enterpriseSearch.workplaceSearch.features.searchExperiences',
                  {
                    defaultMessage: 'Search experiences for authenticated users',
                  }
                ),
              ]}
              icon="logoWorkplaceSearch"
              name={WORKPLACE_SEARCH_PLUGIN.NAME}
              productId={WORKPLACE_SEARCH_PLUGIN.ID}
              resourceLinks={[
                {
                  label: i18n.translate(
                    'xpack.enterpriseSearch.workplaceSearch.resources.gettingStartedLabel',
                    {
                      defaultMessage: 'Getting started with Workplace Search',
                    }
                  ),
                  to: docLinks.workplaceSearchGettingStarted,
                },
                {
                  label: i18n.translate(
                    'xpack.enterpriseSearch.workplaceSearch.resources.setUpConnectorsLabel',
                    {
                      defaultMessage: 'Set up your connectors',
                    }
                  ),
                  to: docLinks.workplaceSearchContentSources,
                },
                {
                  label: i18n.translate(
                    'xpack.enterpriseSearch.workplaceSearch.resources.managePermissionsLabel',
                    {
                      defaultMessage: 'Manage permissions',
                    }
                  ),
                  to: docLinks.workplaceSearchPermissions,
                },
              ]}
              url={WORKPLACE_SEARCH_URL}
            />
          </EuiFlexItem>
        )}
        {!config.host && config.canDeployEntSearch && (
          <EuiFlexItem>
            <SetupGuideCta />
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
      <Chat />
    </EnterpriseSearchOverviewPageTemplate>
  );
};
