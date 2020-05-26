export class Task {
  _id: string;
  description: string;
  status: taskStatus;
  assignee: {
    _id: string;
    name: string;
    employeeId: number;
    password: string;
    isManager: boolean;
    reportTo: string;
  };
  date: string;
}

export enum taskStatus {
  pending = 'pending',
  ongoing = 'ongoing',
  completed = 'completed',
}
