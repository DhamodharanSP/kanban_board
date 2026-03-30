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

export function saveTaskInColumn(column, taskId)
{
    column.taskIds.push(taskId);
    saveTasksInColumnOnLocal(column.id);
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
    const column = state.columns[columnId];
    column.taskIds = column.taskIds.filter(id => id !== taskId);
    saveTasksInColumnOnLocal(column.id);
}

export function clearTask(columnId, taskId)
{
    deleteTask(taskId);
    deleteTaskInColumn(columnId, taskId);
}