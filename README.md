# WDSPortfolio
#Nguyen Quoc Huy - View - Add - Edit - Delete Activities

1. npm install --save
2. nodemon start
- Web will run on port 1029 if you run it on your personal computer.

I use file activities.ejs to view activity.
I render a lot of information:
+ activities: All activities you add to database
+ success: Message, which is returned when your request is successful.
+ fail: Message, which is returned when your request is failed.
Other, i use:
+ activity: Information about the activity you request.

You can change it in controller/activity/index.js at lines 15, 16, 17
