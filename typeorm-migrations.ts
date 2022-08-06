import * as child_process from 'child_process';
import { join } from 'path';

import * as prompts from 'prompts';
import { argv } from 'yargs';

enum APPS {
  API = 'api',
}

// ====================================================================
// ============================== PATHS ===============================
// ====================================================================

const CONFIG_PATHS = {
  [APPS.API]: 'apps/api/config/orm.config.ts',
};

const MIGRATIONS_PATHS = {
  [APPS.API]: 'apps/api/src/database/migrations',
};

// ====================================================================
// ============================ Functions =============================
// ====================================================================

function callTypeOrmCli(
  app: string,
  command: string,
  input: string = null,
  pretty = false,
) {
  let cmd = `npm run typeorm-cli -- ${command}`;
  cmd = cmd + (input ? ` "${join(MIGRATIONS_PATHS[app], input)}"` : '');
  cmd = cmd + (pretty ? ` --pretty` : '');
  // Ignore data source path for specific commands
  if (!command.includes('migration:create')) {
    cmd += ` -d ${CONFIG_PATHS[app]}`;
  }
  child_process.execSync(cmd, { stdio: [0, 1, 2] });
}

const ALL_ACTION_NOT_SUPPORTED =
  'This action cannot be performed to All the apps at once.';
const CONFIRM_REBOOT_MESSAGE =
  'Confirm reboot of the environment? (warning: this will erase ALL data in the databases).';

// ====================================================================
// ============================= Main App =============================
// ====================================================================
async function main() {
  prompts.override(argv);

  const { app, action } = await prompts([
    {
      type: 'select',
      name: 'app',
      message: 'Choose an app to run TypeOrm:',
      choices: [
        { title: 'ALL', value: 'ALL' },
        { title: 'API', value: APPS.API },
      ],
    },
    {
      type: 'select',
      name: 'action',
      message: 'Choose a TypeOrm action to run in the selected app:',
      choices: [
        { title: 'test', value: 'migration:test' },
        { title: 'migration:create', value: 'migration:create' },
        { title: 'migration:run', value: 'migration:run' },
        { title: 'migration:revert', value: 'migration:revert' },
        { title: 'migration:generate', value: 'migration:generate' },
        { title: 'schema:sync', value: 'schema:sync' },
        { title: 'schema:drop', value: 'schema:drop' },
        { title: 'Reboot Environment', value: 'reboot-environment' },
      ],
    },
  ]);

  const appsToRun = app === 'ALL' ? Object.values(APPS) : [app];

  switch (action) {
    case 'migration:create': {
      if (app === 'ALL') throw new Error(ALL_ACTION_NOT_SUPPORTED);

      const { name } = await prompts({
        type: 'text',
        name: 'name',
        message: `Migration create name:`,
      });
      callTypeOrmCli(app, 'migration:create', name);
      break;
    }
    case 'migration:generate': {
      if (app === 'ALL') throw new Error(ALL_ACTION_NOT_SUPPORTED);
      const { name } = await prompts({
        type: 'text',
        name: 'name',
        message: `Migration generate name:`,
      });
      callTypeOrmCli(app, 'migration:generate', name, true);
      break;
    }
    case 'schema:sync':
    case 'schema:drop':
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`${action} can't be executed in production`);
      }
    case 'migration:run':
    case 'migration:revert':
      appsToRun.forEach((appToRun) => callTypeOrmCli(appToRun, action));
      break;
    case 'reboot-environment': {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`${action} can't be executed in production`);
      }
      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: () => CONFIRM_REBOOT_MESSAGE,
      });
      if (confirm) {
        for (const appToRun of appsToRun) {
          callTypeOrmCli(appToRun, 'schema:drop');
          callTypeOrmCli(appToRun, 'migration:run');
        }
      } else {
        // eslint-disable-next-line no-console
        console.log('CANCELED');
      }
      break;
    }
  }
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Process Ended.');
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log('Error', err.message || err);
    // eslint-disable-next-line no-console
    console.log('Process Terminated.');
    process.exit(1);
  });