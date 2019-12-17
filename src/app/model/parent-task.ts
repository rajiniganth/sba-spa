export class ParentTask {

  parentId: number;
  parentTask: string;


  constructor() { }

  set setParentTask(parentTask: string) {
    this.parentTask = parentTask;
  }

  set setParentId(parentId: number) {
    this.parentId = parentId;
  }

  get getParentTask(): string {
    return this.parentTask;
  }

  get getParentId(): number {
    return this.parentId;
  }

}
