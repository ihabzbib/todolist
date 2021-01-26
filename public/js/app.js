"use strict";

const saveTask = async () => {
	const name = document.getElementById('taskName').value;
	const description = document.getElementById('taskDescription').value;
	try {
		const {data} = await axios.post(`/api/task`, {name, description});
		if (data.error) {
			//Close the add task dialog
			dialog('Error', data.error);
		} else {
			getList();
		}
	} catch(e) {
		dialog('Error', e);
	} finally {
		toggleTaskDialog();
	}
}

const toggleTask = async (id) => {
	try {
		const {data} = await axios.put(`/api/task/${id}/toggle`);
		if (data.error) {
			dialog('Error', e);
		} else {
			getList();
		}
	} catch(e) {
		dialog('Error', e);
	}
};

const deleteTask = async (id) => {
	try {
		const {data} = await axios.delete(`/api/task/${id}`);
		console.log(data.error)
		if (data.error) {
			dialog('Error', e);
		} else {
			getList();
		}
	} catch(e) {
		dialog('Error', e);
	}
};

const getList = async () => {
	try {
		const {data, error} = await axios.get(`/api/task`);
		if (error) {
			dialog('Error', error);
		} else {
			render(data);
		}
	} catch(e) {
		dialog('Error', e);
	}
}

const render = (data = []) => {
	const fragment = document.createDocumentFragment();
	data.forEach(item => {
		const el = document.createElement('li');
		el.className = 'list-group-item';
		el.innerHTML = `<div class="todo-indicator bg-warning"></div>
			<div class="widget-content p-0">
				<div class="widget-content-wrapper ${item.done  ? ' line-through' : ''}">
					<div class="widget-content-left">
						<div class="widget-heading text-style">${item.name}<div class="badge badge-danger ml-2">${item.time || ''}</div>
						</div>
						<div class="widget-subheading text-style"><i>${item.description || ''}</i></div>
					</div>
					<div class="widget-content-right">
						<button class="border-0 btn-transition btn ${item.done ? 'btn-outline-success' : ''} " onClick="toggleTask(${item.id})" >
							<i class="fa fa-check"></i>
						</button>
						<button class="border-0 btn-transition btn btn-outline-danger"  onClick="deleteTask(${item.id})">
							<i class="fa fa-trash"></i>
						</button>
					</div>
				</div>
			</div>`;
		fragment.appendChild(el);
	});
	const listGroup = document.getElementById('list-group');
	listGroup.innerHTML = "";
	document.getElementById('list-group').appendChild(fragment)
} 

const parseDOM = async () => {
    const includes = document.getElementsByTagName('include');

    Array.from(includes).forEach(async el => {
      if (el.hasAttribute('src')) {
        const {data} = await axios.get(el.getAttribute('src'));
        el.innerHTML = data;
      }
    });
}

const dialog = (title = 'Tile', text = '') => {
	const modal = document.getElementById('modal');
	const classes = modal.className.split(' ');
	const idx = classes.indexOf('show');

	if (idx > -1) {
		//Show class is always added last
		classes.pop();
	} else {
		classes.push('show')
	}
	document.getElementById('modal-title').innerHTML = title;
	document.getElementById('modal-text').innerHTML = text;
	modal.className = classes.join(' ');
}

const toggleTaskDialog = () => {
	const modal = document.getElementById('add-task-modal');
	const classes = modal.className.split(' ');
	const idx = classes.indexOf('show');

	if (idx > -1) {
		//Close the modal and clear the fields
		classes.pop();
		document.getElementById('taskName').value = '';
		document.getElementById('taskDescription').value = '';
	} else {
		classes.push('show')
	}

	modal.className = classes.join(' ');
}

window.onload = () => {
	parseDOM();
	getList();
}
