export const state = {
    tasks: {
        task1: {
            id: 'task1',
            title: 'Add button'
        },
        task2: {
            id: 'task2',
            title: 'Enhance UI'
        }, 
        task3: {
            id: 'task3',
            title: 'Test the frontend'
        },
        task4: {
            id: 'task4',
            title: 'Toggle animation theme'
        },
        task5: {
            id: 'task5',
            title: 'Train ML model'
        },
        task6: {
            id: 'task6',
            title: 'Multi-service architecture'
        },
        task7: {
            id: 'task7',
            title: 'Deployment'
        },
    },

    columns: {
        requested: {
            id: 'requested',
            title: 'REQUESTED',
            taskIds: ['task1', 'task5', 'task6'],
            colorTheme: 'blue'
        },
        in_progress: {
            id: 'in_progress',
            title: 'IN PROGRESS',
            taskIds: ['task3', 'task7'],
            colorTheme: 'orange'
        },
        done: {
            id: 'done',
            title: 'DONE',
            taskIds: ['task2','task4'],
            colorTheme: 'green'
        }
    },

    columnOrder: ['requested', 'in_progress', 'done']
};

export function setState(updates)
{
    Object.assign(state, updates);
}

export function getTask(taskId)
{
    return state.tasks[taskId];
}