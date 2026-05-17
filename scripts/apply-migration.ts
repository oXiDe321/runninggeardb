import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

async function applyMigration() {
  const migrationFile = process.argv[2];
  if (!migrationFile) {
    console.error('Usage: npx tsx scripts/apply-migration.ts <path-to-sql-file>');
    process.exit(1);
  }

  const sql = fs.readFileSync(path.resolve(migrationFile), 'utf-8');

  const { error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    console.error('Migration failed:', error.message);
    console.log(
      'The Supabase Management API requires a stored procedure. Run the SQL manually in the Supabase dashboard SQL Editor:\n'
    );
    console.log(sql);
    process.exit(1);
  }

  console.log('Migration applied successfully.');
}

applyMigration();
