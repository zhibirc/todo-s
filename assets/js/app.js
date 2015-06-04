var APP = {
    init: function (func) {
        'use strict';

        var container = document.getElementById('task_section'),
            newItem = '<label><input><button data-state="add">Add</button></label>';

        func.call(null, [container], { 'click': function (event) {
            var target = event.target,
                item = target.parentNode,
                input = target.previousSibling;

            if (target.tagName !== 'BUTTON') {
                return;
            }

            if (!target.previousSibling.value) {
                return;
            }

            switch (target.dataset.state) {
            case 'add':
                target.textContent = 'Done';
                target.dataset.state = 'done';
                container.insertAdjacentHTML('beforeEnd', newItem);
                break;
            case 'done':
                input.setAttribute('disabled', 'disabled');
                input.classList.add('shadow');
                target.textContent = 'X';
                target.dataset.state = 'X';
                break;
            case 'X':
                item.parentNode.removeChild(item);
                break;
            }

        } });
    }
};