import {
    TableView as SpectrumTableView,
    TableHeader as SpectrumTableHeader,
    TableBody as SpectrumTableBody,
    Column as SpectrumColumn,
    Row as SpectrumRow,
    Cell as SpectrumCell,
} from '@adobe/react-spectrum';
import type {
    SpectrumTableProps,
    SpectrumColumnProps,
    TableHeaderProps,
    TableBodyProps,
    RowProps,
    CellProps,
} from '@adobe/react-spectrum';

/**
 * Props for the TableView component.
 * Extends Spectrum's SpectrumTableProps.
 */
export interface TableViewProps<T extends object> extends SpectrumTableProps<T> {}

export type { SpectrumColumnProps, TableHeaderProps, TableBodyProps, RowProps, CellProps };

/**
 * Re-export of Spectrum TableHeader for use with TableView.
 */
export const TableHeader = SpectrumTableHeader;

/**
 * Re-export of Spectrum TableBody for use with TableView.
 */
export const TableBody = SpectrumTableBody;

/**
 * Re-export of Spectrum Column for use with TableView.
 */
export const Column = SpectrumColumn;

/**
 * Re-export of Spectrum Row for use with TableView.
 */
export const Row = SpectrumRow;

/**
 * Re-export of Spectrum Cell for use with TableView.
 */
export const Cell = SpectrumCell;

/**
 * A table component that wraps Adobe React Spectrum's TableView.
 * Supports sortable columns, selectable rows, and virtualized scrolling for large datasets.
 */
export const TableView = <T extends object>(props: TableViewProps<T>) => <SpectrumTableView {...props} />;
