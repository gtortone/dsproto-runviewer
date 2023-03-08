
import mysql.connector as mysql

class RunDb:

    def __init__(self, host, user, pw, dbname):
        try:
            self.db = mysql.connect(host=host, user=user, password=pw, database=dbname)
        except Error as e:
            print('E: MySQL connection failed')
            sys.exit(-1) 

        self.cursor = self.db.cursor()

    def hasRun(self, setup, run):
        select = f'SELECT * from ds.params WHERE setup = {setup} AND run = {run}'
        self.cursor.execute(select)
        records = self.cursor.fetchall()
        if len(records) == 0:
            return False
        return True

    def updateStartField(self, setup, run, summary):
        insert = f'INSERT INTO ds.params VALUES (NULL, {setup}, {run}, \'{summary}\', NULL)'
        self.cursor.execute(insert)
        self.db.commit()

    def updateStopField(self, setup, run, summary):
        update = f'UPDATE ds.params SET jsonStop = \'{summary}\' WHERE setup = {setup} AND run = {run}'
        self.cursor.execute(update)
        self.db.commit()

    def delete(self, setup, run):
        remove = f'DELETE from ds.params WHERE setup = {setup} AND run = {run}'
        self.cursor.execute(remove)
        self.db.commit()
