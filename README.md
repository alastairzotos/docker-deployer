# @bitmetro/docker-deployer
---
A simple service to deploy docker containers to your servers.

## Getting started

### Installation and starting the service

SSH into your server and run the following:

```
$ npm i -g @bitmetro/docker-deployer
$ ddeploy start
```

This will setup a server listening on port `4042`. To stop it, simply run:
```
$ ddeploy stop
```

On the first run it will ask you to provide a password. This password must be provided when triggering a deployment (to ensure nobody else tries to install containers on your server)

### Triggering a deployment

To trigger a deployment, hit the following endpoint:
```
POST <your server url>:4042/deploy
```

The `Content-Type` is expected to be `application/json` and the following properties must be sent in the body:
```
{
  "image": <Your image name without the tag>,
  "tag": <Optional: The image tag. Defaults to "latest">
  "name": <A name for the container>,
  "ports": <A port forwarding pattern, i.e. 80:3000>,
}
```

You must also provide your password in the `Authorization` `Bearer` header.

That's it! Happy deployment.