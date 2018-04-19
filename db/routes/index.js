var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Расписание ИМЭИ ИГУ' });
});

router.get('/addTeacher', function(req, res, next) {
  res.render('addTeacher', { title: 'Добавить преподавателя' })
});

router.get('/addDays', function(req, res, next) {
  res.render('addDays', { title: 'Добавить день недели' })
});
router.post('/addTeacher', function(req, res, next) {
  console.log(req.body.lastname + req.body.firstname + req.body.patronymic);
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  db.run(`INSERT INTO teacher(lastname, firstname, patronymic) VALUES ('${req.body.lastname}', '${req.body.firstname}', '${req.body.patronymic}');`,
    (err) => {
      if (err) { console.error(err.message); }
     db.get("SELECT last_insert_rowid() as id", function (err, row) {
       console.log('Last inserted id is: ' + row['id']);
     });
      res.redirect('/listTeacher');
    }
  );       
});

router.post('/teacher/:id', function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
        if (err) {
            console.error(err.message);
        }
    });
    //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
    db.run(`UPDATE teacher SET lastname='${req.body.lastname}', firstname='${req.body.firstname}', patronymic='${req.body.patronymic}' WHERE id=?;`, req.params.id);
    res.redirect('/listTeacher');
});

router.get('/teacher/:id', function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
        if (err) {
            console.error(err.message);
        }
    });
    db.all('SELECT * FROM teacher WHERE id=?', req.params.id, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('teacher', { title: 'Описание ', val: rows[0] });
});
});



router.get('/listDays', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  result = [];
  db.all('SELECT * FROM days', (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      result.push({id: row.id,  name: row.name})
    });
    res.render('listDays', { title: 'Список дней', list: result });
  });
});
router.post('/addDays', function(req, res, next) {
  console.log(req.body.name);
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  db.run(`INSERT INTO days(name) VALUES ('${req.body.name}');`,
    (err) => {
      if (err) { console.error(err.message); }
     db.get("SELECT last_insert_rowid() as id", function (err, row) {
       console.log('Last inserted id is: ' + row['id']);
     });
      res.redirect('/listDays');
    }
  );       
});

router.post('/days/:id', function(req, res, next) {
    console.log(req.body.name);
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
        if (err) {
            console.error(err.message);
        }
    });
    //db.run(`UPDATE days SET name='Data' WHERE id=?;`,
    db.run(`UPDATE days SET name='${req.body.name}' WHERE id=?;`, req.params.id);
    res.redirect('/listDays');
});

router.get('/days/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  db.all('SELECT * FROM days WHERE id=?', req.params.id, (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('days', { title: 'Описание дня', val: rows[0] });
  });
});

router.post('/delTeacher/:id', function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
        if (err) {
            console.error(err.message);
        }
    });
    //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
    db.run(`DELETE FROM teacher WHERE id=?;`, req.params.id);
    db.run(`UPDATE teacher SET id=id-1 WHERE id>?`,req.params.id);
    res.redirect('/listTeacher').refresh();
});

router.get('/delTeacher/:id', function(req, res, next) {
    var db = new sqlite3.Database('./db/sample.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
        if (err) {
            console.error(err.message);
        }
    });
    db.all('SELECT * FROM teacher WHERE id=?', req.params.id, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('delTeacher', { title: 'Описание ', val: rows[0] });
});
});

router.get('/listTeacher', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  result = [];
  db.all('SELECT * FROM teacher', (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      result.push({id: row.id,  lastname: row.lastname, firstname: row.firstname, patronymic: row.patronymic })
    });
    res.render('listTeacher', { title: 'Список преподавателей', list: result });
  });
});

 router.get('/addSubject', function(req, res, next) {
  res.render('addSubject', { title: 'Добавить предмет' })
});

router.post('/addSubject', function(req, res, next) {
  console.log(req.body.name);
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
      db.run(`INSERT INTO subject(name) VALUES ('${req.body.name}');`,
    (err) => {
      if (err) { console.error(err.message); }
     db.get("SELECT last_insert_rowid() as id", function (err, row) {
       console.log('Last inserted id is: ' + row['id']);
     });
      res.redirect('/listSubject');
    }
  ); 
});

router.post('/subject/:id', function(req, res, next) {
  console.log(req.body.name);
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
      //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
     db.run(`UPDATE subject SET name='${req.body.name}' WHERE id=?;`, req.params.id);
     res.redirect('/listSubject');
});

router.get('/listSubject', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  result = [];
  db.all('SELECT * FROM subject', (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      result.push({id: row.id, name: row.name})
    });
    console.log(result);
    res.render('listSubject', { title: 'Список предметов', list: result });
  });
});

router.get('/subject/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  db.all('SELECT * FROM subject WHERE id=?', req.params.id, (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('subject', { title: 'Описание предмета', val: rows[0] });
  });
});



router.get('/addClass', function(req, res, next) {
  res.render('addClass', { title: 'Добавить аудиторию' })
});

router.post('/addClass', function(req, res, next) {
  console.log(req.body.name);
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
      db.run(`INSERT INTO class(name) VALUES ('${req.body.name}');`,
    (err) => {
      if (err) { console.error(err.message); }
     db.get("SELECT last_insert_rowid() as id", function (err, row) {
       console.log('Last inserted id is: ' + row['id']);
     });
      res.redirect('/listClass');
    }
  ); 
});

router.post('/class/:id', function(req, res, next) {
  console.log(req.body.name);
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
      //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
     db.run(`UPDATE class SET name='${req.body.name}' WHERE id=?;`, req.params.id);
     res.redirect('/listClass');
});

router.get('/listClass', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  result = [];
  db.all('SELECT * FROM class', (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      result.push({id: row.id, name: row.name})
    });
    console.log(result);
    res.render('listClass', { title: 'Список аудиторий', list: result });
  });
});

router.get('/class/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  db.all('SELECT * FROM class WHERE id=?', req.params.id, (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('class', { title: 'Описание аудитории', val: rows[0] });
  });
});



router.get('/addGroup', function(req, res, next) {
  res.render('addGroup', { title: 'Добавить группу' })
});

router.post('/addGroup', function(req, res, next) {
  console.log(req.body.name);
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
      db.run(`INSERT INTO group1(name) VALUES ('${req.body.name}');`,
    (err) => {
      if (err) { console.error(err.message); }
     db.get("SELECT last_insert_rowid() as id", function (err, row) {
       console.log('Last inserted id is: ' + row['id']);
     });
      res.redirect('/listGroup');
    }
  ); 
});

router.post('/group1/:id', function(req, res, next) {
  console.log(req.body.name);
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
      //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
     db.run(`UPDATE group1 SET name='${req.body.name}' WHERE id=?;`, req.params.id);
     res.redirect('/listGroup');
});

router.get('/listGroup', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  result = [];
  db.all('SELECT * FROM group1', (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      result.push({id: row.id, name: row.name})
    });
    console.log(result);
    res.render('listGroup', { title: 'Список групп', list: result });
  });
});

router.get('/group1/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db', 
         sqlite3.OPEN_READWRITE, 
         (err) => {
            if (err) {
                console.error(err.message);        
            }
      });
  db.all('SELECT * FROM group1 WHERE id=?', req.params.id, (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('group1', { title: 'Описание групп', val: rows[0] });
  });
});



router.post('/delSubject/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db',
      sqlite3.OPEN_READWRITE,
      (err) => {
      if (err) {
          console.error(err.message);
      }
  });
  //db.run(`UPDATE subject SET name='Data' WHERE id=?;`,
  db.run(`DELETE FROM subject WHERE id=?;`, req.params.id);
  db.run(`UPDATE subject SET id=id-1 WHERE id>?`,req.params.id);
  res.redirect('/listSubject').refresh();
});

router.get('/delSubject/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db',
      sqlite3.OPEN_READWRITE,
      (err) => {
      if (err) {
          console.error(err.message);
      }
  });
  db.all('SELECT * FROM subject WHERE id=?', req.params.id, (err, rows) => {
      if (err) {
          throw err;
      }
      res.render('delSubject', { title: 'Описание ', val: rows[0] });
});
});



router.post('/delGroup/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db',
      sqlite3.OPEN_READWRITE,
      (err) => {
      if (err) {
          console.error(err.message);
      }
  });
  //db.run(`UPDATE group1 SET name='Data' WHERE id=?;`,
  db.run(`DELETE FROM group1 WHERE id=?;`, req.params.id);
  db.run(`UPDATE group1 SET id=id-1 WHERE id>?`,req.params.id);
  res.redirect('/listGroup').refresh();
});

router.get('/delGroup/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db',
      sqlite3.OPEN_READWRITE,
      (err) => {
      if (err) {
          console.error(err.message);
      }
  });
  db.all('SELECT * FROM group1 WHERE id=?', req.params.id, (err, rows) => {
      if (err) {
          throw err;
      }
      res.render('delGroup', { title: 'Описание ', val: rows[0] });
});
});


router.post('/delClass/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db',
      sqlite3.OPEN_READWRITE,
      (err) => {
      if (err) {
          console.error(err.message);
      }
  });
  //db.run(`UPDATE class SET name='Data' WHERE id=?;`,
  db.run(`DELETE FROM class WHERE id=?;`, req.params.id);
  db.run(`UPDATE class SET id=id-1 WHERE id>?`,req.params.id);
  res.redirect('/listClass').refresh();
});

router.get('/delClass/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db',
      sqlite3.OPEN_READWRITE,
      (err) => {
      if (err) {
          console.error(err.message);
      }
  });
  db.all('SELECT * FROM class WHERE id=?', req.params.id, (err, rows) => {
      if (err) {
          throw err;
      }
      res.render('delClass', { title: 'Описание ', val: rows[0] });
});
});



router.post('/delDays/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db',
      sqlite3.OPEN_READWRITE,
      (err) => {
      if (err) {
          console.error(err.message);
      }
  });
  //db.run(`UPDATE days SET name='Data' WHERE id=?;`,
  db.run(`DELETE FROM days WHERE id=?;`, req.params.id);
  db.run(`UPDATE days SET id=id-1 WHERE id>?`,req.params.id);
  res.redirect('/listDays').refresh();
});

router.get('/delDays/:id', function(req, res, next) {
  var db = new sqlite3.Database('./db/sample.db',
      sqlite3.OPEN_READWRITE,
      (err) => {
      if (err) {
          console.error(err.message);
      }
  });
  db.all('SELECT * FROM days WHERE id=?', req.params.id, (err, rows) => {
      if (err) {
          throw err;
      }
      res.render('delDays', { title: 'Описание ', val: rows[0] });
});
});
module.exports = router;