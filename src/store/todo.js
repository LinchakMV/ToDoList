import { types, onSnapshot, applySnapshot } from 'mobx-state-tree';
import uuid from 'uuid';

const Todo = types.model('Todo', {
    id: types.string,
    title: types.string,
    project: types.string,
    priority: types.number,
    description: types.string,
    done: false,
    expanded: false
}, {
    toggle() {
        this.done = !this.done
    },

    toggleExpand() {
        this.expanded = !this.expanded;
    }
})

const Store = types.model('Store', {
    todos: types.array(Todo),
    selectedProject: types.string,
    isByPrio: types.boolean,
    isAddMode: types.boolean,
    isEditMode: types.boolean,
    selectedTodo: types.reference(Todo),

    get list() {
        let list = this.todos.slice().filter(t => !!t);

        if (this.isByPrio) {
            list = list.sort((a, b) => a.priority > b.priority);
        }

        if (this.selectedProject) {
            list = list.filter(t => t.project === this.selectedProject);
        }

        return list.filter(t => !t.done);
    },

    get projectsList() {
        return [...new Set(this.todos.slice().filter(t => !!t).filter(t => !t.done).map(t => t.project))];
    }
}, {
    afterCreate() {
        const todos = localStorage.getItem('todosStore');
        
        if (todos) {
            applySnapshot(this, JSON.parse(todos));
        }
    },

    setAddMode() {
        this.isAddMode = !this.isAddMode;
    },

    addTodo(todoModel) {
        this.todos.push({ id: uuid(), ...todoModel });
    },

    updateTodo(id, model) {
        const item = this.todos.find(todo => todo.id === id);
        if (item) {
            item.title = model.title;
            item.description = model.description;
            item.priority = model.priority;
            item.project = model.project;
        }
    },

    setSelectedProject(name) {
        this.selectedProject = name;
    },

    togglePrio() {
        this.isByPrio = !this.isByPrio;
    },

    toggleEditMode(todo) {
        this.isEditMode = !this.isEditMode;
        this.selectedTodo = todo;
    }
})

// create an instance from a snapshot
const store = Store.create({ todos: [
    {
        title: 'My first todo',
        project: 'Self',
        description: '',
        priority: 2,
        id: uuid()
    },
    {
        title: 'My second todo',
        project: 'Work',
        description: '',
        priority: 1,
        id: uuid()
    }
], selectedProject: '', isByPrio: false, isAddMode: false, isEditMode: false, selectedTodo: null });

// listen to new snapshots
onSnapshot(store, (snapshot) => {
    localStorage.setItem('todosStore', JSON.stringify(snapshot));
})

export default store;