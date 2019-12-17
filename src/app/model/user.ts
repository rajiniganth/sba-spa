export class User {

    userId: number;
    firstName: string;
    lastName: string;
    employeeId: string;

    constructor() { }

    set setFirstName(firstName: string) {
        this.firstName = firstName;
    }

    set setLastName(lastName: string) {
        this.lastName = lastName;
    }

    set setEmployeeId(employeeId: string) {
        this.employeeId = employeeId;
    }

    set setUserId(userId: number) {
      this.userId = userId;
  }

    get getFirstName(): string {
      return this.firstName;
    }

    get getLastName(): string {
      return this.lastName;
    }

    get getEmployeeId(): string {
      return this.employeeId;
    }

    get getUserId(): number {
      return this.userId;
    }
}
