# Integrate with team@applications

## Structure
Because of the integrate app's biz logic is different with team's logic, so I decided to build a separate app (microservice app) and make team as a gateway.
With team, I will handle any logic for working only, when you need to work with the other applications I will call request to team@applications to do that.
For more, you can view this structure:

![Team structure](https://hackmd.io/_uploads/r1MvCFBgT.png)

> **Why I not develop my apps inside team?**
>
> If I do that, it causes my source is too big -> difficult to read, maintain it in the future.

In the current, when I develop this feature, I just want to allow the external applications call to my system to interactive with my internal application.
When do it, I need to expose my APIs, it can makes my app is insecure for the users. So I added a feature to make it secure more (API key).