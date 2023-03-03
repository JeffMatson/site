import type {Handler} from '@netlify/functions';

interface FormsResponse {
    id: string;
    submission_count: number;
    name: string;
}

interface FormSubmission {
    data: {
        name: string;
        email: string;
        message: string;
    };
    created_at: string;
}

interface CommentProps {
    author: string;
    email: string;
    message: string;
    date: string;
}

interface CommentSubmissions {
    id: string;
    comments: CommentProps[]
}

const siteId = 'b323b3d7-5796-4dec-8b32-123e40cdf111';
const apiPrefix = 'https://api.netlify.com/api/v1/sites/';
const apiToken = process.env.FORM_API_TOKEN;

const getAllForms = async () => {
    const response = await fetch(`${apiPrefix}${siteId}/forms/`, {
        headers: new Headers({
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
        }),
    });

    return response.json();
}
const getFormSubmissions = async (id: string) => {
    const response = await fetch(`${apiPrefix}${siteId}/forms/${id}/submissions/`, {
        headers: new Headers({
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
        }),
    });

    return response.json();
}

const commentSubmissions: CommentSubmissions[] = [];

const processAll = async () => {
    const allForms: FormsResponse[] = await getAllForms();

    for (const form of allForms) {
        if ( form.submission_count > 0 ) {
            const submissions: FormSubmission[] = await getFormSubmissions(form.id);

            const commentList: CommentProps[] = [];
            for (const submission of submissions) {
                commentList.push({
                    author: submission.data.name,
                    email: submission.data.email,
                    message: submission.data.message,
                    date: submission.created_at
                })
            };

            commentSubmissions.push({
                id: form.name,
                comments: commentList
            });
        }

    }

    return commentSubmissions;
}

const handler: Handler = async (event, context) => {
    const comments = await processAll();

    return {
        statusCode: 200,
        body: JSON.stringify(comments)
    }
}

export {handler};