/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { memo, useCallback, useMemo, useRef } from 'react';
import './index.scss';
import { FormattedMessage } from '@kbn/i18n-react';
import { EuiText } from '@elastic/eui';
import { usePager } from '@kbn/discover-utils';
import { SAMPLE_SIZE_SETTING } from '../../../common';
import {
  ToolBarPagination,
  MAX_ROWS_PER_PAGE_OPTION,
} from './components/pager/tool_bar_pagination';
import { DocTableProps, DocTableRenderProps, DocTableWrapper } from './doc_table_wrapper';
import { useDiscoverServices } from '../../hooks/use_discover_services';
import { SavedSearchEmbeddableBase } from '../../embeddable/saved_search_embeddable_base';

export interface DocTableEmbeddableProps extends DocTableProps {
  totalHitCount: number;
  rowsPerPageState?: number;
  onUpdateRowsPerPage?: (rowsPerPage?: number) => void;
}

const DocTableWrapperMemoized = memo(DocTableWrapper);

export const DocTableEmbeddable = (props: DocTableEmbeddableProps) => {
  const services = useDiscoverServices();
  const onUpdateRowsPerPage = props.onUpdateRowsPerPage;
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const {
    curPageIndex,
    pageSize,
    totalPages,
    startIndex,
    hasNextPage,
    changePageIndex,
    changePageSize,
  } = usePager({
    initialPageSize:
      typeof props.rowsPerPageState === 'number' && props.rowsPerPageState > 0
        ? Math.min(props.rowsPerPageState, MAX_ROWS_PER_PAGE_OPTION)
        : 50,
    totalItems: props.rows.length,
  });
  const showPagination = totalPages !== 0;

  const scrollTop = useCallback(() => {
    if (tableWrapperRef.current) {
      tableWrapperRef.current.scrollTo(0, 0);
    }
  }, []);

  const pageOfItems = useMemo(
    () => props.rows.slice(startIndex, pageSize + startIndex),
    [pageSize, startIndex, props.rows]
  );

  const onPageChange = useCallback(
    (page: number) => {
      scrollTop();
      changePageIndex(page);
    },
    [changePageIndex, scrollTop]
  );

  const onPageSizeChange = useCallback(
    (size: number) => {
      scrollTop();
      changePageSize(size);
      onUpdateRowsPerPage?.(size); // to update `rowsPerPage` input param for the embeddable
    },
    [changePageSize, scrollTop, onUpdateRowsPerPage]
  );

  const shouldShowLimitedResultsWarning = useMemo(
    () => !hasNextPage && props.rows.length < props.totalHitCount,
    [hasNextPage, props.rows.length, props.totalHitCount]
  );

  const sampleSize = useMemo(() => {
    return services.uiSettings.get(SAMPLE_SIZE_SETTING, 500);
  }, [services]);

  const renderDocTable = useCallback(
    (renderProps: DocTableRenderProps) => {
      return (
        <div className="kbnDocTable__container">
          <table className="kbnDocTable table" data-test-subj="docTable">
            <thead>{renderProps.renderHeader()}</thead>
            <tbody>{renderProps.renderRows(pageOfItems)}</tbody>
          </table>
        </div>
      );
    },
    [pageOfItems]
  );

  return (
    <SavedSearchEmbeddableBase
      totalHitCount={props.totalHitCount}
      isLoading={props.isLoading}
      prepend={
        shouldShowLimitedResultsWarning ? (
          <EuiText grow={false} size="s" color="subdued">
            <FormattedMessage
              id="discover.docTable.limitedSearchResultLabel"
              defaultMessage="Limited to {resultCount} results. Refine your search."
              values={{ resultCount: sampleSize }}
            />
          </EuiText>
        ) : undefined
      }
      append={
        showPagination ? (
          <ToolBarPagination
            pageSize={pageSize}
            pageCount={totalPages}
            activePage={curPageIndex}
            onPageClick={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        ) : undefined
      }
    >
      <DocTableWrapperMemoized ref={tableWrapperRef} {...props} render={renderDocTable} />
    </SavedSearchEmbeddableBase>
  );
};
