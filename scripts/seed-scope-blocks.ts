import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const USER_ID = '4172ae11-0f33-4041-a700-383d21510cb0';

async function seedScopeBlocks() {
	const { saveScopeBlock } = await import('../src/actions/saveScopeBlock');

	const blocks = [
		{
			title: 'Shower Valve Relocation',
			body: 'Relocate shower valve to approved wall location. Includes rough plumbing adjustment, coordination prior to waterproofing, and confirmation before tile installation begins.',
			projectType: 'Bathroom Remodel',
			trade: 'Plumbing',
			room: 'Bathroom',
			tags: ['shower', 'valve', 'plumbing', 'tile dependency'],
		},
		{
			title: 'Waterproofing Prep',
			body: 'Prepare shower walls and wet areas for waterproofing system. Verify substrate condition, seams, penetrations, and transitions before tile installation.',
			projectType: 'Bathroom Remodel',
			trade: 'Tile',
			room: 'Bathroom',
			tags: ['shower', 'waterproofing', 'tile prep'],
		},
		{
			title: 'Hidden Conditions Exclusion',
			body: 'Proposal excludes hidden conditions discovered after demolition, including concealed framing damage, plumbing defects, electrical issues, mold, rot, or subfloor damage. Any required corrective work will be reviewed before proceeding.',
			projectType: 'General Remodel',
			trade: 'General',
			room: 'General',
			tags: ['exclusion', 'hidden conditions', 'change order', 'demo'],
		},
	];

	for (const block of blocks) {
		const result = await saveScopeBlock({
			userId: USER_ID,
			...block,
		});

		console.log(block.title, result);
	}
}

seedScopeBlocks()
	.then(() => process.exit(0))
	.catch(error => {
		console.error('Seed failed:', error);
		process.exit(1);
	});
