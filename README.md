# db-csv-s3
 stream data from mysql or pg to csv to s3


### Usage as CLI
Can be installed

```
npm install -g git+ssh://github.com/scottjustin5000/db-csv-s3.git
```

or can just be run locally....


It is assumed you there is a valid aws profile in `~/. aws/config`
Or that was env variables are set

#### Options

```
Available Options:
-h   host, required
-u   database user, required
-d   database, required
-p   database port, 
-t   database type (mysql or pg), required
-b   s3 bucket name, required
-k   csv file name, required
-f   file containing query, 
-q   query to execute,
```

(running `db-csv-s3 --help` will list options)

#### Examples

mysql with inline query:

```
db-csv-s3 -h 10.77.08.42 -u dbuser -d databasename -t mysql -k s3KeyName -b s3Bucket -q "select foor, bar FROM table1 where baz = 1"

```

Output

```
{ 
  Location:'https://s3Bucket.s3.amazonaws.com/s3KeyName.csv.gz',
  Bucket: 's3Bucket',
  Key: 's3KeyName.csv.gz',
  ETag: '"e48b33c83fb38c49333ffa8315e22a65-1"' 
}
```

postgres with inline query:

```
db-csv-s3 -h 192.31.42.13 -u dbUser -d databasename -t pg -k s3KeyName -b s3Bucket  -q "select foor, bar FROM table1 where baz = 1"
```

Output

```
{ 
  Location:'https://s3Bucket.s3.amazonaws.com/s3KeyName.csv.gz',
  Bucket: 's3Bucket',
  Key: 's3KeyName.csv.gz',
  ETag: '"e48b33c83fb38c49333ffa8315e22a65-1"' 
}
```

postgres with file

```
db-csv-s3 -h 192.31.42.13 -u dbUser -d databasename -t pg -k s3KeyName -b s3Bucket  -f "./query-file.sql"
```

Output

```
{ 
  Location: 'https://s3Bucket.s3.amazonaws.com/s3KeyName.csv.gz',
  Bucket: 's3Bucket',
  Key: 's3KeyName.csv.gz',
  ETag: '"e48b33c83fb38c49333ffa8315e22a65-1"' 
}
```