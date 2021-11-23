# Installation

```bash
$ yarn install
```

# Database
## Install mongodb docker image 
```bash
$ docker run -p 27018:27017 -d -t mongo:4.2-bionic
```

## Or create a free cluster on mongo atlas

# Create ".env" file on project root
```
MONGO_URI="{insert the database uri}"
```

# Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

# To access the doc api go to
```
'{api path}:3003/doc'
```

# You can upload a csv file with cdi history on
```
'{api path}:3003/api/upload/cdi
```