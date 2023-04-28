import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const id = {
  id: z.number({required_error: "Must inform the ID"})
}

const login = {
  login: z.string({required_error: "Must inform a login"}).min(5, {message: 'Min 5'})
  }

const password = {
  password: z.string({required_error: "Must inform a password"}).min(3, { message: 'Min 5' }),
}

const newPassword = {
  newPassword: z.string({required_error: "Must inform a password"}).min(5, { message: 'Min 5' }),
}

const roles = {
  roles: z.any()
}

const salt = {
  salt: z.string()
}

const hash = {
  hash: z.string()
}

const deleted_at = {
  deleted_at: z.date()
}


const LoginSchema = z.object({
  ...login,
  ...password
})
export type LoginInput = z.infer<typeof LoginSchema>;

const ChangePasswordSchema = z.object({
  ...id,
  ...password,
  ...newPassword
})
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>

const ChangePasswordAsAdminSchema = z.object({
  ...id,
  ...newPassword
})
export type ChangePasswordAsAdmin = z.infer<typeof ChangePasswordAsAdminSchema>

const EditLoginSchema = z.object({
  ...id,
  ...login,
})
export type EditLoginInput = z.infer<typeof EditLoginSchema>

const UserDatabase = z.object({
  ...id,
  ...login,
  ...salt,
  ...hash,
  ...roles,
  ...deleted_at
})
export type UserDatabaseSchema = z.infer<typeof UserDatabase>

const UserToken = z.object({
  ...id,
  ...login,
  ...roles
})
export type UserTokenSchema = z.infer<typeof UserToken>



const models = {
  ChangePasswordAsAdminSchema,
  ChangePasswordSchema,
  EditLoginSchema,
  LoginSchema
}

const options = {
  $id: "authSchemas"
};

export const { schemas: authSchema, $ref } = buildJsonSchemas(models, options);

