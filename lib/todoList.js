const db = require('./db').db;

/**
 * 
 * @param {Function} cb : callback containing data and error
 * 
 */
const getList = (cb) => {
    db.serialize(() => {
        db.all(`SELECT * from list`, cb);
      });
}

/**
 * 
 * @param {Integer} id : task id
 * @param {Function} cb : callback containing data and error
 * 
 */
const getTask = (id, cb) => {
    db.serialize(() => {
        db.each(`SELECT * FROM list WHERE id = ${id}`, cb);
      });
}

/**
 * Toggles he done field of a task
 * @param {Function} cb : callback containing data and error
 */
const toggleTask = (id, cb) => {
    if (!id) return null;
    getTask(id, (err, row) => {
        if (err || !row || !row.id) {
            return cb(err || `Id ${id} doesn't exist`);
        }
        db.serialize(() => {
            db.exec(`UPDATE list SET done = ${!row.done} where id=${id}`, cb);
          });
    })
}

/**
 * Delete a task by id
 * @param {Function} cb : callback containing data and error
 */
const deleteTask = (id, cb) => {
    if (!id) return null;
    getTask(id, (err, row) => {
        if (err || !row || !row.id) {
            return cb(err || `Id ${id} doesn't exist`);
        }
        db.serialize(() => {
            db.exec(`DELETE FROM list where id=${id}`, cb);
          });
    })
}

/**
 * Add a task
 * @param {Function} cb : callback containing data and error
 */
const addTask = (name, description, cb) => {
    db.serialize(() => {
        db.exec(`INSERT INTO list (name, description) VALUES ('${name}', '${description}')`, cb);
    });
}

exports.getList = getList;
exports.toggleTask = toggleTask;
exports.deleteTask = deleteTask;
exports.addTask = addTask;