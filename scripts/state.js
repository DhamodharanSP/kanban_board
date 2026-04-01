export const state = loadState();

function loadState()
{
    const savedState = JSON.parse(localStorage.getItem('kanbanState'));

    if(savedState) {
        delete savedState.dragState;
        delete savedState.draftTask;
        return savedState;
    }

    return {
        tasks: {},
        
        columns: {
            requested: createColumn('requested', 'REQUESTED', 'blue'),
            in_progress: createColumn('in_progress', 'IN PROGRESS', 'orange'),
            done: createColumn('done', 'DONE', 'green')
        },

        columnOrder: ['requested', 'in_progress', 'done']
    };
}

function saveState()
{
    const { tasks, columns, columnOrder } = state;
    const persistentState = {
        tasks,
        columns,
        columnOrder
    };
    localStorage.setItem('kanbanState', JSON.stringify(persistentState));
}

export function getTask(taskId)
{
    const task = state.tasks[taskId];
    if(!task) {
        console.log(`Task not found: ${taskId}`);
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
    saveState();
}

function getColumn(columnId)
{
    return state.columns[columnId];
}

export function saveTaskInColumn(columnId, taskId)
{
    const column = getColumn(columnId);
    column.taskIds.push(taskId);
    saveState();
}

// Creating columns
function createColumn(id, title, colorTheme)
{
    return {
        id,
        title,
        taskIds: [],
        colorTheme
    };
}

// Deleting tasks
function deleteTask(taskId)
{
    delete state.tasks[taskId];
    saveState();
}

function deleteTaskInColumn(columnId, taskId)
{
    const column = getColumn(columnId);
    column.taskIds = column.taskIds.filter(id => id !== taskId);
    saveState();
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