import { state, getTask, addTask, saveTaskInColumn, setDraftTask, clearDraftTask, clearTask } from "./state.js";

const kanbanBoard = document.querySelector('.js-kanban-board');

renderTable();

export function renderTable()
{
    kanbanBoard.innerHTML = generateColumns();
}

function generateColumns()
{
    const columns = state.columnOrder;
    return columns.map(columnName => {
        const column = state.columns[columnName];
        return `
            <section class="column js-column" data-column-id="${column.id}">
                <div class="column-title ${column.colorTheme}">
                    ${column.title}
                    <div class="add-task-btn js-add-task-btn">
                        +
                    </div>
                </div>
                <section class="task-container js-task-container" data-column-id="${column.id}">
                    ${generateTasks(column)}
                    ${renderDraftTask(column)}
                </section>
            </section>
        `;
    }).join('');
}

function generateTasks(column)
{
    const { taskIds, colorTheme } = column;
    return taskIds.map(taskId => getTask(taskId)).map(task => renderTasks(task, colorTheme)).join('');
}

function renderTasks(task, colorTheme)
{
    return `
        <div class="task-card js-task-card" data-task-id="${task.id}" draggable="true">
            <div class="task-header ${colorTheme}">${task.title}</div>
            <div class="delete-task js-delete-task-btn">
                <span class="material-symbols-outlined">delete</span>
            </div>
        </div>
    `;
}

function renderDraftTask(column)
{
    const draftTask = state.draftTask;
    if(column.id !== draftTask?.columnId) return '';
    const { colorTheme } = column;
    return `
        <div class="task-card js-draft-task" data-column-id="${column.id}" draggable="true">
            <input type="text" class="task-header ${colorTheme} js-draft-task-input" placeholder="Enter new Task"}>
            <div class="task-options js-task-options">
                <button class="clear-task js-clear-task">X</button>
                <button class="save-task js-save-task">V</button>
            </div>
        </div>
    `;
}

kanbanBoard.addEventListener('click', (event) => {
    const { target } = event;
    const addDraftTaskButton = target.closest('.js-add-task-btn');

    const saveButton = target.closest('.js-save-task');
    const clearButton = target.closest('.js-clear-task');

    const deleteButton = target.closest('.js-delete-task-btn');

    if(addDraftTaskButton) {
        const column = target.closest('.js-column');
        addDraftTask(column);
        renderTable();
    }
    else if(saveButton) {
        saveDraftTask(saveButton);
        renderTable();
    }
    else if(clearButton) {
        removeDraftTask();
        renderTable();
    }
    else if(deleteButton) {
        removeTask(deleteButton);
        renderTable();
    }
});

function addDraftTask(column)
{
    const { columnId } = column.dataset;
    setDraftTask(columnId);
}

function saveDraftTask(saveButton)
{   
    const draftTaskCard = saveButton.closest('.js-draft-task');
    const draftInput = draftTaskCard.querySelector('.js-draft-task-input');

    const draftValue = draftInput.value;
    if(!draftValue.trim()) return;

    const newTaskId = crypto.randomUUID();

    const newTask = {
        id: newTaskId,
        title: draftValue
    };

    addTask(newTask);

    const { draftTask } = state;
    const column = state.columns[draftTask.columnId];

    saveTaskInColumn(column, newTaskId);

    removeDraftTask();
}

function removeDraftTask()
{
    clearDraftTask();
}

// Deleting a task
function removeTask(deleteButton)
{
    const task = deleteButton.closest('.js-task-card');
    const { taskId } = task.dataset;

    const taskContainer = task.closest('.js-task-container');
    const { columnId } = taskContainer.dataset;

    clearTask(columnId, taskId);
}