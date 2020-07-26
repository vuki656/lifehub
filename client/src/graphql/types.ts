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

export type CreateReminderPayload = {
  __typename?: 'CreateReminderPayload';
  reminder: ReminderType;
};

export type DeleteReminderPayload = {
  __typename?: 'DeleteReminderPayload';
  id: Scalars['String'];
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
  createReminder: CreateReminderPayload;
  deleteReminder: DeleteReminderPayload;
  editReminder: EditReminderPayload;
  logInUser: LogInUserPayload;
  registerUser: RegisterUserPayload;
};


export type MutationCreateReminderArgs = {
  input: CreateReminderInput;
};


export type MutationDeleteReminderArgs = {
  id: Scalars['String'];
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

export type UserType = {
  __typename?: 'UserType';
  email: Scalars['String'];
  id: Scalars['String'];
  username: Scalars['String'];
};

export type CreateReminderInput = {
  endDate: Scalars['Date'];
  note: Scalars['String'];
  startDate: Scalars['Date'];
  title: Scalars['String'];
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
