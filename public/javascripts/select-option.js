class SelectOption {
    constructor(config) {
        this.config = config;
        this.selector = document.querySelector(this.config.selector);
       
        if (this.selector) {
            this.hideSelect();
            if (this.selector.multiple)
                this.customSelectMulti();
            else
                this.customSelectSingle();
        }
    }

    hideSelect() {
        this.selector.classList.add('select-hidden');
    }

    customSelectSingle() {
        let options = document.querySelectorAll(this.config.selector + ' option');
        let selectInstate = document.createElement('div');
        selectInstate.className = 'select-instate';

        /**
         * Selected field
         */
        let selectedField = document.createElement('div');
        selectedField.className = 'selected-field select-form-control';

        let selectedItem = document.createElement('span');
        selectedItem.className = 'selected-item';
        selectedItem.textContent = options[0].textContent;

        selectedField.appendChild(selectedItem);

        /* End */
        let selectChoices = document.createElement('div');
        selectChoices.className = 'select-choices select-hidden';

        let searchField = document.createElement('input');
        if (this.config.search) {
            searchField.className = 'search-field select-form-control';
            searchField.onkeyup = function() {
                let value = searchField.value;
                let options = selectChoices.querySelectorAll('ul li');

                for (let i=0; i<options.length; i++) {
                    let optionText = options[i].textContent, reg = new RegExp(value, 'i');
                    let match = optionText.search(reg);

                    if ( match === -1) {
                        options[i].classList.add('option-hidden');
                    } else {
                        options[i].classList.remove('option-hidden');
                    }
                }
            }.bind(this);
            selectChoices.appendChild(searchField);
        }
        selectedField.onclick = function() {
            selectChoices.classList.toggle('select-hidden');
            selectInstate.classList.toggle('show-choices');
            if (this.config.search)
                searchField.focus();
        }.bind(this);
        /**
         * All choice
         */
        let choiceUl = document.createElement('ul');
        for(let i=0; i<options.length; i++) {
            let choiceLi = document.createElement('li');
            choiceLi.textContent = options[i].textContent;
            choiceLi.setAttribute('value', options[i].value);
            choiceLi.onclick = function() {
                selectedItem.textContent = choiceLi.textContent;
                options[i].selected = true;
                selectChoices.classList.toggle('select-hidden');
                selectInstate.classList.toggle('show-choices');
                /* Trigger select on change */
                this.selector.onchange({target: this.selector});
            }.bind(this);

            choiceUl.appendChild(choiceLi);
        }

        let triangle = document.createElement('span');
        triangle.className = 'triangle';

        selectChoices.appendChild(choiceUl);
        selectInstate.appendChild(selectedField);
        selectInstate.appendChild(triangle);
        selectInstate.appendChild(selectChoices);

        this.selector.parentNode.insertBefore(selectInstate, this.selector.nextSibling);
    }

    customSelectMulti() {
        let options = document.querySelectorAll(this.config.selector + ' option');

        let selectInstate = document.createElement('div');
        selectInstate.className = 'select-instate';

        /**
         * Selected field
         */
        let selectedField = document.createElement('div');
        selectedField.className = 'selected-field select-form-control';

        let selectItems = document.createElement('div');
        selectItems.className = 'select-items';

        // let selectedItem = document.createElement('span');
        // selectedItem.className = 'selected-item';
        // selectedItem.textContent = options[0].textContent;

        // selectItems.appendChild(selectedItem);

        selectedField.appendChild(selectItems);

        /* End */
        let selectChoices = document.createElement('div');
        selectChoices.className = 'select-choices select-hidden';
        let searchField = document.createElement('input');

        if (this.config.search) {
            searchField.className = 'search-field select-form-control';
            searchField.onkeyup = function() {
                let value = searchField.value;
                let options = selectChoices.querySelectorAll('ul li');

                for (let i=0; i<options.length; i++) {
                    let optionText = options[i].textContent, reg = new RegExp(value, 'i');
                    let match = optionText.search(reg);

                    if ( match === -1) {
                        options[i].classList.add('option-hidden');
                    } else {
                        if (options[i].classList.contains('option-selected')) {

                        } else {
                            options[i].classList.remove('option-hidden');
                        }
                    }
                }
            }.bind(this);
            selectChoices.appendChild(searchField);
        }
        selectedField.onclick = function() {
            selectChoices.classList.toggle('select-hidden');
            selectInstate.classList.toggle('show-choices');
            if (this.config.search)
                searchField.focus();
        }.bind(this);
        /**
         * All choice
         */
        let choiceUl = document.createElement('ul');
        for(let i=0; i<options.length; i++) {
            let choiceLi = document.createElement('li');
            choiceLi.textContent = options[i].textContent;
            choiceLi.setAttribute('value', options[i].value);
            choiceLi.onclick = function() {
                let selectedItem = document.createElement('span');
                selectedItem.className = 'selected-item';
                selectedItem.textContent = choiceLi.textContent;
                selectItems.appendChild(selectedItem);
                choiceLi.classList.add('option-selected');
                choiceLi.classList.add('option-hidden');

                let removeItem = document.createElement('i');
                removeItem.className = 'remove-item';
                removeItem.textContent = 'x';
                removeItem.onclick = function() {
                    selectedItem.remove();
                    options[i].selected = false;
                    choiceLi.classList.remove('option-selected');
                    choiceLi.classList.remove('option-hidden');
                    selectChoices.classList.toggle('select-hidden');
                    selectInstate.classList.toggle('show-choices');
                }
                selectedItem.appendChild(removeItem);

                options[i].selected = true;
                selectChoices.classList.toggle('select-hidden');
                selectInstate.classList.toggle('show-choices');
            }

            choiceUl.appendChild(choiceLi);
        }

        let triangle = document.createElement('span');
        triangle.className = 'triangle';

        selectChoices.appendChild(choiceUl);
        selectInstate.appendChild(selectedField);
        selectInstate.appendChild(triangle);
        selectInstate.appendChild(selectChoices);

        this.selector.parentNode.insertBefore(selectInstate, this.selector.nextSibling);
    }
}

// new SelectOption({
//     selector: '#filter_col3',
//     search: true
// })