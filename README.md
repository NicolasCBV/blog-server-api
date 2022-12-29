# DEDICATED TO TEST

## WELCOME

You're welcome to my project! this is the branch for tests, it is used to implements new features and updates on server. It was made on purpose to support the blog-client project placed in my github.

I'm using the framework express, jest, typescript, prisma, and a bunch of applications to provide the best in one!

## WARNING

This version is dedicated especially for test mode, if you wish use this server please set the .env.production with the right configuration using the .env example displayed on repositorie. In the case of tests just set the email config like .env example.

All routes supported by server is listed on /src/configRoutes. The key "defaultName" and "authName" is placed before the rest of options, for example:

server_url/defaultName/nameOfRoute

## TESTING ROUTES
This is the list of routes that you could use on the server and their arguments and config:

## USERS ROUTES

### /users/sigin
  method: post
  json body:
    name: string,
    email: string,
    password: string

Description: the user will be able to create your account on cache and should validate you data using Two Factor and putting the OTP code on /user/validate.

### /user/validate
  method: patch
  json body:
    email: string,
    OTP: string

Description: this route finish the create process after user pass in Two Factor process and prove your identity.

### /users-auth/cancel
  method: delete
  json body:
    email: string,
    password: string

Description: in the case of user desist of the process to create one account, is possible to remove your data using this route.

### /users/login
  method: post
  json body:
    name: string,
    email: string

Description: the user will receive the token data to use around the server.

### /user/update-password/:email
  method: get

Description: the user should use this route to active the forgot password process and receive the email with the next step and finish in /users-auth/confirm-update-password.

### /user-auth/confirm-update-password
  method: patch
  token header is required
  json body:
    password: string

Description: to finish the process of change password.
### /remake-token
  method: get
  token header is required

Description: in especial case, the user could renovate your token using this route.

### /users/search-for-user/:id
  method: get

Description: the user should be able to search for another users using this route.

### /users/parse-token
  method: get
  token header is required

Description: this route parse the token for the user to get your data, if something is wrong with the token it you throw one error.

### /users-auth/delete
  method: delete
  token header is required

Description: if user wish to delete your account, should use this route.

### /users-auth/update-name-or-desc
  method: patch
  json body:
    name: string,
    desc: string

Description: if user wish change your name or description, should use this route.

### /users-auth/update-user-photo
  method: patch
  token header is required
  multipart form
    userPhoto: file in jpeg, pjpeg, png and gif

Description: if user wish change your photo, should use this route.

### users-auth/modify2FA
  method: patch
  token header is required
  json body:
    email: string,
    newStatus: string

## POSTS ROUTES

### /post-auth/create
  method: post
  token header is required
  json body:
    name: string,
    content: string,
    desc: string,
    creatorId: string

Description: this route should create one post.

### /post/get-group
  method: get

Description: this route should return 5 posts more actualy for the users.

### /post-auth/get/:id
  method: get

Description: this route should return one post for the users using your id.

### /post-auth/delete/:id
  method: delete
  token header is required

Description: this route should delete post using your id.

### /post-auth/update
  method: patch
  token header is required
  json body:
    id: string,
    name: string,
    content: string

Description: this route should update name or content of one post using your id.

### /post-auth/insert-image
  method: patch
  token header is required
  multipart form:
    postPhoto: file in jpeg, pjpeg, png and gif

Description: this route should update one photo of post using your id.
