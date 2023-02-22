# Warning : If you want to update this readme please make a pull request

## Install dependencies
```console
$ npm install
```

## Update .env on folder prisma
Why update .env ?
If you use docker then you will have to check at each restart of the mysql container that you have the same IP for the access to the database.
If you use xampp or other software you will not need to change the .env for the database

## Use server vite or custom-server typescript ?
if you want to use the custom-server.ts in demon mode then you have to use the command :
```console
$ npm run dev:old
```
It will start the server in vite :
```console
$ npm run dev
```

## Access to database with prisma studio without application see databases ( phpmyadmin / postegres ...)
A window will be opened with the data of the database.
You haven't need to open adminer in the browser if you want
Use the command : 
```command
$ npx prisma studio
```

## Access to database with phpmyadmin ( in mac )
```command
$ make phpmyadmin
```

## Access to database with adminer ( in mac )
```command
$ make adminer
```

## Access to database with adminer session or phpmyadmin
```console
$ login : root
$ password : without
```

