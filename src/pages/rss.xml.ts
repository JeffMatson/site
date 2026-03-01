import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context: { site: string }) {
	const blog = await getCollection('blog');
	const sortedBlog = blog.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

	return rss({
		title: "Jeff Matson's Super Rad Home Page",
		description: 'YOLO',
		site: context.site,
		items: sortedBlog.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.description,
			link: `/blog/${post.id}/`,
		})),
		customData: `<language>en-us</language>`,
	});
}
