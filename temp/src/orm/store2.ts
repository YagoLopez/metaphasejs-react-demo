/*debugger

(async function () {
  const users = new Collection(User);
  try {
    const response = await fetch('metaphase.sqlite');
    const arrayBuffer = await response.arrayBuffer();
    const uInt8Array = new Uint8Array(arrayBuffer);
    const database = new SQL.Database(uInt8Array);
    const results = database.exec("select * from users");
    db.setDatabase(database);
    console.log('users', users.getAll());
  } catch (error) {
    console.error(error);
  }
})();*/

