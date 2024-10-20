import MUIDataTable from "mui-datatables";

const DefaultTablePagination = ({
  title,
  data,
  pageSize,
  itemCount,
  handleChangePage = () => {},
  handleSearch = () => {},
  columns,
  download = true,
  print = true,
  filter = true,
  handleApplyFilters = () => {},
  customToolbar = null,
  enableNestedDataAccess = ".",
  localStorageId,
  page,
  searchText = "",
}) => {
  // Estilo
  const defaultTextLabels = {
    body: {
      noMatch: "no_records",
      toolTip: "sort",
    },
    pagination: {
      next: "next",
      previous: "previous",
      rowsPerPage: "Total",
      displayRows: "of",
      jumpToPage: "jump_to_page",
    },
    toolbar: {
      search: "search",
      downloadCsv: "download_csv",
      print: "print",
      viewColumns: "columns",
      filterTable: "filter_table",
    },
    filter: {
      all: "all",
      title: "filters",
      reset: "reset",
    },
    viewColumns: {
      title: "view_columns",
      titleAria: "view_hide",
    },
  };

  const defaultOptions = {
    textLabels: defaultTextLabels,
    download: download,
    print: print,
    selectableRowsHideCheckboxes: true,
    selectableRows: "none",
    fixedHeader: true,
    serverSide: true,
    count: itemCount,
    jumpToPage: true,
    enableNestedDataAccess: enableNestedDataAccess,
    storageKey: localStorageId,
    rowsPerPage: pageSize,
    customToolbar: customToolbar || null,
    page: page - 1,
    searchText: searchText,
    onTableChange: (action, tableState) => {
      switch (action) {
        case "changePage":
          handleChangePage(tableState.page, pageSize);
         // console.log("changePage", tableState.page);
          break;
        case "changeRowsPerPage":
          handleChangePage(0, tableState.rowsPerPage);
          break;
        case "sort":
          // console.log("Ordenamiento", tableState.sortOrder);
          break;
        case "search":
          handleSearch(tableState.searchText);
          break;
        default:
        // console.log("action not handled.");
      }
    },
    filter: filter,
    onFilterChange: (changedColumn, filterList) => {
      handleApplyFilters(changedColumn, filterList);
    },
  };

  return (
    <div name="table" className="table-div">
      <div className="table-content">
        <MUIDataTable
          className="custom-table"
          title={title}
          data={data}
          columns={columns}
          options={defaultOptions}
        />
      </div>
    </div>
  );
};

export default DefaultTablePagination;
