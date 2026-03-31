export const state = {
    tasks: initTasks(),
    
    columns: {
        requested: createColumn('requested', 'REQUESTED', 'blue'),
        in_progress: createColumn('in_progress', 'IN PROGRESS', 'orange'),
        done: createColumn('done', 'DONE', 'green')
    },

    columnOrder: ['requested', 'in_progress', 'done']
};

function initTasks()
{
    return JSON.parse(localStorage.getItem('tasks')) || {};
}

function saveTasksOnLocal()
{
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
}

function initTasksInColumn(columnId)
{
    return JSON.parse(localStorage.getItem(columnId)) || [];
}

function saveTasksInColumnOnLocal(columnId)
{
    localStorage.setItem(columnId, JSON.stringify(state.columns[columnId].taskIds));
}

export function getTask(taskId)
{
    const task = state.tasks[taskId];
    if(!task) {
        console.log(`Task not found: ${task}`);
        return null;
    }
    return task;
}

// Draft task
export function setDraftTask(columnId)
{
    state.draftTask = {
        columnId,
        title: ''
    };
}

export function clearDraftTask()
{
    delete state.draftTask;
}

export function addTask(task)
{
    state.tasks[task.id] = task;
    saveTasksOnLocal();
}

function getColumn(columnId)
{
    return state.columns[columnId];
}

export function saveTaskInColumn(columnId, taskId)
{
    const column = getColumn(columnId);
    column.taskIds.push(taskId);
    saveTasksInColumnOnLocal(columnId);
}

// Creating columns
function createColumn(id, title, colorTheme)
{
    return {
        id,
        title,
        taskIds: initTasksInColumn(id),
        colorTheme
    };
}

// Deleting tasks
function deleteTask(taskId)
{
    delete state.tasks[taskId];
    saveTasksOnLocal();
}

function deleteTaskInColumn(columnId, taskId)
{
    const column = getColumn(columnId);
    column.taskIds = column.taskIds.filter(id => id !== taskId);
    saveTasksInColumnOnLocal(columnId);
}

export function clearTask(columnId, taskId)
{
    deleteTask(taskId);
    deleteTaskInColumn(columnId, taskId);
}

// Draggable
export function setDragState(taskId, sourceColumnId)
{
    state.dragState = {
        taskId,
        sourceColumnId
    };
}

export function clearDragState()
{
    delete state.dragState;
}

export function updateColumnsOnSuccessfulDrag(targetColumnId)
{
    const { taskId, sourceColumnId } = state?.dragState;
    if(!sourceColumnId) return;

    deleteTaskInColumn(sourceColumnId, taskId);
    saveTaskInColumn(targetColumnId, taskId);
}