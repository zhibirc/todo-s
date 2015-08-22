var APP = {
	db: localStorage,
	doc: document,
	arrayProto: Array.prototype,
    init: function () {
        'use strict';

        var doc = this.doc,
			settingsContainer = doc.getElementById('settings'),
			tasksContainer = doc.getElementById('task_section'),
            newItem = ['<label><input maxlength="160" data-id="', '"><button data-state="add">&plus;</button></label>'],
			lang = (this.dbOperate('select', 'lang') || navigator.language || navigator.browserLanguage).substr(0, 2),
			acceptedLangs = ['en', 'ru'],
			DB = this.db,
			dbLen = DB.length,
			storedTasks = Array(dbLen),
			key,
			i;
		
		this.buildDefense(+this.dbOperate('select', 'lock'), doc, settingsContainer, tasksContainer);
		
		doc.body.classList.add(this.dbOperate('select', 'theme') || 'light-theme');
		doc.querySelector('[data-theme="' + doc.body.className + '"]').classList.add('active');
		
		doc.querySelector('[data-lang="' + (~acceptedLangs.indexOf(lang) ? lang : 'en') + '"]').classList.add('active');
		this.pageTranslate(doc, lang);

		if (!dbLen) { // if LocalStorage database is totally empty
			tasksContainer.insertAdjacentHTML('beforeEnd', newItem.join('0'));
		} else {
			for (i = 0; i < dbLen; i += 1) {
				key = DB.key(i);
				if (!isNaN(key)) {
					storedTasks[+key] = this.dbOperate('select', key);
				}
			}
			tasksContainer.insertAdjacentHTML('beforeEnd', storedTasks.join(''));
			tasksContainer.insertAdjacentHTML('beforeEnd', newItem.join(dbLen + ''));
		}
		
		this.setStats(doc, tasksContainer);
		
		doc.getElementById('header').addEventListener('click', function (e) {
			this.setPrefs(e, DB, dbLen, doc, settingsContainer, tasksContainer, newItem);
		}.bind(this), false);
		
		doc.getElementById('sort').addEventListener('click', function (e) {
			this.listSort(e, doc, tasksContainer);
		}.bind(this), false);
		
        tasksContainer.addEventListener('click', function (e) {
			this.todoCreate(e, doc, tasksContainer, newItem);
		}.bind(this), false);
    },
	setPrefs: function (event, DB, dbLen, doc, settingsContainer, tasksContainer, newItem) {
		var target = event.target,
			buttonBars = doc.getElementById('toggle_menu'),
			arrayProto = this.arrayProto,
			hasOwn = Object.prototype.hasOwnProperty,
			prop;
		
		target.classList.contains('fa-bars') && buttonBars.classList.toggle('active');
		
		target.classList.contains('fa-unlock') && this.buildDefense(1, doc, settingsContainer, tasksContainer);
		target.classList.contains('fa-lock') && this.buildDefense(0, doc, settingsContainer, tasksContainer);
		
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
			} else if (target.hasAttribute('data-clear')) {
				for (prop in DB) {
					if (hasOwn.call(DB, prop) && !isNaN(prop)) {
						this.dbOperate('remove', prop);
					}
				}
				tasksContainer.innerHTML = newItem.join('0');
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
		this.arrayProto.forEach.call(doc.querySelectorAll('[data-lang-' + currentLang + ']'), function (elem) {
			// One of the fastest way nowdays to capitalize strings.
			elem.textContent = elem.dataset['lang' + currentLang.charAt(0).toUpperCase() + currentLang.substring(1)];
		});
	},
	setStats: function (doc, tasksContainer) {
		var totalCell = doc.getElementById('stat_total'),
			doneCell = doc.getElementById('stat_done'),
			planCell = doc.getElementById('stat_plan'),
			total = totalCell.textContent = tasksContainer.childNodes.length - 1,
			done = doneCell.textContent = tasksContainer.querySelectorAll('button[data-state="X"]').length;
			
		planCell.textContent = total - done;
	},
	listSort: function (event, doc, tasksContainer) {
		var target = event.target, 
			doneTasks = tasksContainer.querySelectorAll('label[data-state="X"]'),
			fragment = doc.createDocumentFragment();
		
		this.arrayProto.forEach.call(doneTasks, function (elem) {
			fragment.appendChild(elem);
		});
			
		if (!target.dataset.state || target.dataset.state === 'asc') {
			tasksContainer.insertBefore(fragment, tasksContainer.firstChild);
			target.dataset.state = 'desc';
		} else {
			tasksContainer.insertBefore(fragment, tasksContainer.lastChild);
			target.dataset.state = 'asc';
		}
	},
	todoCreate: function (event, doc, tasksContainer, newItem) {
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
			tasksContainer.insertAdjacentHTML('beforeEnd', newItem.join(this.db.length + ''));
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
		
		this.setStats(doc, tasksContainer);
	},
	buildDefense: function (flag, doc, settingsContainer, tasksContainer) {
		var lockIcon = doc.querySelector('.fa-lock'),
			unlockIcon = doc.querySelector('.fa-unlock'),
			menuIcon = doc.querySelector('.fa-bars'),
			sortIcon = doc.getElementById('sort');
			
		if (flag === 1) {
			unlockIcon.classList.add('hidden');
			lockIcon.classList.remove('hidden');
			
			[menuIcon, settingsContainer, sortIcon, tasksContainer].forEach(function (elem) {
				elem.classList.add('disabled');
			});
			
			this.dbOperate('insert', 'lock', 1);
		} else if (flag === 0) {
			unlockIcon.classList.remove('hidden');
			lockIcon.classList.add('hidden');
			
			[menuIcon, settingsContainer, sortIcon, tasksContainer].forEach(function (elem) {
				elem.classList.remove('disabled');
			});
			
			this.dbOperate('insert', 'lock', 0);
		}
		
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