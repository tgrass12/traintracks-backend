const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ApolloError } = require('apollo-server-errors');
const { PrismaUniqueConstraintError } = require('../shared/constants');
const {
  getAuthenticatedUser,
  createAuthCookie,
  destroyAuthCookie,
} = require('../shared/util');

const { AUTH_SECRET } = process.env;

async function authenticate(_, __, { prisma, request }) {
  try {
    const { userId, username } = getAuthenticatedUser(request);
    const token = jwt.sign({ userId, username }, AUTH_SECRET);
    createAuthCookie(token, request);

    const user = await prisma.user.findOne({ where: { id: userId } });
    return {
      user,
    };
  } catch (e) {
    return null;
  }
}

async function signup(_, { email, username, password }, { prisma, request }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id, username }, AUTH_SECRET);
    createAuthCookie(token, request);
    return {
      user,
    };
  } catch (e) {
    const {
      code,
      meta: { target },
    } = e;
    if (code === PrismaUniqueConstraintError) {
      if (target[0] === 'email') {
        throw new ApolloError('Email is already taken', 'USER_EXISTS');
      }
      if (target[0] === 'username') {
        throw new ApolloError('Username is already taken', 'USER_EXISTS');
      }
    }

    throw e;
  }
}

async function login(_, { username, password }, { prisma, request }) {
  const user = await prisma.user.findOne({
    where: { username },
  });

  if (!user) {
    throw new AuthenticationError(`Error Authenticating ${username}`);
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new AuthenticationError(`Error Authenticating ${username}`);
  }

  const token = jwt.sign({ userId: user.id, username }, AUTH_SECRET);
  createAuthCookie(token, request);
  return {
    user,
  };
}

function logout(_, __, { request }) {
  try {
    const { username } = getAuthenticatedUser(request);
    destroyAuthCookie(request);
    return username;
  } catch (e) {
    return null;
  }
}

const resolvers = {
  Mutation: {
    authenticate,
    signup,
    login,
    logout,
  },
};

module.exports = {
  resolvers,
};
