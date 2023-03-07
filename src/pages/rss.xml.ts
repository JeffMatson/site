import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function get(context: { site: string; }) {
    const blog = await getCollection('blog');
    
    return rss({
        title: 'Jeff Matson\'s Super Rad Home Page',
        description: 'YOLO',
        site: context.site,
        items: blog.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            description: post.data.description,
            link: `/blog/${post.slug}/`,
        })),
        customData: `<language>en-us</language>`,
  });
}