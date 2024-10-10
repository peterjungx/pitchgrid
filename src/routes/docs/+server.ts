import { readFile, readdir } from 'fs';
import type { RequestHandler } from './$types';



export const GET: RequestHandler = async ({ url }) => {
	let file = url.searchParams.get('file');
	if (file){
		const getMarkdown = () => {
			return new Promise((resolve, reject) => {
				readFile(`src/routes/docs/${file}.md`, 'utf8', (err, data) => {
					if (err) {
						reject(err);
					}
					resolve(data);
				});
			});
		};

		let markdown = (await getMarkdown()) as string;
		return new Response(markdown, {
			headers: {
				'content-type': 'text/html'
			}
		});
	}
	let content = url.searchParams.get('content');
	if (content){
		// list md files in src/routes/docs and return a list of file names as json
		const getFileList = () => {
			return new Promise((resolve, reject) => {
				readdir('src/routes/docs', (err, files) => {
					if (err) {
						reject(err);
					}
					resolve(files);
				});
			});
		};
			
		let files = (await getFileList()) as string[];
		// filter out non-md files and remove the .md extension. Only keep file names starting with number and underscore
		files = files
			.filter((file) => file.endsWith('.md'))
			.filter((file) => /^[0-9_]/.test(file))
			.map((file) => file.replace('.md', ''));
		return new Response(JSON.stringify(files), {
			headers: {
				'content-type': 'application/json'
			}
		});
	}

	return new Response('Not Found', { status: 404 });
};