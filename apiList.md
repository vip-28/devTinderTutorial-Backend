# DEVtinder APIs

AuthRouter
- POST /signup
- POST /login
- POST /logout

ProfileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/editPassword 

ConnectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignores/:userId
- POST/request/send/superLike/:userId
--
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

UserRouter
- GET /user/requests
- GET /user/connections
- GET /user/feeds  - gets you the profile of other people 




Status: ignore(pass)(left swipe), interested(like)(right swipe), accepted(to accept an incoming request),  rejected(to reject an incoming request)
