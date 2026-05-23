import dotenv from 'dotenv';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const openaiApiKey = process.env.OPENAI_API_KEY;
const supabaseUrl =
	process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!openaiApiKey) {
	throw new Error('Missing OPENAI_API_KEY. Check .env.local.');
}

if (!supabaseUrl) {
	throw new Error(
		'Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL. Check .env.local.',
	);
}

if (!supabaseServiceRoleKey) {
	throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY. Check .env.local.');
}

const openai = new OpenAI({
	apiKey: openaiApiKey,
});

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
	},
});

type MemoryRow = {
	id: string;
	content: string;
};

const BATCH_SIZE = 25;

async function backfillMemoryEmbeddings() {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error('Missing OPENAI_API_KEY');
	}

	if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
		throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
	}

	let totalUpdated = 0;
	let totalSkipped = 0;

	console.log('Starting memory embedding backfill...');

	while (true) {
		const { data: memories, error } = await supabase
			.from('project_memories')
			.select('id, content')
			.is('embedding', null)
			.not('content', 'is', null)
			.limit(BATCH_SIZE);

		if (error) {
			throw new Error(`Failed to fetch memories: ${error.message}`);
		}

		if (!memories || memories.length === 0) {
			break;
		}

		const rows = memories as MemoryRow[];

		console.log(`Processing batch of ${rows.length} memories...`);

		for (const memory of rows) {
			const content = memory.content?.trim();

			if (!content) {
				totalSkipped += 1;
				console.log(`Skipping empty memory ${memory.id}`);
				continue;
			}

			try {
				const embeddingResponse = await openai.embeddings.create({
					model: 'text-embedding-3-small',
					input: content,
					encoding_format: 'float',
				});

				const embedding = embeddingResponse.data[0]?.embedding;

				if (!embedding) {
					totalSkipped += 1;
					console.log(`No embedding returned for memory ${memory.id}`);
					continue;
				}

				const { error: updateError } = await supabase
					.from('project_memories')
					.update({ embedding })
					.eq('id', memory.id);

				if (updateError) {
					totalSkipped += 1;
					console.error(
						`Failed to update memory ${memory.id}:`,
						updateError.message,
					);
					continue;
				}

				totalUpdated += 1;
				console.log(`Updated memory ${memory.id}`);
			} catch (error) {
				totalSkipped += 1;
				console.error(`Failed to embed memory ${memory.id}:`, error);
			}
		}
	}

	console.log('Backfill complete.');
	console.log(`Updated: ${totalUpdated}`);
	console.log(`Skipped: ${totalSkipped}`);
}

backfillMemoryEmbeddings()
	.then(() => process.exit(0))
	.catch(error => {
		console.error('Backfill failed:', error);
		process.exit(1);
	});
