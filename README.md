# Getting Started DS-Proto RunViewer

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

### Development

In development mode backend runs on port 4000 and frontend runs on port 4040.
REACT_APP_BASEURL must be set to '' (nothing)

To start backend
```
npm run start:be:dev
```

To start frontend
```
npm run stat:fe:dev
```


### Production

In production mode backend and frontend run both on port 4000.
REACT_APP_BASEURL must be set to '/runviewer'

To build frontend:
```
npm run build:prod
```

To run frontend:
```
npm run start:prod
```

