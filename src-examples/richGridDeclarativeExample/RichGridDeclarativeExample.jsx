import React, { Component } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import RowDataFactory from "./RowDataFactory";
import DateComponent from "./DateComponent.jsx";
import SkillsCellRenderer from './SkillsCellRenderer.jsx';
import NameCellEditor from './NameCellEditor.jsx';
import ProficiencyCellRenderer from './ProficiencyCellRenderer.jsx';
import RefData from './RefData';
import SkillsFilter from './SkillsFilter.jsx';
import ProficiencyFilter from './ProficiencyFilter.jsx';
import HeaderGroupComponent from './HeaderGroupComponent.jsx';
import SortableHeaderComponent from './SortableHeaderComponent.jsx';
import { Form, FormLabel } from 'react-bootstrap';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-alpine.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-alpine-dark.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham-dark.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-material.css';

import "./RichGridDeclarativeExample.css";
// for enterprise features
import { AllModules } from "@ag-grid-enterprise/all-modules";

const Country = RefData.COUNTRIES.map((country) => country.country)

export default class RichGridDeclarativeExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quickFilterText: null,
            sideBar: false,
            rowData: new RowDataFactory().createRowData(),
            rowCount: null,
            theme: 'ag-theme-alpine',
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-times"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>'
            },
            columnDefs: [
                {
                    children: [
                        {
                            headerCheckboxSelection: true,
                            headerCheckboxSelectionFilteredOnly: true,
                            minWidth: 60,
                            checkboxSelection: true,
                            sortable: false,
                            suppressMenu: true,
                            filter: false,
                            pinned: true
                        },
                        {
                            headerName: "Name",
                            field: "name",
                            minWidth: 160,
                            cellEditor: NameCellEditor,
                            enablePivot: true,
                            editable: true,
                            pinned: true
                        }
                    ]

                },
                {
                    headerName: "Employee",
                    headerGroupComponent: HeaderGroupComponent,
                    children: [
                        {
                            field: 'gender',
                            minWidth: 160,
                            cellRenderer: RichGridDeclarativeExample.GenderCellRenderer,
                            cellEditor: 'agRichSelectCellEditor',
                            cellEditorPopup: true,
                            editable: true,
                            enablePivot: true, pinned: false,
                            cellEditorParams: {
                                values: ['Male', 'Female'],
                                cellRenderer: RichGridDeclarativeExample.GenderCellRenderer,
                            },
                        },
                        {
                            field: "country",
                            minWidth: 170,
                            cellRenderer: RichGridDeclarativeExample.countryCellRenderer,
                            cellEditor: 'agRichSelectCellEditor',
                            columnGroupShow: "open",
                            enablePivot: true,
                            pinned: false,
                            editable: true,
                            cellEditorPopup: true,
                            cellEditorParams: {
                                values: Country,
                                cellRenderer: RichGridDeclarativeExample.countryCellRenderer,
                            },
                        },
                        {
                            headerName: "DOB",
                            field: "dob", minWidth: 120,
                            filter: "agDateColumnFilter",
                            pinned: false,
                            columnGroupShow: "open",
                            cellRenderer: RichGridDeclarativeExample.dateCellRenderer,
                        }
                    ]
                },
                {
                    headerName: "IT Skills",
                    children: [
                        {
                            field: "skills",
                            minWidth: 100,
                            enableRowGroup: true,
                            enablePivot: true,
                            sortable: false,
                            cellRenderer: SkillsCellRenderer,
                            filter: SkillsFilter
                        },
                        {
                            field: "proficiency",
                            minWidth: 210,
                            enableValue: true,
                            cellRenderer: ProficiencyCellRenderer,
                            filter: ProficiencyFilter
                        }
                    ]
                },
                {
                    headerName: "Contact",
                    children: [
                        { field: "mobile", minWidth: 180, filter: "text", editable: true },
                        { field: "address", minWidth: 500, filter: "text", editable: true }
                    ]
                },
                {
                    headerName: "Marks",
                    children: [
                        { field: "physics", minWidth: 140, filter: "text", editable: true, cellClass:"centerText" },
                        { field: "maths", minWidth: 140, filter: "text", editable: true, cellClass:"centerText" },
                        {
                            field: "total", minWidth: 140, filter: "text", editable: false,
                            valueGetter: function (params) {
                                return parseInt(params.data.maths) + parseInt(params.data.physics)
                            },
                            cellClassRules: {
                                "cell-pass": params => params.value >= 67,
                                "cell-fail": params => params.value < 67
                            }
                        }
                    ]
                },
                {
                    headerName: "Result",
                    children: [
                        {
                            field: 'pass',
                            minWidth: 120,
                            cellRenderer: RichGridDeclarativeExample.PassCellRenderer,
                            editable: false,
                            enablePivot: true,
                            valueGetter: function (params) {
                                return parseInt(params.data.maths) + parseInt(params.data.physics)
                            },
                            cellClass:"centerText"
                        }
                    ]
                }
            ]
        };
    }

    /* Grid Events we're listening to */
    onGridReady = (params) => {
        this.api = params.api;
        this.columnApi = params.columnApi;

        this.api.sizeColumnsToFit();

        this.calculateRowCount();
    };

    // onCellClicked = (event) => {
    //     console.log('onCellClicked: ' + event.data.name + ', col ' + event.colIndex);
    // };

    // onRowSelected = (event) => {
    //     console.log('onRowSelected: ' + event.node.data.name);
    // };

    /* Demo related methods */
    onToggleSidebar = (event) => {
        this.setState({ sideBar: event.target.checked });
    };

    // deselectAll() {
    //     this.api.deselectAll();
    // }

    onQuickFilterText = (event) => {
        this.setState({ quickFilterText: event.target.value });
    };

    onRefreshData = () => {
        this.setState({
            rowData: new RowDataFactory().createRowData()
        });
    };

    // invokeSkillsFilterMethod = () => {
    //     this.api.getFilterInstance('skills', (instance) => {
    //         instance.helloFromSkillsFilter();
    //     });
    // };

    // dobFilter = () => {
    //     this.api.getFilterInstance('dob', (dateFilterComponent) => {
    //         dateFilterComponent.setModel({
    //             type: 'equals',
    //             dateFrom: '2000-01-01'
    //         });

    //         // as the date filter is a React component, and its using setState internally, we need
    //         // to allow time for the state to be set (as setState is an async operation)
    //         // simply wait for the next tick
    //         setTimeout(() => {
    //             this.api.onFilterChanged();
    //         });
    //     });
    // };

    calculateRowCount = () => {
        if (this.api && this.state.rowData) {
            const model = this.api.getModel();
            const totalRows = this.state.rowData.length;
            const processedRows = model.getRowCount();
            this.setState({
                rowCount: processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString()
            });
        }
    };

    onBtExport = () => {
        this.api.exportDataAsExcel();
    };

    static countryCellRenderer(params) {
        if (params.value && RefData.COUNTRY_CODES[params.value]) {
            return <><img border='0' width='15' height='10' style={{ marginBottom: 2 }} src={`http://flags.fmcdn.net/data/flags/mini/${RefData.COUNTRY_CODES[params.value]}.png`} /> {params.value}</>;
        } else {
            return <>{params.value}</>;
        }
    }

    static GenderCellRenderer(params) {
        const image = params.value === 'Male' ? 'male.png' : 'female.png';
        return (
            <span>
                <img src={`https://www.ag-grid.com/example-assets/genders/${image}`} />
                {params.value}
            </span>
        );
    }

    static PassCellRenderer(params) {
        if (params.value >= 67) {
            return (
                <span>
                    <img src='images/true.png' width={30} />
                </span>
            );
        }
        else {
            return (
                <span>
                    <img src='images/false.png' width={30} />
                </span>
            );
        }
        // if (params.value === 'Pass' || params.value === 'Fail') {
        //     const image = params.value === 'Pass' ? 'true' : 'false';
        //     return (
        //         <span>
        //             <img src={`images/${image}.png`} width={30} />
        //         </span>
        //     );
        // }
        // else {
        //     return <>{params.value}</>
        // }
    }

    static TotalMarksRenderer(params) {

    }

    static dateCellRenderer(params) {
        return RichGridDeclarativeExample.pad(params.value.getDate(), 2) + '/' +
            RichGridDeclarativeExample.pad(params.value.getMonth() + 1, 2) + '/' +
            params.value.getFullYear();
    }

    static pad(num, totalStringSize) {
        let asString = num + "";
        while (asString.length < totalStringSize) asString = "0" + asString;
        return asString;
    }

    render() {
        return (
            <div style={{ width: '100%', marginTop: '30px' }}>
                <div style={{ display: "inline-block", width: "100%" }}>
                    <div style={{ float: "left" }}>
                        <b>Employees Skills and Contact Details: </b>{this.state.rowCount}
                    </div>
                    <div style={{ float: "right", marginLeft: 20 }}>
                        <FormLabel>Select Theme :&nbsp;</FormLabel>
                        <Form.Select onChange={e => {
                            this.setState({ theme: e.target.value })
                        }}
                        >
                            <option value={'ag-theme-alpine'}>Alpine</option>
                            <option value={'ag-theme-alpine-dark'}>Alpine dark</option>
                            <option value={'ag-theme-balham'}>Balham</option>
                            <option value={'ag-theme-balham-dark'}>Balham Dark</option>
                            <option value={'ag-theme-bootstrap'}>Material</option>
                        </Form.Select>
                    </div>
                </div>
                <div style={{ marginTop: 10, marginBottom: 10 }}>
                    <span style={{ float: "right" }}>
                        <button onClick={() => this.onBtExport()} className="btn btn-primary">Excel Export</button>
                    </span>
                    <div style={{ float: "left" }}>
                        <button onClick={this.onRefreshData} className="btn btn-primary">Refresh Data</button>
                    </div>
                </div>
                <div style={{ display: "inline-block", width: "100%", marginTop: 10, marginBottom: 10 }}>
                    <div style={{ float: "left" }}>
                        <label htmlFor="sideBarToggle">Show Side Bar&nbsp;</label>
                        <input type="checkbox" id="sideBarToggle" onChange={this.onToggleSidebar}
                            style={{ marginRight: 5 }} />
                    </div>
                    <div style={{ float: "right", marginLeft: 20 }}>
                        <label htmlFor="quickFilter">Quick Filter:&nbsp;</label>
                        <input type="text" id="quickFilter" onChange={this.onQuickFilterText}
                            placeholder="Type text to filter..." />
                    </div>
                </div>
                <div style={{ height: 650, width: '100%' }} className={`${this.state.theme}`}>
                    <AgGridReact
                        // listening for events
                        onGridReady={this.onGridReady}
                        onRowSelected={this.onRowSelected}
                        onCellClicked={this.onCellClicked}
                        onModelUpdated={this.calculateRowCount}

                        // binding to simple properties
                        sideBar={this.state.sideBar}
                        quickFilterText={this.state.quickFilterText}

                        // binding to an object property
                        icons={this.state.icons}

                        alwaysShowHorizontalScroll={true}

                        // column definitions
                        columnDefs={this.state.columnDefs}

                        // binding to array properties
                        rowData={this.state.rowData}

                        // register all modules (row model, csv/excel, row grouping etc)
                        modules={AllModules}

                        // no binding, just providing hard coded strings for the properties
                        // boolean properties will default to true if provided (ie suppressRowClickSelection => suppressRowClickSelection="true")
                        suppressRowClickSelection
                        rowSelection="multiple"
                        groupHeaders

                        // setting grid wide date component
                        components={{
                            agDateInput: DateComponent
                        }}
                        // setting default column properties
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: true,
                            // floatingFilter: true,
                            headerComponent: SortableHeaderComponent,
                            headerComponentParams: {
                                menuIcon: 'fa-bars'
                            }
                        }} />
                </div>
            </div>
        );
    }
}
