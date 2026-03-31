import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../config/database'
import { AppError } from '../../utils/AppError'
import { RegisterInput, LoginInput } from './auth.schema'

// Generate access + refresh tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_SECRET!,
    { expiresIn: '30d' }
  )
  return { accessToken, refreshToken }
}

// Register new user
export const register = async (data: RegisterInput) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  })
  if (existingUser) {
    throw new AppError('Email already registered', 409)
  }

  // Check if phone already exists
  const existingPhone = await prisma.user.findUnique({
    where: { phone: data.phone }
  })
  if (existingPhone) {
    throw new AppError('Phone number already registered', 409)
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(data.password, 12)

  // Create user in database
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: (data.role as any) || 'DONOR',
      bloodGroup: data.bloodGroup as any,
      ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
      city: data.city,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      bloodGroup: true,
      city: true,
      createdAt: true,
    }
  })

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id)

  // Save refresh token to database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  })

  return { user, accessToken, refreshToken }
}

// Login user
export const login = async (data: LoginInput) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  })
  if (!user) {
    throw new AppError('Invalid email or password', 401)
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(data.password, user.password)
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401)
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id)

  // Save refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodGroup: user.bloodGroup,
      isEligible: user.isEligible,
      city: user.city,
    },
    accessToken,
    refreshToken,
  }
}

// Get user profile
export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bloodGroup: true,
      city: true,
      isEligible: true,
      lastDonation: true,
      createdAt: true,
    }
  })
  if (!user) {
    throw new AppError('User not found', 404)
  }
  return user
}