const { exec } = require('child_process');

function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
   exec(cmd, {env: process.env}, (error, stdout, stderr) => {
    if (error) {
     console.warn(error);
    }
    resolve(stdout? stdout : stderr);
   });
  });
 }

module.exports = new Promise( async (resolve, reject) => {

  // const unmigration = await execShellCommand('knex migrate:rollback --all');

  // console.log('Rolling back migrations...');
  // console.log(unmigration);

  
  console.log('Running migrations...');
   const migration = await execShellCommand('knex migrate:latest');
   console.log(migration);


  // console.log('Running seeders...');
   const seeding = await execShellCommand('knex seed:run');
  // console.log(seeding);

});