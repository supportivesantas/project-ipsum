Design notes (add to readme later):

Tables:
Users, creds, servers, apps, stats

Our postgres tables: 
- One user has many apps
- one app has one server
- one server has one app
- stat belongs to a server
- stat belongs to an app

User schema
- username
- password
- email
- phone

server schema:
- ip hostname
- App_id
- User_id

stats:
- User_id
- App_id
- Server_id

events (generic)

each user has their own event list and prefs, stored in memory
we hold a standard, generic list of events held in memory

