interface Task {
                    name?: string;
              description: string;
    readonly creationDate: number;
                    tags?: Array<string>;
                 priority: number;
                    state: number;
                deadline?: number;
}

export class TaskModel implements Task {
    // TODO: implements
}
