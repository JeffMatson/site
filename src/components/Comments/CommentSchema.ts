import {z} from 'zod';
import isISO8601 from 'validator/lib/isISO8601';

export const FormApiToken = z.string().or(z.boolean()).default(false);
export type FormApiToken = z.infer<typeof FormApiToken>;

export const FormName = z.string().min(1);

export const FormId = z.string();
export type FormId = z.infer<typeof FormId>;

export const FormsResponse = z.array(
    z.object({
        name: FormName,
        id: FormId,
        submission_count: z.number()
    })
);

export const CommentFormSubmission = z.object({
    created_at: z.string().refine(isISO8601),
    data: z.object({
        name: z.string(),
        email: z.string().email(),
        message: z.string(),
        url: z.string().url().or(z.string().refine(str => str === '')).optional()
    })
});

export const CommentFormSubmissionList = z.array(CommentFormSubmission);

export const CommentItem = z.object({
    author: z.string(),
    email: z.string().email(),
    message: z.string(),
    date: z.string(),
    url: z.string().url().or(z.literal('')).optional(),
});

export const CommentList = z.array(CommentItem);

