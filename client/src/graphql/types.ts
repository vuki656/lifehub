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
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: string;
};

export type CreateReminderPayload = {
  __typename?: 'CreateReminderPayload';
  endDate: Scalars['DateTime'];
  id: Scalars['ID'];
  note: Scalars['String'];
  startDate: Scalars['DateTime'];
  title: Scalars['String'];
};

export type EditReminderPayload = {
  __typename?: 'EditReminderPayload';
  endDate: Scalars['DateTime'];
  id: Scalars['ID'];
  note: Scalars['String'];
  startDate: Scalars['DateTime'];
  title: Scalars['String'];
};

export type LogInUserPayload = {
  __typename?: 'LogInUserPayload';
  token: Scalars['String'];
  user: UserType;
};

export type Mutation = {
  __typename?: 'Mutation';
  createReminder: CreateReminderPayload;
  editReminder: EditReminderPayload;
  logInUser: LogInUserPayload;
  registerUser: RegisterUserPayload;
};


export type MutationCreateReminderArgs = {
  endDate: Scalars['DateTime'];
  note: Scalars['String'];
  startDate: Scalars['DateTime'];
  title: Scalars['String'];
};


export type MutationEditReminderArgs = {
  endDate: Scalars['DateTime'];
  id: Scalars['ID'];
  note: Scalars['String'];
  startDate: Scalars['DateTime'];
  title: Scalars['String'];
};


export type MutationLogInUserArgs = {
  input: LogInUserInput;
};


export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};

export type Query = {
  __typename?: 'Query';
  reminder: ReminderType;
  remindersByDate: ReminderType;
};


export type QueryReminderArgs = {
  id: Scalars['String'];
};


export type QueryRemindersByDateArgs = {
  id: Scalars['String'];
};

export type RegisterUserPayload = {
  __typename?: 'RegisterUserPayload';
  token: Scalars['String'];
  user: UserType;
};

export type ReminderType = {
  __typename?: 'ReminderType';
  endDate: Scalars['DateTime'];
  id: Scalars['String'];
  note: Scalars['String'];
  startDate: Scalars['DateTime'];
  title: Scalars['String'];
  user: UserType;
};

export type UserType = {
  __typename?: 'UserType';
  email: Scalars['String'];
  id: Scalars['String'];
  username: Scalars['String'];
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


export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterUserMutation = (
  { __typename?: 'Mutation' }
  & { registerUser: (
    { __typename?: 'RegisterUserPayload' }
    & Pick<RegisterUserPayload, 'token'>
    & { user: (
      { __typename?: 'UserType' }
      & Pick<UserType, 'id' | 'username' | 'email'>
    ) }
  ) }
);
