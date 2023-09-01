# Program
This document describes about `Program` and why we need it in our system!?

## Why we need it?
Imagine, our team receive a request from company X to create UI/UX for their eCommerce website. From our view, we have a project **UI/UX eCommerce Website for X**. After we did it, with some reasons (maybe good results), the customer wants us to build the backend side for it. Because UI/UX is OK, but the website is so slow, it causes their customer to close their app. And they want us to upgrade the backend side for that eCommerce website. From our view, we have a new project **Backend eCommerce Website for X**. It seems that no connection between them, but in Agile, product development is progress, where we go through each sprint, have review/retro sessions, lessons learned. We had the experience to handle the project for this customer. So, why we must create a new team (maybe the same members) to handle a project with the same customer?

From the system's view, **why do we need to duplicate data for the same customer**? And **the member of the new team, can they view the review/retro, which was created by the team before**.

These are reasons, why we need `Program` in this system!

## What a user can do with a Program?
As user, who is a member or a participant of a Program, he/she can views that program's information (projects, project's iteration,... and can log-work).

But, if a user is a member of program -> He/she must be project-member, so from system view, a program, only add member if it has at least a project.