/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: string;
};

export type CardType = {
  __typename?: 'CardType';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type CreateCardPayload = {
  __typename?: 'CreateCardPayload';
  card: CardType;
};

export type CreateReminderPayload = {
  __typename?: 'CreateReminderPayload';
  reminder: ReminderType;
};

export type CreateTaskPayload = {
  __typename?: 'CreateTaskPayload';
  task: TaskType;
};

export type DeleteCardPayload = {
  __typename?: 'DeleteCardPayload';
  id: Scalars['String'];
};

export type DeleteReminderPayload = {
  __typename?: 'DeleteReminderPayload';
  id: Scalars['String'];
};

export type DeleteTaskPayload = {
  __typename?: 'DeleteTaskPayload';
  id: Scalars['String'];
};

export type EditCardPayload = {
  __typename?: 'EditCardPayload';
  card: CardType;
};

export type EditReminderPayload = {
  __typename?: 'EditReminderPayload';
  reminder: ReminderType;
};

export type EditTaskPayload = {
  __typename?: 'EditTaskPayload';
  task: TaskType;
};

export type LogInUserPayload = {
  __typename?: 'LogInUserPayload';
  token: Scalars['String'];
  userId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCard: CreateCardPayload;
  createReminder: CreateReminderPayload;
  createTask: CreateTaskPayload;
  deleteCard: DeleteCardPayload;
  deleteReminder: DeleteReminderPayload;
  deleteTask: DeleteTaskPayload;
  editCard: EditCardPayload;
  editReminder: EditReminderPayload;
  editTask: EditTaskPayload;
  logInUser: LogInUserPayload;
  registerUser: RegisterUserPayload;
  toggleTask: ToggleTaskPayload;
};


export type MutationCreateCardArgs = {
  input: CreateCardInput;
};


export type MutationCreateReminderArgs = {
  input: CreateReminderInput;
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationDeleteCardArgs = {
  input: DeleteCardInput;
};


export type MutationDeleteReminderArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTaskArgs = {
  input: DeleteTaskInput;
};


export type MutationEditCardArgs = {
  input: EditCardInput;
};


export type MutationEditReminderArgs = {
  input: EditReminderInput;
};


export type MutationEditTaskArgs = {
  input: EditTaskInput;
};


export type MutationLogInUserArgs = {
  input: LogInUserInput;
};


export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};


export type MutationToggleTaskArgs = {
  input: ToggleTaskInput;
};

export type Query = {
  __typename?: 'Query';
  cards: Array<CardType>;
  reminder?: Maybe<ReminderType>;
  reminders: Array<ReminderType>;
  task: TaskType;
  tasks: Array<TaskType>;
  verifyUser: UserType;
};


export type QueryReminderArgs = {
  id: Scalars['String'];
};


export type QueryRemindersArgs = {
  args: RemindersArgs;
};


export type QueryTaskArgs = {
  args: TaskArgs;
};


export type QueryTasksArgs = {
  args: TasksArgs;
};


export type QueryVerifyUserArgs = {
  token: Scalars['String'];
};

export type RegisterUserPayload = {
  __typename?: 'RegisterUserPayload';
  token: Scalars['String'];
  userId: Scalars['String'];
};

export type ReminderType = {
  __typename?: 'ReminderType';
  dueDate: Scalars['Date'];
  id: Scalars['String'];
  note: Scalars['String'];
  title: Scalars['String'];
  user: UserType;
};

export type TaskType = {
  __typename?: 'TaskType';
  date: Scalars['Date'];
  id: Scalars['String'];
  isCompleted: Scalars['Boolean'];
  note?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type ToggleTaskPayload = {
  __typename?: 'ToggleTaskPayload';
  id: Scalars['String'];
  isCompleted: Scalars['Boolean'];
};

export type UserType = {
  __typename?: 'UserType';
  email: Scalars['String'];
  id: Scalars['String'];
  username: Scalars['String'];
};

export enum RemindersTimeSpanEnum {
  All = 'ALL',
  Future = 'FUTURE',
  Past = 'PAST'
}

export type CreateCardInput = {
  name: Scalars['String'];
};

export type CreateReminderInput = {
  dueDate: Scalars['DateTime'];
  note?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type CreateTaskInput = {
  cardId: Scalars['String'];
  date: Scalars['DateTime'];
  title: Scalars['String'];
};

export type DeleteCardInput = {
  id: Scalars['String'];
};

export type DeleteTaskInput = {
  id: Scalars['String'];
};

export type EditCardInput = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type EditReminderInput = {
  dueDate: Scalars['DateTime'];
  id: Scalars['String'];
  note?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type EditTaskInput = {
  date: Scalars['DateTime'];
  id: Scalars['String'];
  isCompleted: Scalars['Boolean'];
  note: Scalars['String'];
  title: Scalars['String'];
};

export type LogInUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type RegisterUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  username: Scalars['String'];
};

export type RemindersArgs = {
  timeSpan: RemindersTimeSpanEnum;
};

export type TaskArgs = {
  id: Scalars['String'];
};

export type TasksArgs = {
  cardId: Scalars['String'];
  date: Scalars['DateTime'];
};

export type ToggleTaskInput = {
  isCompleted: Scalars['Boolean'];
  taskId: Scalars['String'];
};



export type CardPayloadFragment = (
  { __typename?: 'CardType' }
  & Pick<CardType, 'id' | 'name'>
);

export type ReminderPayloadFragment = (
  { __typename?: 'ReminderType' }
  & Pick<ReminderType, 'id' | 'title' | 'note' | 'dueDate'>
);

export type TaskPayloadFragment = (
  { __typename?: 'TaskType' }
  & Pick<TaskType, 'id' | 'title' | 'note' | 'date' | 'isCompleted'>
);

export type CreateCardMutationVariables = Exact<{
  input: CreateCardInput;
}>;


export type CreateCardMutation = (
  { __typename?: 'Mutation' }
  & { createCard: (
    { __typename?: 'CreateCardPayload' }
    & { card: (
      { __typename?: 'CardType' }
      & CardPayloadFragment
    ) }
  ) }
);

export type DeleteCardMutationVariables = Exact<{
  input: DeleteCardInput;
}>;


export type DeleteCardMutation = (
  { __typename?: 'Mutation' }
  & { deleteCard: (
    { __typename?: 'DeleteCardPayload' }
    & Pick<DeleteCardPayload, 'id'>
  ) }
);

export type EditCardMutationVariables = Exact<{
  input: EditCardInput;
}>;


export type EditCardMutation = (
  { __typename?: 'Mutation' }
  & { editCard: (
    { __typename?: 'EditCardPayload' }
    & { card: (
      { __typename?: 'CardType' }
      & CardPayloadFragment
    ) }
  ) }
);

export type CreateReminderMutationVariables = Exact<{
  input: CreateReminderInput;
}>;


export type CreateReminderMutation = (
  { __typename?: 'Mutation' }
  & { createReminder: (
    { __typename?: 'CreateReminderPayload' }
    & { reminder: (
      { __typename?: 'ReminderType' }
      & ReminderPayloadFragment
    ) }
  ) }
);

export type EditReminderMutationVariables = Exact<{
  input: EditReminderInput;
}>;


export type EditReminderMutation = (
  { __typename?: 'Mutation' }
  & { editReminder: (
    { __typename?: 'EditReminderPayload' }
    & { reminder: (
      { __typename?: 'ReminderType' }
      & ReminderPayloadFragment
    ) }
  ) }
);

export type DeleteReminderMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteReminderMutation = (
  { __typename?: 'Mutation' }
  & { deleteReminder: (
    { __typename?: 'DeleteReminderPayload' }
    & Pick<DeleteReminderPayload, 'id'>
  ) }
);

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { createTask: (
    { __typename?: 'CreateTaskPayload' }
    & { task: (
      { __typename?: 'TaskType' }
      & TaskPayloadFragment
    ) }
  ) }
);

export type ToggleTaskMutationVariables = Exact<{
  input: ToggleTaskInput;
}>;


export type ToggleTaskMutation = (
  { __typename?: 'Mutation' }
  & { toggleTask: (
    { __typename?: 'ToggleTaskPayload' }
    & Pick<ToggleTaskPayload, 'id' | 'isCompleted'>
  ) }
);

export type DeleteTaskMutationVariables = Exact<{
  input: DeleteTaskInput;
}>;


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & { deleteTask: (
    { __typename?: 'DeleteTaskPayload' }
    & Pick<DeleteTaskPayload, 'id'>
  ) }
);

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterUserMutation = (
  { __typename?: 'Mutation' }
  & { registerUser: (
    { __typename?: 'RegisterUserPayload' }
    & Pick<RegisterUserPayload, 'token' | 'userId'>
  ) }
);

export type LogInUserMutationVariables = Exact<{
  input: LogInUserInput;
}>;


export type LogInUserMutation = (
  { __typename?: 'Mutation' }
  & { logInUser: (
    { __typename?: 'LogInUserPayload' }
    & Pick<LogInUserPayload, 'token' | 'userId'>
  ) }
);

export type CardsQueryVariables = Exact<{ [key: string]: never; }>;


export type CardsQuery = (
  { __typename?: 'Query' }
  & { cards: Array<(
    { __typename?: 'CardType' }
    & CardPayloadFragment
  )> }
);

export type RemindersQueryVariables = Exact<{
  args: RemindersArgs;
}>;


export type RemindersQuery = (
  { __typename?: 'Query' }
  & { reminders: Array<(
    { __typename?: 'ReminderType' }
    & ReminderPayloadFragment
  )> }
);

export type TasksQueryVariables = Exact<{
  args: TasksArgs;
}>;


export type TasksQuery = (
  { __typename?: 'Query' }
  & { tasks: Array<(
    { __typename?: 'TaskType' }
    & TaskPayloadFragment
  )> }
);

export type TaskQueryVariables = Exact<{
  args: TaskArgs;
}>;


export type TaskQuery = (
  { __typename?: 'Query' }
  & { task: (
    { __typename?: 'TaskType' }
    & TaskPayloadFragment
  ) }
);

export type VerifyUserQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyUserQuery = (
  { __typename?: 'Query' }
  & { verifyUser: (
    { __typename?: 'UserType' }
    & Pick<UserType, 'id' | 'username' | 'email'>
  ) }
);
