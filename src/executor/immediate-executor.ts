import { Executor, Task } from './executor';

export class ImmediateExecutor implements Executor {
  async execute<T>(task: Task<T>): Promise<T> {
    console.log('Executing task:', task);
    const result = await task.task();
    console.log('Result of task:', task, result);
    
    return result;
  }
}
