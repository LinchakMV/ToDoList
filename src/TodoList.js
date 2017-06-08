import React from 'react';
import TodoStore from './store/todo';
import { observer } from 'mobx-react';
import TodoItem from './TodoItem';

function submitForm(e) {
    e.preventDefault();
    const description = e.currentTarget.elements['description'].value || '';
    const title = e.currentTarget.elements['title'].value || '';
    const project = e.currentTarget.elements['project'].value || '';
    const priority = ~~e.currentTarget.elements['priority'].value || 1;

    TodoStore.addTodo({ description, title, project, priority });

    e.currentTarget.reset();
}

function submitEditForm(e, id) {
    e.preventDefault();

    const description = e.currentTarget.elements['description'].value || '';
    const title = e.currentTarget.elements['title'].value || '';
    const project = e.currentTarget.elements['project'].value || '';
    const priority = ~~e.currentTarget.elements['priority'].value || 1;

    TodoStore.updateTodo(id, { description, title, project, priority });
}

function TodoList() {
    return (
        <div className="tasks">
            <ul className="tasks__list">
                {TodoStore.list.map((item) => <TodoItem key={item.id} todo={item}/>)}
            </ul>
            {!(TodoStore.isEditMode || TodoStore.isAddMode) && (
                <div className="addTasks">
                    <button onClick={() => TodoStore.setAddMode()}>New task</button>
                    By prio <input type="checkbox" onChange={TodoStore.togglePrio} checked={TodoStore.isByPrio}/>
                    <select onChange={({ currentTarget }) => TodoStore.setSelectedProject(currentTarget.value)} value={TodoStore.selectedProject}>
                        <option value={''}>All</option>
                        {TodoStore.projectsList.map((project, i) => <option key={i} value={project}>{project}</option>)}
                    </select>
                </div>
            )}
            {(TodoStore.isEditMode) && (
                <div>
                    <form onSubmit={(e) => submitEditForm(e, TodoStore.selectedTodo.id)}>
                        Title <input name="title" required defaultValue={TodoStore.selectedTodo.title} />
                        Project <input name="project" defaultValue={TodoStore.selectedTodo.project}/>
                        Prio <select name="priority" defaultValue={TodoStore.selectedTodo.priority}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                             </select>
                        Desc <textarea name="description" defaultValue={TodoStore.selectedTodo.description}/>

                        <button type="submit">Save</button>
                        <button onClick={() => TodoStore.toggleEditMode()}>Cancel</button>
                    </form>
                </div>
            )}
            {(TodoStore.isAddMode) &&
                (
                <div>
                    <form onSubmit={submitForm}>
                        Title <input name="title" required />
                        Project <input name="project"/>
                        Prio <select name="priority" >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                             </select>
                        Desc <textarea name="description"/>

                        <button type="submit">Save</button>
                        <button onClick={() => TodoStore.setAddMode()}>Cancel</button>
                    </form>
                </div>    
                )}
        </div>
    );
}

export default observer(TodoList);
