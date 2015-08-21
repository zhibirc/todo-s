var APP = {
	db: localStorage,
	doc: document,
    init: function () {
        'use strict';

        var doc = this.doc,
			container = doc.getElementById('task_section'),
            newItem = ['<label><input maxlength="160" data-id="', '"><button data-state="add">&plus;</button></label>'],
			lang = (this.dbOperate('select', 'lang') || navigator.language || navigator.browserLanguage).substr(0, 2),
			acceptedLangs = ['en', 'ru'],
			DB = this.db,
			dbLen = DB.length,
			storedTasks = Array(dbLen),
			key,
			i;
			
		doc.body.classList.add(this.dbOperate('select', 'theme') || 'light-theme');
		doc.querySelector('[data-theme="' + doc.body.className + '"]').classList.add('active');
		
		doc.querySelector('[data-lang="' + (~acceptedLangs.indexOf(lang) ? lang : 'en') + '"]').classList.add('active');
		this.pageTranslate(doc, lang);

		if (!dbLen) { // if LocalStorage database is totally empty
			container.insertAdjacentHTML('beforeEnd', newItem.join('0'));
		} else {
			for (i = 0; i < dbLen; i += 1) {
				key = DB.key(i);
				if (!isNaN(key)) {
					storedTasks[+key] = this.dbOperate('select', key);
				}
			}
			container.insertAdjacentHTML('beforeEnd', storedTasks.join(''));
			container.insertAdjacentHTML('beforeEnd', newItem.join(dbLen + ''));
		}
		
		this.setStats(doc, container);
		
        container.addEventListener('click', function (e) {
			this.todoCreate(e, doc, container, newItem);
		}.bind(this), false);
		
		doc.getElementById('header').addEventListener('click', function (e) {
			this.setPrefs(e, DB, dbLen, container, newItem);
		}.bind(this), false);
		
		doc.getElementById('sort').addEventListener('click', function (e) {
			this.listSort(e, doc, container);
		}.bind(this), false);
    },
	setPrefs: function (event, DB, dbLen, container, newItem) {
		var doc = this.doc,
			target = event.target,
			buttonBars = doc.getElementById('toggle_menu'),
			arrayProto = Array.prototype,
			hasOwn = Object.prototype.hasOwnProperty,
			prop;
		
		target.classList.contains('fa-bars') && buttonBars.classList.toggle('active');
		
		if (target.tagName === 'LI') {
			if (target.hasAttribute('data-lang') && !target.classList.contains('active')) {
				arrayProto.forEach.call(doc.querySelectorAll('[data-lang]'), function (elem) {
					elem.classList.toggle('active');
				});
				
				this.dbOperate('insert', 'lang', target.dataset.lang);
				this.pageTranslate(doc, target.dataset.lang);
			} else if (target.hasAttribute('data-theme') && !target.classList.contains('active')) {
				this.changeTheme(target.dataset.langEn.split(' ')[0].toLowerCase());
				
				arrayProto.forEach.call(doc.querySelectorAll('[data-theme]'), function (elem) {
					elem.classList.toggle('active');
				});
				
				// target.classList.add('active');
			} else if (target.hasAttribute('data-clear')) {
				for (prop in DB) {
					if (hasOwn.call(DB, prop) && !isNaN(prop)) {
						this.dbOperate('remove', prop);
					}
				}
				container.innerHTML = newItem.join('0');
			}
		}
	},
	changeTheme: function (newStyle) {
		var themeName = newStyle + '-theme',
			docBody = this.doc.body;
		
		docBody.className = '';
		docBody.classList.add(themeName);
		this.dbOperate('insert', 'theme', themeName);
	},
	pageTranslate: function (doc, currentLang) {
		Array.prototype.forEach.call(doc.querySelectorAll('[data-lang-' + currentLang + ']'), function (elem) {
			// One of the fastest way nowdays to capitalize strings.
			elem.textContent = elem.dataset['lang' + currentLang.charAt(0).toUpperCase() + currentLang.substring(1)];
		});
	},
	setStats: function (doc, container) {
		var totalCell = doc.getElementById('stat_total'),
			doneCell = doc.getElementById('stat_done'),
			planCell = doc.getElementById('stat_plan'),
			total = totalCell.textContent = container.childNodes.length - 1,
			done = doneCell.textContent = container.querySelectorAll('button[data-state="X"]').length;
			
		planCell.textContent = total - done;
	},
	listSort: function (event, doc, container) {
		var target = event.target, 
			doneTasks = container.querySelectorAll('label[data-state="X"]'),
			fragment = doc.createDocumentFragment();
		
		Array.prototype.forEach.call(doneTasks, function (elem) {
			fragment.appendChild(elem);
		});
			
		if (!target.dataset.state || target.dataset.state === 'asc') {
			container.insertBefore(fragment, container.firstChild);
			target.dataset.state = 'desc';
		} else {
			container.insertBefore(fragment, container.lastChild);
			target.dataset.state = 'asc';
		}
	},
	todoCreate: function (event, doc, container, newItem) {
		var target = event.target,
			item = target.parentNode,
            input = target.previousSibling,
			trash = '<i class="fa fa-trash-o"></i>';

		if (target.tagName !== 'BUTTON' || !target.previousSibling.value) {
			return;
		}

		switch (target.dataset.state) {
		case 'add':
			target.textContent = '−';
			target.dataset.state = 'done';
			container.insertAdjacentHTML('beforeEnd', newItem.join(this.db.length + ''));
			input.setAttribute('value', input.value);
			input.dataset.id = this.db.length;
			this.dbOperate('insert', this.db.length, item.outerHTML);
			break;
		case 'done':
			input.setAttribute('disabled', 'disabled');
			input.classList.add('shadow');
			target.innerHTML = trash;
			target.dataset.state = item.dataset.state = 'X';
			this.dbOperate('update', input.dataset.id, item.outerHTML);
			break;
		case 'X':
			item.parentNode.removeChild(item);
			this.dbOperate('remove', input.dataset.id);
		}
		
		this.setStats(doc, container);
	},
	dbOperate: function (operation, key, value) {
		var DB = this.db;
		
		switch (operation) {
		case 'insert':
		case 'update':
			DB.setItem(key, value);
			break;
		case 'select':
			return DB.getItem(key);
		case 'remove':
			DB.removeItem(key);
			break;
		case 'clear':
			DB.clear();
		}
	}
};