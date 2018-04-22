class DataTable {
    constructor(config) {
        this.config = config;
        this.columns = [];
        this.columnEls = {};
        this.searchParams = {};
        this.page = 1;
        this.pageSize = 10;
        this.init(config.selector);
        this.generateSearch(config.selector, config.filters);
    }

    init (selector) {
        let tableSelector = document.querySelector(selector);
        this.tableSelector = tableSelector;
        if (tableSelector) {
            tableSelector.classList.add('t-data-table');

            // let btnFilter = document.createElement('button');
            // btnFilter.className = selector.replace('#', '') + '-btn-filter';
            // btnFilter.textContent = 'Filter';
            // btnFilter.style = 'float: right;';
            // btnFilter.onclick = function() {
            //     tableSelector.classList.toggle('hidden-filter');
            // }
            // tableSelector.parentNode.insertBefore(btnFilter, tableSelector);

            let columns = document.querySelectorAll(selector + ' thead tr th');

            for(let i=0; i<columns.length; i++) {
                let name = columns[i].getAttribute('name');
                this.columns.push(name);
                this.columnEls[name] = columns[i];
            }
        }
    }

    generateSearch (selector, filters) {
        for (let i=0; i<filters.length; i++) {
            let filter = filters[i];
            console.log('filters', filters);
            console.log('columnEls', this.columnEls);
            if (filter && filter.name) {
                switch(filter.type) {
                    case 'text':
                        let filterText = this.generateInputText(filter);
                        this.columnEls[filter.name].appendChild(filterText);
                        break;
                    case 'select':
                        let filterSelect = this.generateInputSelectOption(filter);
                        this.columnEls[filter.name].appendChild(filterSelect);
                        new SelectOption({
                            selector: '#filter_' + filter.name,
                            search: filter.search
                        })
                        break;
                    default:
                        break;
                }
            }
        }
    }

    generateInputText(data) {
        let searchItem = document.createElement('div');
        searchItem.className = 'search-item input-text';

        let inputSearch = document.createElement('input');
        inputSearch.className = 'form-control';
        inputSearch.type = 'text';
        inputSearch.name = data.name;
        inputSearch.onkeydown = function(e) {
            let keyCode = e.keyCode;

            this.searchParams[data.name] = inputSearch.value;

            if (keyCode === 13) {
                let queryParams = '';
                
                for (let i=0; i<this.columns.length; i++) {
                    let param = this.searchParams[this.columns[i]];

                    if (param) {
                        if (queryParams === '') {
                            queryParams += this.columns[i] + '=' + param;
                        } else {
                            queryParams += '&' + this.columns[i] + '=' + param;
                        }
                    }
                }
                /**
                 * Request server
                 */
                this.requestServerFilter(queryParams);
            }
        }.bind(this);

        searchItem.appendChild(inputSearch);

        return searchItem;
    }

    generateInputSelectOption(data) {
        let searchItem = document.createElement('div');
        searchItem.className = 'search-item input-text';
        searchItem.style = data.style;

        let inputSearch = document.createElement('select');
        inputSearch.className = 'form-control';
        inputSearch.id = 'filter_' + data.name;
        inputSearch.name = data.name;

        if (data.placeholder) {
            let option = document.createElement('option');
            option.value = '';
            option.textContent = data.placeholder;
            inputSearch.appendChild(option);
        }

        if (data.options && data.options instanceof Array) {
            for (let i=0; i<data.options.length; i++) {
                let option = document.createElement('option');
                option.value = data.options[i][data.key];
                option.textContent = data.options[i][data.value];
                inputSearch.appendChild(option);
            }
        }

        searchItem.appendChild(inputSearch);

        inputSearch.onchange = function() {
            this.searchParams[data.name] = inputSearch.value;
            
            let queryParams = '';
                
            for (let i=0; i<this.columns.length; i++) {
                let param = this.searchParams[this.columns[i]];

                if (param) {
                    if (queryParams === '') {
                        queryParams += this.columns[i] + '=' + param;
                    } else {
                        queryParams += '&' + this.columns[i] + '=' + param;
                    }
                }
            }
            
            /**
             * Request server
             */
            this.requestServerFilter(queryParams);
        }.bind(this);

        return searchItem;
    }

    requestServerFilter(queryParams) {
        let url = this.config.urlFilter + '?' + queryParams;
        let xhttp = new XMLHttpRequest();
        let _this = this;
        let table = document.querySelector(_this.config.selector);
        let tBody = document.querySelector(_this.config.selector + ' tbody'), html = '';

        tBody.innerHTML = '<tr class="processing"><td colspan="' + _this.columns.length + '" style="text-align: center">Processing...</td></tr>';

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let dataRes = JSON.parse(this.responseText);
                let data = dataRes.data;

                if (data && data instanceof Array) {
                    if (tBody) {
                        if (data.length > 0) {
                            for(let i=0; i<data.length; i++) {
                                html += '<tr>';
                                for (let j=0; j<_this.columns.length; j++) {
                                    switch(_this.columns[j]) {
                                        case 'STT':
                                            html += '<td>' + (i + 1) + '</td>';
                                            break;
                                        case 'avatar':
                                            if (data[i]['avatar']) {
                                                html += '<td class="text-center" style="font-size: 50px;"><img src="' + data[i]['avatarUrl'] + '" style="width: 100px;"></td>';
                                            } else {
                                                html += '<td class="text-center" style="font-size: 50px;"><i class="fa fa-user"></i></td>';
                                            }
                                            break;
                                        case 'actions':
                                            let actionEl = document.querySelector(_this.config.selector + ' thead tr th[name="actions"]');
                                            if (actionEl) {
                                                let actions = actionEl.getAttribute('actions');
                                                if (actions) {
                                                    actions = JSON.parse(actions);
                                                    html += '<td class="text-center">';
                                                    if (actions.view) {
                                                        html += '<a class="user-action btn btn-default" href="' + actions.view + '/' + data[i]._id + '"><em class="fa fa-eye"></em></a>';
                                                    }
                                                    if (actions.edit) {  
                                                        html += '<a class="user-action btn btn-success" href="' + actions.edit + '/' + data[i]._id + '"><em class="fa fa-pencil"></em></a>';
                                                    }
                                                    if (actions.delete) {
                                                        html += '<a class="user-action btn btn-danger" href="' + actions.delete + '/' + data[i]._id + '"><em class="fa fa-trash"></em></a>';
                                                    }
                                                    html += '</td>';
                                                } else {
                                                    html += '<td>No actions</td>';
                                                }
                                            } else {
                                                html += '<td>No actions</td>';
                                            }
                                            break;
                                        default:
                                            html += '<td>' + data[i][_this.columns[j]] + '</td>';
                                    }
                                }
                                html += '</tr>';
                            }
                            tBody.innerHTML = html;
    
                            /**
                             * Append pagination
                             */
                            // let pUl = table.nextSibling;
                            // if (pUl) {
                            //     pUl.innerHTML = '';
                            // } else {
                            //     pUl = document.createElement('ul')
                            //     pUl.className = 'pagination data-table-pagination';
                            // }
    
                            // for (let i=0; i<6; i++) {
                            //     let li = document.createElement('li');
                            //     let span = document.createElement('span');
                            //     span.textContent = i + 1;
                            //     span.onclick = function() {
                            //         _this.page = i+1;
    
                            //         let queryParams = '';
                    
                            //         for (let i=0; i<_this.config.columns.length; i++) {
                            //             let param = _this.searchParams[_this.config.columns[i]];
    
                            //             if (param) {
                            //                 if (queryParams === '') {
                            //                     queryParams += _this.config.columns[i] + '=' + param;
                            //                 } else {
                            //                     queryParams += '&' + _this.config.columns[i] + '=' + param;
                            //                 }
                            //             }
                            //         }
    
                            //         if (queryParams) {
                            //             queryParams += '&page=' + i + '&pageSize=10';
                            //         } else {
                            //             queryParams += '?page=' + i + '&pageSize=10';
                            //         }
                            //         /**
                            //          * Request server
                            //          */
                            //         _this.requestServerFilter(queryParams);
                            //     }.bind(_this)
                            //     li.className = ((i + 1) === _this.page) ? 'active' : '';
                            //     li.appendChild(span);
                            //     pUl.appendChild(li);
                            // }
                            
                            // table.parentNode.insertBefore(pUl, table.nextSibling);
                        } else {
                            tBody.innerHTML = '<tr class="processing"><td colspan="' + _this.columns.length + '" style="text-align: center">Không tìm thấy dữ liệu</td></tr>';
                        }
                    }
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }
}

// let dataTable = new DataTable({
//     selector: '#table-test',
//     urlFilter: '/search',
//     columns: ['col1', 'col2', 'col3'],
//     filters: [
//         {
//             name: 'col1',
//             type: 'text'
//         },
//         {
//             name: 'col2',
//             type: 'text'
//         },
//         {
//             name: 'col3',
//             type: 'select',
//             key: 'id',
//             value: 'firstName',
//             placeholder: 'Chon ho ten',
//             options: [
//                 {
//                     id: 121,
//                     firstName: 'abc',
//                     lastName: 'def'
//                 },
//                 {
//                     id: 122,
//                     firstName: 'ghi',
//                     lastName: 'klm'
//                 }
//             ]
//         }
//     ]
// })