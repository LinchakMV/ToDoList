import React from 'react';
import TodoStore from './store/todo';
import { observer } from 'mobx-react';

function TodoItem({ todo }) {
    return (
        <li className="tasks__item">
            <h3>{todo.title}</h3> <div className="tasks__name"><span>Priority:</span>{todo.priority}<span>Project:</span>{todo.project}<span>Done:</span>{todo.done.toString()}</div>
            <p>{todo.expanded ? `${todo.description || ''}` : null}</p>
            {!TodoStore.isEditMode && <button disabled={TodoStore.isAddMode} onClick={() => TodoStore.toggleEditMode(todo)}>Edit</button>}
            <button onClick={() => todo.toggle()}>{!todo.done ? 'Mark as done' : 'Mark as undone'}</button>
            <button onClick={() => todo.toggleExpand()}>{!todo.expanded ? 'Expand' : 'Collapse'}</button>
        </li>
    );
}

export default observer(TodoItem);
