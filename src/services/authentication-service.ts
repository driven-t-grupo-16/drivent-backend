import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { invalidCredentialsError } from '@/errors';
import { authenticationRepository, userRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import { SignInGitHubParams } from '@/schemas';

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

async function signInGitHub(params: SignInGitHubParams): Promise<SignInResult> {
  const { code } = params;
  const response = await axios.post(`https://github.com/login/oauth/access_token`, {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  });
  console.log('Response', response.data);
  const inputString = response.data;
  const match = inputString.match(/access_token=([^&]+)/);
  const token = match[1];
  console.log(token);

  const userResponse = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const email = userResponse.data.email;
  const password = userResponse.data.node_id;

  const user = await userRepository.findByEmail(email, { id: true, email: true });
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userRepository.create({
      email,
      password: hashedPassword,
    });

    const tokenUser = await createSession(newUser.id);

    return { user: { email: newUser.email, id: newUser.id }, token: tokenUser };
  }

  const tUser = await createSession(user.id);

  return { user: { email: user.email, id: user.id }, token: tUser };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await authenticationRepository.createSession({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, 'email' | 'password'>;

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

export const authenticationService = {
  signIn,
  signInGitHub,
};
