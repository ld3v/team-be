# Problems & Solutions?
## Why I need to create a Google App Script instead of using Google Console?
First of all, my approach is create a Google Console App & require permission to access to user's calendar, which allow me to retrieve all of events in the user's calendar. But when I run test, it got a problem: Because my user's org is strict about Security Rules, which not allow to access to user's privacy data.

So, my approach is create a Google App Script, which will retrieve all of event on my profile and send it to my app with HTTP request.

When use this approach, I understand that I will meet an problem, that I don't know when an event was deleted! -> My solution is retrieve hour by hour, to check all of event from now -> end of day. If any events was sent before but not sent later -> Mark as Deleted -> Remove that event in my database.

Note: Maybe because my app is in Verification Progress, and can work when it was Verified by Google Team. I'm not sure about that, so this problem can be solved by another solution in the future (in 4-6 weeks :v for Verification Progress).
