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

export type DeleteCardPayload = {
  __typename?: 'DeleteCardPayload';
  id: Scalars['String'];
};

export type DeleteReminderPayload = {
  __typename?: 'DeleteReminderPayload';
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

export type LogInUserPayload = {
  __typename?: 'LogInUserPayload';
  token: Scalars['String'];
  userId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCard: CreateCardPayload;
  createReminder: CreateReminderPayload;
  deleteCard: DeleteCardPayload;
  deleteReminder: DeleteReminderPayload;
  editCard: EditCardPayload;
  editReminder: EditReminderPayload;
  logInUser: LogInUserPayload;
  registerUser: RegisterUserPayload;
};


export type MutationCreateCardArgs = {
  input: CreateCardInput;
};


export type MutationCreateReminderArgs = {
  input: CreateReminderInput;
};


export type MutationDeleteCardArgs = {
  input: DeleteCardInput;
};


export type MutationDeleteReminderArgs = {
  id: Scalars['String'];
};


export type MutationEditCardArgs = {
  input: EditCardInput;
};


export type MutationEditReminderArgs = {
  input: EditReminderInput;
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
  reminder: Maybe<ReminderType>;
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
  endDate: Scalars['Date'];
  id: Scalars['String'];
  note: Scalars['String'];
  startDate: Scalars['Date'];
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
  endDate: Scalars['Date'];
  note: Scalars['String'];
  startDate: Scalars['Date'];
  title: Scalars['String'];
};

export type DeleteCardInput = {
  id: Scalars['String'];
};

export type EditCardInput = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type EditReminderInput = {
  endDate: Scalars['Date'];
  id: Scalars['String'];
  note: Scalars['String'];
  startDate: Scalars['Date'];
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


export type CreateCardMutationVariables = Exact<{
  input: CreateCardInput;
}>;


export type CreateCardMutation = (
  { __typename?: 'Mutation' }
  & { createCard: (
    { __typename?: 'CreateCardPayload' }
    & { card: (
      { __typename?: 'CardType' }
      & Pick<CardType, 'id' | 'name'>
    ) }
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
      & Pick<CardType, 'id' | 'name'>
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

export type CreateReminderMutationVariables = Exact<{
  input: CreateReminderInput;
}>;


export type CreateReminderMutation = (
  { __typename?: 'Mutation' }
  & { createReminder: (
    { __typename?: 'CreateReminderPayload' }
    & { reminder: (
      { __typename?: 'ReminderType' }
      & Pick<ReminderType, 'id' | 'title' | 'note' | 'startDate' | 'endDate'>
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
      & Pick<ReminderType, 'id' | 'title' | 'note' | 'startDate' | 'endDate'>
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

export type CardsQueryVariables = Exact<{
  cardTasksArgs: CardTasksArgs;
}>;


export type CardsQuery = (
  { __typename?: 'Query' }
  & { cards: Array<(
    { __typename?: 'CardType' }
    & Pick<CardType, 'id' | 'name'>
    & { tasks: Array<(
      { __typename?: 'TaskType' }
      & Pick<TaskType, 'id' | 'title' | 'note' | 'date' | 'isCompleted'>
    )> }
  )> }
);

export type RemindersByDateQueryVariables = Exact<{
  date: Scalars['Date'];
}>;


export type RemindersByDateQuery = (
  { __typename?: 'Query' }
  & { remindersByDate: Array<(
    { __typename?: 'ReminderType' }
    & Pick<ReminderType, 'id' | 'title' | 'note' | 'startDate' | 'endDate'>
  )> }
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
