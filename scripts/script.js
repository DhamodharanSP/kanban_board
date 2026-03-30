import { state, getTask, addTask, updateColumn, setDraftTask, clearDraftTask } from "./state.js";

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
                <section class="task-container" data-column-id="${column.id}">
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
        <div class="task-card" data-task-id="${task.id}" draggable="true">
            <div class="task-header ${colorTheme}">${task.title}</div>
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

    updateColumn(column, newTaskId);

    removeDraftTask();
}

function removeDraftTask()
{
    clearDraftTask();
}