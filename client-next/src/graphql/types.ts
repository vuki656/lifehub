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
};

export type CardType = {
  __typename?: 'CardType';
  id: Scalars['String'];
  name: Scalars['String'];
  tasks: Array<TaskType>;
};


export type CardTypeTasksArgs = {
  args: CardTasksArgs;
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

export type Query = {
  __typename?: 'Query';
  cards: Array<CardType>;
  reminder?: Maybe<ReminderType>;
  remindersByDate: Array<ReminderType>;
  verifyUser: UserType;
};


export type QueryReminderArgs = {
  id: Scalars['String'];
};


export type QueryRemindersByDateArgs = {
  date: Scalars['Date'];
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
  note: Scalars['String'];
  title: Scalars['String'];
};

export type UserType = {
  __typename?: 'UserType';
  email: Scalars['String'];
  id: Scalars['String'];
  username: Scalars['String'];
};

export type CardTasksArgs = {
  date: Scalars['Date'];
};

export type CreateCardInput = {
  name: Scalars['String'];
};

export type CreateReminderInput = {
  dueDate: Scalars['Date'];
  note?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type CreateTaskInput = {
  cardId: Scalars['String'];
  date: Scalars['Date'];
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
  dueDate: Scalars['Date'];
  id: Scalars['String'];
  note?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type EditTaskInput = {
  date: Scalars['Date'];
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


export type CreateReminderMutationVariables = Exact<{
  input: CreateReminderInput;
}>;


export type CreateReminderMutation = (
  { __typename?: 'Mutation' }
  & { createReminder: (
    { __typename?: 'CreateReminderPayload' }
    & { reminder: (
      { __typename?: 'ReminderType' }
      & Pick<ReminderType, 'id' | 'title' | 'note' | 'dueDate'>
    ) }
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
