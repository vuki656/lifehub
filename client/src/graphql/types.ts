/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

export type Maybe<T> = null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** Represents NULL values */
  Void: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  isUserAuthenticated: Scalars['Boolean'];
  username: Scalars['String'];
};

export type CreateTaskPayload = {
  __typename?: 'CreateTaskPayload';
  task: Task;
};

export type DeleteAllTasksAndMetaDataPayload = {
  __typename?: 'DeleteAllTasksAndMetaDataPayload';
  taskMetaDataId: Scalars['ID'];
};

export type DeleteSingleTaskInstancePayload = {
  __typename?: 'DeleteSingleTaskInstancePayload';
  taskId: Scalars['ID'];
};

export type DeleteTaskPayload = {
  __typename?: 'DeleteTaskPayload';
  taskId: Scalars['ID'];
};

export type GetTasksByDateAndTaskCardPayload = {
  __typename?: 'GetTasksByDateAndTaskCardPayload';
  tasks: Array<Maybe<Task>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty: Maybe<Scalars['String']>;
  createReminder: Reminder;
  createTask: CreateTaskPayload;
  createTaskCard: TaskCard;
  createUser: UserAuth;
  deleteAllTasksAndMetaData: DeleteAllTasksAndMetaDataPayload;
  deleteReminder: ReminderDeleteResponse;
  deleteSingleTaskInstance: DeleteSingleTaskInstancePayload;
  deleteTask: DeleteTaskPayload;
  deleteTaskCard: TaskCardDeleteResponse;
  logInUser: UserAuth;
  toggleTaskCompleted: ToggleTaskCompletedPayload;
  turnOffRepeating: Maybe<Scalars['Void']>;
  updateReminder: Reminder;
  updateTask: UpdateTaskPayload;
  updateTaskCard: TaskCard;
};


export type MutationCreateReminderArgs = {
  description: Maybe<Scalars['String']>;
  endDate: Scalars['String'];
  startDate: Scalars['String'];
  title: Scalars['String'];
  username: Scalars['String'];
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationCreateTaskCardArgs = {
  name: Scalars['String'];
  username: Scalars['String'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  username: Scalars['String'];
};


export type MutationDeleteAllTasksAndMetaDataArgs = {
  input: DeleteAllTasksAndMetaDataInput;
};


export type MutationDeleteReminderArgs = {
  id: Scalars['String'];
};


export type MutationDeleteSingleTaskInstanceArgs = {
  input: DeleteSingleTaskInstanceInput;
};


export type MutationDeleteTaskArgs = {
  input: DeleteTaskInput;
};


export type MutationDeleteTaskCardArgs = {
  id: Scalars['String'];
};


export type MutationLogInUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationToggleTaskCompletedArgs = {
  input: ToggleTaskCompletedInput;
};


export type MutationTurnOffRepeatingArgs = {
  input: TurnOffRepeatingInput;
};


export type MutationUpdateReminderArgs = {
  description: Maybe<Scalars['String']>;
  endDate: Scalars['String'];
  id: Scalars['String'];
  startDate: Scalars['String'];
  title: Scalars['String'];
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};


export type MutationUpdateTaskCardArgs = {
  id: Scalars['String'];
  name: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _empty: Maybe<Scalars['String']>;
  getAllTaskCards: Array<Maybe<TaskCard>>;
  getRemindersByDate: Array<Reminder>;
  getTasksByDateAndTaskCard: GetTasksByDateAndTaskCardPayload;
  verifyUser: AuthResponse;
};


export type QueryGetAllTaskCardsArgs = {
  username: Scalars['String'];
};


export type QueryGetRemindersByDateArgs = {
  selectedDate: Scalars['String'];
  username: Scalars['String'];
};


export type QueryGetTasksByDateAndTaskCardArgs = {
  input: GetTasksByDateAndTaskCardInput;
};


export type QueryVerifyUserArgs = {
  token: Maybe<Scalars['String']>;
};

export type Reminder = {
  __typename?: 'Reminder';
  description: Maybe<Scalars['String']>;
  endDate: Scalars['Date'];
  id: Scalars['String'];
  startDate: Scalars['Date'];
  title: Scalars['String'];
};

export type ReminderDeleteResponse = {
  __typename?: 'ReminderDeleteResponse';
  id: Scalars['String'];
};

export type Task = {
  __typename?: 'Task';
  date: Scalars['Date'];
  id: Scalars['ID'];
  isCompleted: Maybe<Scalars['Boolean']>;
  taskMetaData: TaskMetaData;
};

export type TaskCard = {
  __typename?: 'TaskCard';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type TaskCardDeleteResponse = {
  __typename?: 'TaskCardDeleteResponse';
  id: Scalars['String'];
};

export type TaskMetaData = {
  __typename?: 'TaskMetaData';
  endDate: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  isHabit: Maybe<Scalars['Boolean']>;
  isRepeating: Maybe<Scalars['Boolean']>;
  nextRepeatingInstance: Maybe<Scalars['Date']>;
  note: Maybe<Scalars['String']>;
  rrule: Maybe<Scalars['String']>;
  startDate: Maybe<Scalars['Date']>;
  taskCard: TaskCard;
  title: Scalars['String'];
};

export type ToggleTaskCompletedPayload = {
  __typename?: 'ToggleTaskCompletedPayload';
  task: Task;
};

export type UpdateTaskPayload = {
  __typename?: 'UpdateTaskPayload';
  task: Task;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserAuth = {
  __typename?: 'UserAuth';
  token: Scalars['String'];
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type CreateTaskInput = {
  date: Scalars['Date'];
  taskMetaData: Maybe<TaskMetaDataInput>;
};

export type DeleteAllTasksAndMetaDataInput = {
  taskMetaDataId: Scalars['ID'];
};

export type DeleteSingleTaskInstanceInput = {
  rruleStr: Scalars['String'];
  taskId: Scalars['ID'];
  taskMetaDataId: Scalars['ID'];
};

export type DeleteTaskInput = {
  taskId: Scalars['ID'];
  taskMetaDataId: Scalars['ID'];
};

export type GetTasksByDateAndTaskCardInput = {
  selectedDate: Scalars['Date'];
  taskCardId: Scalars['String'];
};

export type TaskMetaDataInput = {
  endDate: Maybe<Scalars['Date']>;
  id: Maybe<Scalars['ID']>;
  isHabit: Maybe<Scalars['Boolean']>;
  isRepeating: Maybe<Scalars['Boolean']>;
  nextRepeatingInstance: Maybe<Scalars['Date']>;
  note: Maybe<Scalars['String']>;
  rrule: Maybe<Scalars['String']>;
  startDate: Maybe<Scalars['Date']>;
  taskCard: Scalars['String'];
  title: Scalars['String'];
};

export type ToggleTaskCompletedInput = {
  id: Scalars['ID'];
};

export type TurnOffRepeatingInput = {
  taskId: Scalars['ID'];
  taskMetaDataId: Scalars['ID'];
};

export type UpdateTaskInput = {
  date: Scalars['Date'];
  id: Scalars['ID'];
  isCompleted: Maybe<Scalars['Boolean']>;
  taskMetaData: TaskMetaDataInput;
};




export type CreateReminderMutationVariables = Exact<{
  title: Scalars['String'];
  description: Maybe<Scalars['String']>;
  username: Scalars['String'];
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type CreateReminderMutation = (
  { __typename?: 'Mutation' }
  & { createReminder: (
    { __typename?: 'Reminder' }
    & Pick<Reminder, 'id' | 'title' | 'description' | 'startDate' | 'endDate'>
  ) }
);

export type UpdateReminderMutationVariables = Exact<{
  id: Scalars['String'];
  title: Scalars['String'];
  description: Maybe<Scalars['String']>;
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type UpdateReminderMutation = (
  { __typename?: 'Mutation' }
  & { updateReminder: (
    { __typename?: 'Reminder' }
    & Pick<Reminder, 'id' | 'title' | 'description' | 'startDate' | 'endDate'>
  ) }
);

export type DeleteReminderMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteReminderMutation = (
  { __typename?: 'Mutation' }
  & { deleteReminder: (
    { __typename?: 'ReminderDeleteResponse' }
    & Pick<ReminderDeleteResponse, 'id'>
  ) }
);

export type GetRemindersByDateQueryVariables = Exact<{
  username: Scalars['String'];
  selectedDate: Scalars['String'];
}>;


export type GetRemindersByDateQuery = (
  { __typename?: 'Query' }
  & { getRemindersByDate: Array<(
    { __typename?: 'Reminder' }
    & Pick<Reminder, 'id' | 'title' | 'description' | 'startDate' | 'endDate'>
  )> }
);

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { createTask: (
    { __typename?: 'CreateTaskPayload' }
    & { task: (
      { __typename?: 'Task' }
      & Pick<Task, 'id' | 'date' | 'isCompleted'>
      & { taskMetaData: (
        { __typename?: 'TaskMetaData' }
        & Pick<TaskMetaData, 'title' | 'note' | 'id' | 'startDate' | 'endDate' | 'rrule' | 'isRepeating' | 'isHabit' | 'nextRepeatingInstance'>
        & { taskCard: (
          { __typename?: 'TaskCard' }
          & Pick<TaskCard, 'id'>
        ) }
      ) }
    ) }
  ) }
);

export type GetTasksByDateAndTaskCardQueryVariables = Exact<{
  input: GetTasksByDateAndTaskCardInput;
}>;


export type GetTasksByDateAndTaskCardQuery = (
  { __typename?: 'Query' }
  & { getTasksByDateAndTaskCard: (
    { __typename?: 'GetTasksByDateAndTaskCardPayload' }
    & { tasks: Array<Maybe<(
      { __typename?: 'Task' }
      & Pick<Task, 'id' | 'date' | 'isCompleted'>
      & { taskMetaData: (
        { __typename?: 'TaskMetaData' }
        & Pick<TaskMetaData, 'id' | 'title' | 'note' | 'startDate' | 'endDate' | 'rrule' | 'isRepeating' | 'isHabit' | 'nextRepeatingInstance'>
        & { taskCard: (
          { __typename?: 'TaskCard' }
          & Pick<TaskCard, 'id'>
        ) }
      ) }
    )>> }
  ) }
);

export type ToggleTaskCompletedMutationVariables = Exact<{
  input: ToggleTaskCompletedInput;
}>;


export type ToggleTaskCompletedMutation = (
  { __typename?: 'Mutation' }
  & { toggleTaskCompleted: (
    { __typename?: 'ToggleTaskCompletedPayload' }
    & { task: (
      { __typename?: 'Task' }
      & Pick<Task, 'id' | 'date' | 'isCompleted'>
      & { taskMetaData: (
        { __typename?: 'TaskMetaData' }
        & Pick<TaskMetaData, 'id' | 'title' | 'note' | 'startDate' | 'endDate' | 'rrule' | 'isRepeating' | 'isHabit' | 'nextRepeatingInstance'>
        & { taskCard: (
          { __typename?: 'TaskCard' }
          & Pick<TaskCard, 'id'>
        ) }
      ) }
    ) }
  ) }
);

export type UpdateTaskMutationVariables = Exact<{
  input: UpdateTaskInput;
}>;


export type UpdateTaskMutation = (
  { __typename?: 'Mutation' }
  & { updateTask: (
    { __typename?: 'UpdateTaskPayload' }
    & { task: (
      { __typename?: 'Task' }
      & Pick<Task, 'id' | 'date' | 'isCompleted'>
      & { taskMetaData: (
        { __typename?: 'TaskMetaData' }
        & Pick<TaskMetaData, 'id' | 'title' | 'note' | 'startDate' | 'endDate' | 'rrule' | 'isRepeating' | 'isHabit' | 'nextRepeatingInstance'>
        & { taskCard: (
          { __typename?: 'TaskCard' }
          & Pick<TaskCard, 'id'>
        ) }
      ) }
    ) }
  ) }
);

export type DeleteTaskMutationVariables = Exact<{
  input: DeleteTaskInput;
}>;


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & { deleteTask: (
    { __typename?: 'DeleteTaskPayload' }
    & Pick<DeleteTaskPayload, 'taskId'>
  ) }
);

export type DeleteSingleTaskInstanceMutationVariables = Exact<{
  input: DeleteSingleTaskInstanceInput;
}>;


export type DeleteSingleTaskInstanceMutation = (
  { __typename?: 'Mutation' }
  & { deleteSingleTaskInstance: (
    { __typename?: 'DeleteSingleTaskInstancePayload' }
    & Pick<DeleteSingleTaskInstancePayload, 'taskId'>
  ) }
);

export type DeleteAllTasksAndMetaDataMutationVariables = Exact<{
  input: DeleteAllTasksAndMetaDataInput;
}>;


export type DeleteAllTasksAndMetaDataMutation = (
  { __typename?: 'Mutation' }
  & { deleteAllTasksAndMetaData: (
    { __typename?: 'DeleteAllTasksAndMetaDataPayload' }
    & Pick<DeleteAllTasksAndMetaDataPayload, 'taskMetaDataId'>
  ) }
);

export type TurnOffRepeatingMutationVariables = Exact<{
  input: TurnOffRepeatingInput;
}>;


export type TurnOffRepeatingMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'turnOffRepeating'>
);

export type CreateTaskCardMutationVariables = Exact<{
  name: Scalars['String'];
  username: Scalars['String'];
}>;


export type CreateTaskCardMutation = (
  { __typename?: 'Mutation' }
  & { createTaskCard: (
    { __typename?: 'TaskCard' }
    & Pick<TaskCard, 'id' | 'name'>
  ) }
);

export type UpdateTaskCardMutationVariables = Exact<{
  name: Maybe<Scalars['String']>;
  id: Scalars['String'];
}>;


export type UpdateTaskCardMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskCard: (
    { __typename?: 'TaskCard' }
    & Pick<TaskCard, 'id' | 'name'>
  ) }
);

export type DeleteTaskCardMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteTaskCardMutation = (
  { __typename?: 'Mutation' }
  & { deleteTaskCard: (
    { __typename?: 'TaskCardDeleteResponse' }
    & Pick<TaskCardDeleteResponse, 'id'>
  ) }
);

export type GetAllTaskCardsQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetAllTaskCardsQuery = (
  { __typename?: 'Query' }
  & { getAllTaskCards: Array<Maybe<(
    { __typename?: 'TaskCard' }
    & Pick<TaskCard, 'id' | 'name'>
  )>> }
);

export type CreateUserMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'UserAuth' }
    & Pick<UserAuth, 'token'>
  ) }
);

export type LogInUserMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LogInUserMutation = (
  { __typename?: 'Mutation' }
  & { logInUser: (
    { __typename?: 'UserAuth' }
    & Pick<UserAuth, 'token'>
  ) }
);

export type VerifyUserQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyUserQuery = (
  { __typename?: 'Query' }
  & { verifyUser: (
    { __typename?: 'AuthResponse' }
    & Pick<AuthResponse, 'isUserAuthenticated' | 'username'>
  ) }
);
