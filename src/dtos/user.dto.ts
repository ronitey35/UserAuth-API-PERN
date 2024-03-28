import z from 'zod';
const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

const emailSchema = z.string().email('please enter valid email ');

const passwordSchema = z
  .string()
  .min(8, { message: 'Please type minimun of eight digits' })
  .regex(regex, {
    message: 'please enter atleast one capital,one symbol,one number'
  });

export const userRegisterSchema = z.object({
  name: z.string().min(7).max(20),
  email: emailSchema,
  password: passwordSchema
});
export const userLoginSchema = userRegisterSchema.omit({ name: true });

// export const userLoginSchema =z.object({
//   email: emailSchema,
//   password: passwordSchema
// });
