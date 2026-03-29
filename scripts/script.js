import { state, getTask } from "./state.js";

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
            <section class="column" data-column-id="${column.id}">
                <div class="column-title ${column.colorTheme}">
                    ${column.title}
                </div>
                <section class="task-container" data-column-id="${column.id}">
                    ${generateTasks(column)}
                </section>
            </section>
        `;
    }).join('');
}

function generateTasks(column)
{
    const { taskIds, colorTheme } = column;
    return taskIds.map(taskId => {
        const task = getTask(taskId);
        return `
            <div class="task-card" data-task-id="${task.id}" draggable="true">
                <div class="task-header ${colorTheme}">${task.title}</div>
            </div>
        `;
    }).join('');
}

